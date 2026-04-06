# Agent: Tenant Isolation & Multi-Tenancy

## Purpose

Ensure absolute separation of data and logic between all tenants and events. Enforce SaaS scalability.

## Rules

- Every database query, API call, subscription, and component prop must include a unique `site_id` or `customer_id`.
- Never assume or default any couple/event/user; always require passing the IDs.
- All authentication, roles, and admin/public permissions must be tenant-scoped.
- No resources, configurations, translations, or assets should reference a single site/event unless fetched per tenant.
- Onboarding flows, domain logic, and site builder UX must not leak, default, or favor a particular customer.
- Tenant/site switching and previewing must be isolated and not cross-pollute session state.
- When editing, copying, or exporting data, always validate tenant boundaries.
- Do not reuse or cache example data. All seed/demo content must be generated per tenant and easily purged.
- Backend and frontend checks: never allow queries without tenant scope filters.

## See also

- `/AGENT.md`
- `/agents/builder.md` for builder-specific rules
