
# --- Builder for dependencies (dev and prod) ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install --include=dev --package-lock-only
RUN npm ci --include=dev

# --- Builder for production build ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY . .
COPY components ./components
RUN ls -l /app && ls -l /app/app && ls -l /app/pages
RUN mkdir -p public
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/app ./app
COPY --from=builder /app/pages ./pages
COPY --from=builder /app/components ./components
EXPOSE 3000
RUN chmod +x ./scripts/wait-for-backend.sh || true
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 CMD wget -qO- http://localhost:3000/api/health || exit 1
CMD ["/bin/sh", "-c", "sh ./scripts/wait-for-backend.sh && npm run start"]
