import { forwardRef } from 'react';
import { Table as MantineTable } from '@mantine/core';

// The island behind the built-in {% table %} tag
// (table.md). Mantine's Table is a compound component (MantineTable.Thead / Tbody / Tr / Th
// / Td), so the mapping of plain row data to that tree lives here rather than in the .md
// wrapper (same pattern as Stepper / List).
//
// `head` is an array of header-cell inline-HTML strings (one <MantineTable.Th> each); `rows` is
// an array of rows, each an array of body-cell inline-HTML strings (one <MantineTable.Td> each);
// the macro pre-renders each cell's inline Markdown. `caption` is a plain caption string.
// `stickyHeader` needs a scrollable, height-capped container to stick within, so when it's
// set the table is wrapped in a MantineTable.ScrollContainer. Every other prop (striped,
// highlightOnHover, withTableBorder, withColumnBorders, withRowBorders, captionSide,
// horizontalSpacing, verticalSpacing, the Mantine style system, …) flows straight through
// to <MantineTable> via {...rest}, so the full Table API stays available.
const Table = forwardRef(function Table(
  { head, rows, caption, captionSide, stickyHeader, stickyHeaderOffset, minWidth, maxHeight, children, ...rest },
  ref,
) {
  const header = Array.isArray(head) ? head : [];
  const body = Array.isArray(rows) ? rows : [];
  // Cells are pre-rendered inline HTML (trusted build-time template output), injected so
  // **bold** / `code` / [links] inside a cell format.
  const cell = (html) => <span dangerouslySetInnerHTML={{ __html: String(html) }} />;
  const table = (
    <MantineTable
      ref={ref}
      captionSide={captionSide || undefined}
      stickyHeader={stickyHeader || undefined}
      stickyHeaderOffset={stickyHeader ? stickyHeaderOffset : undefined}
      {...rest}
    >
      {caption ? <MantineTable.Caption>{caption}</MantineTable.Caption> : null}
      {header.length > 0 ? (
        <MantineTable.Thead>
          <MantineTable.Tr>
            {header.map((h, i) => (
              <MantineTable.Th key={i}>{cell(h)}</MantineTable.Th>
            ))}
          </MantineTable.Tr>
        </MantineTable.Thead>
      ) : null}
      <MantineTable.Tbody>
        {body.map((row, ri) => (
          <MantineTable.Tr key={ri}>
            {(Array.isArray(row) ? row : [row]).map((c, ci) => (
              <MantineTable.Td key={ci}>{cell(c)}</MantineTable.Td>
            ))}
          </MantineTable.Tr>
        ))}
        {children}
      </MantineTable.Tbody>
    </MantineTable>
  );
  // A scroll container is needed for a sticky header (which sticks within it), a minWidth
  // (horizontal scroll on narrow viewports), OR a maxHeight (vertical scroll). stickyHeader
  // defaults maxHeight to 320; otherwise maxHeight caps the height only when explicitly set,
  // and a plain maxHeight (no sticky/minWidth) still gets a height-capped scroll container.
  if (stickyHeader || minWidth || maxHeight != null) {
    return (
      <MantineTable.ScrollContainer
        minWidth={minWidth || 0}
        maxHeight={maxHeight ?? (stickyHeader ? 320 : undefined)}
      >
        {table}
      </MantineTable.ScrollContainer>
    );
  }
  return table;
});

export default Table;
