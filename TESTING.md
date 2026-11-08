# Testing and Verification Guide

This document defines practical testing and verification conventions for Miri Housing Guide.

It complements `AGENTS.md` and `PROJECT_SPEC.md`. It does not require every testing tool to be installed immediately; adopt the relevant checks as each part of the project is implemented.

## 1. Goals

- Verify that features behave according to their requirements.
- Catch regressions before changes are merged or deployed.
- Check edge cases, invalid input, and failure behavior.
- Preserve the integrity of existing tests.
- Make verification results transparent and reproducible.

Passing tests is evidence of correctness, not a guarantee. Tests must reflect requirements, and important changes still need review.

## 2. Testing Layers

Use the smallest test layer that meaningfully verifies behavior. Add broader tests when integration or user flows are affected.

### Unit tests

Test isolated functions and business logic, such as:

- Eligibility calculations based on explicit, documented rules.
- Input validation and normalization.
- Search/filter logic.
- Date and status formatting.
- Scraper parsing and extraction functions.
- Duplicate detection and change comparison.

Unit tests should be fast, deterministic, and independent of live external services where practical.

### Component tests

Test React components and user interactions, including:

- Rendering expected content.
- Empty, loading, and error states.
- Search and filtering interactions.
- Accessible labels and keyboard interaction where relevant.
- Handling missing or incomplete scheme data.

Prefer testing observable behavior rather than implementation details.

### Integration tests

Verify that components or services work together:

- API routes and request validation.
- Backend/database interactions.
- Data serialization and response formats.
- Scraper ingestion and persistence.
- Error handling across service boundaries.

Use a test database or isolated test fixtures. Do not run tests against production data.

### End-to-end tests

Use browser-based tests for important user journeys, for example:

- Open the schemes directory.
- Search for a scheme.
- Apply a filter.
- Open scheme details.
- Follow an application/source link.
- Verify announcements and empty states.

Keep E2E tests focused on critical flows; avoid making every small behavior depend on a browser test.

## 3. Suggested Tooling

Choose tools that fit the actual repository configuration. These are recommendations, not assumptions that the packages are already installed.

| Area | Suggested tool | Purpose |
|---|---|---|
| Frontend unit/component tests | Vitest | Run JavaScript/TypeScript tests |
| React component tests | React Testing Library | Test UI behavior |
| Browser/E2E tests | Playwright | Verify user journeys in a browser |
| Type checking | TypeScript compiler | Detect type errors |
| Linting | ESLint | Detect common mistakes and enforce conventions |
| Backend tests | Vitest or a suitable test runner | Test Hono handlers and logic |
| Scraper tests | pytest | Test Python extraction and processing |
| Security checks | npm audit and/or an appropriate scanner | Identify known dependency/security issues |
| CI | GitHub Actions | Run repeatable checks automatically |

Do not add every tool at once. Introduce tools when there is code or a feature that benefits from them.

## 4. Test Data and Fixtures

- Use synthetic or anonymized data; never use real applicant documents or sensitive personal information.
- Keep representative HTML fixtures for scraper tests.
- Include normal, incomplete, malformed, and changed source-page examples.
- Avoid relying on live government websites for ordinary unit tests.
- Do not place credentials, tokens, or private connection strings in fixtures.
- Make fixtures clearly identifiable as test data.

## 5. Housing Information and Scraper Tests

Scraper and publication-related tests should check that:

- Source URLs and collection timestamps are preserved.
- Missing fields remain missing rather than being invented.
- Parsing failures are surfaced rather than silently producing misleading records.
- Duplicate records are detected according to the intended rules.
- Important changes can be detected and flagged.
- Extracted values are not automatically treated as verified facts.
- Publication status and verification status are not accidentally conflated.
- Conflicting or ambiguous source information is handled explicitly.

Tests should verify the implemented rules, not assert that a source's current content is always correct.

## 6. API and Security Tests

Where relevant, verify that:

- Invalid request data is rejected appropriately.
- Responses use expected status codes and schemas.
- Error responses do not expose stack traces, secrets, or database details.
- Protected administrative endpoints reject unauthenticated or unauthorized requests.
- SQL operations use parameterized values.
- Rate limiting and other controls behave as intended if implemented.
- Unexpected external input does not cause unsafe HTML rendering or injection.

Security tests must run in an isolated environment and must not target production systems without explicit authorization.

## 7. Local Verification Workflow

Before starting, inspect the repository and identify the commands actually configured in its package scripts, Python environment, and CI workflows.

For a frontend change, a typical verification sequence may be:

1. Run relevant unit/component tests.
2. Run TypeScript type checking.
3. Run linting.
4. Run the production build.
5. Run relevant E2E tests if user-facing flows changed.
6. Inspect the Git diff.

For a backend change:

1. Run unit tests.
2. Run API/integration tests as appropriate.
3. Run type checking and linting.
4. Verify request validation and error handling.
5. Inspect the Git diff.

For a scraper change:

1. Run parser/extraction unit tests against fixtures.
2. Test missing, malformed, and changed source content.
3. Verify provenance and timestamps.
4. Verify duplicate/change detection.
5. Confirm no live source or production database is modified unintentionally.
6. Inspect the Git diff.

Do not copy commands blindly. Use the scripts and configuration present in the repository.

## 8. Test-Driven Development

For important logic and bug fixes, use TDD when practical:

1. Identify the expected behavior and acceptance criteria.
2. Write a test that captures the behavior.
3. Run it and confirm it fails for the intended reason.
4. Implement the smallest change that makes it pass.
5. Run the test again.
6. Run related regression tests.
7. Refactor only while keeping tests passing.

For UI work or exploratory prototypes, tests may be written after an initial implementation when that is more practical. Explain meaningful deviations for critical logic.

## 9. Test Integrity Rules

- Do not delete or skip tests to hide a failure.
- Do not weaken assertions merely to make implementation pass.
- Do not mock the exact behavior a test is supposed to verify.
- Do not change test configuration or coverage thresholds to conceal regressions.
- Update expectations only when requirements or intended behavior legitimately change.
- Explain significant changes to existing tests.
- A test that passes without exercising the relevant behavior is not sufficient verification.

## 10. Continuous Integration

As the project matures, use GitHub Actions to run relevant checks on pushes and pull requests.

Recommended checks, as applicable:

- Dependency installation using the lockfile.
- Type checking.
- Linting.
- Unit/component tests.
- Production build.
- Scraper tests.
- Integration/E2E tests for important changes.
- Dependency vulnerability checks.

Protect the main branch with required status checks when the workflow is stable. Pin third-party GitHub Actions to reviewed commit SHAs where practical, and review workflow permission scopes.

CI should not deploy to production automatically unless that behavior is intentionally configured and approved.

## 11. AI Agent Verification Checklist

Before an agent reports a task complete, it should:

- [ ] Identify the behavior changed and its acceptance criteria.
- [ ] Add or update meaningful tests where appropriate.
- [ ] Run relevant tests and report actual results.
- [ ] Run type checking, linting, and build checks when configured and relevant.
- [ ] Run integration/E2E checks when the change warrants them.
- [ ] Investigate failures rather than bypassing them.
- [ ] Inspect the complete Git diff.
- [ ] Check for unrelated changes, exposed secrets, and unsafe patterns.
- [ ] State checks that were not run and why.
- [ ] Report residual risks or limitations.

## 12. Completion Report Template

Agents may use this format in their final response:

### Summary
- What changed and why.

### Files changed
- List the files and their purpose.

### Verification
- `command` — passed / failed / not run, with a brief explanation.

### Notes
- Assumptions, limitations, risks, or follow-up work.

Never claim that a command passed unless it was actually executed and its result observed.
