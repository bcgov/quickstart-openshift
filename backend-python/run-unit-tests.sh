#!/bin/bash

# Change to script dir
cd $(dirname ${BASH_SOURCE[0]})

# Setup poetry and install dependencies
curl -sSL https://install.python-poetry.org | python3 -
export PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"
poetry install --no-root -vvv

# Start app
echo "Starting unit tests at $(date +'%Y-%m-%d %H:%M:%S.%3N')"
poetry run coverage run --source=app -m pytest ./test -x -o log_cli=true --disable-warnings -vvv
poetry run coverage report
poetry run coverage xml -o coverage-reports/coverage-report.xml
