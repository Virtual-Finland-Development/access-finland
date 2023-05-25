FROM node:18-alpine AS base

# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN npm install -g turbo
COPY . .
# RUN npx turbo prune --scope=vf-mvp --docker
RUN turbo prune --scope=web --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm ci

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

# Pass external api urls from build args to env
ARG NEXT_PUBLIC_AUTH_GW_BASE_URL
ARG NEXT_PUBLIC_TESTBED_API_BASE_URL
ARG NEXT_PUBLIC_CODESETS_BASE_URL
ENV NEXT_PUBLIC_AUTH_GW_BASE_URL=${NEXT_PUBLIC_AUTH_GW_BASE_URL}
ENV NEXT_PUBLIC_TESTBED_API_BASE_URL=${NEXT_PUBLIC_TESTBED_API_BASE_URL}
ENV NEXT_PUBLIC_CODESETS_BASE_URL=${NEXT_PUBLIC_CODESETS_BASE_URL}

# Build
# RUN npx turbo run build --filter=vf-mvp...
RUN turbo run build --filter=web...

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/vf-mvp/next.config.js .
COPY --from=installer /app/apps/vf-mvp/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/vf-mvp/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/vf-mvp/.next/static ./apps/vf-mvp/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/vf-mvp/public ./apps/vf-mvp/public

EXPOSE 3000

ENV PORT 3000

CMD node apps/vf-mvp/server.js