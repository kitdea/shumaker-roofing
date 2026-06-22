import { htmlToBlocks } from '@portabletext/block-tools'
import type { DeserializerRule } from '@portabletext/block-tools'
import type { ArraySchemaType } from '@sanity/types'
import type { ArrayOfObjectsInputProps, OnPasteFn } from 'sanity'

function randomKey(length = 12) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let key = ''
  for (let i = 0; i < length; i++) key += chars[Math.floor(Math.random() * chars.length)]
  return key
}

/**
 * Most rich-text sources (Word, Google Docs) wrap ALL clipboard content —
 * including plain paragraphs — in a layout <table>, almost always a single
 * row/column. Requiring at least 2 rows and 2 columns avoids hijacking a
 * paragraph paste into a malformed one-cell table; returning undefined here
 * falls through to block-tools' default (paragraph-preserving) handling.
 */
const tableDeserializerRule: DeserializerRule = {
  deserialize(el) {
    if (!(el instanceof HTMLElement) || el.tagName !== 'TABLE') return undefined

    const rows = Array.from(el.querySelectorAll('tr'))
      .map((tr) => ({
        _type: 'row',
        _key: randomKey(),
        cells: Array.from(tr.querySelectorAll('td, th')).map((cell) => cell.textContent?.trim() ?? ''),
      }))
      .filter((row) => row.cells.some((cell) => cell.length > 0))

    const isGenuineTable = rows.length >= 2 && rows.every((row) => row.cells.length >= 2)
    if (!isGenuineTable) return undefined

    return { _type: 'table', _key: randomKey(), rows }
  },
}

/**
 * Sanity's editor has no built-in HTML-table deserializer, so a pasted
 * spreadsheet table normally collapses into plain paragraphs. This converts
 * the FULL pasted HTML (prose and all) to blocks via block-tools — same
 * fidelity as native paste for paragraphs/headings/marks/links — while
 * intercepting genuine <table> elements and turning them into `table`
 * blocks (from @sanity/table) instead.
 */
export function createTablePasteHandler(schemaType: ArraySchemaType): OnPasteFn {
  return ({ event }) => {
    const html = event.clipboardData?.getData('text/html')
    if (!html || !/<table/i.test(html)) return undefined

    const blocks = htmlToBlocks(html, schemaType, { rules: [tableDeserializerRule] })
    if (blocks.length === 0) return undefined

    // block-tools and `sanity` each ship their own (structurally identical)
    // copy of @sanity/types, so TS sees the otherwise-compatible shapes as distinct types.
    return { insert: blocks as unknown[] } as ReturnType<OnPasteFn>
  }
}

/**
 * Wires up `createTablePasteHandler` on a block-array field's input component,
 * for use in a `defineField({ ..., components: withTablePasteInput() })`.
 */
export function withTablePasteInput() {
  return {
    input: (props: ArrayOfObjectsInputProps) =>
      props.renderDefault({
        ...props,
        // block-tools' ArraySchemaType is structurally identical but a distinct nominal type from sanity's.
        onPaste: createTablePasteHandler(props.schemaType as unknown as Parameters<typeof createTablePasteHandler>[0]),
      }),
  }
}
