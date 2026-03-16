# Deploy Debug Log

_Tracking bugs encountered during deployment and their resolutions._

---

## Bug #1: AWS credentials failure in build script

**Error:** `configure_aws` function (line 146 in `scripts/build_and_push_to_ecr.sh`) failed because `aws sts get-caller-identity` returned non-zero.
**Root Cause:** The script was invoked with `AWS_PROFILE=personal`, but no profile named `personal` exists in `~/.aws/config`. Only the `default` profile is configured.
**Fix:** No code fix required. Runtime configuration issue -- the script should be run without `AWS_PROFILE=personal`, using the `default` profile which has valid credentials (`arn:aws-cn:iam::432084094746:user/zhouyuxuan`). Re-run with: `bash scripts/build_and_push_to_ecr.sh --auto`
**Status:** Fixed (configuration)
