# RedHat UBI 8
FROM registry.access.redhat.com/ubi8/ubi

# Install nodejs 14
RUN dnf module install -y nodejs:14

# Create and populate /app directory
WORKDIR /app
COPY . .

# Install packages by consuming package-lock.json
RUN npm ci && \
    npm run build

# Expose port - mostly a convention, for readability
EXPOSE 3000

# Command - ENTRYPOINT persists, CMD can be overridden
ENTRYPOINT ["npm"]
CMD ["run", "prod"]
