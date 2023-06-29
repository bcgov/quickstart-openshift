# Build static files
FROM node:alpine3.16 AS build

WORKDIR /app
COPY . .
RUN npm ci --ignore-scripts && \
    npm run build

# Caddy
FROM caddy:2.6.4-alpine

# Copy static files and config
COPY --from=build /app/dist /app/dist
COPY Caddyfile /etc/caddy/Caddyfile

# Packages and caddy format
RUN apk add --no-cache ca-certificates && \
    caddy fmt --overwrite /etc/caddy/Caddyfile

# Port, health check and non-root user
EXPOSE 3000 3001
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:3001/health
USER 1001
