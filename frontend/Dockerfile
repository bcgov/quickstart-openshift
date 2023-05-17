### Global args
ARG PORT 3000

### Builder
FROM node:alpine3.16 AS build

# Build static files
WORKDIR /app
COPY . .
RUN npm ci --omit=dev --ignore-scripts && \
    npm run build

### Deploy
FROM caddy:2.4.6-alpine
ARG PORT

# Copy Caddyfile and static files
COPY --from=build /app/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

# Port, Healthcheck and user
EXPOSE ${PORT}
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost/:${PORT} || exit 1
USER app
