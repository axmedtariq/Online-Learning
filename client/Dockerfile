# --- BUILD STAGE ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files for caching
COPY package*.json ./
RUN npm ci

# Copy full source and build
COPY . .
RUN npm run build

# --- PRODUCTION STAGE ---
FROM nginx:alpine

# Copy built assets to Nginx html directory
COPY --from=builder /app/build /usr/share/nginx/html

# Custom Nginx config (Can be expanded later)
EXPOSE 80

# Run Nginx as a non-root user (Standard Nginx user)
USER nginx

# Start with security hardening
CMD ["nginx", "-g", "daemon off;"]