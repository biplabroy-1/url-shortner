# Stage 1: Build
FROM oven/bun:slim AS builder

WORKDIR /app

# Install dependencies (only package.json and lockfile to leverage cache)
COPY package.json ./ 

RUN bun install

COPY . .

# Build Next.js app
RUN bun run build

# Stage 2: Production image
FROM oven/bun:slim

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/node_modules ./node_modules

# Expose default Next.js port
EXPOSE 3000

# Start Next.js in production mode
CMD ["bun", "start"]
