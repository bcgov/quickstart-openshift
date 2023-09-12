FROM flyway/flyway:9.22-alpine

# Non-root user
RUN adduser -D app
USER app

# Copy migrations
COPY ./migrations /flyway/sql

# Startup and health check
CMD ["info","migrate","info"]
HEALTHCHECK --interval=300s --timeout=30s CMD info
