# ADR 0003: How Template Changes Reach Downstream Repositories

- **Status:** Accepted
- **Date:** 2026-11-19
- **Deciders:** QuickStart OpenShift maintainers
- **Product team:** Platform / QuickStart
- **Related:** [renovate.json](../../renovate.json), [README.md](../../README.md), [#2955](https://github.com/bcgov/quickstart-openshift/issues/2955)

## Context

GitHub template repositories perform a one-time file copy when a team creates a new repository. Once a downstream repository starts adding domain code, migrations, and custom workflows, pushing raw file diffs from the template repository directly into downstream branches causes frequent merge conflicts and risks overwriting team customizations.

## Decision

Ongoing platform updates reach downstream repositories primarily through shared, versioned components (`bcgov/actions`, `bcgov/actions-openshift`, `bcgov/action-*`, and `bcgov/renovate-config`) delivered automatically by Mend Renovate pull requests (`renovate.json`), rather than an automated template-sync bot. Structural changes inside this template repository (workflow wiring, `scripts/`, OpenShift templates, or application scaffolding) are adopted manually by downstream teams via release notes and cherry-picking.

## Options considered

### Option 1: Versioned shared actions/presets via Renovate + manual structural adoption

- Pros: CI bugfixes, security patches, and new platform features roll out automatically to downstream repos as clean, SHA-pinned Renovate PRs without touching application code; avoids merge-conflict churn in customized repos.
- Cons: Changes to workflow YAML structure, OpenShift manifests, or `scripts/` in `quickstart-openshift` do not propagate automatically to already-created repositories.

### Option 2: Automated template-sync bot opening file-copy PRs downstream

- Pros: Keeps workflow files and repo scaffolding closer to template `main`.
- Cons: Generates noisy conflict PRs whenever downstream teams customize `backend/`, `frontend/`, `migrations/`, or workflows, eroding trust in automated maintenance PRs.

## Consequences

- **Positive:** Reusable behavior belongs in `bcgov/actions*` and `bcgov/renovate-config` so downstream teams receive updates hands-free (including Renovate automerge where configured).
- **Negative:** Template maintainers must keep breaking changes in workflow wiring rare, document migration steps in release notes, and push reusable logic into shared actions rather than duplicating it in template workflows.
