FROM flyway/flyway:latest-alpine
COPY ./sql /flyway/sql
USER 1000
CMD ["info","migrate","info"]
