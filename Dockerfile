# RedHat UBI 8 with nodejs 14
FROM registry.access.redhat.com/ubi8/ubi as builder
RUN dnf module install -y nodejs:14

# Install dev packages and build js in /app/dist
WORKDIR /app
COPY package*.json tsconfig.* ./
COPY ./src /app/src
RUN npm ci && \
    npm run build

# Fresh image
FROM registry.access.redhat.com/ubi8/ubi
RUN dnf module install -y nodejs:14

# Copy over /app/dist
WORKDIR /app
COPY --from=builder /app/dist ./dist

# Install prod packages
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production

# Expose port - mostly a convention, for readability
EXPOSE 3000

# Command - ENTRYPOINT persists, CMD can be overridden
ENTRYPOINT ["npm"]
CMD ["run", "prod"]
