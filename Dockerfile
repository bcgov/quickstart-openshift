# RedHat UBI 8
FROM registry.access.redhat.com/ubi8/ubi

# Install nodejs 14
RUN dnf module install -y nodejs:14

# Create and populate /app directory
WORKDIR /app
COPY . .

# Create /.npm and /.config for unprivileged user
RUN mkdir /.npm /.config; \
    chown -R 1001:0 /app /.npm /.config

# Switch to unprivileged user
USER 1001

# Install packages by consuming package-lock.json
RUN npm ci

# Expose port - mostly a convention, for readability
EXPOSE 3000

# Command - ENTRYPOINT persists, CMD can be overridden
ENTRYPOINT ["npm"]
CMD ["start"]
