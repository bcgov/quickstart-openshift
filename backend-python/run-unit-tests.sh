#!/bin/bash
apt update
curl -sSL https://install.python-poetry.org | python3 -
export PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"
poetry install --no-root -vvv
cd app || exit
DATE_TIME=$(date +'%Y-%m-%d %H:%M:%S.%3N')
echo "Starting unit tests at $DATE_TIME"
ptw -v -w /application/app/test
