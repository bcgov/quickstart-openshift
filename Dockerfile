FROM registry.access.redhat.com/ubi8/ubi as builder
RUN dnf module install -y nodejs:14

# Install dev packages and build js in /app/dist
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm ci

# Deployment container
FROM registry.access.redhat.com/ubi8/ubi-micro
# Copy binary and configuration
WORKDIR /app
COPY . .
COPY --from=builder /usr/bin/node /usr/bin/
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /usr/lib64/libz.so.1 /usr/lib64/
COPY --from=builder /usr/lib64/libbrotlidec.so.1 /usr/lib64/
COPY --from=builder /usr/lib64/libbrotlienc.so.1 /usr/lib64/
COPY --from=builder /usr/lib64/libcrypto.so.1.1 /usr/lib64/
COPY --from=builder /usr/lib64/libssl.so.1.1 /usr/lib64/
COPY --from=builder /usr/lib64/libstdc++.so.6 /usr/lib64/
COPY --from=builder /usr/lib64/libgcc_s.so.1 /usr/lib64/
COPY --from=builder /usr/lib64/libbrotlicommon.so.1 /usr/lib64/

EXPOSE 3000
CMD node index.js
