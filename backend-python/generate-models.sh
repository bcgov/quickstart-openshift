#!/bin/bash
python3 -m venv venv-py
source venv-py/bin/activate
pip install --upgrade pip
pip install sqlalchemy sqlacodegen psycopg2-binary sqlacodegen[citext]
sqlacodegen --schema py_api postgresql://postgres:postgres@database-py:5432/postgres > /application/models/model.py
