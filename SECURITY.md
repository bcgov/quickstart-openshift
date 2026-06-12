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

Out of the box, this QuickStart repository is hardened to satisfy Level 1 and Level 2 requirements of the **OWASP Application Security Verification Standard (ASVS) v4.0.3**. The table below outlines how this template implements and verifies specific security controls.

| ASVS v4.0.3 Section | Category / Control | QuickStart Implementation | Verification / Automation |
| :--- | :--- | :--- | :--- |
| **V5.5** | Active Application Defense | Integrates the **Coraza Web Application Firewall (WAF)** running inline with the OWASP Core Rule Set (CRS) inside the frontend reverse proxy. | Verified by build integration in [frontend/Dockerfile](file:///home/derek/Repos/quickstart-openshift/frontend/Dockerfile) and Caddy configuration in [frontend/Caddyfile](file:///home/derek/Repos/quickstart-openshift/frontend/Caddyfile). |
| **V14.2** | Build-Time Security Scans | Scans for container base image vulnerabilities and code weaknesses during development. | Automated [Trivy](https://github.com/aquasecurity/trivy) and [CodeQL](https://codeql.github.com/) scans running in the Analysis workflow on every PR. |
| **V14.2** | Dependency Security | Automatically patches outdated packages and scans for unused dependencies/exports. | [Mend Renovate](https://github.com/bcgov/renovate-config) for automated pull requests and [Knip](https://knip.dev/) scans running in the Analysis workflow. |
| **V14.2** | Secret Management | Separates database connection credentials, API keys, and environment-specific configs from code. | Configuration materialized via OpenShift Secrets templates in [common/openshift.init.yml](file:///home/derek/Repos/quickstart-openshift/common/openshift.init.yml). |
| **V14.2** | Dynamic Security Testing (DAST) | Performs automated runtime penetration tests on the deployed application. | Scheduled **OWASP ZAP** full scans running weekly in the Scheduled workflow against the deployed `test` environment. |
| **V14.4** | HTTP Secure Headers | Strips identifying `Server` headers and enforces secure HTTP response headers (CSP, HSTS, X-Frame-Options, same-origin, and MIME sniffing blocks). | Configured natively in the frontend [frontend/Caddyfile](file:///home/derek/Repos/quickstart-openshift/frontend/Caddyfile) and verified by weekly OWASP ZAP scans. |
| **V14.4** | Container Hardening | Restricts container execution permissions and prevents host system modifications. | Enforces `readOnlyRootFilesystem: true`, `runAsNonRoot: true`, `allowPrivilegeEscalation: false`, drop all `capabilities`, and default `seccompProfile` in [backend/openshift.deploy.yml](file:///home/derek/Repos/quickstart-openshift/backend/openshift.deploy.yml) and [frontend/openshift.deploy.yml](file:///home/derek/Repos/quickstart-openshift/frontend/openshift.deploy.yml). |
| **V14.4** | Network Segmentation | Controls pod communication, isolating network traffic between frontend, backend, and database tiers. | Hardened [NetworkPolicies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) defined in [common/openshift.init.yml](file:///home/derek/Repos/quickstart-openshift/common/openshift.init.yml). |

## Vulnerability Triage SLAs

All security issues are triaged using CISA KEV status and CVSS scores:
- **Critical** (CVSS 9.0-10.0 or CISA KEV): Remediation within 24 hours.
- **High** (CVSS 7.0-8.9): Remediation within 1 week.
- **Medium** (CVSS 4.0-6.9): Remediation within 2 weeks.
- **Low** (CVSS 0.0-3.9): Remediation next scheduled release.

