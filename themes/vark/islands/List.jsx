import { forwardRef } from 'react';
import { List as MantineList } from '@mantine/core';
import { tablerGlyph } from '@aardvark/islands/tabler-icons';

// The island behind the built-in {% list %} tag
// (list.md). Mantine's List is a compound component (List + MantineList.Item) and its
// `icon` is a React node, so — like the other compound builtins (Stepper, List's Table
// sibling) — the mapping of plain data to the MantineList.Item tree lives here rather
// than in the .md wrapper.
//
// `items` is an array of inline-HTML strings (the macro pre-renders each item's inline
// Markdown), one per MantineList.Item. An optional `icon` (Tabler name) replaces the bullet on
// every item with the lazily-loaded glyph the {% card %} / {% icon %} builtins use. Every
// other prop (type, withPadding, spacing, size, center, the Mantine style system, …)
// flows straight through to <MantineList> via {...rest}, so the full List API stays available.

const List = forwardRef(function List(
  { items, icon, iconCdn, children, ...rest },
  ref,
) {
  const rows = Array.isArray(items) ? items : [];
  const itemIcon = tablerGlyph(icon, iconCdn, 'aardvark-list-glyph');
  return (
    <MantineList ref={ref} icon={itemIcon} {...rest}>
      {rows.map((html, i) => (
        // Each item is pre-rendered inline HTML from the macro (trusted build-time
        // template output), injected so **bold** / `code` / [links] inside an item format.
        <MantineList.Item key={i}>
          <span dangerouslySetInnerHTML={{ __html: html }} />
        </MantineList.Item>
      ))}
      {children}
    </MantineList>
  );
});

export default List;
