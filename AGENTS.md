# AGENTS.md

Repository facts for automated coding assistants. Teams may edit or remove this file.

## Layout
- `backend/` (NestJS, Prisma), `frontend/` (Vite, React, Caddy), `migrations/` (Flyway SQL in `migrations/sql/`)
- OpenShift templates (not Helm): `common/openshift.init.yml`, `common/openshift.database.yml`, `backend/openshift.deploy.yml`, `frontend/openshift.deploy.yml`
- Workflows: `.github/workflows/` (PR deploys via `reusable-deploy.yml`, tests via `reusable-tests.yml`); integration and load tests in `common/tests/`

## Build, test, run
- Full stack locally: `docker compose up` (optional profiles: `schemaspy`, `caddy`)
- Backend (`cd backend`): `npm ci`, `npm run build`, `npm run lint`, `npm test`, `npm run test:cov`
- Frontend (`cd frontend`): `npm ci`, `npm run build`, `npm run lint`, `npm run test:unit`; e2e: `npx playwright install --with-deps chromium`, then `npx playwright test --project="chromium"`
- Deploys to OpenShift run from GitHub Actions (PR open, merge), not from a workstation

## Shared actions
- Uses bcgov shared actions and workflows (`bcgov/action-*`, `bcgov/actions/*`, `bcgov/actions-openshift/*`, `bcgov/quickstart-openshift-helpers`). Use them as provided; don't copy or fork them.
- Never pin `@main`. Pin bcgov shared actions to a published release SHA with a `# vX.Y.Z` comment.
- Vanity Route TLS (`bcgov/actions-openshift/route-tls`) is strictly managed via the standalone on-demand workflow (`.github/workflows/route-tls.yml` with `workflow_dispatch`). Never embed `route-tls` into `merge.yml`, `release.yml`, or continuous deployment pipelines.

## Settings
- Automated agents must not change repository or organization settings. Settings changes are made by a person on the team (team-run setup scripts: see #2858).
