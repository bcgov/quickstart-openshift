FROM flyway/flyway:9.22-alpine

# Copy migrations
COPY ./migrations /flyway/sql

# Non-root user
RUN adduser -D app
USER app

# Health check and startup
HEALTHCHECK CMD info
CMD ["info", "migrate", "info"]
