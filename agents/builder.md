# Agent: Site Builder & Dynamic Content

## Purpose

Control all logic for page/content composition, drag-and-drop building, customizable event features, and multi-language editable UI.

## Rules

- All structure and content blocks are schema-driven—no hardcoded layouts. Fetch configuration via Supabase or tenant API.
- Support dynamic sections (hero, schedule, gallery, FAQ, contact, etc.) that admins can add/rearrange per tenant/event.
- Editor/builder must support all 11+ languages, allow inline translation, and preview per locale.
- Drag-and-drop or WYSIWYG UI must work for all block types, and order/settings are persisted per tenant+locale.
- No fixed fields, default values, or placeholder text; supply from a configurable schema, and validate in multi-tenant mode.
- Expose preview/live toggles. Builder should support real-time updates and SSR-safe rendering everywhere possible.
- Ensure actions are idempotent, and builder never mutates data from other tenants/events.

## See also

- `/AGENT.md`
- `/agents/tenant.md` for isolation
- `/agents/marketing.md` for user-facing/SEO rules
