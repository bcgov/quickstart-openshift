#!/bin/bash
# Setup Copilot Instructions globally across all AI coding sessions.
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
cp "$SOURCE_FILE" "$DEST_FILE"

echo "SUCCESS: Copilot instructions copied to ${DEST_FILE}."
echo "AI coding tools reading ~/.copilot/instructions/ will now use standard BC Gov development guidelines globally."
