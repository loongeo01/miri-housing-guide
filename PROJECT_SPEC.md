# Miri Housing Guide — Project Specification

## 1. Project Overview

Miri Housing Guide is a public information portal that consolidates government housing schemes and housing assistance information relevant to residents of Miri, Sarawak.

The website aims to make fragmented government housing information easier to discover, understand, and access.

The project also demonstrates modern full-stack development, automated data collection, serverless architecture, and AI-assisted development.

The portal is an independent information resource and must not present itself as an official government website.

## 2. Objectives

- Centralize information about government housing schemes and assistance relevant to Miri.
- Make housing eligibility, application procedures, and requirements easier to understand.
- Automatically collect new announcements and updates from permitted government sources.
- Preserve source links and information provenance.
- Provide a searchable and accessible information portal.
- Demonstrate a practical, maintainable software architecture.

## 3. Target Users

- Miri residents looking for affordable housing.
- Individuals searching for government housing assistance.
- Applicants looking for eligibility requirements and application instructions.
- Residents interested in housing announcements and government programmes.

## 4. Project Scope

### 4.1 Included

- Government housing scheme directory.
- Housing scheme information pages.
- Housing assistance information.
- Application guides.
- Government housing announcements.
- Document and application form links.
- Search and filtering.
- Automated information collection.
- Source attribution and update timestamps.
- Scraping monitoring and administration.
- Potential AI-powered housing information assistant.

### 4.2 Excluded

- Private property listings.
- Real estate marketplaces.
- Property agent services.
- Property transactions.
- Housing application submission or processing.
- Claims that the portal is an official government website.

The portal provides information and links to responsible agencies; it does not make decisions on behalf of those agencies or submit applications for users.

## 5. Technology Stack

### 5.1 Frontend

- React
- TypeScript
- Vite
- CSS or an appropriate styling framework
- Cloudflare Pages

### 5.2 Backend

- TypeScript
- Hono
- Cloudflare Workers

### 5.3 Database

- PostgreSQL
- Neon
- Cloudflare Hyperdrive

### 5.4 Automated Collection

- Python
- Scrapy
- BeautifulSoup where appropriate
- GitHub Actions for scheduled execution

### 5.5 Development Tools

- VS Code
- Git
- GitHub
- Codex

The stack describes the intended architecture. Check the repository's actual configuration before assuming a service, package, or deployment is already set up.

## 6. Core Features

### 6.1 Homepage

- Introduction to the portal.
- Featured housing schemes.
- Latest announcements.
- Quick access to housing assistance.
- Search interface.
- Clear notice that the portal is independent and not an official government website.

### 6.2 Housing Schemes Directory

- Browse government housing schemes.
- Search schemes by name.
- Filter schemes by category or relevant criteria.
- Display scheme summaries and availability information where verified.
- Clearly distinguish unknown or unconfirmed availability from confirmed open or closed application periods.

### 6.3 Scheme Details

- Scheme description.
- Responsible government agency.
- Eligibility requirements.
- Benefits and relevant financial information.
- Application procedure.
- Required documents.
- Official application links.
- Original sources.
- Last checked and last verified timestamps where applicable.
- Clear indication of incomplete, unverified, or potentially outdated information.

### 6.4 Announcements

- Latest government housing announcements.
- Announcement summaries.
- Publication dates.
- Related schemes.
- Original source links.
- Application deadlines where available and supported by sources.
- Clear distinction between source publication dates and collection dates.

### 6.5 Application Guides

- Explain application processes.
- Provide links to official application portals.
- Explain common requirements and documents.
- Clearly distinguish guidance from official government instructions.
- Encourage users to confirm current requirements with the responsible agency.

### 6.6 Automated Data Collection

- Periodically check permitted sources.
- Detect new announcements and relevant changes.
- Extract structured information.
- Detect duplicate records.
- Preserve source URLs.
- Track scraping history and failures.
- Maintain change history.
- Flag important extracted changes for verification.

Automated extraction must not silently turn uncertain or inferred information into verified facts.

### 6.7 Administration

- Monitor scraping execution.
- Review extraction results when necessary.
- Correct inaccurate information.
- Manage source configurations.
- View source update history.
- Track failed scraping jobs.
- Review important changes before publication where appropriate.

## 7. Data Collection Principles

- Prefer official government websites and explicitly permitted open datasets.
- Respect website terms, robots.txt, applicable access restrictions, and rate limits.
- Do not bypass CAPTCHA, authentication, or access controls.
- Do not automatically scrape Facebook without appropriate authorization.
- Preserve original source URLs.
- Record when information was collected.
- Avoid collecting personal or sensitive applicant information.
- Do not publish AI-generated eligibility requirements or deadlines without appropriate verification.
- Clearly distinguish automatically collected, reviewed, verified, and potentially outdated information.
- Handle conflicting information between sources explicitly rather than silently selecting an unsupported answer.

## 8. Data Quality and Verification

### 8.1 Provenance

For relevant records, preserve:

- Original source URL.
- Source name or responsible agency.
- Collection timestamp.
- Publication date when available.
- Verification timestamp when verified.
- Relevant extraction or review status.

Collection time and verification time are different and must not be treated as interchangeable.

### 8.2 Verification

- Important eligibility requirements, deadlines, income limits, application procedures, and benefits must be supported by reliable sources.
- Flag significant changes to high-impact information for verification before publication.
- Do not infer that a scheme is closed, unavailable, or ineligible merely because information is missing.
- Clearly label incomplete, unconfirmed, or potentially outdated information.
- Record or preserve important historical changes where practical.
- Surface conflicting information for review.

### 8.3 Publication

- Separate collected information from information approved for publication where the feature and risk warrant it.
- Do not automatically publish unverified high-impact changes as confirmed facts.
- Preserve attribution when presenting summaries or extracted information.
- Provide users with links to the original source so they can confirm details with the responsible agency.

The initial MVP may use a simpler review process, provided uncertainty and verification status remain clear.

## 9. Architecture

### 9.1 Frontend

React communicates with the backend using HTTP requests and JSON responses.

The frontend is responsible for presenting scheme information, announcements, application guides, search, and filtering.

### 9.2 Backend

Hono provides REST API endpoints for retrieving housing schemes, announcements, guides, and source information.

The backend validates requests, applies appropriate access controls, and handles database interactions.

### 9.3 Database

PostgreSQL stores structured information, source metadata, announcements, schemes, and scraping history.

### 9.4 Scraper

Python independently collects information from approved sources and writes structured records into PostgreSQL through an appropriately authorized connection or ingestion mechanism.

The scraper must not bypass source access restrictions or silently publish uncertain information.

### 9.5 Scheduling

GitHub Actions executes scraping jobs periodically.

Scheduled workflows should use appropriately scoped credentials and avoid exposing secrets in logs or artifacts.

### 9.6 Deployment

- Frontend: Cloudflare Pages.
- API: Cloudflare Workers.
- Database: Neon PostgreSQL.
- Scraper: GitHub Actions.

## 10. Security and Privacy

- Keep database credentials and API secrets in appropriate server-side secret stores.
- Never expose database credentials or private environment variables to frontend applications.
- Restrict database access to authorized services.
- Use least-privilege credentials for backend and scraping services.
- Protect administrative endpoints with authentication and authorization.
- Validate API inputs and handle errors appropriately.
- Apply reasonable rate limits to public endpoints where appropriate.
- Avoid collecting personal applicant information.
- Do not store real applicant documents or sensitive personal information.
- Avoid exposing internal errors, credentials, or database details in public API responses.
- Use HTTPS for deployed services.
- Review security implications before introducing AI features, external integrations, or administrative functionality.

## 11. Testing and Quality

### 11.1 General

- Test important functionality and business logic.
- Include relevant edge cases, invalid inputs, and failure scenarios.
- Do not consider a feature complete merely because it compiles or appears functional.
- Keep tests meaningful and aligned with intended behavior.

### 11.2 Frontend

Potential testing tools:

- Vitest for unit tests.
- React Testing Library for component tests.
- Playwright for end-to-end browser tests.

### 11.3 Backend

- Unit tests for business logic and validation.
- Integration tests for API endpoints.
- Tests for database interactions and error handling where appropriate.

### 11.4 Scrapers

- Unit tests for extraction and parsing logic.
- Fixtures containing representative source HTML.
- Tests for missing fields, malformed content, and unexpected page changes.
- Tests for duplicate detection.

### 11.5 Continuous Integration

Where configured, automated checks should include:

- Type checking.
- Linting.
- Automated tests.
- Production builds.
- Dependency vulnerability checks.

The project may introduce these tools incrementally. Do not add a large testing infrastructure before it provides value to the current stage of development.

## 12. Feature Acceptance Criteria

Significant features should have explicit acceptance criteria before implementation.

Acceptance criteria should describe, where relevant:

- Expected functionality.
- Behavior for invalid or missing inputs.
- Error and failure scenarios.
- Security and privacy requirements.
- Accessibility requirements.
- Testing and verification requirements.
- Conditions under which the feature is considered complete.

Features should be implemented incrementally and verified against their acceptance criteria.

## 13. Development Roadmap

### Phase 1: Frontend Foundation

- Initialize React and TypeScript.
- Establish project structure.
- Create navigation and homepage.
- Implement responsive layouts.
- Create reusable components.

### Phase 2: Core Information Pages

- Scheme directory.
- Scheme details.
- Announcements.
- Application guides.
- Search and filtering.

### Phase 3: Backend and Database

- Initialize Hono API.
- Configure PostgreSQL.
- Implement database schema.
- Create API endpoints.
- Connect frontend to backend.

### Phase 4: Automated Collection

- Identify permitted sources.
- Develop source-specific scrapers.
- Implement data extraction.
- Implement duplicate detection.
- Add scheduled scraping.
- Add monitoring and change tracking.

### Phase 5: Deployment

- Deploy frontend.
- Deploy API.
- Configure database connectivity.
- Configure automated scraping.
- Test production environment.

### Phase 6: Advanced Features

- AI housing assistant using source-grounded information.
- AI-generated announcement summaries.
- Eligibility checker using explicit rules.
- Scheme comparison.
- Update notifications.

Advanced features must preserve the project's information accuracy, privacy, and security principles.

## 14. Development Principles

- Implement features incrementally.
- Prefer simple, maintainable solutions.
- Avoid unnecessary dependencies.
- Keep frontend, backend, and scraping responsibilities separate.
- Preserve data provenance.
- Validate inputs and handle errors appropriately.
- Never expose secrets in frontend code or Git repositories.
- Test important functionality.
- Prioritize correctness over automatic publication.
- Keep the initial MVP manageable.
- Clearly communicate uncertainty and limitations.
- Do not expand the project into a property marketplace or application-processing platform.
