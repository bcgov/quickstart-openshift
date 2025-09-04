# Build
FROM node:22-slim@sha256:0ae9e80c8c7e7a8fea5bc8e8762e4fd09a7a68c251abf8cf44ea0863efda2bc5 AS build

# Copy, build static files; see .dockerignore for exclusions
WORKDIR /app
COPY . ./
RUN npm run deploy

# Deploy using Caddy to host static files
FROM caddy:2.10.2-alpine@sha256:a4180db0805b3725ddf936d2e6290553745c7339c003565da717ee612fd8a888
RUN apk add --no-cache ca-certificates

# Copy static files, verify Caddyfile formatting
COPY --from=build /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
RUN caddy fmt /etc/caddy/Caddyfile

# Boilerplate, not used in OpenShift/Kubernetes
EXPOSE 3000 3001
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3001/health

# Nonroot user
USER 1001
