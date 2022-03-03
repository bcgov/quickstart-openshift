<!-- PROJECT SHIELDS -->

[![Contributors](https://img.shields.io/github/contributors/bcgov/greenfield-template)](/../../graphs/contributors)
[![Forks](https://img.shields.io/github/forks/bcgov/greenfield-template)](/../../network/members)
[![Stargazers](https://img.shields.io/github/stars/bcgov/greenfield-template)](/../../stargazers)
[![Issues](https://img.shields.io/github/issues/bcgov/greenfield-template)](/../../issues)
[![MIT License](https://img.shields.io/github/license/bcgov/greenfield-template.svg)](/LICENSE.md)
[![Lifecycle](https://img.shields.io/badge/Lifecycle-Experimental-339999)](https://github.com/bcgov/repomountie/blob/master/doc/lifecycle-badges.md)


Forestry Client Services' greenfield starter template and pull request based pipeline.  For new and migrating products.  Currently supports OpenShift with plans for Amazon Web Services.


# Overview

The Greenfield-template is a node.js application built with [nestJS](https://docs.nestjs.com), and the main purpose is to provide a [GitHub Actions](https://docs.github.com/en/actions/quickstart) template to automate the process for testing, security scanning, code quality checking, image building and deploying for an application.  

This project is in active development.  Please visit our [issues](https://github.com/bcgov/greenfield-template/issues) page to view or request features.

Currently, our most exciting offering is the [GitHub Actions](https://github.com/bcgov/greenfield-template/actions) [pipeline](https://github.com/bcgov/greenfield-template/blob/main/.github/workflows/pr-open.yml), which includes:

* [Pull Request](https://github.com/bcgov/greenfield-template/pulls)-based ephemeral, sandboxed environments.
* [Docker](https://github.com/marketplace/actions/build-and-push-docker-images)(/Podman) container building.
* [Build caching](https://github.com/marketplace/actions/cache) to save time and bandwidth.
* [GitHub Container Registry](https://github.com/bcgov/greenfield-template/pkgs/container/greenfield-template) image publishing.
* [RedHat OpenShift](https://www.redhat.com/en/technologies/cloud-computing/openshift) deployment, with other options under consideration.
* [OpenShift artifact](https://github.com/bcgov/greenfield-template/blob/main/.github/workflows/pr-close.yml) pruning on PR completion.
* [SonarCloud](https://sonarcloud.io/) continuous code quality and security scanning.
* [GitHub CodeQL](https://codeql.github.com/) semantic code analysis and vulerability scanning.
* [Snyk](https://snyk.io/) development, vulnerability and security scanning.
* [OWASP ZAP](https://owasp.org/www-project-zap/) Zed Attack Proxy security scanning.
* [Jest](https://jestjs.io/) JavaScript testing enforced in-pipeline.
* [ESLint](https://eslint.org/) linting enforced in-pipeline and on code staging.
* [TypeScript](https://www.typescriptlang.org/) strong-typing for JavaScript.

...and more [on the way](https://github.com/bcgov/greenfield-template/issues)!

![Pipeline Action](.github/graphics/pr.png)


# Getting Started

Initial setup can be completed in around half a business day.  Please keep reading for directions.

Included:

- Documentation:
    - *.md
- Workflows:
    - Pull Request-based (.github/workflows/pr-open.yml)
    - On Close (.github/workflows/pr-close.yml)
    - Main Merge (.github/workflows/main-merge.yml)
- Hello World! starter application
    - TypeScript source in src/
    - One Jest test in test/
    - JavaScript container in Dockerfile
- Misc:
    - nestjs
    - eslint
    - lint-staged

Not included:

- Repository secrets
- Environment secrets
- Issues
- Pull requests
- JavaScript (transpiled/created to dist/)


## Prerequisites

The following are required:

- BC Government IDIR accounts for anyone submitting requests
- GitHub accounts for all participating team members
    - [Sign Up is free](https://github.com/signup)
- Membership in the BCGov GitHub organization
    - Provide GitHub IDs to [BCGov's Just Ask](https://just-ask.developer.gov.bc.ca/)
- Project namespaces (pick one):
    - OpenShift - [Register a New Project](https://registry.developer.gov.bc.ca/public-landing)
    - Amazon Web Services coming soon


## Consuming This Template

![image](./.github/graphics/newRepo.png)

Create a new repository using this repository as a template.
- Select bcgov/greenfield-template under Repository template
- Check Codecov | Code Coverage to grant access
- Jira cannot be unchecked (I try every time!)


## Setting Up the GitHub Repository


### Pull Request Handling

Squash merging is recommended for simplified histories ad ease of rollback.

Cleaning up merged branches is recommended for your DevOps Specialist's fragile sanity.

From GitHub:
1. Select Settings (gear, top right) -> General (selected automatically)
2. Scroll to Pull Requests
    - `[check] Allow squash merging`
    - `[check] Automatically delete head branches`


## Closing Repo-Mountie Issues

repo-mountie is a BCGov bot that likes to spam us.  Here are a few issues to expect.

Lets use common phrasing
 - Includes examples of inappropriate and preferred phrasing
 - The default branch should be named `main`
 - Close the issue

Add missing topics
 - Topics improve discoverability
 - Directions will be included
 - Close the issue


## Action Secrets

Action Secrets are consumed by workflows, including 3rd party Actions.  Please use Environment secrets for highly sensitive content.

Manage Action Secrets from your Repo > Settings > Secrets > Actions.


### Required

**GHTOKEN**

- Default token, not viewable, common to all repositories
- Variable: `{{ secrets.GHTOKEN }}`

**GHPROJECT_TOKEN** (TODO: check that this is still in use)

- Personal Access Token for writing to Pull Requests
- Variable: `{{ secrets.GHPROJECT_TOKEN }}`

**OC_SERVER**

- OpenShift server address
- Variable: `{{ secrets.OC_SERVER }}`
- Value (pick one of):
    - `https://api.gold.devops.gov.bc.ca:6443`
    - `https://api.silver.devops.gov.bc.ca:6443`


### Optional

Provide these tokens or comment their jobs out:

- ./github/workflows/pr-open.yml
- ./github/workflows/main.yml

**SNYK_TOKEN**

- Vulnerability, dependency and infrastructure code scanning
- Acquire a free token at [Snyk.io](https://snyk.io/)
- Variable: `{{ secrets.SNYK_TOKEN }}`

**SONAR_TOKEN**

- Code quality and security scanning
- Request to [import a GitHub repository](https://github.com/BCDevOps/devops-requests/issues/new/choose)
- Variable: `{{ secrets.SNYK_TOKEN }}`


## Environment Secrets

Secrets can be grouped into and protected by Environments.  [Features include](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment):

- Required reviewers
- Wait timer
- Deployment branches

Manage Environments and their Secrets from your Repo > Settings > Environments.

**Environment: dev**

Create a new Environment to hold the keys to our development deployment.

Environment name: `dev`

No  protection rules are required yet:

 - [`unchecked`] Required reviewers
 - [`unchecked`] Wait timer
 - Deployment branches: `All branches`


### Required

**NAMESPACE**

- OpenShift Development namespace (see **Prerequisites**)
- Variable: `{{ secrets.NAMESPACE }}`

**OC_TOKEN**

- OpenShift pipeline account token (see **Getting an OpenShift Account Token**)
- Variable: `{{ secrets.OC_TOKEN }}`


#### Getting an OpenShift Account Token

Please assume that your OpenShift platform team has provisioned a pipeline account.

1. Login to your OpenShift cluster
    - E.g. BCGov [Gold](https://console.apps.silver.devops.gov.bc.ca/) or [Silver](https://console.apps.silver.devops.gov.bc.ca/)
2. Select your DEV namespace (provided by the OpenShift platform team)
3. Select Secrets (under Workloads for Administrator view)
4. Select `pipeline-token-...` or a similarly privileged token
5. Under Data, copy `token`
6. Paste into the GitHub Environment Secret `OC_TOKEN` (see above)


#### Getting a Personal Access Token

TODO: verify still in use

Generate a Personal Access Token in a GitHub account of your choosing.  Personal or shared Service accounts can be used.

From GitHub:
1. Select Settings (gear, top right) -> Developer settings -> Personal access tokens
2. Create a new token with the following rights:
    - `workflow`
    - `write:packages`
3. Paste into the GitHub Action Secret `GHCR_TOKEN` (see above)


## First Pipeline Run

By now all tokens should be provided or their corresponding workflow jobs commented out.  We are going to assume that Synk and SonarCloud tokens have not been obtained yet, so they are being commented out.

1. Create a new branch and switch to that branch

- Comment out the Snyk and SonarCloud part of the `.github/workflows/pr_open.yml` file as those need additional access tokens that need to apply for. Also, comment out the SonarCloud part in the `.github/workflows/main.yml` as well.

- Update the “Log in to the Container registry” step in the `.github/workflows/pr_open.yml` file, and update the username to be `${{ secrets.GHCR_USERNAME }}`, and password to be `${{ secrets.GHCR_TOKEN }}`

- Try to create a pull request and watch the pipeline running

- If all steps passed, you should be able to access the web page. 
    The host, service and route section are defined in the `.github/pipeline/deploy.yml` file. 
    You could also access the web page through OpenShift topology as follows:
    ![image](https://user-images.githubusercontent.com/77364706/155819645-23b66bfc-0a83-45d2-a1c6-8742a784a391.png)

When merging the pull request, the jobs in the pr_close file will do the cleanup  


### Branch Protection

This is required to prevent direct pushes and merges to the default branch.  One full pipeline run must be completed before Make sure that `main` is the default branch.

From GitHub:
1. Select Settings (gear, top right) -> Branches (under Code and Automation)
2. Click `Add Rule` or edit an existing rule
3. Under `Protect matching branches` specify the following:
    - Branch name pattern: `main`
    - `[check] Require a pull request before merging`
        - `[check] Require approvals` (default = 1)
        - `[check] Dismiss stale pull request approvals when new commits are pushed`
        - `[check] Require review from Code Owners`
    - `[check] Require status checks to pass before merging`
        - `[check] Require branches to be up to date before merging`
        - `Status checks that are required` requires to the search box to select:
            - `Build`
            - `Check`
            - `CodeQL`
            - `Deploy`
            - `Tests`
            - `Zap`
            - `Snyk` (optional)
            - `SonarCloud` (optional)
    - `[check] Require conversation resolution before merging`
    - `[check] Include administrators` (optional)


## **Troubleshooting**:

- If failed to get authentication at the build docker image stage, check if updated to use the secrets [GHCR token and username](https://github.com/marketplace/actions/docker-build-push-action), the default GitHub token might not work
- If failed to authenticate to openshfit at the deploy stage, check if the service account “pipeline” has the right ability to get project and do deploy

## **Additional settings**:

- Add branch protection rule, for example adding one for “main” branch:    

        Select repo settings -> branches -> add rule, select first 2, and for the 2nd one, add “TESTS” so it requires to pass the GitHub Actions tests step. You         could customize it based on your needs.

- Set auto delete merged branch:    

    Select repo settings -> general, check “Automatically delete head branches” 

- Add team members to the repositroy:  
  
    Select repo settings -> collaborators and teams

- To check the image registry:  

    You could see a list of images within bcgov organization -> select packages -> search greenfield-template.   



**Note**: This greenfield-template repo provides a basic template to start up a new project. It needs to be customized based on the project, for example, run tests for a different language and what secrets to be cleaned up in the cleanup stage or so.
