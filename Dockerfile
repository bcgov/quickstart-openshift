# RedHat UBI 8 with nodejs 14
FROM registry.access.redhat.com/ubi8/ubi as builder
RUN dnf module install -y nodejs:14

# Install dev packages and build js in /app/dist
WORKDIR /app
COPY package*.json tsconfig.* ./
COPY ./src /app/src
RUN npm ci && \
    npm run build && \
    rm -rf ./node_modules && \
    NODE_ENV=production npm ci --only=production

# Fresh image
FROM registry.access.redhat.com/ubi8/nodejs-14-minimal

# Copy over /app/dist
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Expose port - mostly a convention, for readability
EXPOSE 3000

# Start up command
ENTRYPOINT ["npm", "run", "start:prod"]
