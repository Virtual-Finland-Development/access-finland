FROM node:18-alpine AS base

# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
COPY . .
RUN npx turbo prune --scope=af-mvp --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY patches ./patches
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
ARG NEXT_PUBLIC_CODESETS_BASE_URL
ENV NEXT_PUBLIC_CODESETS_BASE_URL=${NEXT_PUBLIC_CODESETS_BASE_URL}
ARG NEXT_PUBLIC_USERS_API_BASE_URL
ENV NEXT_PUBLIC_USERS_API_BASE_URL=${NEXT_PUBLIC_USERS_API_BASE_URL}
ARG BACKEND_SECRET_SIGN_KEY
ENV BACKEND_SECRET_SIGN_KEY=${BACKEND_SECRET_SIGN_KEY}
ARG NEXT_PUBLIC_STAGE
ENV NEXT_PUBLIC_STAGE=${NEXT_PUBLIC_STAGE}
ARG TESTBED_PRODUCT_GATEWAY_BASE_URL
ENV TESTBED_PRODUCT_GATEWAY_BASE_URL=${TESTBED_PRODUCT_GATEWAY_BASE_URL}
ARG TESTBED_DEFAULT_DATA_SOURCE
ENV TESTBED_DEFAULT_DATA_SOURCE=${TESTBED_DEFAULT_DATA_SOURCE}
ARG FRONTEND_ORIGIN_URI
ENV FRONTEND_ORIGIN_URI=${FRONTEND_ORIGIN_URI}

# Create a dotenv file with the build args for the nextjs
RUN echo "NEXT_PUBLIC_STAGE=${NEXT_PUBLIC_STAGE}" >> apps/af-mvp/.env
RUN echo "BACKEND_SECRET_SIGN_KEY=${BACKEND_SECRET_SIGN_KEY}" >> apps/af-mvp/.env
RUN echo "TESTBED_PRODUCT_GATEWAY_BASE_URL=${TESTBED_PRODUCT_GATEWAY_BASE_URL}" >> apps/af-mvp/.env
RUN echo "TESTBED_DEFAULT_DATA_SOURCE=${TESTBED_DEFAULT_DATA_SOURCE}" >> apps/af-mvp/.env
RUN echo "FRONTEND_ORIGIN_URI=${FRONTEND_ORIGIN_URI}" >> apps/af-mvp/.env

# Build
RUN npx turbo run build --filter=af-mvp...

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/af-mvp/next.config.js .
COPY --from=installer /app/apps/af-mvp/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/af-mvp/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/af-mvp/.next/static ./apps/af-mvp/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/af-mvp/public ./apps/af-mvp/public

EXPOSE 3000

ENV PORT 3000

CMD node apps/af-mvp/server.js