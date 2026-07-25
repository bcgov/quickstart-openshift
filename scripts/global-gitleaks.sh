#!/bin/bash
# Setup Gitleaks globally for local secret prevention across all repositories.
set -euo pipefail

echo "==> Setting up Gitleaks global pre-commit hook..."

# 1. Ensure Gitleaks is installed
if ! command -v gitleaks >/dev/null 2>&1; then
  echo "Gitleaks is not installed on your system."
  echo "Installing Gitleaks binary to ~/.local/bin..."
  
  mkdir -p ~/.local/bin
  
  OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
  ARCH="$(uname -m)"
  
  case "$ARCH" in
    x86_64) ARCH="x64" ;;
    aarch64|arm64) ARCH="arm64" ;;
    *) echo "Unsupported architecture: $ARCH" >&2; exit 1 ;;
  esac

  GITLEAKS_VERSION="8.18.2"
  URL="https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_${OS}_${ARCH}.tar.gz"

  curl -fsSL "$URL" | tar -xz -C ~/.local/bin gitleaks
  chmod +x ~/.local/bin/gitleaks
  echo "Installed Gitleaks v${GITLEAKS_VERSION} to ~/.local/bin/gitleaks"
fi

# 2. Setup global git hooks directory
GLOBAL_HOOKS_DIR="${HOME}/.config/git/hooks"
mkdir -p "$GLOBAL_HOOKS_DIR"

# 3. Create global pre-commit hook
PRE_COMMIT_HOOK="${GLOBAL_HOOKS_DIR}/pre-commit"

cat << 'EOF' > "$PRE_COMMIT_HOOK"
#!/bin/bash
# Global Pre-commit hook - Blocks commits containing secrets using Gitleaks
set -euo pipefail

if command -v gitleaks >/dev/null 2>&1; then
  gitleaks protect --staged --redact --no-banner
fi
EOF

chmod +x "$PRE_COMMIT_HOOK"

# 4. Configure git to use global hooks directory
git config --global core.hooksPath "$GLOBAL_HOOKS_DIR"

echo "SUCCESS: Global Gitleaks pre-commit hook configured at ${PRE_COMMIT_HOOK}."
echo "All local git commits across all repositories will now be scanned for secrets."
