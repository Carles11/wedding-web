/**
 * JSON-LD structured data component
 * Renders schema.org markup for SEO.
 *
 * Usage:
 * - Use this component to inject structured data (JSON-LD) into any page.
 * - Pass a schema.org object as the 'data' prop.
 * - For tenant pages, use this to inject tenant-specific schemas (e.g., WebSite, Organization, Event).
 * - For marketing/global layout, inject schemas directly in layout (avoid duplication).
 * - Do NOT inject the same schema twice on the same page (e.g., WebSite in both layout and page).
 *
 * Example:
 * <JsonLd data={{ ...schemaObject }} />
 */
export function JsonLd({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
