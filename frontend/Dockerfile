### Global args
ARG PORT 3000
ARG SRC /app

### Builder
FROM node:alpine3.16 AS build
ARG SRC

# Build static files
WORKDIR ${SRC}
COPY . .
RUN npm ci && \
    npm run build

### Deploy
FROM caddy:2.6.4-alpine
ARG PORT
ARG SRC

# Copy Caddyfile and static files
COPY --from=build ${SRC}/Caddyfile /etc/caddy/Caddyfile
COPY --from=build ${SRC}/dist /srv

# Port, Healthcheck and user
EXPOSE ${PORT}
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost/:${PORT} || exit 1
