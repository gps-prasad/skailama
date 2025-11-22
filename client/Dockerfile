# Stage 1: Dependency installation
# Changed from node:18-alpine to node:20-alpine
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; else npm install --frozen-lockfile; fi

# Stage 2: Application building
# Changed from node:18-alpine to node:20-alpine
FROM node:20-alpine AS builder
WORKDIR /app
ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Production runner
# Changed from node:18-alpine to node:20-alpine
FROM node:20-alpine AS runner
WORKDIR /app

# Create a non-root user for security
RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs

# Set ownership for the application files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Fix the ENV format warnings as well
ENV PORT=3000

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
