# ADR 0004: Keep CODEOWNERS Empty in the Template Repository

- **Status:** Accepted
- **Date:** 2026-11-19
- **Deciders:** QuickStart OpenShift maintainers
- **Product team:** Platform / QuickStart
- **Related:** [.github/codeowners](../../.github/codeowners), [scripts/setup-github.sh](../../scripts/setup-github.sh), [#2955](https://github.com/bcgov/quickstart-openshift/issues/2955)

## Context

Maintainers need review permissions and visibility on pull requests and workflow failures. In standard application repositories, teams often add usernames or team handles to `.github/codeowners` (or `CODEOWNERS`). However, `bcgov/quickstart-openshift` is a GitHub template repository (`is_template: true`) used to bootstrap many independent downstream repositories.

## Decision

`.github/codeowners` remains empty (all owner rules commented out) in `bcgov/quickstart-openshift`. Co-maintainers are granted access through GitHub repository roles (such as the Maintain role) rather than `CODEOWNERS` entries, and `scripts/setup-github.sh` keeps `require_code_owner_review: false` in the `main` branch ruleset.

## Options considered

### Option 1: Keep `.github/codeowners` commented out and use GitHub repository roles

- Pros: Repositories created from this template do not inherit platform maintainers as code owners; avoids flooding template maintainers with unrelated PR review requests and workflow failure notifications (for example, `.github/workflows/cert-keeper.yml` sets `notify_codeowners: "always"`).
- Cons: Template maintainers do not get automatic CODEOWNERS review assignment on PRs in `bcgov/quickstart-openshift` and rely on repository watch/notification settings and explicit review requests.

### Option 2: Populate `.github/codeowners` with template maintainers

- Pros: Automatically assigns template maintainers as reviewers on PRs in this repo.
- Cons: Every new downstream repository copies `.github/codeowners` verbatim, flooding template maintainers with review requests, notifications, and failure alerts from unrelated teams until those teams remember to edit the file.

## Consequences

- **Positive:** Downstream repositories stay clean of external reviewer handles, and teams can uncomment `.github/codeowners` in their own repositories whenever they want local ownership rules.
- **Negative:** Onboarding a new maintainer to `bcgov/quickstart-openshift` requires granting the GitHub Maintain (or Admin) role in repository settings rather than editing a file.
