# Build static files
FROM node:20.14.0-bullseye-slim AS build

# Copy files, install packages and build static files
# See .dockerignore for exclusions
WORKDIR /app
COPY . ./
RUN npm ci --ignore-scripts --no-update-notifier --omit=dev && \
    npm run build

# Deploy using Caddy to host static files
FROM caddy:2.8.4-alpine
RUN apk add --no-cache ca-certificates

# Copy static files and run formatting
COPY --from=build /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
RUN caddy fmt /etc/caddy/Caddyfile

# Boilerplate, not used in OpenShift/Kubernetes
EXPOSE 3000 3001
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3001/health

# Run as non-root user
USER 1001
