FROM flyway/flyway:11-alpine@sha256:e7f6f7866e73adf993d1f11f023527a4b0926cc6ad2c431c8fcaa03f2db2ce81

# Copy migrations
COPY ./sql /flyway/sql

# Non-root user
RUN adduser -D app
USER app

# Health check and startup
HEALTHCHECK CMD info
# Adding repair to see if it fixes migration issues.
CMD ["info", "migrate", "repair"] 
