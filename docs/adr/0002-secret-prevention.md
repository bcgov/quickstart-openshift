# ADR 0002: Secret Prevention for Downstream Repositories

- **Status:** Accepted
- **Date:** 2026-11-19
- **Deciders:** QuickStart OpenShift maintainers
- **Product team:** Platform / QuickStart
- **Related:** [SECURITY.md](../../SECURITY.md), [.github/workflows/analysis.yml](../../.github/workflows/analysis.yml), [#2955](https://github.com/bcgov/quickstart-openshift/issues/2955)

## Context

Repositories created from this template deploy to OpenShift using database credentials, service account tokens, and optional S3 or SonarCloud tokens. Downstream teams need secret-prevention controls that stop accidental credential commits early without forcing every developer workstation to install local hook runners or stalling unrelated pull requests on upstream vulnerability advisories.

## Decision

Downstream repositories prevent secret leaks through three layered controls: (1) GitHub secret scanning with push protection to block committed secrets at `git push` time, (2) separation of runtime credentials into GitHub Actions secrets and OpenShift `Secret` templates (`common/openshift.init.yml`), and (3) Trivy repository scanning (`scanners: "vuln,secret,misconfig"`) in `.github/workflows/analysis.yml` with `exit-code: "0"` uploading SARIF findings to the GitHub Security tab for triage rather than blocking merges. Local pre-commit secret hooks are optional and are not shipped as a mandatory template dependency.

## Options considered

### Option 1: GitHub push protection + runtime secret separation + non-blocking Trivy SARIF

- Pros: Blocks known secret formats on push with zero local setup; keeps credentials out of git history and OpenShift manifests; surfaces findings in the GitHub Security tab without breaking unrelated PRs when new advisories publish.
- Cons: Relies on GitHub secret scanning and push protection being enabled at the repository or organization level; teams must actively triage Security tab alerts.

### Option 2: Mandatory local pre-commit secret hooks and blocking CI secret scans

- Pros: Catches some custom secret patterns before `git push` reaches GitHub.
- Cons: Requires every contributor to install and maintain hook tooling (`pre-commit`, `gitleaks`, etc.) locally; failing the Trivy workflow job on any finding blocks unrelated PRs whenever external vulnerability databases update.

## Consequences

- **Positive:** Downstream repositories get push-time secret blocking out of the box with no extra workstation tooling and clean Security tab visibility.
- **Negative:** Maintainers and downstream teams must ensure GitHub secret scanning push protection remains enabled and review Trivy alerts in the Security tab on a regular cadence.
