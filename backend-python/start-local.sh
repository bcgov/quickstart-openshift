#!/bin/bash
apt update
curl -sSL https://install.python-poetry.org | python3 -
export PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"
poetry install --no-root -vvv
cd app/src || exit
DATE_TIME=$(date +'%Y-%m-%d %H:%M:%S.%3N')
echo "Starting uvicorn at $DATE_TIME"
uvicorn main:app --host 0.0.0.0 --port 3000 --workers 1 --log-level info --server-header --date-header --limit-concurrency 100 --reload
