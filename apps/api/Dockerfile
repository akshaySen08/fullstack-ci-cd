# syntax=docker/dockerfile:1

ARG NODE_VERSION=24

# ---------------------------------------------------------
# Shared base
# ---------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS base

WORKDIR /app


# ---------------------------------------------------------
# Install all dependencies for build and migration stages
# ---------------------------------------------------------
FROM base AS dependencies

COPY package.json package-lock.json ./

RUN npm ci


# ---------------------------------------------------------
# Generate Prisma Client and compile TypeScript
# ---------------------------------------------------------
FROM base AS builder

ENV NODE_ENV=development

COPY --from=dependencies /app/node_modules ./node_modules

COPY package.json package-lock.json ./
COPY tsconfig.json tsconfig.build.json ./

COPY prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate

RUN npm run build


# ---------------------------------------------------------
# Install production dependencies only
# ---------------------------------------------------------
FROM base AS production-dependencies

ENV NODE_ENV=production

COPY package.json package-lock.json ./

RUN npm ci --omit=dev \
  && npm cache clean --force


# ---------------------------------------------------------
# One-time Prisma migration image
# ---------------------------------------------------------
FROM base AS migrator

ENV NODE_ENV=production

COPY --from=dependencies /app/node_modules ./node_modules

COPY package.json package-lock.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma

USER node

CMD ["npx", "prisma", "migrate", "deploy"]


# ---------------------------------------------------------
# Final production API image
# ---------------------------------------------------------
FROM base AS runner

ENV NODE_ENV=production

COPY --from=production-dependencies \
  --chown=node:node \
  /app/node_modules \
  ./node_modules

COPY --from=builder \
  --chown=node:node \
  /app/dist \
  ./dist

COPY --chown=node:node \
  package.json \
  package-lock.json \
  ./

USER node

EXPOSE 4000

STOPSIGNAL SIGTERM

HEALTHCHECK \
  --interval=10s \
  --timeout=3s \
  --start-period=15s \
  --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || '4000') + '/api/ready').then((response) => { if (!response.ok) process.exit(1); }).catch(() => process.exit(1));"

CMD ["node", "dist/server.js"]