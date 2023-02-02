FROM node:16-bullseye AS build

WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build
RUN ls /app

FROM caddy:2.4.6-alpine AS deploy
COPY --from=build /app/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/build /srv

HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:3000
EXPOSE 3000
USER 1001
