#!/bin/bash
# Setup Copilot Instructions globally across all AI coding sessions safely.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
SOURCE_FILE="${REPO_ROOT}/.github/copilot-instructions.md"

if [ ! -f "$SOURCE_FILE" ]; then
  echo "ERROR: Source file ${SOURCE_FILE} not found!" >&2
  exit 1
fi

DEST_DIR="${HOME}/.copilot/instructions"
DEST_FILE="${DEST_DIR}/instructions.md"

mkdir -p "$DEST_DIR"

if [ -f "$DEST_FILE" ]; then
  if cmp -s "$SOURCE_FILE" "$DEST_FILE"; then
    echo "INFO: Global instructions at ${DEST_FILE} are already identical and up to date."
    exit 0
  else
    BACKUP_FILE="${DEST_FILE}.bak.$(date +%Y%m%d%H%M%S)"
    cp "$DEST_FILE" "$BACKUP_FILE"
    echo "WARNING: Existing global instructions differed. Created backup at ${BACKUP_FILE} before updating."
  fi
fi

cp "$SOURCE_FILE" "$DEST_FILE"

echo "SUCCESS: Copilot instructions copied to ${DEST_FILE}."
echo "AI coding tools reading ~/.copilot/instructions/ will now use standard QuickStart AI development guidelines globally."
