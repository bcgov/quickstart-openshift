FROM node:alpine3.16 AS build
WORKDIR /app
COPY . .
RUN npm ci --ignore-scripts && \
    npm run build

FROM caddy:2.6.4-alpine
COPY --from=build /app/dist /app/dist
RUN chmod 777 /config/caddy
EXPOSE 3000
EXPOSE 3001
USER 1001

HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:3001/health || exit 1
