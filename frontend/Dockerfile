# Build static files
FROM node:24-slim AS static-files

WORKDIR /app
COPY . ./
RUN npm run deploy

# Build custom Caddy with Coraza WAF plugin
FROM caddy:2.10.2-builder AS xcaddy-builder

RUN apk add --no-cache ca-certificates
RUN xcaddy build \
    --with github.com/corazawaf/coraza-caddy/v2

# Final image with Caddy binary, static files, Coraza config, verify Caddyfile formatting
FROM caddy:2.10.2-alpine

# Caddy binary with Coraza, static files, Coraza config, verify Caddyfile formatting
COPY --from=xcaddy-builder /usr/bin/caddy /usr/bin/caddy
COPY --from=static-files /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
COPY coraza.conf /etc/caddy/coraza.conf

# Verify Caddyfile formatting, install CA certificates, create Coraza WAF directories
RUN caddy fmt /etc/caddy/Caddyfile && \
    apk add --no-cache ca-certificates && \
    mkdir -p /tmp/coraza

# Port, healthchek, non-root user (boilerplate)
EXPOSE 3000 3001
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3001/health
USER 1001
