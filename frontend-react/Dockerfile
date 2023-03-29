FROM node:19-bullseye@sha256:1fab548e95c779df229e4b50d8d20e222597bda15aeece508098c5ba7723302e AS build

WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

FROM caddy:2.4.6-alpine@sha256:15e576e7d00b1f41a648c5295a03677c24da5fede09131edcb1e6d809c7dc8aa AS deploy
COPY --from=build /app/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/build /srv

EXPOSE 3000
USER 1001
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:3000
