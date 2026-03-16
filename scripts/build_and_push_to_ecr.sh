#!/usr/bin/env bash
###############################################################################
#  Artemis Eval - Docker Build & Push to ECR
#
#  Builds a linux/amd64 image on Apple-Silicon (or any host) via Docker
#  Buildx, then pushes to AWS ECR (China region by default).
#
#  Usage:
#    ./scripts/build_and_push_to_ecr.sh            # interactive
#    ./scripts/build_and_push_to_ecr.sh --auto      # non-interactive (CI)
#
#  Environment overrides (all optional):
#    AWS_ACCOUNT_ID   - default 432084094746
#    AWS_REGION       - default cn-northwest-1
#    ECR_REPOSITORY   - default artemis-eval
#    CUSTOM_TAGS      - space-separated extra tags  (e.g. "rc1 hotfix")
#    SKIP_PUSH        - set to "true" to build only
#    BACKEND_URL      - default http://bic-agent-backend:8124
###############################################################################
set -euo pipefail

# ─── Colour helpers ──────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Colour

info()    { printf "${BLUE}[INFO]${NC}    %s\n" "$*"; }
success() { printf "${GREEN}[OK]${NC}      %s\n" "$*"; }
warn()    { printf "${YELLOW}[WARN]${NC}    %s\n" "$*"; }
error()   { printf "${RED}[ERROR]${NC}   %s\n" "$*" >&2; }
header()  { printf "\n${BOLD}${CYAN}══════ %s ══════${NC}\n\n" "$*"; }

# ─── Defaults ────────────────────────────────────────────────────────────────
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-432084094746}"
AWS_REGION="${AWS_REGION:-cn-northwest-1}"
ECR_REPOSITORY="${ECR_REPOSITORY:-artemis-eval}"
PLATFORM="linux/amd64"
BUILDER_NAME="artemis-eval-builder"
BACKEND_URL="${BACKEND_URL:-http://bic-agent-backend:8124}"

AUTO_MODE=false
SKIP_PUSH="${SKIP_PUSH:-false}"
MAX_RETRIES=3
RETRY_DELAY=5
BUILD_TIMEOUT=1800          # 30 min

# Parse flags
for arg in "$@"; do
  case "$arg" in
    --auto) AUTO_MODE=true ;;
    *)      warn "Unknown flag: $arg" ;;
  esac
done

# Derived
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com.cn"
IMAGE_URI="${ECR_REGISTRY}/${ECR_REPOSITORY}"

# ─── Banner ──────────────────────────────────────────────────────────────────
clear_line() { printf "\r\033[K"; }

print_banner() {
  printf "\n"
  printf "${BOLD}${CYAN}"
  printf "╔══════════════════════════════════════════════════════════════╗\n"
  printf "║          Artemis Eval - Docker Build & Push to ECR         ║\n"
  printf "╠══════════════════════════════════════════════════════════════╣\n"
  printf "║  Platform : %-46s  ║\n" "$PLATFORM"
  printf "║  Registry : %-46s  ║\n" "$ECR_REGISTRY"
  printf "║  Repo     : %-46s  ║\n" "$ECR_REPOSITORY"
  printf "╚══════════════════════════════════════════════════════════════╝\n"
  printf "${NC}\n"
}

# ─── Prerequisites ───────────────────────────────────────────────────────────
check_prerequisites() {
  header "Checking prerequisites"

  local missing=()
  for cmd in docker aws git; do
    if command -v "$cmd" &>/dev/null; then
      success "$cmd  $(command -v "$cmd")"
    else
      missing+=("$cmd")
      error "$cmd  NOT FOUND"
    fi
  done

  if (( ${#missing[@]} > 0 )); then
    error "Missing tools: ${missing[*]}"
    exit 1
  fi

  # Docker daemon
  if ! docker info &>/dev/null; then
    error "Docker daemon is not running. Please start Docker Desktop."
    exit 1
  fi
  success "Docker daemon is running"
}

# ─── Buildx ──────────────────────────────────────────────────────────────────
setup_buildx() {
  header "Setting up Buildx builder"

  if docker buildx inspect "$BUILDER_NAME" &>/dev/null; then
    info "Builder '$BUILDER_NAME' already exists — reusing"
    docker buildx use "$BUILDER_NAME"
  else
    info "Creating builder '$BUILDER_NAME'"
    docker buildx create \
      --name "$BUILDER_NAME" \
      --driver docker-container \
      --platform "$PLATFORM" \
      --use
  fi

  # Ensure the builder is bootstrapped
  docker buildx inspect --bootstrap "$BUILDER_NAME" &>/dev/null
  success "Buildx builder ready"
}

# ─── Git info ────────────────────────────────────────────────────────────────
get_git_info() {
  header "Collecting Git info"

  GIT_SHA="$(git rev-parse --short=8 HEAD 2>/dev/null || echo 'unknown')"
  GIT_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')"
  GIT_DIRTY=""
  if ! git diff --quiet HEAD -- 2>/dev/null; then
    GIT_DIRTY="-dirty"
  fi

  info "Branch : $GIT_BRANCH"
  info "SHA    : $GIT_SHA${GIT_DIRTY}"
}

# ─── AWS / ECR ───────────────────────────────────────────────────────────────
configure_aws() {
  header "Configuring AWS"

  if ! aws sts get-caller-identity &>/dev/null; then
    error "AWS credentials not configured or expired."
    error "Run 'aws configure' or refresh SSO / assume-role."
    exit 1
  fi

  local caller
  caller="$(aws sts get-caller-identity --output text --query 'Arn' 2>/dev/null)"
  success "Authenticated as: $caller"
}

ecr_login() {
  header "Logging in to ECR"

  local attempt=0
  while (( attempt < MAX_RETRIES )); do
    if aws ecr get-login-password --region "$AWS_REGION" \
       | docker login --username AWS --password-stdin "$ECR_REGISTRY" 2>/dev/null; then
      success "ECR login succeeded"
      return 0
    fi
    attempt=$((attempt + 1))
    warn "ECR login attempt $attempt/$MAX_RETRIES failed — retrying in ${RETRY_DELAY}s"
    sleep "$RETRY_DELAY"
  done

  error "ECR login failed after $MAX_RETRIES attempts"
  exit 1
}

ensure_ecr_repository() {
  header "Ensuring ECR repository exists"

  if aws ecr describe-repositories \
       --repository-names "$ECR_REPOSITORY" \
       --region "$AWS_REGION" &>/dev/null; then
    success "Repository '$ECR_REPOSITORY' exists"
  else
    info "Creating repository '$ECR_REPOSITORY' ..."
    aws ecr create-repository \
      --repository-name "$ECR_REPOSITORY" \
      --region "$AWS_REGION" \
      --image-scanning-configuration scanOnPush=true \
      --image-tag-mutability MUTABLE >/dev/null
    success "Repository created"
  fi
}

# ─── Tags ────────────────────────────────────────────────────────────────────
determine_image_tags() {
  header "Determining image tags"

  TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
  PRIMARY_TAG="${GIT_SHA}${GIT_DIRTY}"
  TAGS=("$PRIMARY_TAG" "production-latest" "${GIT_BRANCH}-latest" "${TIMESTAMP}-${GIT_SHA}")

  # Extra custom tags
  if [[ -n "${CUSTOM_TAGS:-}" ]]; then
    for t in $CUSTOM_TAGS; do
      TAGS+=("$t")
    done
  fi

  for t in "${TAGS[@]}"; do
    info "  ${IMAGE_URI}:${t}"
  done
}

# ─── Build ───────────────────────────────────────────────────────────────────
build_image() {
  header "Building Docker image  (platform: $PLATFORM)"

  local push_flag=""
  if [[ "$SKIP_PUSH" != "true" ]]; then
    push_flag="--push"
  else
    push_flag="--load"
    warn "SKIP_PUSH=true — image will NOT be pushed"
  fi

  # Construct tag flags
  local tag_flags=()
  for t in "${TAGS[@]}"; do
    tag_flags+=("-t" "${IMAGE_URI}:${t}")
  done

  local attempt=0
  while (( attempt < MAX_RETRIES )); do
    info "Build attempt $((attempt + 1))/$MAX_RETRIES ..."

    if docker buildx build \
         --builder "$BUILDER_NAME" \
         --platform "$PLATFORM" \
         --build-arg "BACKEND_URL=${BACKEND_URL}" \
         --cache-from "type=registry,ref=${IMAGE_URI}:buildcache" \
         --cache-to   "type=registry,ref=${IMAGE_URI}:buildcache,mode=max" \
         "${tag_flags[@]}" \
         $push_flag \
         --progress=plain \
         -f Dockerfile \
         . ; then
      success "Build succeeded"
      return 0
    fi

    attempt=$((attempt + 1))
    if (( attempt < MAX_RETRIES )); then
      warn "Build failed — retrying in ${RETRY_DELAY}s"
      sleep "$RETRY_DELAY"
    fi
  done

  error "Build failed after $MAX_RETRIES attempts"
  exit 1
}

# ─── Push additional tags (when --load is used, tags need separate push) ─────
push_additional_tags() {
  if [[ "$SKIP_PUSH" == "true" ]]; then
    warn "Skipping push (SKIP_PUSH=true)"
    return 0
  fi

  # When using --push in buildx, all tags are already pushed.
  # This function exists for scenarios where --load was used and tags
  # need manual pushing. With current flow (--push), this is a no-op.
  success "All tags pushed via buildx --push"
}

# ─── Summary ─────────────────────────────────────────────────────────────────
print_summary() {
  header "Build & Push Complete"

  printf "${BOLD}${GREEN}"
  printf "╔══════════════════════════════════════════════════════════════╗\n"
  printf "║                      Summary                               ║\n"
  printf "╠══════════════════════════════════════════════════════════════╣\n"
  printf "${NC}"
  printf "  ${BOLD}Registry :${NC} %s\n" "$ECR_REGISTRY"
  printf "  ${BOLD}Repo     :${NC} %s\n" "$ECR_REPOSITORY"
  printf "  ${BOLD}Platform :${NC} %s\n" "$PLATFORM"
  printf "  ${BOLD}Branch   :${NC} %s\n" "$GIT_BRANCH"
  printf "  ${BOLD}Commit   :${NC} %s%s\n" "$GIT_SHA" "$GIT_DIRTY"
  printf "  ${BOLD}Backend  :${NC} %s\n" "$BACKEND_URL"
  printf "\n"
  printf "  ${BOLD}Tags pushed:${NC}\n"
  for t in "${TAGS[@]}"; do
    printf "    - %s:%s\n" "$ECR_REPOSITORY" "$t"
  done
  printf "\n"
  printf "${BOLD}${GREEN}"
  printf "╠══════════════════════════════════════════════════════════════╣\n"
  printf "║  Deploy:  Update image tag in docker-compose.cloud.yaml    ║\n"
  printf "║           then run  docker compose -f                      ║\n"
  printf "║           docker-compose.cloud.yaml up -d                  ║\n"
  printf "╚══════════════════════════════════════════════════════════════╝\n"
  printf "${NC}\n"
}

# ─── Main ────────────────────────────────────────────────────────────────────
main() {
  print_banner
  check_prerequisites
  setup_buildx
  get_git_info
  determine_image_tags
  configure_aws
  ecr_login
  ensure_ecr_repository
  build_image
  push_additional_tags
  print_summary
}

main "$@"
