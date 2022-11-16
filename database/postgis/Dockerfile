# RedHat UBI 8 with nodejs 14
FROM postgis/postgis:13-master

# Enable pgcrypto extension on startup
RUN sed -i '/EXISTS postgis_tiger_geocoder;*/a CREATE EXTENSION IF NOT EXISTS pgcrypto;' \
        /docker-entrypoint-initdb.d/10_postgis.sh

# Non-privileged user
USER postgres
