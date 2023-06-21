#!/bin/bash

# Setup Poetry
curl -sSL https://install.python-poetry.org | python3 -
export PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"
poetry install --no-root -vvv --without dev --sync

# Start app
cd $(dirname ${BASH_SOURCE[0]})
echo "Starting uvicorn at $(date +'%Y-%m-%d %H:%M:%S.%3N')"
uvicorn src.main:app --host 0.0.0.0 --port 3000 --workers 1 --server-header --date-header --limit-concurrency 100 --reload --log-config ./logger.conf
