# Security Policy

## Supported Versions

This template is experimental and has no formal product support. Vulnerability reports against the template are still triaged to the windows in [Vulnerability Triage SLAs](#vulnerability-triage-slas) below.

## Reporting a Vulnerability

**DO NOT open public GitHub issues for security vulnerabilities.**

If you believe you have found a security vulnerability in this project, please report it privately:

1. Navigate to the main page of this repository on GitHub.
2. Click the **"Security"** tab at the top of the repository (next to "Insights").
3. In the left sidebar under "Reporting", click **"Advisories"**.
4. Click the **"Report a vulnerability"** button to privately submit a report to the repository maintainers.

## OWASP ASVS Alignment

This template implements a subset of Level 1 and Level 2 controls from the **OWASP Application Security Verification Standard (ASVS) v4.0.3**, at the platform and pipeline layer. It does not claim full L1 or L2 coverage. The table below maps those platform controls to the ASVS sections they actually belong to. A plain-language guide for directors, product owners, and Ministry Information Security Officers (MISOs) is in [docs/stra-soar-devops.md](docs/stra-soar-devops.md).

| ASVS v4.0.3 Section | Category / Control | QuickStart Implementation | Verification / Automation |
| :--- | :--- | :--- | :--- |
| — | Active application defence (WAF) | Integrates the **Coraza Web Application Firewall (WAF)** inline in the frontend reverse proxy, with a small set of custom rules. This is not the OWASP Core Rule Set, and it is not ASVS V5.5 (deserialization). Rules 1001 (SQL injection), 1002 (XSS), 1003 (scanner user-agents), 1004 (sensitive paths such as `/.env`), 1007 (path traversal), and 1008 (null byte) use `deny` and return 403. Rule 1005 (SQL keyword regex) only logs (`pass,log`), because its pattern matched ordinary text; SQL injection is still blocked by rule 1001. JSON request bodies are not inspected yet; a follow-up PR is in progress. Teams can disable a rule (`SecRuleRemoveById`), make it log only (`SecRuleUpdateActionById <id> "pass"`) or skip it for one path (`ctl:ruleRemoveById`); examples are in `frontend/coraza.conf`. | Built in [frontend/Dockerfile](./frontend/Dockerfile); rules in [frontend/coraza.conf](./frontend/coraza.conf) are loaded from [frontend/Caddyfile](./frontend/Caddyfile). |
| **V14.1** / **V14.2** | Build-time security scans | Scans the repository filesystem for vulnerabilities, secrets, and misconfiguration during development, and requires CodeQL results on `main`. | [Trivy](https://github.com/aquasecurity/trivy) runs a filesystem scan (`scan-type: fs`, `scanners: vuln,secret,misconfig`, `ignore-unfixed: true`, ignores in [`.github/.trivyignore`](./.github/.trivyignore)) in the Analysis workflow on every non-draft PR, on pushes to `main`, and weekly, uploading SARIF to the GitHub Security tab. [CodeQL](https://codeql.github.com/) is not a workflow in this repository; it runs through GitHub's default code scanning setup. The `main` branch ruleset in [scripts/setup-github.sh](./scripts/setup-github.sh) requires CodeQL with no alerts at high or higher. |
| **V14.2** | Dependency security | Updates outdated packages and scans for unused dependencies and exports once those tools are onboarded. | [Mend Renovate](https://github.com/bcgov/renovate-config) opens update pull requests after the Renovate GitHub App is installed (`renovate.json`). [Knip](https://knip.dev/) runs in the Analysis workflow via `bcgov/actions/test-and-analyse` (warning mode by default). The same action runs [Aikido Safe-Chain](https://www.npmjs.com/package/@aikidosec/safe-chain) (`supply_scan` defaults to `true`; this repository does not override it) to wrap `npm` installs on the path-gated Node analysis jobs. |
| **V6.4** | Secret management | Separates database connection credentials, API keys, and environment-specific configs from code. | Configuration materialized via OpenShift Secrets templates in [common/openshift.init.yml](./common/openshift.init.yml). Committed secrets are blocked at push time by GitHub secret scanning push protection when that setting is enabled (it is enabled in this repository). It is a repository or organization setting, not something the template scripts turn on ([ADR 0002](./docs/adr/0002-secret-prevention.md)). |
| — | Dynamic security testing (DAST) | Automated runtime testing of the deployed TEST application. | Weekly **OWASP ZAP** and **Nuclei** scans in the Scheduled workflow (`.github/workflows/scheduled.yml`, `bcgov/actions/scan-url` v0.13.0) against the deployed `test` environment. The action uploads ZAP and Nuclei SARIF to the GitHub Security tab (`allow_issue_writing: false`, so it does not also open GitHub issues). |
| **V14.4** | HTTP security headers | Strips identifying `Server` headers and enforces secure HTTP response headers (CSP, HSTS, X-Frame-Options, same-origin, and MIME sniffing blocks). | Configured natively in the frontend [frontend/Caddyfile](./frontend/Caddyfile) and verified by weekly OWASP ZAP scans. |
| **V1.14** / **V14.1** | Container hardening | Restricts container execution permissions and prevents host system modifications. | Enforces `readOnlyRootFilesystem: true`, `runAsNonRoot: true`, `allowPrivilegeEscalation: false`, drop all `capabilities`, and default `seccompProfile` in [backend/openshift.deploy.yml](./backend/openshift.deploy.yml) and [frontend/openshift.deploy.yml](./frontend/openshift.deploy.yml). |
| **V1.14** | Network segmentation | Controls inbound pod communication between frontend, backend, and database tiers. The shipped NetworkPolicies are ingress-only; egress is unrestricted. | [NetworkPolicies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) in [common/openshift.init.yml](./common/openshift.init.yml) (`policyTypes: [Ingress]`). In PROD, [common/openshift.backup.yml](./common/openshift.backup.yml) also allows the backup and restore CronJob pods to reach the database on port 5432. |

## Vulnerability Triage SLAs

All security issues are triaged using CISA KEV status and CVSS scores:
- **Critical** (CVSS 9.0-10.0 or CISA KEV): Remediation within 24 hours.
- **High** (CVSS 7.0-8.9): Remediation within 1 week.
- **Medium** (CVSS 4.0-6.9): Remediation within 2 weeks.
- **Low** (CVSS 0.0-3.9): Remediation next scheduled release.

Trivy reports findings at every severity to the GitHub Security tab on each run, where they are triaged against the windows above. Findings are not a merge gate, because advisories are published independently of any contribution. Committed secrets are blocked at push time by GitHub secret scanning push protection when that setting is enabled (it is enabled in this repository).

