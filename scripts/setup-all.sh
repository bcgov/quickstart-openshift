#!/bin/bash
# Master developer setup script for quickstart-openshift
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Running quickstart-openshift global developer setup..."

"${SCRIPT_DIR}/setup-gitleaks.sh"
echo ""
"${SCRIPT_DIR}/setup-copilot-instructions.sh"

echo ""
echo "All global developer tools configured successfully!"
