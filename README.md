[![MIT License](https://img.shields.io/github/license/bcgov/quickstart-openshift.svg)](/LICENSE)
[![Lifecycle](https://img.shields.io/badge/Lifecycle-Experimental-339999)](https://github.com/bcgov/repomountie/blob/master/doc/lifecycle-badges.md)
[![Merge](https://github.com/bcgov/quickstart-openshift/actions/workflows/merge.yml/badge.svg)](https://github.com/bcgov/quickstart-openshift/actions/workflows/merge.yml)
[![Analysis](https://github.com/bcgov/quickstart-openshift/actions/workflows/analysis.yml/badge.svg)](https://github.com/bcgov/quickstart-openshift/actions/workflows/analysis.yml)
[![Scheduled](https://github.com/bcgov/quickstart-openshift/actions/workflows/scheduled.yml/badge.svg)](https://github.com/bcgov/quickstart-openshift/actions/workflows/scheduled.yml)

# 🚀 QuickStart for OpenShift

## 🔄 Pull Request-Based Workflows with Sample Stack

This repository provides a template to rapidly deploy a modern web application stack to OpenShift using [GitHub Actions](https://github.com/bcgov/quickstart-openshift/actions), incorporating best practices for CI/CD, security, and observability.  By hitting the ground running we can save weeks-to-months of development time plus receive regular updates and features.

**Includes:**
* 🔄 Pull Request-based pipeline
* 🏖️ Sandboxed development environments
* 🔒 Gated/controlled production deployments (optional)
* 📦 Container publishing (ghcr.io) and importing (OpenShift)
* 🛡️ Security, vulnerability, infrastructure, and container scan tools
* 🔧 Automatic dependency patching available from [bcgov/renovate-config](https://github.com/bcgov/renovate-config)
* ✅ Enforced code reviews and workflow jobs (pass|fail)
* 📊 Helm Package Manager
* 📈 Prometheus Metrics export from Backend/Frontend
* ⚡ Resource Tuning with Horizontal Pod Autoscaler (TEST/PROD only)
* 🎯 Affinity and anti-affinity for Scheduling on different worker nodes
* 🔄 Rolling updates with zero downtime in PROD
* 🗃️ Database Migrations with Flyway
* 🛡️ Pod disruption budgets for high availability
* 🔍 Self-healing through probes/checks (startup, readiness, liveness)
* 🎯 Point the long-lived DEMO route to PRs by using the `demo` label
* **Sample application stack:**
    * 🗄️ Database: Single Postgres/PostGIS (default) or Crunchy (optional), backups, Flyway
    * 🎨 Frontend: TypeScript, Caddy Server with Coraza WAF
    * ⚙️ Backend: TypeScript, Nest.js
    * 🔄 Alternative backend examples - see [Alternative Backends](#alternative-backends)

# ⚙️ Setup

Initial setup is intended to take an hour or less.  This depends greatly on intended complexity, features selected/excluded and outside cooperation.

## ✅ Prerequisites

The following are required for all users:

- [ ] 🐙 [GitHub accounts](https://github.com/signup) for all participating team members
- [ ] 🚀 An OpenShift cluster with project namespaces (DEV, TEST, PROD)

### 🏛️ Additional Requirements for BC Government OpenShift

If you're using BC Government's OpenShift platform, you'll also need:

- [ ] 🏛️ BC Government IDIR accounts for anyone submitting requests
- [ ] 👥 Membership in the BCGov GitHub organization
    - Join the bcgov organization using [these instructions](https://developer.gov.bc.ca/docs/default/component/bc-developer-guide/use-github-in-bcgov/bc-government-organizations-in-github/#directions-to-sign-up-and-link-your-account-for-bcgov).
- [ ] 🚀 BCGov OpenShift project namespaces:
    - [BCGov signup](https://registry.developer.gov.bc.ca)

## 📋 Using this Template

Create a new repository using this repository as a template.

* ✅ Verify bcgov/quickstart-openshift is selected under Repository template

![](./.github/graphics/template.png)

## 🔐 Secrets, Variables and Environments

### 🔑 Secrets and Variables

Variables and secrets are consumed by workflows.  Variables are visible in workflows and logs, while secrets are hidden/redacted.

**Repository-level vs Environment-specific:**

- **Repository-level** (shown as `<none>` in the environment column): These are available to all workflows and environments. They're created at the repository level and apply globally unless overridden by environment-specific values.
- **Environment-specific**: These are scoped to a particular environment (e.g., TEST, PROD) and override repository-level values when that environment is used.

To create new secrets from GitHub.com click:

* `Settings > Secrets and Variables > Actions > Secrets > New repository secret`

Note: Dependabot, which we don't recommend as highly as Renovate, requires its own set of values.

### 🌍 Environments

Environments are groups of secrets and variables with optional access controls.  This includes limiting access to certain users or requiring manual approval before a requesting workflow can run.  Environment values add to or override any repository-level values.

To create new environments from GitHub.com click:

* `Settings > Environments > New environment`

Environments provide a [number of features](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment), including:

* Required reviewers
* Wait timer
* Limit TEST/PROD values to post-merge workflows

### 📊 Example

Here is the arrangement of secrets, variables and environments for this repository.

| Environment | Name                   | Description                                    |
|-------------|------------------------|------------------------------------------------|
| \<none\>    | `vars.OC_SERVER`       | Common server address (repository-level)       |
| \<none\>    | `secrets.OC_NAMESPACE` | DEV namespace (repository-level)               |
| \<none\>    | `secrets.OC_TOKEN`     | DEV service token (repository-level)           |
| TEST        | `secrets.OC_NAMESPACE` | TEST namespace (overrides repository-level)     |
| TEST        | `secrets.OC_TOKEN`     | TEST service token (overrides repository-level) |
| PROD        | `secrets.OC_NAMESPACE` | PROD namespace (overrides repository-level)    |
| PROD        | `secrets.OC_TOKEN`     | PROD service token (overrides repository-level) |

### 🔐 Secret Values

**`OC_TOKEN`** 🎫

OpenShift's service account token, different for every namespace.  This guide assumes your OpenShift platform team has provisioned a pipeline account.

* Consume: `{{ secrets.OC_TOKEN }}`

Locate an OpenShift pipeline token:

1. Login to your OpenShift cluster (for BCGov users: [Gold](https://console.apps.gold.devops.gov.bc.ca/) or [Silver](https://console.apps.silver.devops.gov.bc.ca/))
2. Select your DEV namespace
3. Click Workloads > Secrets (under Workloads for Administrator view)
4. Select `pipeline-token-...` or a similarly privileged token
5. Under Data, copy `token`
6. Paste into the GitHub Secret `OC_TOKEN`

**`OC_NAMESPACE`** 📁

Teams will receive a set of project namespaces, usually DEV (for PRs), TEST and PROD.  TOOLS namespaces (e.g. Jenkins, shared Oracle resources) are not used here.  Provided by your OpenShift platform team.

* Consume: `{{ secrets.OC_NAMESPACE }}`
* E.g.: `abc123-dev`

**`SONAR_TOKEN(s)`** 📊

If SonarCloud is being used each application will have its own token.  Single-application repositories typically use `${{ secrets.SONAR_TOKEN }}`, while monorepos use similar names.

E.g.:
* `${{ secrets.SONAR_TOKEN_BACKEND }}`
* `${{ secrets.SONAR_TOKEN_FRONTEND }}`

BC Government employees can request SonarCloud projects by creating an [issue](https://github.com/BCDevOps/devops-requests/issues/new/choose) with BCDevOps.  Please make sure to request a monorepo with component names (e.g. backend, frontend), which may not be explained in their directions.

### 📊 Variable Values

> 👆 Click Settings > Secrets and Variables > Actions > Variables > New repository variable

**`OC_SERVER`** 🌐

OpenShift server address (API endpoint for your OpenShift cluster).
* Consume: `{{ vars.OC_SERVER }}`
* Example values (BCGov): `https://api.gold.devops.gov.bc.ca:6443` or `https://api.silver.devops.gov.bc.ca:6443`
* For other OpenShift clusters: Use your cluster's API server address (typically `https://api.<cluster-domain>:6443`)

**`DB_PROVIDER`** 🗄️

Database provider toggle for deployments.

* Where: `Settings > Secrets and Variables > Actions > Variables`
* Values: `single` (default) or `crunchy`
* Behavior:
    * `single`: Deploys an in-release Postgres/PostGIS StatefulSet with PgBouncer sidecar (no Crunchy operator resources).
    * `crunchy`: Deploys Crunchy via `bcgov/action-crunchy` and wires the app to the Crunchy-generated service/secrets.

## 🔄 Updating Dependencies

Dependabot and Mend Renovate can both provide dependency updates using pull requests.  Dependabot is simpler to configure, while Renovate is much more configurable and lighter on resources.

### 🤖 Renovate

A config file (`renovate.json`) is included with this template.  It can source config from our [renovate repository](https://github.com/bcgov/renovate-config).  Renovate can be [self-hosted](https://github.com/renovatebot/github-action) or run using the GitHub App managed at the organization level.  For BC Government the OCIO controls this application, so please opt in with them using a GitHub issue.

To opt-in:
* Visit the [Renovate GitHub App](https://github.com/apps/renovate/)
* Click `Configure` and set up your repository
* Visit [BCDevOps Requests](https://github.com/BCDevOps/devops-requests)
* Select [Issues](https://github.com/BCDevOps/devops-requests/issues)
* Select [New Issue](https://github.com/BCDevOps/devops-requests/issues/new/choose)
* Select [Request for integrating a GitHub App](https://github.com/BCDevOps/devops-requests/issues/new?assignees=MonicaG%2C+oomIRL%2C+SHIHO-I&labels=github-app%2C+pending&projects=&template=github_integration_request.md&title=)
* Create a meaningful title, e.g. `Request to add X repo to Renovate App`
* Fill out the description providing a repository name
* Select "Submit new issue"
* Wait for Renovate to start sending pull requests to your repository

### 🔧 Dependabot

Dependabot is no longer recommended as an alternative to Renovate for generating security, vulnerability and dependency pull requests.  It can still be used to generate warnings under the GitHub Security tab, which is only viewable by repository administrators.

## ⚙️ Repository Configuration

### 🔀 Pull Request Handling

Squash merging is recommended for simplified history and ease of rollback.  Cleaning up merged branches is recommended for your DevOps Specialist's fragile sanity.

> Click Settings > General (selected automatically)

Pull Requests:

* `[uncheck] Allow merge commits`
* `[check] Allow squash merging`
   * `Default to pull request title`
* `[uncheck] Allow rebase merging`
* `[check] Always suggest updating pull request branches`
* `[uncheck] Allow auto-merge`
* `[check] Automatically delete head branches`

### 📦 Packages

Packages are available from your repository (link on right).  All should have visibility set to public for the workflows to run successfully.

E.g. https://github.com/bcgov/quickstart-openshift/packages

### 🛡️ Branch Protection Rules

This is required to prevent direct pushes and merges to the default branch.  These steps must be run after one full pull request pipeline has been run to populate the required status checks.

1. Select `Settings` (gear, top right) > `Rules` > `Rulesets` (under Code and Automation)
2. Click `New ruleset` > `New branch ruleset`
3. Setup Ruleset:
    * Ruleset Name: `main`
    * Enforcement status: `Active`
    * Bypass list:
        * Click `+ Add bypass`
        * Check `[x] Repository admin`
        * Click `Add selected`
    * Target branches:
        * Click `Add target`
        * Select `Add default branch`
    * Branch protections:
        * `[x] Restrict deletions`
        * `[x] Require linear history`
        * `[x] Require a pull request before merging`
            * Additional settings:
                * `Require approvals: 1` (or more!)
                * `[x] Require conversation resolution before merging`
        * `[x] Require status checks to pass`
            * `[x] Require branches to be up to date before merging`
            * Required checks: *These will be populated after a full pull request pipeline run!*
                * Click `+Add checks`
                * This is our default set, yours may differ:
                    * `Analysis Results`
                    * `PR Results`
                    * `Validate Results`
    * `[x] Block force pushes`
    * `[x] Require code scanning results`
        * Click `+ Add tool`
        * This is our default set, yours may differ:
            * `CodeQL`
            * `Trivy`
    * Click `Create`

Note: Required status checks will only be available to select after the relevant workflows have run at least once on a pull request.

#### Status checks example
![](./.github/graphics/branch-protection.png)

#### Required tools and alerts example
![](./.github/graphics/branch-code-results.png)


### 👥 Adding Team Members

Don't forget to add your team members!  

1. ⚙️ Select Settings (gear, top right)  *> Collaborators and teams (under `Access`)
2. 👆 Click `Add people` or `Add teams`
3. 🔍 Use the search box to find people or teams
4. 🎭 Choose a role (read, triage, write, maintain, admin)
5. ➕ Click Add

# 🔄 Workflows

These workflows and actions enforce a pull request based flow.
```mermaid
flowchart TD
    A1(PR_Env_1) -->|tests| B
    A2(PR_Env_2) -->|tests| B
    A3(PR_Env_3) -->|tests| B
    Ad@{ shape: text, label: "..." }
    An(PR Env n) -->|tests| B
    B(TEST_Env) -->|tests| C(PROD_Env)

    %% Define styles with good contrast for light/dark modes
    %% PR Environments (using distinct, reasonably bright colors)
    style A1 fill:#ffeadb,stroke:#ff8c42,stroke-width:2px,color:#5c3d1e  %% Light Orange/Orange
    style A2 fill:#dbeaff,stroke:#4285f4,stroke-width:2px,color:#1a3f7a  %% Light Blue/Blue
    style A3 fill:#dfffea,stroke:#34a853,stroke-width:2px,color:#154b24  %% Light Green/Green
    style An fill:#fce8ff,stroke:#a142f4,stroke-width:2px,color:#4d1e7a  %% Light Purple/Purple
    %% TEST Environment
    style B fill:#e6f4ea,stroke:#34a853,stroke-width:3px,color:#154b24  %% Lighter Green/Green
    %% PROD Environment
    style C fill:#fff4d8,stroke:#fbbc05,stroke-width:3px,color:#7a5f01  %% Light Gold/Gold

    %% Link style
    linkStyle default stroke:#757575,stroke-width:1px
```

Here's a more detailed view showing a single pull request.

```mermaid
flowchart TD
    A(Developer)
    B(Pull Request)
    Ba(Build Images,<br/>Deploy Images,<br/>E2E Tests)
    Bb(Unit Tests,<br/>Security Analysis,<br/>Vulnerability Analysis)
    Bc(Validate PR Title,<br/>Provide User Feedback)
    Bd(Code Review)
    C{Verify Results}
    D(Merge)
    E(Deploy Images to TEST)
    F{E2E Tests,<br/>Load Tests,<br/>Analysis}
    G(Deploy Images to PROD)
    H(Tag Images as PROD)

    A --> B
    B --> Ba --> C
    B --> Bb --> C
    B --> Bc --> C
    B --> Bd --> C
    C -- fail --> A
    C -- pass --> D --> E --> F
    F -- fail --> A
    F -- pass --> G --> H

    %% Define styles with good contrast for light/dark modes
    %% Developer & PR Actions (Blue)
    style A fill:#dbeaff,stroke:#4285f4,stroke-width:2px,color:#1a3f7a
    style B fill:#dbeaff,stroke:#4285f4,stroke-width:2px,color:#1a3f7a
    %% PR Checks & Validation (Light Green)
    style Ba fill:#e6f4ea,stroke:#34a853,stroke-width:2px,color:#154b24
    style Bb fill:#e6f4ea,stroke:#34a853,stroke-width:2px,color:#154b24
    style Bc fill:#e6f4ea,stroke:#34a853,stroke-width:2px,color:#154b24
    %% Code Review (Light Gold - requires attention)
    style Bd fill:#fff4d8,stroke:#fbbc05,stroke-width:2px,color:#7a5f01
    %% Decision Points (Purple)
    style C fill:#fce8ff,stroke:#a142f4,stroke-width:2px,color:#4d1e7a
    style F fill:#fce8ff,stroke:#a142f4,stroke-width:2px,color:#4d1e7a
    %% Merge & TEST Deployment (Green)
    style D fill:#dfffea,stroke:#34a853,stroke-width:2px,color:#154b24
    style E fill:#e6f4ea,stroke:#34a853,stroke-width:3px,color:#154b24
    %% PROD Deployment & Tagging (Gold)
    style G fill:#fff4d8,stroke:#fbbc05,stroke-width:3px,color:#7a5f01
    style H fill:#fff4d8,stroke:#fbbc05,stroke-width:3px,color:#7a5f01

    %% Link style
    linkStyle default stroke:#757575,stroke-width:1px
```

## 🔀 Pull Request

Runs on pull request submission.

* 🏖️ Provides safe, sandboxed deployment environments
* 🏗️ Build action pushes to GitHub Container Registry (ghcr.io)
* 🔄 Build triggers select new builds vs reusing builds
* 🚀 Deploy only when changes are made
* 📋 Deployment includes curl checks and optional penetration tests
* 🧪 Run tests (e2e, load, integration) when changes are made
* ✅ Other checks and updates as required

![](.github/graphics/pr-open.png)

## ✅ Validation

Runs on pull request submission.

* 📋 Enforces conventional commits in PR title
* 👋 Adds greetings/directions to PR descriptions

![](.github/graphics/pr-validate.png)


## 📊 Analysis

Runs on pull request submission or merge to the default branch.

* 🧪 Unit tests (should include coverage)
* 🔍 CodeQL/GitHub security reporting (now handled as GitHub default!)
* 🛡️ Trivy password, vulnerability and security scanning

![](.github/graphics/analysis.png)

## ❌ Pull Request Closed

Runs on pull request close or merge.

* 🧹 Cleans up OpenShift objects/artifacts
* 🏷️ Merge retags successful build images as `latest`

![](.github/graphics/pr-close.png)

## 🔗 Merge

Runs on merge to main branch.

* 🔍 Code scanning and reporting to GitHub Security overview
* 🚀 Zero-downtime* TEST deployment
* 🛡️ Penetration tests on TEST deployment (optional)
* 🚀 Zero-downtime* PROD deployment
* 🏷️ Labels successful deployment images as PROD

\* excludes database changes

![](.github/graphics/merge.png)

## ⏰ Scheduled

Runs on scheduled job (cronjob) or workflow dispatch.

* 🧹 PR environment purge
* 📚 Generate SchemaSpy documentation
* 🧪 Tests (e2e, load, integration) on TEST deployment

![](.github/graphics/scheduled.png)

## 🎯 DEMO Routing

There is a long-lived custom route available to be assigned to specific Pull Request deployments.  Add the label `demo` to that pull request or run the `DEMO Route` workflow.

Typical route format: `https://<REPO_NAME>-demo.<your-openshift-domain>`  
Example (BCGov): `https://<REPO_NAME>-demo.apps.silver.devops.gov.bc.ca`

#### 🏷️ PR Label

Please note that the label must be manually created using GitHub's web interface.

![](.github/graphics/demo-label.png)

#### ⚙️ Workflow
![](.github/graphics/workflow.png)


# 📚 App Stack

**Frontend (JavaScript/TypeScript)** 🎨

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=quickstart-openshift_frontend&metric=bugs)](https://sonarcloud.io/summary/new_code?id=quickstart-openshift_frontend)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=quickstart-openshift_frontend&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=quickstart-openshift_frontend)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=quickstart-openshift_frontend&metric=coverage)](https://sonarcloud.io/summary/new_code?id=quickstart-openshift_frontend)
[![Duplicated Lines](https://sonarcloud.io/api/project_badges/measure?project=quickstart-openshift_frontend&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=quickstart-openshift_frontend)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=quickstart-openshift_frontend&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=quickstart-openshift_frontend)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=quickstart-openshift_frontend&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=quickstart-openshift_frontend)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=quickstart-openshift_frontend&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=quickstart-openshift_frontend)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=quickstart-openshift_frontend&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=quickstart-openshift_frontend)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=quickstart-openshift_frontend&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=quickstart-openshift_frontend)

**Backend (JavaScript/TypeScript)** ⚙️

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=quickstart-openshift_backend&metric=bugs)](https://sonarcloud.io/summary/new_code?id=quickstart-openshift_backend)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=quickstart-openshift_backend&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=quickstart-openshift_backend)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=quickstart-openshift_backend&metric=coverage)](https://sonarcloud.io/summary/new_code?id=quickstart-openshift_backend)
[![Duplicated Lines](https://sonarcloud.io/api/project_badges/measure?project=quickstart-openshift_backend&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=quickstart-openshift_backend)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=quickstart-openshift_backend&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=quickstart-openshift_backend)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=quickstart-openshift_backend&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=quickstart-openshift_backend)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=quickstart-openshift_backend&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=quickstart-openshift_backend)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=quickstart-openshift_backend&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=quickstart-openshift_backend)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=quickstart-openshift_backend&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=quickstart-openshift_backend)

## 🚀 Starter

The starter stack includes a frontend (React, Bootstrap, Vite, Caddy), backend (Nest/Node) and Postgres or PostGIS database.  See subfolder for source, including Dockerfiles and OpenShift templates.  Alternative backends are available.

**Features:**
* 💪 [TypeScript](https://www.typescriptlang.org/) strong-typing for JavaScript
* 🏗️ [NestJS](https://docs.nestjs.com) Nest/Node backend and frontend
* 🔄 [Flyway](https://flywaydb.org/) database migrations
* 🗄️ Database provider toggle (`single` or `crunchy`)
* 🐘 [Crunchy](https://www.crunchydata.com/products/crunchy-postgresql-for-kubernetes) Postgres/PostGIS Database (optional)
* 🐘 Single Postgres/PostGIS (default) with PgBouncer sidecar
* 🛡️ [OWASP Coraza WAF](https://github.com/corazawaf/coraza-caddy) Web Application Firewall integrated with Caddy

PostGIS notes:
* **Single mode** uses the repository-owned database image (built from `./database/Dockerfile`), currently targeting Postgres 18 + PostGIS.
* **Crunchy mode** uses `charts/crunchy/values.yml`. PostGIS is enabled when `crunchy.postGISVersion` is set; to switch to standard PostgreSQL, set it to `~`.

### 🛡️ OWASP Coraza WAF: Application Security

[OWASP Coraza](https://coraza.io/) is an open-source Web Application Firewall (WAF) that provides application-layer security protection against common web attacks. As part of the OWASP (Open Web Application Security Project) ecosystem, Coraza can be used alongside other OWASP security tools. For example, [OWASP ZAP](https://www.zaproxy.org/) (Zed Attack Proxy) is a security testing and validation tool that can be used to test applications protected by Coraza, though there is no special integration between them.

**Why Coraza WAF is Important:**

Coraza WAF acts as a security shield for your application, protecting against:
- **SQL Injection (SQLi)** attacks that attempt to manipulate database queries
- **Cross-Site Scripting (XSS)** attacks that inject malicious scripts into web pages
- **Path Traversal** attempts to access unauthorized files or directories
- **Security Scanner** probes from automated attack tools
- **Sensitive Path** access attempts (e.g., `.env`, `.git`, admin panels)

The WAF is integrated directly into the Caddy web server, providing real-time protection with minimal performance overhead. It uses pattern-based rules and operators (such as regular expressions and string matching) to identify and block malicious requests before they reach your application.

**Customization & Troubleshooting:**

**1. Modifying WAF Rules**
- WAF rules are defined in `frontend/coraza.conf`.
- Edit this file to add, remove, or adjust rules. For example, to allow a specific request method, modify or comment out the relevant rule.
- After making changes, restart the frontend service using Docker Compose:
  ```bash
  docker compose restart frontend
  ```

**2. Viewing WAF Logs**
- WAF logs are typically output to the Caddy logs. When running locally with Docker Compose, check the container logs with:
  ```bash
  docker compose logs frontend
  ```
- Look for entries containing "coraza" or "WAF" to identify blocked requests and rule matches.

**3. Temporarily Disabling the WAF**
- To disable the WAF for testing, comment out or remove the Coraza configuration block in the Caddyfile (usually in `frontend/Caddyfile`).
- Alternatively, you can remove or rename `coraza.conf` and restart the frontend.
- **Warning:** Disabling the WAF exposes your app to threats. Only do this in non-production environments.

**4. Handling False Positives & Whitelisting Legitimate Traffic**
- If legitimate requests are blocked, review the logs to identify which rule triggered the block.
- Adjust or disable the specific rule in `coraza.conf` to whitelist the traffic.
- You can use `SecRuleRemoveById <rule_id>` to disable a rule by its ID.
- Test thoroughly after making changes to ensure security is maintained.

For more details, see the [Coraza documentation](https://coraza.io/docs/).

## 🗄️ Database

This template supports two database providers. The provider is controlled via the repository variable `DB_PROVIDER` and is also passed into Helm as `global.database.provider`.

### 🐘 Single Postgres/PostGIS (default)

This mode deploys a NON-HA database **inside the application Helm release**:

* A Postgres/PostGIS **StatefulSet** and **Service** named `<release>-db`
* A **PgBouncer sidecar** (service port 5432 targets PgBouncer)
* Optional backups via a **CronJob** using the BCGov backup container (`ghcr.io/bcgov/backup-container`)

Images:
* Database image is built from `./database/Dockerfile` and published to GHCR (expected default: `ghcr.io/<org>/<repo>/database:<tag>`)
* PgBouncer image is built from `./pgbouncer/Dockerfile` and published to GHCR (expected default: `ghcr.io/<org>/<repo>/pgbouncer:<tag>`)

Backups (single mode):
* Enable with Helm values: `global.database.backup.enabled=true`
* Configure schedule/retention/PVC under `global.database.backup.*` in `charts/app/values.yaml`
* Optional object storage settings live under `global.database.backup.s3.*`
Pros:
* Simple to maintain, low resource consumption
Cons:
* Non HA:  https://developer.gov.bc.ca/docs/default/component/platform-developer-docs/docs/automation-and-resiliency/app-resiliency-guidelines/#a-highly-available-application

### 🐘 Crunchy Database (optional)

Crunchy is still the recommended choice for high availability (HA) Postgres/PostGIS databases in BC Government with its known pitfalls and drawbacks around operational overhead.

### 🌟 Key Features
- ⚡ Automatic failover with Patroni
- 💾 Scheduled backups
- 📊 Monitoring
- 🔧 Self-healing capabilities
- 📈 Horizontal scaling options (Read Replicas)

### 💡 Setup Tips
1. **⚙️ Resource Allocation**: Adjust the resources in [crunchy helm chart values](charts/crunchy/values.yml) based on your application needs, since the **defaults are just minimal**.
2. **🌍 Environment Configuration**: Create environment-specific configs from base values.yml as  `values-test.yml` and `values-prod.yml`, Make sure there are **at least 3 replicas in PRODUCTION**.
3. **🚨 DR Testing**: Disaster Recovery Testing is **`MANDATORY`** before go live.

### 💾 Enabling S3 Backups
To enable S3 backups/recovery in Crunchy mode, configure `crunchy.pgBackRest.s3.*` in `charts/crunchy/values.yml` (or an environment-specific override values file).

> **Important**: Never reuse the same s3/object store, bucket path across different Crunchy deployments or instances (dev, test, prod)

For advanced configuration, see the [re-usable GitHub Action](https://github.com/bcgov/action-crunchy) that manages PR deployments and helm template upgrades.

### 🔧 Troubleshooting and Support

If you encounter issues, check out the [Troubleshooting Guide](https://github.com/bcgov/crunchy-postgres/blob/main/Troubleshoot.md) for quick solutions.

Need more help? Join the discussion in the [CrunchyDB Rocket.Chat Channel](https://chat.developer.gov.bc.ca/channel/crunchydb) to get support from the community and experts.


## 🔄 Alternative Backends

The sample Java, Python and Go backends repository has been archived, but we have lots of other great examples of active projects you can learn from!

* [NR-RFC-AlertAuthoring - Python with FastAPI and Alembic](https://github.com/bcgov/nr-rfc-alertauthoring)
* [QuickStart OpenShift Backends](https://github.com/bcgov/quickstart-openshift-backends)

## 📊 SchemaSpy

The database documentation is created and deployed to GitHub pages.  See [here](https://bcgov.github.io/quickstart-openshift/schemaspy/index.html).

After a full workflow run and merge has been completed, please do the following:

1. ⚙️ Select Settings (gear, top right) > Pages (under `Code and automation`)
2. 👆 Click `Branch`
3. 🌿 Select `gh-pages`
4. 💾 Click `Save`

![img.png](.github/graphics/schemaspy.png)

# 🔄 Flyway, Prisma, Migrations
1. 🛠️ [Flyway is used as Database Schema Migration tool](https://www.red-gate.com/products/flyway/community/)
2. 🔧 [Prisma is used as ORM layer](https://www.prisma.io/)
3. 💡 The rationale behind using flyway to have schema first approach and let prisma generate ORM schema from the database, which would avoid pitfalls like lazy loading, cascading, etc. when defining entities in ORM manually.
4. 🐳 Run flyway in the docker compose to apply latest changes to Postgres database.
5. 🔄 Run npx prisma db pull from backend folder to sync the prisma schema.
6. ⚙️ Run npx prisma generate to generate the prisma client which will have all the entities populated based on fresh prisma schema.
7. 💻 If using VS Code, be aware of [this issue](https://stackoverflow.com/questions/65663292/prisma-schema-not-updating-properly-after-adding-new-fields)



## 🏗️ Architecture

The architecture diagram provides an overview of the system's components, their interactions, and the deployment structure. It illustrates the relationships between the frontend, backend, database, and other infrastructure elements within the OpenShift environment.

![Architecture](./.diagrams/architecture/arch.drawio.svg)

## 🤝 Contributing

We welcome contributions to improve this template! 
Please contribute your ideas!  [Issues](/../../issues) and [Pull Requests](/../../pulls) are appreciated.

**Built with ❤️ by the NRIDS Team**

This repository is provided by NRIDS Architecture and Forestry Digital Services, courtesy of the Government of British Columbia.

* 🚀 NRID's [Kickstarter Guide](https://bcgov.github.io/nr-architecture-patterns-library/docs/Agile%20Team%20Kickstarter) (via. Confluence, links may be internal)
