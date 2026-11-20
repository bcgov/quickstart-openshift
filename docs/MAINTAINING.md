# Maintaining `bcgov/quickstart-openshift`

This guide is for maintainers of the `bcgov/quickstart-openshift` template repository. For initial app setup and usage, see the root [README](../README.md).

## Governance and Permissions

- **Repository roles, not `CODEOWNERS`:** Co-maintainers use the GitHub **Maintain** (or **Admin**) role rather than `.github/codeowners`. See [ADR 0004](adr/0004-empty-codeowners.md).
- **Repository settings:** Manage branch rulesets, merge settings, and private vulnerability reporting through [`scripts/setup-github.sh`](../scripts/setup-github.sh). Run it without `--apply` first to preview changes.
- **Required PR checks:** The `main` branch ruleset requires `PR Results`, `Analysis Results`, and `Validate Results` (the summary jobs in `.github/workflows/pr-open.yml`, `analysis.yml`, and `pr-validate.yml`), plus `CodeQL` high-or-higher alerts and resolved review threads.

## How Changes Reach Consumers

See [ADR 0003](adr/0003-downstream-template-updates.md) for the full rationale. In short:

1. **New repositories** copy `main` once via GitHub's **Use this template** button.
2. **Existing downstream repositories** do **not** receive automated file-copy PRs from this repo. Instead, they pick up updates in two ways:
   - **Shared actions and presets (automatic via Renovate):** Reusable CI/CD logic lives in [`bcgov/actions`](https://github.com/bcgov/actions), [`bcgov/actions-openshift`](https://github.com/bcgov/actions-openshift), `bcgov/action-*`, and [`bcgov/renovate-config`](https://github.com/bcgov/renovate-config). When those repositories publish a release, Mend Renovate opens SHA-pinned update PRs in downstream repos using [`renovate.json`](../renovate.json).
   - **Structural template changes (manual):** Changes inside `.github/workflows/`, `common/`, `scripts/`, `backend/`, `frontend/`, or `migrations/` must be cherry-picked or copied by downstream teams. Document any manual upgrade steps in GitHub release notes.

### Canary Validation

- `bcgov/quickstart-openshift` serves as the golden-path reference ([ADR 0001](adr/0001-golden-path-example.md)) and validates new shared-action and Renovate-preset releases before wider adoption.
- Always pin shared actions to a released commit SHA with a `# vX.Y.Z` comment—never `@main` (see [`AGENTS.md`](../AGENTS.md)).
- When testing a shared-action change, release it in the action repo (or test in a PR first) and verify the target deploy/test jobs actually ran—not just a green `PR Results` summary. Because `pr-open.yml` skips `deploys` and `tests` unless changes match `('backend/', 'frontend/', 'migrations/', 'common/', '.github/workflows/pr-open.yml')`, a Renovate bump confined to a reusable workflow (such as `.github/workflows/reusable-deploy.yml`) will skip PR deployment unless a triggered path is also exercised during validation before merging to verify `merge.yml` (`deploy-test`, `tests`, `deploy-prod`, `promote`).

## How to Release

Publishing a GitHub Release runs [`.github/workflows/release.yml`](../.github/workflows/release.yml), which deploys to **PROD**, syncs Sysdig alerts, and promotes GHCR images (`migrations`, `backend`, `frontend`) to `:prod`.

Because `release.yml` reuses PR-tagged images rather than rebuilding them:

1. **Pick a merged PR commit on `main` with public PR-tagged images:** `release.yml`'s `init` job uses `bcgov/action-get-pr` to resolve the merged PR for the tagged commit and verifies that `ghcr.io/bcgov/quickstart-openshift/{migrations,backend,frontend}:<PR>` all exist and are public (`pr-open.yml` builds changed packages and retags `tag_fallback: latest` to `:<PR>` for unchanged ones).
   - **Do not** tag a direct commit on `main` that did not come from a PR, or a PR whose `:<PR>` images are missing or private—`Check images` will fail.
2. **Verify `main` is healthy:** Confirm the target commit's `Merge` workflow run (`.github/workflows/merge.yml`) succeeded across `deploy-test`, `tests`, `deploy-prod`, and `promote`.
3. **Choose a Semantic Version (`vX.Y.Z`):**
   - **Major (`vX.0.0`):** Breaking workflow, OpenShift template, secret/variable contract, or stack upgrades requiring manual action in downstream repos.
   - **Minor (`vX.Y.0`):** Backwards-compatible capabilities or template improvements.
   - **Patch (`vX.Y.Z`):** Bug fixes, security updates, and non-breaking dependency updates.
4. **Publish the release:** Draft the release from the verified `main` commit, summarize user-facing changes and any downstream migration steps, and publish.
5. **Confirm `Release` workflow green:** Watch `.github/workflows/release.yml` finish `init`, `deploy-prod`, `monitor-prod`, and `promote`.

## Common Pitfalls

- **Releasing on a commit without public PR-tagged images:** `release.yml` fails in `init` (`Check images`) if the tagged commit did not come from a merged PR (`bcgov/action-get-pr`), if any `migrations`/`backend`/`frontend` `:<PR>` tag is missing, or if the GHCR packages are private.
- **`docs/` changes still run `merge.yml`:** `merge.yml`'s `paths-ignore` skips top-level `*.md` and `.github/**` (except `.github/workflows/**`), **not** `docs/**`. Merging changes under `docs/` triggers a `Merge` run (`deploy-test`, `tests`, `deploy-prod`, `promote`).
- **Editing `.github/codeowners`:** Uncommenting owner entries affects every future repo created from this template and routes notifications (such as `cert-keeper.yml`'s `notify_codeowners: "always"`) to template maintainers. Keep it commented out ([ADR 0004](adr/0004-empty-codeowners.md)).
- **Pinning `@main` on actions:** Breaks reproducibility and prevents Renovate from managing versioned SHA updates. Always use `@<commit-sha> # vX.Y.Z`.
- **Changing `overwrite: false` on init or database templates:** In `.github/workflows/reusable-deploy.yml`, `common/openshift.init.yml` uses `overwrite: false` so `DB_PASSWORD` is never restamped over an initialized PostgreSQL database (which would desync Flyway). Never flip database or secret mutability without an explicit migration plan.
- **Embedding `cert-keeper` into deploy pipelines:** Vanity Route TLS (`bcgov/actions-openshift/cert-keeper`) belongs strictly in `.github/workflows/cert-keeper.yml` (schedule and `workflow_dispatch`, `prod` environment, gated by `vars.ROUTE_HOST`), never inside `pr-open.yml`, `merge.yml`, or `release.yml`.
- **Forgetting `merge.yml` deploys to PROD by default:** Unlike repositories configured for release-only PROD deployments, `quickstart-openshift`'s `merge.yml` runs `deploy-prod` on every merge to `main` (see comments at `merge.yml` lines 51–52).
- **Expecting Trivy to block PRs:** In `.github/workflows/analysis.yml`, Trivy runs with `exit-code: "0"` and uploads SARIF to the Security tab so upstream advisories don't stall unrelated PRs ([ADR 0002](adr/0002-secret-prevention.md)). Committed secrets are blocked at push time by GitHub secret scanning push protection.
