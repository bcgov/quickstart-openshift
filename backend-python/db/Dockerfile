FROM flyway/flyway:9.20-alpine

# Non-root user
RUN adduser -D app
USER app

# Copy migrations
COPY ./migrations /flyway/sql
HEALTHCHECK --interval=300s --timeout=30s CMD info || exit 1
# Startup
CMD ["info","migrate","info"]
