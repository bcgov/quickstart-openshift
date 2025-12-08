# Build
FROM node:24-slim AS build

# Install git (needed to clone BCGov repo)
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Clone and build BCGov design system CSP fix branch
WORKDIR /tmp
RUN git clone --depth 1 --branch 574-feat-replace-inline-styles-csp-compliance \
    https://github.com/bcgov/design-system.git bcgov-design-system
WORKDIR /tmp/bcgov-design-system/packages/react-components
RUN npm ci --ignore-scripts --no-update-notifier && npm run rollup

# Build our application
WORKDIR /app
COPY . ./
# Use npm install instead of npm ci because we have a local file dependency
RUN npm install --ignore-scripts --no-update-notifier --omit=dev && npm run build

# Deploy using Caddy to host static files
FROM caddy:2.10.2-alpine
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
