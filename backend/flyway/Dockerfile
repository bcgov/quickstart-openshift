FROM flyway/flyway:9.10-alpine
COPY ./sql /flyway/sql
USER app
CMD ["info","migrate","info"]
