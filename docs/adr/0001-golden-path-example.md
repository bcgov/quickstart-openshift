# ADR 0001: QuickStart Is the Shared Golden-Path Example

- **Status:** Accepted
- **Date:** 2026-11-19
- **Deciders:** QuickStart OpenShift maintainers
- **Product team:** Platform / QuickStart
- **Related:** [#2955](https://github.com/bcgov/quickstart-openshift/issues/2955)

## Context

Shared GitHub Actions (`bcgov/actions`, `bcgov/actions-openshift`, `bcgov/action-*`), Renovate presets (`bcgov/renovate-config`), and platform documentation serve many application teams across the `bcgov` organization. When each action README or guide invents standalone workflow snippets or placeholder service names, examples drift from real repository constraints such as job ordering, required summary gates, and package boundaries.

## Decision

`bcgov/quickstart-openshift` is the shared golden-path example for OpenShift web applications. Action READMEs, platform documentation, and pattern guidance use this repository's workflow layout (`pr-open.yml`, `pr-close.yml`, `merge.yml`, `release.yml`, `scheduled.yml`, `analysis.yml`), package layout (`backend`, `frontend`, `migrations`), and OpenShift templates (`common/`, `backend/`, `frontend/`) as the canonical reference.

## Options considered

### Option 1: Use `bcgov/quickstart-openshift` as the canonical example

- Pros: Keeps examples grounded in working, CI-verified workflows; exposes real constraints like job dependencies, `paths-ignore` / `triggers`, and cleanup ordering; matches what teams actually get when creating a repo from the template.
- Cons: Structural changes to QuickStart workflows or packages must be reflected across shared action documentation.

### Option 2: Use generic standalone examples per action

- Pros: Each action doc stays decoupled from any single repository layout.
- Cons: Hides integration details (for example, PR image tags, summary gate jobs, and OpenShift `overwrite: false` guards) that cause failures when teams wire actions together.

## Consequences

- **Positive:** Teams and maintainers share one consistent reference architecture from initial template creation through maintenance mode.
- **Negative:** Breaking changes to QuickStart's directory or workflow structure require updating shared docs and examples to match.
