# How QuickStart DevOps supports a STRA and SoAR

This guide is for directors, product owners, and Ministry Information Security Officers (MISOs). It explains how the practices already built into `bcgov/quickstart-openshift` help a team complete a Security Threat and Risk Assessment (STRA) and a signed Statement of Acceptable Risks (SoAR), and where the application team still has work to do.

It maps two artefacts that are commonly used together:

- The **Key STRA Control Areas Checklist** used by the Provincial IDIM Program for BC Services Card onboarding. It is a subset of controls drawn from the [Information Security Policy](https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/services-policies-for-government/information-management-technology/information-security/isp_v50_aug2025.pdf) (ISP v5.0, August 2025), which is modelled on ISO 27002. Completing the checklist is **not** a substitute for a full STRA.
- The **SoAR**, which is the signed record that closes a STRA under the [IM/IT 6.11 Security Threat Risk Assessment Standard](https://www2.gov.bc.ca/assets/gov/government/services-for-government-and-broader-public-sector/information-technology-services/standards-files/imit_611_security_threat_risk_assessment_standard.pdf) (v3.1). The standard requires a STRA for new systems and for significant changes, and says that a signed SoAR must be submitted to the OCIO Information Security Branch.

This document does not complete a STRA or a SoAR. Ratings, residual risk, and sign-off stay with the business owner, the MISO, and the accountable Ministry Chief Information Officer (MCIO) or delegate.

Related application and database expectations are in the [IM/IT 6.14 Application and Web Security Standard](https://www2.gov.bc.ca/assets/gov/government/services-for-government-and-broader-public-sector/information-technology-services/standards-files/imit_614_application_and_web_security_standard.pdf) (v2.0; a STRA is required at every stage of the software development life cycle) and the [IM/IT 6.16 Database Security Standard](https://www2.gov.bc.ca/assets/gov/government/services-for-government-and-broader-public-sector/information-technology-services/standards-files/imit_616_database_security_standard.pdf). Process for ministries is also described on the intranet Hub pages **Security Threat and Risk Assessment** and **Web App Scanning**. Identity patterns for BC Services Card, IDIR, and BCeID are illustrated in the [Forests Access Management (FAM) wiki](https://github.com/bcgov/nr-forests-access-management/wiki/API-Security).

A companion OWASP ASVS mapping for the same template lives in [SECURITY.md](../SECURITY.md#owasp-asvs-alignment).

## The story in brief

QuickStart gives a team a running DevSecOps path so a STRA is not starting from a blank sheet:

- Pull requests are built, analysed, and (when application paths change) deployed as a separate set of resources, named by PR number, in the shared DEV namespace (`<plate>-dev`). Those resources are removed when the PR is closed or ages out.
- TEST and PROD are separate namespaces (`<plate>-test`, `<plate>-prod`) deployed through the `test` and `prod` GitHub Environments, with distinct database passwords. PR deploys use repository-level credentials, not a GitHub Environment.
- Linting, unit tests, Semgrep, Trivy, and Aikido Safe-Chain run in GitHub Actions. On pull requests, lint, tests, Semgrep, and Safe-Chain are path-gated (they run only when `backend/` or `frontend/` or the Analysis workflow itself changes). Semgrep is warn-only (`semgrep_fail` defaults to false). Safe-Chain comes from `bcgov/actions/test-and-analyse` (`supply_scan` defaults to `true`; this repository does not override it). SonarCloud analysis runs once its projects and tokens are set up, and Renovate dependency updates run once the Renovate GitHub App is installed. Weekly scheduled jobs run OWASP ZAP and Nuclei against TEST (SARIF is uploaded to the GitHub Security tab), plus SchemaSpy and load tests.
- The frontend Caddy reverse proxy runs an inline Coraza WAF with a small set of custom rules in `frontend/coraza.conf` (not the OWASP Core Rule Set), and enforces CSP, HSTS, and related headers. Rules 1003 (scanner user-agents) and 1004 (sensitive paths such as `/.env`) use `deny` and return 403. Rules 1001, 1002, 1005, 1007, and 1008 (SQL injection, XSS, path traversal, and null-byte checks) use `block` with no `SecDefaultAction`; Coraza's hardcoded phase-2 default is `pass`, so those rules detect and log only. A post-merge review reported that XSS, SQL injection, and path-traversal probes against live TEST returned HTTP 200, while `/.env` returned 403.
- OpenShift templates harden containers (non-root, no privilege escalation, dropped capabilities, default seccomp; read-only root filesystem on the app containers) and isolate frontend, backend, and database traffic with NetworkPolicies.
- PROD database backup and restore CronJobs are included. They only produce off-cluster backups once S3 bucket and credentials are configured; otherwise the backup job exits without a dump. Vanity TLS is handled by a dedicated `cert-keeper` workflow. Sysdig alert sync can run on the PROD deploy path.

What QuickStart does **not** do is replace the ministry STRA process, sign a SoAR, classify information, complete a Privacy Impact Assessment (PIA), or ship application-level sign-in. Those remain team and MISO responsibilities, with engagement through the Hub **Security Threat and Risk Assessment** page and the Connected Services British Columbia (CSBC)-approved STRA tool.

## How to score the IDIM checklist

The Key STRA Control Areas Checklist uses a single status per control:

| Status | Meaning |
| --- | --- |
| 1 | Controls have been tested and comply with the stated standard |
| 2 | Controls comply with the stated standard |
| 3 | Controls partially comply — more work is needed |
| 4 | Controls do not comply |
| N | The stated standard does not apply |
| X | Current status is not known |

QuickStart can support a **1** or **2** on controls that are implemented and, where listed below, continuously tested in CI. It cannot honestly justify a **1** or **2** on controls the team has not yet implemented (for example application access control or a PIA). Use **N** only where the team and the MISO agree the control does not apply. This guide does not assign scores for any specific system.

---

## SoAR sections

A SoAR has three sections. QuickStart supplies evidence and platform defaults for parts of each; the team still writes and signs the artefact.

### Section A — Tracking

The form records the assessment reference, lite versus comprehensive STRA, system name, owner, primary risk evaluator (usually the MISO), ministry, whether the system is critical or handles confidential information, and a short description.

**QuickStart provides:** a documented system shape to describe (NestJS/Prisma backend, React/Vite frontend served by Caddy, PostgreSQL, Flyway migrations, OpenShift templates in `common/`, `backend/`, and `frontend/`); named environments (per-PR resource sets in the shared DEV namespace, TEST, and PROD); and architecture notes in the root [README](../README.md).

**The team still owns:** the official system name and assessment number, business owner and MISO, criticality, information classification, lite versus comprehensive choice, and the executive summary. Those fields are not generated by the template.

### Section B — Risk table

Each row is a risk name, type, rating, treatment (accept, remediate, mitigate, transfer, or avoid), and a short description. If no risks are listed, the form requires a justification in Section A.

**QuickStart provides:** controls that commonly reduce residual risk for web applications. Shipped and running: PR analysis (lint, tests, Semgrep, and Aikido Safe-Chain are path-gated on pull requests; Semgrep is warn-only; Trivy still runs on every non-draft PR), weekly DAST on TEST (ZAP and Nuclei SARIF lands in the GitHub Security tab), a Coraza WAF that denies scanner and sensitive-path requests and otherwise detects and logs, HTTP security headers, ingress-only NetworkPolicies, and container hardening. Ready once onboarded or configured: SonarCloud (projects and tokens), Renovate (GitHub App), and off-cluster database backups (S3 bucket and credentials). As a high-level pattern, a “secure DevOps pipeline” risk is often treated by putting static and dynamic scanning into CI/CD — this template already does that. [IM/IT 6.14](https://www2.gov.bc.ca/assets/gov/government/services-for-government-and-broader-public-sector/information-technology-services/standards-files/imit_614_application_and_web_security_standard.pdf) also expects a STRA at each SDLC stage; the PR and merge pipelines are the hooks for that work, not the assessment itself.

**The team still owns:** identifying risks that apply to *this* system, ratings, treatment plans, and residual risk. Trivy findings are written to the GitHub Security tab and are **not** a merge gate, so someone on the team must triage them against the windows in [SECURITY.md](../SECURITY.md#vulnerability-triage-slas). Application-specific risks (access control, personal information, integrations) will not be covered by the template alone.

### Section C — Acceptance

The SoAR is complete only after the owner and the MISO recommend it and the accountable individual (typically the MCIO or delegate) accepts or declines the documented risks. Completed SoARs are submitted to the OCIO Information Security Branch, which is what closes the STRA under IM/IT 6.11.

**QuickStart provides:** nothing that automates sign-off. The Hub **Security Threat and Risk Assessment** page is the ministry entry point (engage the MISO; use the Connected Services British Columbia (CSBC)-approved tool; “Submit a digital STRA”).

**The team still owns:** routing, signatures, and submission. If the system onboards to BC Services Card, the IDIM checklist is signed and sent separately to the IDIM Security Lead, in addition to the SoAR.

---

## Key STRA Control Areas

For each control: what this template already ships, and what remains with the team. File references are to this repository.

### CO.2.5 — Segregation of duties

**QuickStart provides:** a `main` branch ruleset (applied by `scripts/setup-github.sh`) that requires a pull request, one approval, resolved conversations, and squash merge; force-pushes and direct pushes to `main` are blocked. That is weaker than a full segregation-of-duties control: repository admins can bypass the ruleset by merging a pull request (`bypass_mode: pull_request`); stale approvals are not dismissed on new pushes (`dismiss_stale_reviews_on_push: false`); and the last person to push does not have to obtain a new approval (`require_last_push_approval: false`). The `prod` GitHub Environment has no required reviewers, so a merge to `main` auto-deploys to PROD. Template co-maintainers use GitHub repository roles rather than `CODEOWNERS` ([ADR 0004](adr/0004-empty-codeowners.md)); `.github/codeowners` is left commented so downstream repos can set their own owners.

**The team still owns:** granting least-privilege GitHub and OpenShift roles, deciding who can approve whose work, uncommenting `CODEOWNERS` for the product team, tightening review settings or adding required reviewers on `prod` if they need stronger separation, and any separation of duties beyond git (for example who can approve a SoAR versus who can change production).

### CO.3.11 — Information security awareness, education and training

**QuickStart provides:** no awareness program.

**The team still owns:** ministry and organization training, including onboarding for contractors. Document participation in the checklist response.

### CO.4.3 — Inventory of assets

**QuickStart provides:** a partial technical inventory — container images in GitHub Container Registry, OpenShift labels on deployments, Renovate tracking of dependencies (once the Renovate GitHub App is installed), and a weekly SchemaSpy schema publication.

**The team still owns:** the official information-asset register, lifecycle (including destruction), and classification of those assets.

### CO.4.13 — Classification of information

**QuickStart provides:** no default classification of business data. HTTP cache-control and security headers reduce accidental leakage of responses, but that is not classification.

**The team still owns:** classifying information (Public / Protected A–C under IM/IT 6.18), reflecting it in the SoAR, and applying handling rules. If the system will hold personal information, complete a PIA as well.

### CO.5.3 — Access control policy

**QuickStart provides:** platform-level isolation (NetworkPolicies, GitHub and OpenShift access) only. The sample application does not implement sign-in, roles, or row-level authorization.

**The team still owns:** the access control policy, identity providers, and application authorization. For BC government patterns (IDIR, BCeID, BC Services Card, JWT/role lookup), see the FAM wiki pages [API Security](https://github.com/bcgov/nr-forests-access-management/wiki/API-Security), [Authorization Mechanism](https://github.com/bcgov/nr-forests-access-management/wiki/Authorization-Mechanism), [BCSC Encryption](https://github.com/bcgov/nr-forests-access-management/wiki/BCSC-Encryption), and [OIDC Attribute Mapping](https://github.com/bcgov/nr-forests-access-management/wiki/OIDC-Attribute-Mapping).

### CO.5.35 — Access control to program source code

**QuickStart provides:** GitHub as the source of truth; write access is limited to people and teams granted repository roles; changes to `main` go through pull requests that require one approval. That review is subject to the same limits as CO.2.5: admins can bypass the ruleset by merging a pull request, stale approvals are not dismissed, and last-push approval is not required. Public or internal visibility is a repository setting.

**The team still owns:** keeping membership current, branch protection enabled (via the setup script or equivalent), and any extra restrictions on who can merge or who can see the repo.

### CO.6.3 — Policy on the use of cryptographic controls

**QuickStart provides:** TLS on OpenShift routes; optional vanity-host certificates via `.github/workflows/cert-keeper.yml`; HSTS and related headers in `frontend/Caddyfile`; credentials kept out of git (OpenShift `Secret` templates in `common/openshift.init.yml` and GitHub Actions secrets). GitHub secret scanning push protection also blocks committed secrets at push time when that setting is enabled (it is enabled in this repository). It is a repository or organization setting, not something the template scripts turn on — [ADR 0002](adr/0002-secret-prevention.md).

**The team still owns:** the ministry cryptographic policy, application-level encryption, key or wallet management, and any additional TLS (for example mutual TLS to a database or API). Distinct `DB_PASSWORD` values per environment are required by the README; the team must set and rotate them.

### CO.7.5 — Physical entry controls

**QuickStart provides:** none. The application is intended to run on the Province’s OpenShift platform in approved data centres.

**The team still owns:** agreeing applicability with the MISO. Physical entry controls may be inherited from the OpenShift hosting provider rather than marked not applicable, and may need platform evidence. Office and contractor-site physical controls still apply.

### CO.8.9 — Separation of development, testing and operational environments

**QuickStart provides:** separate OpenShift namespaces for DEV, TEST, and PROD. Pull requests deploy a separate resource set per PR inside the shared DEV namespace, using repository-level credentials. TEST and PROD deploys use the `test` and `prod` GitHub Environments and their environment-scoped secrets. The `prod` environment has no required reviewers; it allows deploys from `main`, so a merge to `main` auto-deploys to PROD. PR deploys run only when application or workflow paths change, and PR resources are removed on close (`.github/workflows/pr-close.yml`) and by a scheduled purge. Images are promoted along that path rather than rebuilt for PROD from an unreviewed commit, but a stale approval can still let a later commit reach `main` and deploy.

**The team still owns:** not reusing database passwords across environments, controlling who can approve the `prod` environment, and keeping TEST data out of production backups and vice versa.

### CO.8.13 — Controls against malware

**QuickStart provides:** defence in the pipeline and runtime, not endpoint antivirus — Trivy filesystem scans (vulnerabilities, secrets, misconfiguration; `ignore-unfixed: true` and `.github/.trivyignore`), Aikido Safe-Chain wrapping `npm` installs in the Analysis jobs via `bcgov/actions/test-and-analyse` (`supply_scan` defaults to `true`; path-gated on pull requests with those jobs), a read-only root filesystem on app containers, non-root execution, and the Coraza WAF on the frontend (scanner and sensitive-path rules deny; SQL injection, XSS, path-traversal, and null-byte rules detect and log only).

**The team still owns:** workstation and contractor-device malware controls, and response if a compromised dependency or image is identified.

### CO.8.21 — Event logging

**QuickStart provides:** Caddy request logs to stdout (`frontend/Caddyfile`) and a NestJS/Winston HTTP request logger (`backend/src/middleware/req.res.logger.ts`, `backend/src/common/logger.config.ts`). Container logs are available in OpenShift. Backend metrics are not exposed through the public `/api/metrics` path (Caddy returns 404).

**The team still owns:** log retention, a review cadence, shipping logs to a ministry SIEM, and audit trails for business-sensitive actions once application authentication exists.

### CO.8.35 — Management of technical vulnerabilities

**QuickStart provides:** Mend Renovate configuration (`renovate.json` extends `bcgov/renovate-config`) for dependency updates once the Renovate GitHub App is installed; Trivy on every non-draft PR and weekly via Analysis (`scan-type: fs`, `ignore-unfixed: true`, `.github/.trivyignore`), uploading SARIF to the GitHub Security tab (`exit-code: 0`, not a merge gate); Semgrep in `.github/workflows/analysis.yml` (via `bcgov/actions/test-and-analyse`; path-gated on pull requests and warn-only), plus SonarCloud in the same jobs once its projects and tokens are set up; Knip unused-dependency scans in that same action (warning mode by default); Aikido Safe-Chain supply-chain scanning in the same action (`supply_scan` defaults to `true`, not set in this repository, and path-gated on pull requests); weekly OWASP ZAP and Nuclei DAST against TEST (`.github/workflows/scheduled.yml`, `bcgov/actions/scan-url` v0.13.0), with ZAP and Nuclei SARIF uploaded to the GitHub Security tab (`allow_issue_writing: false`); private vulnerability reporting and triage SLAs in [SECURITY.md](../SECURITY.md); a `security-triage` issue template. CodeQL runs through GitHub's default code scanning setup (there is no CodeQL workflow in this repository); the `main` ruleset in `scripts/setup-github.sh` requires CodeQL results with no alerts at high or higher. The Hub **Web App Scanning** page describes an OCIO web-application vulnerability assessment that can complement the weekly ZAP and Nuclei jobs.

**The team still owns:** triaging Security tab and Sonar findings, keeping secret scanning push protection enabled (it is a repository or organization setting; it is enabled in this repository), commissioning OCIO scans when the STRA or a change requires them, and meeting the remediation windows in SECURITY.md.

### CO.9.7 — Segregation in networks

**QuickStart provides:** NetworkPolicies in `common/openshift.init.yml` so that only the platform ingress can reach the frontend, only the frontend can reach the backend, and only the backend can reach the database. Those policies are ingress-only (`policyTypes: [Ingress]`); egress is unrestricted. In PROD, `common/openshift.backup.yml` adds one more database ingress rule on port 5432 for the backup and restore CronJob pods.

**The team still owns:** reviewing any extra ingress or egress they add (for example a new integration) and not weakening those policies.

### CO.10.11 — Secure development policy

**QuickStart provides:** a defined pipeline and contributor path ([CONTRIBUTING.md](../CONTRIBUTING.md), [AGENTS.md](../AGENTS.md), GitHub Actions under `.github/workflows/`), linting and tests as merge-relevant analysis, and alignment with IM/IT 6.14 practices (secure headers, WAF, STRA hooks across the SDLC).

**The team still owns:** adopting and enforcing a team secure-development policy, including how contractors work, and performing the STRA/SoAR at the stages 6.14 requires.

### CO.10.15 — Technical review of applications after operating platform changes

**QuickStart provides:** analysis and (when application paths change) build, deploy, integration, and Playwright end-to-end tests on pull requests; merge-time TEST then PROD deploys with tests; weekly DAST and load tests against TEST.

**The team still owns:** a deliberate re-test and, if the change is significant, an updated STRA/SoAR when the platform itself changes (for example an OpenShift major upgrade, a new identity provider, or a new data store).

### CO.10.19 — Secure system engineering principles

**QuickStart provides:** documented architecture in the README; container hardening in `backend/openshift.deploy.yml` and `frontend/openshift.deploy.yml` (`runAsNonRoot`, `allowPrivilegeEscalation: false`, drop all capabilities, default `seccompProfile`, `readOnlyRootFilesystem` on app containers); Coraza WAF built in `frontend/Dockerfile` (scanner and sensitive-path rules deny; SQL injection, XSS, path-traversal, and null-byte rules detect and log only); ingress-only NetworkPolicies; secret separation.

**The team still owns:** applying the same principles to any new components they add, and not disabling the security context (see [README — Container Hardening](../README.md#container-hardening--writable-paths)).

### CO.10.21 — Secure development environment

**QuickStart provides:** local `docker compose` for the stack; per-PR resource sets in the shared DEV namespace on OpenShift; GitHub Actions runners for CI rather than building production from a workstation.

**The team still owns:** securing developer workstations, and any additional private package registries or secrets management the product needs.

### CO.10.23 — Outsourced development

**QuickStart provides:** no contractor-management process. The same PR, analysis, and environment controls apply to every contributor with write access.

**The team still owns:** contract management, supervision of outsourced work, and ensuring external developers are covered by awareness and access policies.

### CO.10.25 — System security testing

**QuickStart provides:** backend and frontend lint, format check, and unit tests with coverage (on pull requests these, and Semgrep, are path-gated); Semgrep on analysis is warn-only; SonarCloud once onboarded; Playwright end-to-end tests and integration tests after a PR or TEST deploy (`.github/workflows/reusable-tests.yml`); weekly ZAP and Nuclei against TEST, with SARIF uploaded to the GitHub Security tab; weekly k6 load tests.

**The team still owns:** tests for authorization and sensitive business rules once those exist, and any OCIO or third-party assessment required by the STRA.

### CO.12.11 — Response to information security incidents

**QuickStart provides:** private vulnerability reporting instructions and triage SLAs in [SECURITY.md](../SECURITY.md); `.github/ISSUE_TEMPLATE/security-triage.md`; Sysdig alert synchronization on the PROD path in `.github/workflows/merge.yml` and `.github/workflows/release.yml` (no-ops if the token is unset).

**The team still owns:** following the government-wide incident response procedure, on-call, and post-incident actions. The template does not replace that procedure.

### CO.13.5 — Implementing information security continuity

**QuickStart provides:** PROD database backup and restore CronJobs (`common/openshift.backup.yml`). Off-cluster backups need an S3 bucket and credentials; if `S3_BUCKET` is unset, the backup job still runs on the default `BACKUP_SCHEDULE` (`30 8 * * *`, 08:30 UTC daily) and exits successfully without producing a dump. QuickStart also provides rolling updates, health probes, and scheduled cleanup of stale PR resources.

**The team still owns:** business continuity and disaster-recovery plans, restore testing, confirming or changing `BACKUP_SCHEDULE` and setting S3 credentials, and RPO/RTO appropriate to the system’s criticality. The PostgreSQL container intentionally omits `readOnlyRootFilesystem` so the database can start; other hardening still applies (`common/openshift.database.yml`).

### CO.14.9 — Privacy and protection of personally identifiable information

**QuickStart provides:** no PIA and no privacy controls. The sample `users` API stores and returns names and email addresses (`backend/src/users/`) as demo data, with no sign-in or access control in front of it.

**The team still owns:** replacing or securing the demo `users` endpoints before real data is entered, determining whether PII is collected, completing a PIA, data minimization, and retention. If BC Services Card onboarding is in scope, IDIM will expect the PIA and STRA/SoAR alongside the checklist.

### CO.14.15 — Independent review of information security

**QuickStart provides:** required peer review on `main` (one approval; stale approvals are not dismissed; last-push approval is not required; admins can bypass the ruleset by merging a pull request), Semgrep, SonarCloud (once onboarded), Trivy SARIF on the Security tab, weekly ZAP and Nuclei DAST (SARIF also lands in the Security tab), and a ruleset requirement for CodeQL (GitHub default setup, no high-or-higher alerts).

**The team still owns:** engaging the MISO, commissioning independent review when the STRA requires it, and keeping review findings in the SoAR and risk register.

---

## Suggested evidence when you sit down with the MISO

Bring this guide, plus:

- The root [README](../README.md) and [SECURITY.md](../SECURITY.md) (ASVS table, triage SLAs, private reporting).
- Recent GitHub Actions runs: Analysis, PR, and Scheduled (ZAP/Nuclei), and Renovate pull requests if the app is installed.
- The GitHub Security tab (Trivy, CodeQL, and weekly ZAP and Nuclei SARIF) and, if onboarded, the SonarCloud projects.
- OpenShift NetworkPolicies and security contexts as deployed from the templates.
- If backups are configured, retained backup objects in S3 and a tested restore, not CronJob status alone.
- If identity is in scope, the FAM wiki pages linked above.

Use the Hub **Security Threat and Risk Assessment** page to start or update the ministry STRA, and the Hub **Web App Scanning** page (or the weekly ZAP and Nuclei job already in this repo) when a web-application scan is required.
