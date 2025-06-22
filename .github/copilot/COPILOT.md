# GitHub Copilot Team Directives

## Overview

This document outlines our team's guidelines for using GitHub Copilot in the quickstart-openshift project. These directives help ensure consistent and secure code generation across the team.

## Configuration

We maintain standardized VS Code settings for Copilot in `.vscode/settings.json`. This ensures consistent behavior across the team:

- Enabled for all code files
- Disabled for plaintext and markdown to prevent accidental data leaks
- Using standard VS Code Copilot integration

## Best Practices

1. **Code Review**
   - Always review Copilot-generated code for correctness
   - Verify security implications of suggested code
   - Check for BC Government compliance and standards

2. **Security**
   - Never accept credentials or secrets from Copilot suggestions
   - Validate any external dependencies or imports
   - Follow project security guidelines in SECURITY.md

3. **Style & Standards**
   - Ensure generated code follows our existing patterns
   - Maintain consistency with our ESLint and TypeScript configurations
   - Follow the project structure in backend/ and frontend/

4. **Testing**
   - Write tests for Copilot-generated code
   - Verify test coverage meets project standards
   - Ensure e2e tests pass after additions

## Language-Specific Guidelines

### TypeScript/JavaScript
- Verify type safety in generated code
- Follow our component patterns in frontend/
- Maintain NestJS patterns in backend/

### SQL
- Review all generated queries for security
- Follow our migration patterns in migrations/
- Test queries with sample data

## Updating These Guidelines

These guidelines should evolve with our project. To suggest changes:
1. Open a PR with your proposed updates
2. Provide context for why the change is needed
3. Get team review and approval
