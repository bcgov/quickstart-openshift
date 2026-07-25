#!/bin/bash
# Reset local container environment for quickstart-openshift (supports Docker and Podman)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "$REPO_ROOT"

echo "==> Cleaning local container environment..."

# Detect container engine: podman-compose, podman, docker compose, or docker-compose
if command -v podman-compose >/dev/null 2>&1; then
  ENGINE="podman-compose"
  echo "Using podman-compose..."
  $ENGINE down -v || true
  podman system prune -f --volumes || true
elif command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  ENGINE="docker compose"
  echo "Using docker compose..."
  $ENGINE down -v --remove-orphans || true
  docker system prune -f --volumes || true
elif command -v docker-compose >/dev/null 2>&1; then
  ENGINE="docker-compose"
  echo "Using docker-compose..."
  $ENGINE down -v || true
  docker system prune -f || true
elif command -v podman >/dev/null 2>&1; then
  ENGINE="podman"
  echo "Using podman..."
  podman compose down -v || true
  podman system prune -f --volumes || true
else
  echo "ERROR: Neither Docker nor Podman container engine was found on PATH." >&2
  exit 1
fi

echo "SUCCESS: Container environment and volumes cleaned successfully."
