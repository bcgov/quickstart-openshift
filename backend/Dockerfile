FROM node:18-bullseye-slim AS build

# Install packages, build and keep only prod packages
WORKDIR /app
COPY *.json ./
COPY ./src ./src
RUN npm ci --omit=dev --ignore-scripts && \
    npm run build


# Deployment container
FROM gcr.io/distroless/nodejs:18
ENV NODE_ENV production

# Copy over app
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Port and health check
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:3000/api || exit 1

# Non-privileged user
USER app

# Start up command with 50MB of heap size, each application needs to determine what is the best value. DONT use default as it is 4GB.
CMD ["--max-old-space-size=50", "/app/dist/main"]
