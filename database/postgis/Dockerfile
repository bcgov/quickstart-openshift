# RedHat UBI 8 with nodejs 14
FROM postgis/postgis:15-master@sha256:ceb611a5025b0cc62202022fdb244a4d8e2b8ab93b61674a1ac1283034dc6884

# Enable pgcrypto extension on startup
RUN sed -i '/EXISTS postgis_tiger_geocoder;*/a CREATE EXTENSION IF NOT EXISTS pgcrypto;' \
        /docker-entrypoint-initdb.d/10_postgis.sh

# Health check - recommended for local dev
HEALTHCHECK --interval=15s --timeout=5s --retries=3 CMD [ "pg_isready" ]

# Non-privileged user
USER postgres
