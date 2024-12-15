FROM flyway/flyway:10-alpine

# Copy migrations
COPY ./sql /flyway/sql

# Non-root user
RUN adduser -D app
USER app

# Health check and startup
HEALTHCHECK CMD info
# Add -X flag for debug output
ENTRYPOINT ["flyway", "-X", "-color"]
# Adding repair to see if it fixes migration issues.
CMD ["info", "migrate", "repair", "info"] 
