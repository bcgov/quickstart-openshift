FROM postgres:15@sha256:9e3b538a581247a22f8e452d1b797373bb3e1bfae6e3273e9c49b637e080c797

# Enable extensions using this pattern on startup
#RUN sed -i '/EXISTS postgis_tiger_geocoder;*/a CREATE EXTENSION IF NOT EXISTS pgcrypto;' \
#        /docker-entrypoint-initdb.d/10_postgis.sh

# Health check - recommended for local dev
HEALTHCHECK --interval=15s --timeout=5s --retries=3 CMD [ "pg_isready" ]

# Non-privileged user
USER postgres
