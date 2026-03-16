# ── Stage 1: Install dependencies ─────────────────────────
FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# ── Stage 2: Build the application ───────────────────────
FROM oven/bun:1 AS builder
WORKDIR /app

# BACKEND_URL is baked into Next.js rewrites at build time.
ARG BACKEND_URL=http://localhost:8124
ENV BACKEND_URL=${BACKEND_URL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build && mkdir -p /app/public

# ── Stage 3: Production runner ───────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 61241

ENV PORT=61241
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
