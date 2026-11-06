# Miri Housing Guide — Project Specification

## 1. Project Overview

Miri Housing Guide is a public information portal that consolidates government housing schemes and housing assistance information relevant to residents of Miri, Sarawak.

The website aims to make fragmented government housing information easier to discover, understand, and access.

The project is also intended to demonstrate modern full-stack development, automated data collection, serverless architecture, and AI-assisted development.

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

### Included

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

### Excluded

- Private property listings.
- Real estate marketplaces.
- Property agent services.
- Property transactions.
- Housing application submission or processing.
- Claims that the portal is an official government website.

## 5. Technology Stack

### Frontend
- React
- TypeScript
- Vite
- CSS or an appropriate styling framework
- Cloudflare Pages

### Backend
- TypeScript
- Hono
- Cloudflare Workers

### Database
- PostgreSQL
- Neon
- Cloudflare Hyperdrive

### Automated Collection
- Python
- Scrapy
- BeautifulSoup where appropriate
- GitHub Actions for scheduled execution

### Development Tools
- VS Code
- Git
- GitHub
- Codex

## 6. Core Features

### Homepage
- Introduction to the portal.
- Featured housing schemes.
- Latest announcements.
- Quick access to housing assistance.
- Search interface.

### Housing Schemes Directory
- Browse government housing schemes.
- Search schemes by name.
- Filter schemes by category or relevant criteria.
- Display scheme summaries and availability information where verified.

### Scheme Details
- Scheme description.
- Responsible government agency.
- Eligibility requirements.
- Benefits and relevant financial information.
- Application procedure.
- Required documents.
- Official application links.
- Original sources.
- Last checked and last verified timestamps.

### Announcements
- Latest government housing announcements.
- Announcement summaries.
- Publication dates.
- Related schemes.
- Original source links.
- Application deadlines where available.

### Application Guides
- Explain application processes.
- Provide links to official application portals.
- Explain common requirements and documents.
- Clearly distinguish guidance from official government instructions.

### Automated Data Collection
- Periodically check permitted sources.
- Detect new announcements and relevant changes.
- Extract structured information.
- Detect duplicate records.
- Preserve source URLs.
- Track scraping history and failures.
- Maintain change history.
- Flag important extracted changes for verification.

### Administration
- Monitor scraping execution.
- Review extraction results when necessary.
- Correct inaccurate information.
- Manage source configurations.
- View source update history.
- Track failed scraping jobs.

## 7. Data Collection Principles

- Prefer official government websites and explicitly permitted open datasets.
- Respect website terms, robots.txt, applicable access restrictions, and rate limits.
- Do not bypass CAPTCHA, authentication, or access controls.
- Do not automatically scrape Facebook without appropriate authorization.
- Preserve original source URLs.
- Record when information was collected.
- Avoid collecting personal or sensitive applicant information.
- Do not publish AI-generated eligibility requirements or deadlines without appropriate verification.
- Clearly distinguish automatically collected, verified, and potentially outdated information.

## 8. Architecture

### Frontend
React communicates with the backend using HTTP requests and JSON responses.

### Backend
Hono provides REST API endpoints for retrieving housing schemes, announcements, guides, and source information.

### Database
PostgreSQL stores structured information, source metadata, announcements, schemes, and scraping history.

### Scraper
Python independently collects information from approved sources and writes structured records into PostgreSQL.

### Scheduling
GitHub Actions executes scraping jobs periodically.

### Deployment
- Frontend: Cloudflare Pages.
- API: Cloudflare Workers.
- Database: Neon PostgreSQL.
- Scraper: GitHub Actions.

## 9. Development Roadmap

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

## 10. Development Principles
## 10. Development Principles

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