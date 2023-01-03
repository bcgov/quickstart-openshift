FROM flyway/flyway:9.10-alpine

# Non-root user
RUN adduser -D app
USER app

# Copy migrations
COPY ./sql /flyway/sql

# Startup
CMD ["info","migrate","info"]
