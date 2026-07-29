FROM flyway/flyway:13-alpine

# Copy migrations
COPY ./sql /flyway/sql

# Non-root user
RUN adduser -D app
USER app

# Concurrent indexes cannot run while Flyway holds a transaction-scoped
# advisory lock. A session-scoped lock still serializes migrators and lets
# V1.0.3 complete its online index build.
ENV FLYWAY_POSTGRESQL_TRANSACTIONAL_LOCK=false

# Health check and startup
HEALTHCHECK CMD info
# Adding repair to see if it fixes migration issues.
CMD ["info", "migrate", "repair"] 
