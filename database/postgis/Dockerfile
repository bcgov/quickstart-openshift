FROM postgis/postgis:15-master

# Enable extensions using this pattern on startup
# RUN sed -i '/EXISTS postgis_tiger_geocoder;*/a CREATE EXTENSION IF NOT EXISTS pgcrypto;' \
#       /docker-entrypoint-initdb.d/10_postgis.sh

# Health check and non-privileged user
HEALTHCHECK --interval=15s --timeout=5s --retries=3 CMD [ "pg_isready" ]
USER postgres
