#!/bin/bash
# Setup Copilot Instructions globally across all AI coding sessions safely.
# Works across Linux, macOS, and Windows (Git Bash / WSL).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
SOURCE_FILE="${REPO_ROOT}/.github/copilot-instructions.md"

if [ ! -f "$SOURCE_FILE" ]; then
  echo "ERROR: Source file ./.github/copilot-instructions.md not found!" >&2
  exit 1
fi

# Detect user home directory across Linux, macOS, and Windows (Git Bash / WSL)
USER_HOME="${HOME:-${USERPROFILE:-}}"
if [ -z "$USER_HOME" ]; then
  echo "ERROR: Unable to determine user home directory." >&2
  exit 1
fi

DEST_DIR="${USER_HOME}/.copilot/instructions"
DEST_FILE="${DEST_DIR}/instructions.md"
DISPLAY_DEST="~/.copilot/instructions/instructions.md"
DISPLAY_SOURCE="./.github/copilot-instructions.md"

mkdir -p "$DEST_DIR"

if [ -f "$DEST_FILE" ]; then
  if cmp -s "$SOURCE_FILE" "$DEST_FILE"; then
    echo "INFO: Global instructions in ${DISPLAY_DEST} are already up to date."
    exit 0
  else
    echo "Global instructions are already present in ${DISPLAY_DEST}. Please remove the file or copy our contents from ${DISPLAY_SOURCE}."
    exit 1
  fi
fi

cp "$SOURCE_FILE" "$DEST_FILE"

echo "SUCCESS: Copilot instructions copied to ${DISPLAY_DEST}."
echo "AI coding tools reading ${DISPLAY_DEST} will now use standard QuickStart AI development guidelines globally."
