FROM postgres:13

# Enable extensions using this pattern on startup
#RUN sed -i '/EXISTS postgis_tiger_geocoder;*/a CREATE EXTENSION IF NOT EXISTS pgcrypto;' \
#        /docker-entrypoint-initdb.d/10_postgis.sh

# Non-privileged user
USER postgres
