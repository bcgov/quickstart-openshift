FROM node:alpine3.16 AS build
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM caddy:2.4.6-alpine
EXPOSE 3000
COPY --from=build /app/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

USER 1001
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:3000
