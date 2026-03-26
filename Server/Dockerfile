# --- BUILD STAGE ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./
RUN npm ci

# Copy full source and build
COPY . .
RUN npm run build

# --- PRODUCTION STAGE ---
FROM node:18-alpine

WORKDIR /app

# Set Production Environment
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Create a non-root user (Security Hardening)
RUN addgroup -S nodeapp && adduser -S nodeapp -G nodeapp
USER nodeapp

# Expose only the required port
EXPOSE 5000

# Start with security best practices
CMD ["node", "dist/index.js"]