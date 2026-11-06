# AGENTS.md

## Project Context

This repository contains Miri Housing Guide, a public information portal for government housing schemes and housing assistance relevant to Miri, Sarawak.

Read PROJECT_SPEC.md before implementing major features.

## Technology Stack

- React
- TypeScript
- Vite
- Hono
- Cloudflare Workers
- PostgreSQL
- Neon
- Cloudflare Hyperdrive
- Python
- Scrapy

## Coding Guidelines

- Use TypeScript for frontend and backend code.
- Prefer clear, maintainable, modular implementations.
- Avoid unnecessary dependencies.
- Use descriptive names.
- Keep components reasonably small and focused.
- Handle errors explicitly.
- Validate user inputs.
- Use parameterized database queries.
- Never expose secrets or credentials.
- Do not hardcode sensitive configuration.
- Avoid unnecessary abstractions.

## Agent Workflow

Before implementing a feature:

1. Inspect the existing project structure.
2. Identify relevant files.
3. Explain the proposed implementation briefly.
4. Implement only the requested scope.
5. Run relevant checks.
6. Report files changed and commands executed.
7. Explain important implementation decisions.

Do not unnecessarily rewrite existing working code.

Do not implement unrelated features without approval.

Ask for clarification when requirements are ambiguous or architectural decisions would significantly affect the project.

## Learning Objective

The developer is learning agentic coding and full-stack development.

When implementing significant features:

- Explain important concepts.
- Explain unfamiliar dependencies.
- Identify relevant architectural decisions.
- Avoid hiding complexity behind unnecessary abstractions.
- Prefer understandable code over overly clever implementations.

## Project Constraints

- This is an information portal, not a property marketplace.
- Use permitted government information sources.
- Preserve source URLs and collection timestamps.
- Do not scrape Facebook without authorization.
- Do not silently publish uncertain eligibility requirements or deadlines.
- Avoid collecting personal applicant information.

## Git

- Do not commit changes unless explicitly requested.
- Keep changes focused.
- Do not modify unrelated files.
- Never overwrite user changes without permission.