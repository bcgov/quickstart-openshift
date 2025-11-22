# Build
FROM node:22-slim AS build

# Copy, build static files; see .dockerignore for exclusions
WORKDIR /app
COPY . ./
RUN npm run deploy

# Build custom Caddy with Coraza WAF plugin
FROM caddy:2.10.2-builder AS builder
# Install CA certificates for Go module downloads
RUN apk add --no-cache ca-certificates
RUN xcaddy build \
    --with github.com/corazawaf/coraza-caddy/v2

# Deploy using custom Caddy to host static files
FROM caddy:2.10.2-alpine
RUN apk add --no-cache ca-certificates

# Copy custom Caddy binary with Coraza
COPY --from=builder /usr/bin/caddy /usr/bin/caddy

# Copy static files, Coraza config, verify Caddyfile formatting
COPY --from=build /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
COPY coraza.conf /etc/caddy/coraza.conf
RUN caddy fmt /etc/caddy/Caddyfile

# Boilerplate, not used in OpenShift/Kubernetes
EXPOSE 3000 3001
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3001/health

# Nonroot user
USER 1001
