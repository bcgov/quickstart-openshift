# Build
FROM node:22-slim@sha256:557e52a0fcb928ee113df7e1fb5d4f60c1341dbda53f55e3d815ca10807efdce AS build

# Copy, build static files; see .dockerignore for exclusions
WORKDIR /app
COPY . ./
RUN npm run deploy

# Deploy using Caddy to host static files
FROM caddy:2.10.0-alpine@sha256:e2e3a089760c453bc51c4e718342bd7032d6714f15b437db7121bfc2de2654a6
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
