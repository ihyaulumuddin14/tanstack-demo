# syntax=docker/dockerfile:1

# Base image with Node.js for build and runtime stages.
FROM node:20-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies in a dedicated layer for better caching.
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build the Next.js app.
FROM base AS builder
WORKDIR /app
ARG NEXT_PUBLIC_AUTH_URL
ARG AUTH_URL
ARG MONGODB_URI
ENV NEXT_PUBLIC_AUTH_URL=$NEXT_PUBLIC_AUTH_URL
ENV AUTH_URL=$AUTH_URL
ENV MONGODB_URI=$MONGODB_URI
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production runtime using the standalone output.
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create a non-root user for security.
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
