#!/bin/bash
apt update
curl -sSL https://install.python-poetry.org | python3 -
export PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"
poetry install --no-root -vvv
DATE_TIME=$(date +'%Y-%m-%d %H:%M:%S.%3N')
echo "Starting unit tests at $DATE_TIME"
poetry run coverage run --source=app -m pytest app/test -x -o log_cli=true --disable-warnings -vvv
poetry run coverage report
poetry run coverage xml -o coverage-reports/coverage-report.xml
