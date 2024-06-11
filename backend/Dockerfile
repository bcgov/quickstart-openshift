# Build
FROM node:20.14.0-bullseye-slim AS build

# Copy, build static files; see .dockerignore for exclusions
WORKDIR /app
COPY . ./
RUN npm run deploy

# Deploy using minimal Distroless image
FROM gcr.io/distroless/nodejs20-debian11:nonroot
ENV NODE_ENV production

# Copy app and dependencies
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Boilerplate, not used in OpenShift/Kubernetes
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3000/api

# Nonroot user, limit heap size to 50 MB
USER nonroot
CMD ["--max-old-space-size=50", "/app/dist/main"]
