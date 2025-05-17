# Stage 1: Build
FROM oven/bun:slim AS builder

WORKDIR /app

# Install dependencies (only package.json and lockfile to leverage cache)
COPY package.json ./ 

RUN bun install --production

COPY . .

# Build Next.js app
RUN bun run build

# Stage 2: Production image
FROM oven/bun:slim

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/.next .next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/node_modules ./node_modules

# Expose default Next.js port
EXPOSE 3000

# Start Next.js in production mode
CMD ["bun", "start"]
