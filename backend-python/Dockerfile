### Build
#
FROM python:bullseye AS build

# https://python-poetry.org/docs/configuration/#using-environment-variables
ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1

# # Pip cache dir off to save space, disable upgrade messages, 
ENV PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on

# Install poetry, then dependencies
WORKDIR /app
COPY pyproject.toml poetry.lock .
RUN pip install poetry==1.2.2 && \
    poetry install --no-root -vvv --without dev --sync

### Deploy
#
FROM python:slim-bullseye AS deploy
ENV PORT=3000

# Output to stdout/stderr, don't create .pyc files, etc.
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    VENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"

# Dependencies and app
COPY --from=build ${VENV} ${VENV}
COPY logger.conf .
COPY ./src ./src

RUN apt update && \
    apt install -y --no-install-recommends curl libpq-dev

# Non-privileged user, port and health check
USER 1001
EXPOSE ${PORT}
HEALTHCHECK --interval=300s --timeout=10s CMD curl -f http://localhost:${PORT}

# Start
CMD uvicorn src.main:app --host 0.0.0.0 --port ${PORT} --workers 1 --server-header --date-header --limit-concurrency 1000 --log-config ./logger.conf
