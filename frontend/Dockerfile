# Build
FROM node:24-slim AS build

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

# Deploy: use Caddy image base, strip capabilities from custom binary
FROM caddy:2.10.2-alpine
RUN apk add --no-cache libcap

# Copy custom Caddy binary and strip file capabilities
COPY --from=builder /usr/bin/caddy /usr/bin/caddy
RUN setcap -r /usr/bin/caddy 2>/dev/null || true

# Copy static files, Coraza config
COPY --from=build /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
COPY coraza.conf /etc/caddy/coraza.conf

# Set permissions for static files (OpenShift-compatible)
# OpenShift uses random UIDs but assigns them to root group (GID 0)
RUN chown -R 1001:0 /srv && \
    chmod -R 755 /srv

# Create directories for Coraza WAF with restricted permissions
RUN mkdir -p /tmp/coraza && \
    chown -R 1001:0 /tmp/coraza && \
    chmod -R 770 /tmp/coraza

RUN /usr/bin/caddy fmt /etc/caddy/Caddyfile

EXPOSE 3000 3001
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3001/health

USER 1001
ENTRYPOINT ["/usr/bin/caddy"]
CMD ["run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
