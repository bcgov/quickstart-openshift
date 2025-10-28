# Spec-Driven Development Workflow Guide

This guide explains how to use the specification-driven development approach in this repository.

## Overview

Spec-driven development separates the "what" (specifications) from the "how" (implementation), making it easier for AI coding agents to understand and implement requirements correctly.

## Workflow Steps

### 1. Create Specification (`/spec` command)
Use the `/spec` command to create a new specification:

```
/spec Create a specification for [feature/requirement description]
```

**Example:**
```
/spec Create a specification for user authentication with IDIR integration
```

### 2. Generate Technical Plan (`/plan` command)
Use the `/plan` command to create a technical implementation plan:

```
/plan Create technical implementation plan for [specification name]
```

**Example:**
```
/plan Create technical implementation plan for user authentication specification
```

### 3. Break Down into Tasks (`/tasks` command)
Use the `/tasks` command to create actionable development tasks:

```
/tasks Break down [specification name] into specific development tasks
```

**Example:**
```
/tasks Break down user authentication specification into specific development tasks
```

### 4. Implement with AI Assistance
Use the generated tasks to guide AI-assisted development:
- Reference the specification for context
- Follow the technical plan for architecture decisions
- Complete tasks incrementally with validation

## Specification Structure

All specifications should follow this structure:

1. **Overview** - High-level description and purpose
2. **Goals** - Clear, measurable objectives
3. **Requirements** - Functional, technical, and non-functional requirements
4. **Implementation Plan** - Phased approach with specific steps
5. **Success Criteria** - Measurable outcomes and validation
6. **Notes** - Additional context and considerations

## Directory Organization

```
specs/
├── README.md                 # This file
├── workflow-guide.md         # Workflow instructions
├── architecture/            # System architecture specs
├── development/             # Development practices specs
├── features/                # Feature specifications
├── security/                # Security and compliance specs
└── templates/               # Specification templates
```

## Best Practices

### Writing Specifications
- **Be specific**: Avoid vague requirements
- **Include context**: Explain the "why" behind decisions
- **Provide examples**: Include code samples and configurations
- **Define success**: Clear criteria for completion
- **Consider constraints**: Include technical and business limitations

### Using AI Commands
- **Start broad**: Use `/spec` for high-level requirements
- **Get specific**: Use `/plan` for technical details
- **Break it down**: Use `/tasks` for actionable items
- **Iterate**: Update specifications as you learn more

### Maintaining Specifications
- **Keep current**: Update specs as requirements change
- **Version control**: Track changes to specifications
- **Validate regularly**: Ensure specs match implementation
- **Document decisions**: Record architectural choices

## Examples

### Feature Development
1. `/spec` - Create user management feature specification
2. `/plan` - Generate technical plan for user management
3. `/tasks` - Break down into development tasks
4. Implement using AI assistance

### Infrastructure Changes
1. `/spec` - Create database migration specification
2. `/plan` - Generate technical plan for migration
3. `/tasks` - Break down into migration tasks
4. Implement with validation checkpoints

### Tooling Updates
1. `/spec` - Create ESLint migration specification (already done!)
2. `/plan` - Generate technical plan for migration
3. `/tasks` - Break down into migration tasks
4. Implement with testing at each phase

## Getting Started

1. **Choose a specification** from existing specs or create a new one
2. **Use the workflow** to generate plans and tasks
3. **Implement incrementally** with AI assistance
4. **Validate progress** against success criteria
5. **Update specifications** as you learn more

## Support

For questions about spec-driven development:
- Review the [GitHub Spec Kit documentation](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
- Check existing specifications for examples
- Use the templates for consistent structure
