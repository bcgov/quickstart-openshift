# https://catalog.redhat.com/software/containers/ubi8/nodejs-18-minimal/627d1c38e35da88581633bf1
FROM registry.access.redhat.com/ubi8/nodejs-18-minimal:1-33.1679485315@sha256:74af9dc2b620022c77fcd712b811f64a03c1444ff1e9b9596a242b2edf3cf96f AS builder

# Install packages, build and keep only prod packages
USER root
WORKDIR /app
COPY *.json ./
COPY ./src /app/src
RUN npm ci --omit=dev && \
    npm run build

# Deployment container
FROM registry.access.redhat.com/ubi8/ubi-micro:8.7-6@sha256:af0a83c2fb7db1b63a5655c85f3f37d32b114443b8969fd8a40d47429cd87016

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

# Start up command
ENTRYPOINT ["node", "dist/main"]
