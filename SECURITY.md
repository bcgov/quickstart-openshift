# Security Policy

## Supported Versions

This product currently has no support and is experimental. That could change in the future.

## Reporting a Vulnerability

**DO NOT open public GitHub issues for security vulnerabilities.**

If you believe you have found a security vulnerability in this project, please report it privately:

1. Navigate to the main page of this repository on GitHub.
2. Click the **"Security"** tab at the top of the repository (next to "Insights").
3. In the left sidebar under "Reporting", click **"Advisories"**.
4. Click the **"Report a vulnerability"** button to privately submit a report to the repository maintainers.

## OWASP ASVS Alignment

Out of the box, this QuickStart repository is hardened to satisfy Level 1 and Level 2 requirements of the **OWASP Application Security Verification Standard (ASVS) v4.0.3**. The table below outlines how this template implements and verifies specific security controls. For a director-facing mapping of these practices to the Key STRA Control Areas Checklist and the Statement of Acceptable Risks (SoAR), see [docs/stra-soar-devops.md](docs/stra-soar-devops.md).

| ASVS v4.0.3 Section | Category / Control | QuickStart Implementation | Verification / Automation |
| :--- | :--- | :--- | :--- |
| **V5.5** | Active Application Defense | Integrates the **Coraza Web Application Firewall (WAF)** inline in the frontend reverse proxy, with a small set of custom rules (SQL injection, XSS, scanners, sensitive paths, path traversal, and null-byte checks). This is not the OWASP Core Rule Set. Teams can disable a rule (`SecRuleRemoveById`), make it log only (`SecRuleUpdateActionById <id> "pass"`) or skip it for one path (`ctl:ruleRemoveById`); examples are in `frontend/coraza.conf`. | Built in [frontend/Dockerfile](./frontend/Dockerfile); rules in [frontend/coraza.conf](./frontend/coraza.conf) are loaded from [frontend/Caddyfile](./frontend/Caddyfile). |
| **V14.2** | Build-Time Security Scans | Scans the repository filesystem for vulnerabilities, secrets, and misconfiguration during development, and requires CodeQL results on `main`. | [Trivy](https://github.com/aquasecurity/trivy) runs a filesystem scan (`scan-type: fs`, `scanners: vuln,secret,misconfig`) in the Analysis workflow on every non-draft PR, on pushes to `main`, and weekly, uploading SARIF to the GitHub Security tab. [CodeQL](https://codeql.github.com/) is not a job in Analysis; the `main` branch ruleset in [scripts/setup-github.sh](./scripts/setup-github.sh) requires CodeQL with no alerts at high or higher. |
| **V14.2** | Dependency Security | Updates outdated packages and scans for unused dependencies/exports once those tools are onboarded. | [Mend Renovate](https://github.com/bcgov/renovate-config) opens update pull requests after the Renovate GitHub App is installed (`renovate.json`). [Knip](https://knip.dev/) runs in the Analysis workflow via `bcgov/actions/test-and-analyse` (warning mode by default). |
| **V14.2** | Secret Management | Separates database connection credentials, API keys, and environment-specific configs from code. | Configuration materialized via OpenShift Secrets templates in [common/openshift.init.yml](./common/openshift.init.yml). Committed secrets are also blocked at push time by GitHub secret scanning push protection ([ADR 0002](./docs/adr/0002-secret-prevention.md)). |
| **V14.2** | Dynamic Security Testing (DAST) | Performs automated runtime testing on the deployed TEST application. | Weekly **OWASP ZAP** and **Nuclei** scans in the Scheduled workflow (`.github/workflows/scheduled.yml`, `bcgov/actions/scan-url`) against the deployed `test` environment. |
| **V14.4** | HTTP Secure Headers | Strips identifying `Server` headers and enforces secure HTTP response headers (CSP, HSTS, X-Frame-Options, same-origin, and MIME sniffing blocks). | Configured natively in the frontend [frontend/Caddyfile](./frontend/Caddyfile) and verified by weekly OWASP ZAP scans. |
| **V14.4** | Container Hardening | Restricts container execution permissions and prevents host system modifications. | Enforces `readOnlyRootFilesystem: true`, `runAsNonRoot: true`, `allowPrivilegeEscalation: false`, drop all `capabilities`, and default `seccompProfile` in [backend/openshift.deploy.yml](./backend/openshift.deploy.yml) and [frontend/openshift.deploy.yml](./frontend/openshift.deploy.yml). |
| **V14.4** | Network Segmentation | Controls pod communication, isolating network traffic between frontend, backend, and database tiers. | [NetworkPolicies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) in [common/openshift.init.yml](./common/openshift.init.yml). In PROD, [common/openshift.backup.yml](./common/openshift.backup.yml) also allows the backup and restore CronJob pods to reach the database on port 5432. |

## Vulnerability Triage SLAs

All security issues are triaged using CISA KEV status and CVSS scores:
- **Critical** (CVSS 9.0-10.0 or CISA KEV): Remediation within 24 hours.
- **High** (CVSS 7.0-8.9): Remediation within 1 week.
- **Medium** (CVSS 4.0-6.9): Remediation within 2 weeks.
- **Low** (CVSS 0.0-3.9): Remediation next scheduled release.

Trivy reports findings at every severity to the GitHub Security tab on each run, where they are triaged against the windows above. Findings are not a merge gate, because advisories are published independently of any contribution. Committed secrets are blocked at push time by GitHub secret scanning push protection instead.

