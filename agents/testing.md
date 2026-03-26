# Agent: Testing & Quality Standards

## Purpose

Guarantee type-safe, production-grade test coverage and robust QA for all features, with SaaS, multilingual, and multi-tenant awareness.

## Test Frameworks & Tools

- **Unit & Integration:** [Jest](https://jestjs.io/), [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)
- **E2E & SSR:** [Playwright](https://playwright.dev/), opt-in [Cypress](https://www.cypress.io/)
- **Type:** All tests must be in TypeScript

## Test Coverage Rules

- Every entity/feature gets tests in a `__tests__` folder (per FSD layers):
  - `/src/entities/[entity]/__tests__`
  - `/src/features/[feature]/__tests__`
  - `/src/pages/__tests__`
- Shared mocks and setup in `/src/shared/testing`
- Each DB/API query must have at least basic tests for site/tenant isolation and error paths.
- Always test multi-language rendering, hreflang, and lang switching at both component and end-to-end level.
- For each new feature, write:
  - **Unit test:** logic, helpers, hooks
  - **Component test:** UI, accessibility, SSR rendering
  - **E2E:** for new page routes or critical workflows (RSVP, admin builder, etc.)
- Maintain minimum 90% coverage for all core and customer-facing code
- Critical bugfixes must include at least one new test proving the fix

## Multi-Tenancy Requirements

- Validate queries/components/isolation for at least 2 tenants per test scenario.
- No assumptions of single-tenant data or static site content—always pass in or mock different tenants.

## CI & Automation

- Tests must pass in all PRs and pre-deploys.
- E2E tests should cover a production-like environment with SSR/SEO validations.
- Coverage reports auto-generated and optionally fail builds if under target.

## See also

- `/AGENT.md` (root)
- `/agents/tenant.md` (tenant separation)
- `/agents/marketing.md` (SEO, lang)
- `/agents/builder.md` (dynamic structure)
