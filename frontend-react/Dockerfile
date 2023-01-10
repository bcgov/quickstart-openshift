FROM node:16-bullseye AS build
LABEL maintainer="Ricardo Montania Prado de Campos <ricardo.campos@encora.com>"
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build
RUN ls /app
FROM caddy:2.4.6-alpine AS deploy
EXPOSE 3000
COPY --from=build /app/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/build /srv
USER 1001
