FROM node:alpine3.16 AS build
WORKDIR /app
COPY . .
RUN npm ci --omit=dev --ignore-scripts && \
    npm run build

FROM caddy:2.4.6-alpine
COPY --from=build /app/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /app/dist
EXPOSE 3000
USER 1001
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:3000
