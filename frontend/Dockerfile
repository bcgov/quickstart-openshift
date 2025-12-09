# Build
FROM node:24-slim AS build

# Install git (needed to clone BCGov repo)
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Clone and build BCGov design system CSP fix branch (forked repo for testing)
WORKDIR /tmp
RUN git clone --depth 1 --branch fix/csp-remove-all-inline-styles \
    git@github.com:DerekRoberts/design-system.git bcgov-design-system || \
    git clone --depth 1 --branch fix/csp-remove-all-inline-styles \
    https://github.com/DerekRoberts/design-system.git bcgov-design-system
WORKDIR /tmp/bcgov-design-system/packages/react-components
RUN npm ci --ignore-scripts --no-update-notifier && npm run rollup

# Build our application
WORKDIR /app
COPY package*.json ./
# WARNING: Using npm install instead of npm ci due to local file dependency for testing fork branch.
# This is UNSAFE for production because:
# - npm install can install different versions than package-lock.json specifies
# - Builds are non-deterministic and may differ between runs
# - Security vulnerabilities may be introduced from dependency resolution changes
# We accept this risk ONLY because we're testing a fork branch via local file dependency:
# "@bcgov/design-system-react-components": "file:../tmp/bcgov-design-system/packages/react-components"
# This path only exists in Docker build context, so package-lock.json cannot contain it.
# npm ci requires exact match between package.json and package-lock.json, so it will fail here.
# TODO: Remove this once fork branch is merged/published and we can use a published version.
RUN rm -f package-lock.json
COPY . ./
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
