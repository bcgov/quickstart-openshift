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


## Create a Repository

The following steps show how to create a new repository and application using this repo as a template.

- Create a new repository using the Greenfield template and grant access the Codecov marketplace application:

    ![image](https://user-images.githubusercontent.com/77364706/155819028-0096d3ae-d08a-44f4-b0d4-203029b46449.png)

  
- Add a new environment variable “dev” to the repository through Settings -> Environments, with the following secrets:  
    ```
    ENV: dev

    NAMESPACE: 245e18-dev (this is a shared namespace for learning purpose, and for real project should use a real namespace)

    OC_TOKEN: get from openshift namespace -> administer view -> user management -> service account -> pipeline token (use the deployer token here for this specific 245e18-dev namespace, normally should use the pipeline token, and they are auto generated by the namespace)
    ```
    
- Add following Repository Secrets through Settings -> Secrets -> Actions:  
    ```
    OC_SERVER:  OpenShift cluster URL

    GHCR_TOKEN: Personal GitHub access token generated through Settings -> Developer settings -> Personal access tokens with the following scopes:
                ![image](https://user-images.githubusercontent.com/77364706/155819254-988e3a8c-6812-4ecd-89ec-fbc4175b6eb7.png)

    GHCR_USERNAME: GitHub username
    ```

- Create a new branch and switch to that branch

- Comment out the Snyk and SonarCloud part of the `.github/workflows/pr_open.yml` file as those need additional access tokens that need to apply for. Also, comment out the SonarCloud part in the `.github/workflows/main.yml` as well.

- Update the “Log in to the Container registry” step in the `.github/workflows/pr_open.yml` file, and update the username to be `${{ secrets.GHCR_USERNAME }}`, and password to be `${{ secrets.GHCR_TOKEN }}`

- Try to create a pull request and watch the pipeline running

- If all steps passed, you should be able to access the web page. 
    The host, service and route section are defined in the `.github/pipeline/deploy.yml` file. 
    You could also access the web page through OpenShift topology as follows:
    ![image](https://user-images.githubusercontent.com/77364706/155819645-23b66bfc-0a83-45d2-a1c6-8742a784a391.png)

When merging the pull request, the jobs in the pr_close file will do the cleanup  

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
