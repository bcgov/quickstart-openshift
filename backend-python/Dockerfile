FROM python:bullseye AS build

# Disable cache dir, disable upgrade message, create .venv in project dir
ARG PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    POETRY_VIRTUALENVS_IN_PROJECT=1

# Install poetry, then dependencies
WORKDIR /app
COPY pyproject.toml poetry.lock ./
RUN pip install poetry==1.2.2 && \
    poetry install --no-root -vvv --without dev --sync

# Deploy
FROM python:slim-bullseye AS deploy

# Output to stdout/stderr, don't create .pyc files, etc.
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/app/.venv/bin:$PATH" \
    PORT=3000

# Packages
RUN apt update && \
    apt install -y --no-install-recommends curl libpq-dev

# Dependencies, config and app
COPY --from=build /app/.venv /app/.venv
COPY logger.conf ./
COPY ./src ./src

# Start with non-privileged user
HEALTHCHECK --interval=300s --timeout=10s CMD curl -f http://localhost:${PORT}
USER 1001
CMD uvicorn src.main:app --host 0.0.0.0 --port ${PORT} --workers 1 --server-header --date-header --limit-concurrency 1000 --log-config ./logger.conf
