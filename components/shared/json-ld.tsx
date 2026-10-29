/**
 * Renders a structured-data block. Pair with `buildPageSchema()` from lib/seo
 * so pages don't hand-roll the <script type="application/ld+json"> incantation.
 *
 * `JSON.stringify` alone is not safe inside a <script> tag: a CMS value that
 * contains "</script>" would close the block early and let the rest run as
 * HTML/JS. Replacing every "<" with its JSON unicode escape (backslash, u, 003c)
 * keeps the payload identical to any JSON parser while making it impossible
 * to break out of the tag.
 */
export function JsonLd({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
