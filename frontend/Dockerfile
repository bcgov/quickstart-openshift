# Build static files
# Node Bullseye has npm
FROM node:20.6.1-bullseye-slim AS build

# Install packages, build and keep only prod packages
WORKDIR /app
COPY *.json *.ts index.html ./
COPY ./src ./src
RUN npm ci --ignore-scripts --no-update-notifier --omit=dev && \
    npm run build

# Deploy container
# Caddy serves static files
FROM caddy:2.7.4-alpine

# Copy static files and config
COPY --from=build /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile

# Packages and caddy format
RUN apk add --no-cache ca-certificates && \
    caddy fmt --overwrite /etc/caddy/Caddyfile

# Port, health check and non-root user
EXPOSE 3000 3001
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:3001/health
USER 1001
