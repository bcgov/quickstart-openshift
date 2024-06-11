# Build
FROM node:20.14.0-bullseye-slim AS build

# Copy, install deps, build static files
WORKDIR /app
COPY . ./
RUN npm ci --ignore-scripts --no-update-notifier --omit=dev && \
    npm run build

# Deploy
FROM gcr.io/distroless/nodejs20-debian11:nonroot
ENV NODE_ENV production

# Copy app and dependencies
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Boilerplate, not used in OpenShift/Kubernetes
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3000/api

# Startup with 50MB of heap size (default is 4 GB)
USER nonroot
CMD ["--max-old-space-size=50", "/app/dist/main"]
