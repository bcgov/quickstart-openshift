ARG POSTGRES_VERSION=18
ARG POSTGIS_VERSION=3.5

FROM postgis/postgis:${POSTGRES_VERSION}-${POSTGIS_VERSION}
HEALTHCHECK --interval=15s --timeout=5s --retries=3 CMD [ "pg_isready" ]
USER postgres


