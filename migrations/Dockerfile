FROM flyway/flyway:11-alpine@sha256:e5c941be8cda7f641cdd80f267bc45297fb6d04ea9275f60d408cd4ba4f52354

# Copy migrations
COPY ./sql /flyway/sql

# Non-root user
RUN adduser -D app
USER app

# Health check and startup
HEALTHCHECK CMD info
# Adding repair to see if it fixes migration issues.
CMD ["info", "migrate", "repair"] 
