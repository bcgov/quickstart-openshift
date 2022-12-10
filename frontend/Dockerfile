FROM node:alpine3.16 as build
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
RUN npm run build
FROM caddy:2.4.6-alpine as deploy

ARG DEPENDENCY=/app
EXPOSE 3000
COPY --from=build ${DEPENDENCY}/Caddyfile /etc/caddy/Caddyfile
COPY --from=build ${DEPENDENCY}/dist /srv
USER 1001
