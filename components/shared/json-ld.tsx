/**
 * Renders a structured-data block. Pair with `buildPageSchema()` from lib/seo
 * so pages don't hand-roll the <script type="application/ld+json"> incantation.
 */
export function JsonLd({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
