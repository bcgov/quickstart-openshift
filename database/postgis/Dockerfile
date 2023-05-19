# RedHat UBI 8 with nodejs 14
FROM postgis/postgis:15-master@sha256:7899b4514afbe2d7baf879113714aea1e6e494479f4123a33a0d582576d5873c

# Enable pgcrypto extension on startup
RUN sed -i '/EXISTS postgis_tiger_geocoder;*/a CREATE EXTENSION IF NOT EXISTS pgcrypto;' \
        /docker-entrypoint-initdb.d/10_postgis.sh

# Health check - recommended for local dev
HEALTHCHECK --interval=15s --timeout=5s --retries=3 CMD [ "pg_isready" ]

# Non-privileged user
USER postgres
