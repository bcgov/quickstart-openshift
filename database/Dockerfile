FROM postgres:15@sha256:50a96a21f2992518c2cb4601467cf27c7ac852542d8913c1872fe45cd6449947

# Enable extensions using this pattern on startup
#RUN sed -i '/EXISTS postgis_tiger_geocoder;*/a CREATE EXTENSION IF NOT EXISTS pgcrypto;' \
#        /docker-entrypoint-initdb.d/10_postgis.sh

# Health check - recommended for local dev
HEALTHCHECK --interval=15s --timeout=5s --retries=3 CMD [ "pg_isready" ]

# Non-privileged user
USER postgres
