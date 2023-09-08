FROM python:slim-bullseye
ENV PORT=3000

# Output to stdout/stderr, don't create .pyc files, etc.
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    VENV_PATH="/application/.venv"

# Pip cache dir off to save space, disable upgrade messages, 
ENV PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on

# https://python-poetry.org/docs/configuration/#using-environment-variables
ENV POETRY_VERSION=1.2.2 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTION=1

# Path
ENV PATH="${POETRY_HOME}/bin:${VENV_PATH}/bin:$PATH"

# Packages
RUN apt update && \
    apt install -y --no-install-recommends curl build-essential libpq-dev python-dev && \
    curl -sSL https://install.python-poetry.org | python3 -

# Dependencies and app
WORKDIR /application
COPY . .
RUN poetry install --no-root -vvv --without dev --sync

# Non-privileged user, port and health check
USER 1001
EXPOSE ${PORT}
HEALTHCHECK --interval=300s --timeout=10s CMD curl -f http://localhost:${PORT}

# Start
CMD uvicorn src.main:app --host 0.0.0.0 --port ${PORT} --workers 1 --server-header --date-header --limit-concurrency 1000 --log-config ./logger.conf
