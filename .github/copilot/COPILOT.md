# 🤖 GitHub Copilot Team Guidelines

## 📋 Overview

This document outlines guidelines for using GitHub Copilot in the quickstart-openshift project. These directives help ensure consistent and secure code generation across the team.

## 🎯 Core Principles
1. **DRY** - Don't Repeat Yourself
   - Let Copilot suggest, but verify the logic
   - Reuse existing patterns in the codebase
   - Preserve valuable domain knowledge in comments

2. **Clean Code**
   - Follow existing formatting (2 spaces)
   - Use meaningful variable names
   - Break down complex functions
   - Maintain or improve existing documentation

## ⚡ Best Practices

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

5. **Documentation Quality**
   - Double-check Markdown formatting after Copilot suggestions
   - Watch for common issues:
     - Corrupted headers from merged text
     - Broken emoji characters
     - Unintended duplicated sections
     - Inconsistent list formatting
   - Verify documentation renders correctly before committing
   - Use `git diff --color --unified=3` for better doc change review
   - Preserve existing documentation structure and tone

## 🚫 Never Allow Copilot To
- Generate sensitive data or secrets
- Create duplicate files
- Modify source when fixing tests
- Add conflicting dependencies
- Bypass security checks
- Generate non-compliant code
- Remove existing documentation or comments
- Discard domain-specific logic without review
- Override carefully crafted error handling

## ⚙️ Configuration

We maintain standardized VS Code settings in `.vscode/settings.json`. This ensures consistent behavior across the team:

- Enabled for all code and documentation files
- Disabled for plaintext log files and raw data files to prevent accidental data leaks
- Using standard VS Code Copilot integration
- Configured for optimal suggestion relevance

Note: Copilot is especially helpful for maintaining consistent documentation in:
- README.md files
- API documentation
- Deployment guides
- Contributing guidelines
- Architectural decision records (ADRs)

## 🎨 Style Guide Integration
```typescript
// Good: Let Copilot follow our patterns
interface UserDto {
  id: string;
  name: string;
}

// Bad: Mixed styles
interface user_dto {
    ID: string,
    userName: string
}
```

## 🔄 Workflow Tips & Learning Together
1. **Getting Better Suggestions**
   - Type slowly for better context-aware suggestions
   - Start with `// Test for...` to get test suggestions
   - Use `// Interface for...` for TypeScript definitions

2. **Knowledge Sharing**
   - Share useful Copilot prompts in PR comments
   - Document new patterns in this guide
   - Tag commits with `[copilot]` when AI-assisted
   - Create knowledge-sharing sessions for successful patterns

3. **Best Practices**
   - Review suggestions carefully before accepting
   - Share successful prompt patterns with the team
   - Document when Copilot helps solve complex problems

## 🔍 Project-Specific Contexts
- OpenShift deployment patterns
- BC Government design system
- React component structures
- API service patterns
- Legacy code considerations
- Domain-specific business rules
- Existing error handling patterns
- Historical workarounds (tagged with // WORKAROUND comments)

## � Language-Specific Guidelines

### TypeScript/JavaScript
- Verify type safety in generated code
- Follow our component patterns in frontend/
- Maintain NestJS patterns in backend/
```typescript
// Good: Type-safe component props
interface DashboardProps {
  userId: string;
  permissions: string[];
}

// Bad: Avoid any types
interface DashboardProps {
  data: any;
}
```

### SQL & Database
- Review all generated queries for security
- Follow our migration patterns in migrations/
- Test queries with sample data
```sql
-- Good: Parameterized query
SELECT * FROM users WHERE id = $1;

-- Bad: Never allow string concatenation
SELECT * FROM users WHERE id = ' + userId + ';
```

## 🔄 Workflow Tips
1. Start with `// Test for...` to get test suggestions
2. Use `// Interface for...` for TypeScript definitions
3. Type slowly for better context-aware suggestions

## 🎓 Learning Together
- Share useful Copilot prompts in PR comments
- Document new patterns in this guide
- Tag commits with `[copilot]` when AI-assisted
- Create knowledge-sharing sessions for successful patterns

## � Contributing to These Guidelines

Help evolve these guidelines by:
1. Opening a PR with your proposed updates
2. Including real examples of successful patterns
3. Getting team review and discussion
4. Documenting the reasoning behind changes

Remember: The best guidelines come from shared experiences! 🚀

---
Last updated: June 22, 2025
