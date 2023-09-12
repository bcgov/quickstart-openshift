#!/bin/bash
set -eu

# Change to script dir
cd $(dirname ${BASH_SOURCE[0]})

# setup
python3 -m venv venv-py
source venv-py/bin/activate
pip install --upgrade pip
pip install sqlalchemy sqlacodegen psycopg2-binary sqlacodegen[citext]

# Envars
POSTGRES_HOST=${POSTGRES_HOST:-database}
POSTGRES_USER=${POSTGRES_USER:-postgres}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-default}
POSTGRES_DATABASE=${POSTGRES_DATABASE:-postgres}

# Generate
sqlacodegen --schema py_api postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/postgres > ./models/model.py
