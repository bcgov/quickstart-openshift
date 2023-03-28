FROM node:alpine3.16@sha256:dda50fd533b57096bfb959afa8bfd290dc3c127207907177b578d44ee14d7119 AS build
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM caddy:2.4.6-alpine@sha256:15e576e7d00b1f41a648c5295a03677c24da5fede09131edcb1e6d809c7dc8aa
EXPOSE 3000
COPY --from=build /app/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

EXPOSE 3000
USER 1001
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:3000
