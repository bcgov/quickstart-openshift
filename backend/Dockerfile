# https://catalog.redhat.com/software/containers/ubi8/nodejs-18-minimal/627d1c38e35da88581633bf1
FROM registry.access.redhat.com/ubi8/nodejs-18-minimal:1-49 AS builder

# Install packages, build and keep only prod packages
USER root
WORKDIR /app
COPY *.json ./
COPY ./src /app/src
RUN npm ci --omit=dev --ignore-scripts && \
    npm run build

# Deployment container
FROM registry.access.redhat.com/ubi8/ubi-micro:8.7-8

# Set node to production 
ENV NODE_ENV production

# Node packages and dependencies
COPY --from=builder /usr/bin/node /usr/bin/
COPY --from=builder /usr/lib64/libz.so.1 /usr/lib64/
COPY --from=builder /usr/lib64/libbrotlidec.so.1 /usr/lib64/
COPY --from=builder /usr/lib64/libbrotlienc.so.1 /usr/lib64/
COPY --from=builder /usr/lib64/libcrypto.so.1.1 /usr/lib64/
COPY --from=builder /usr/lib64/libssl.so.1.1 /usr/lib64/
COPY --from=builder /usr/lib64/libstdc++.so.6 /usr/lib64/
COPY --from=builder /usr/lib64/libgcc_s.so.1 /usr/lib64/
COPY --from=builder /usr/lib64/libbrotlicommon.so.1 /usr/lib64/

# Copy over app
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Port and health check
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:3000

# Non-privileged user
USER app

# Start up command with 50MB of heap size, each application needs to determine what is the best value. DONT use default as it is 4GB.
ENTRYPOINT ["node","--max-old-space-size=50", "dist/main"]
