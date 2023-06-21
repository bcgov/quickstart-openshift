#!/bin/bash
set -eu

# setup
python3 -m venv venv-py
source venv-py/bin/activate
pip install --upgrade pip
pip install sqlalchemy sqlacodegen psycopg2-binary sqlacodegen[citext]

# Envars
POSTGRESQL_HOST=${POSTGRESQL_HOST:-database}
POSTGRESQL_USER=${POSTGRESQL_USER:-postgres}
POSTGRESQL_PASSWORD=${POSTGRESQL_PASSWORD:-default}
POSTGRESQL_DATABASE=${POSTGRESQL_DATABASE:-postgres}

# Generate
sqlacodegen --schema py_api postgresql://${POSTGRESQL_USER}:${POSTGRESQL_PASSWORD}@${POSTGRESQL_HOST}:5432/postgres > ./models/model.py
