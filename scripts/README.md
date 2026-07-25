# Developer Helper Scripts

This directory contains opt-in utility scripts for local development, security configuration, environment cleanup, and verification in `quickstart-openshift`.

---

## Script Inventory

| Script | Category | Purpose |
| :--- | :--- | :--- |
| **[`setup.sh`](./setup.sh)** | Environment | Master opt-in setup script. Runs `global-gitleaks.sh` and `global-instructions.sh`. |
| **[`global-gitleaks.sh`](./global-gitleaks.sh)** | Security | Downloads `gitleaks` (if missing) and configures global pre-commit secret scanning. |
| **[`global-instructions.sh`](./global-instructions.sh)** | AI Guidelines | Copies `.github/copilot-instructions.md` to `~/.copilot/instructions/instructions.md`. |
| **[`clean-containers.sh`](./clean-containers.sh)** | Containers | Resets local container environment and volumes (supports both **Docker** and **Podman**). |
| **[`verify-all.sh`](./verify-all.sh)** | CI & Quality | Runs local pre-push verification (frontend/backend lints, unit tests, container linting). |

---

## Usage Examples

### 1. Opt-in Developer Setup (Run Once)
```bash
./scripts/setup.sh
```

### 2. Clean Container Caches & Volumes (Docker or Podman)
```bash
./scripts/clean-containers.sh
```

### 3. Run Local Pre-Push Verification
```bash
./scripts/verify-all.sh
```
