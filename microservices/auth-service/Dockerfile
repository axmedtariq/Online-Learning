# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build || true # If tsc is ready

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/package*.json ./
RUN npm install --only=production
COPY --from=build /app/dist ./dist || COPY --from=build /app/src ./src 

# Standard security user (OWASP Hardening)
USER node 

ENV NODE_ENV=production
EXPOSE 5001

CMD ["node", "src/index.js"]
