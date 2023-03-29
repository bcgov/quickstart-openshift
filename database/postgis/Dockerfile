# RedHat UBI 8 with nodejs 14
FROM postgis/postgis:15-master@sha256:cff6ce199157318c0a6d656f8e081d3113bdf4f0fcd0282d511e49e8210b8839

# Enable pgcrypto extension on startup
RUN sed -i '/EXISTS postgis_tiger_geocoder;*/a CREATE EXTENSION IF NOT EXISTS pgcrypto;' \
        /docker-entrypoint-initdb.d/10_postgis.sh

# Health check - recommended for local dev
HEALTHCHECK --interval=15s --timeout=5s --retries=3 CMD [ "pg_isready" ]

# Non-privileged user
USER postgres
