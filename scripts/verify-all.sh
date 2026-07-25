#!/bin/bash
# Local pre-push verification script for quickstart-openshift.
# Runs linting, type-checking, and test suites across frontend and backend.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "$REPO_ROOT"

echo "==> Running local project verification..."

ERRORS=0

# 1. Actionlint (GitHub Actions Workflows) if installed
if command -v actionlint >/dev/null 2>&1; then
  echo "--> Running actionlint on .github/workflows/..."
  actionlint || ERRORS=$((ERRORS + 1))
fi

# 2. Hadolint (Containerfiles) if installed
if command -v hadolint >/dev/null 2>&1; then
  echo "--> Running hadolint on Dockerfiles..."
  hadolint backend/Dockerfile || ERRORS=$((ERRORS + 1))
  hadolint frontend/Dockerfile || ERRORS=$((ERRORS + 1))
fi

# 3. Backend Verification
if [ -d "backend" ] && [ -f "backend/package.json" ]; then
  echo "--> Verifying Backend (lint & test)..."
  (cd backend && npm run lint && npm test) || ERRORS=$((ERRORS + 1))
fi

# 4. Frontend Verification
if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
  echo "--> Verifying Frontend (lint & test)..."
  (cd frontend && npm run lint && npm test) || ERRORS=$((ERRORS + 1))
fi

if [ "$ERRORS" -gt 0 ]; then
  echo "FAILED: Verification completed with ${ERRORS} error(s)." >&2
  exit 1
fi

echo "SUCCESS: All verification checks passed cleanly!"
