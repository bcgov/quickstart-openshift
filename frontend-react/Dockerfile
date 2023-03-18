FROM node:19-bullseye@sha256:2405a991a6d9f6ac1d991feefc0a4539d5187abd2ca532fd18f7185c98b32a45 AS build

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
