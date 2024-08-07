# Build
FROM node:22.6.0-slim AS build

# Copy, build static files; see .dockerignore for exclusions
WORKDIR /app
COPY . ./
ENV PRISMA_CLI_BINARY_TARGETS debian-openssl-3.0.x
RUN npm run deploy

# Deploy using minimal Distroless image
FROM gcr.io/distroless/nodejs22-debian12:nonroot
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
