import { forwardRef } from 'react';
import { DataTable as MantineDataTable } from 'mantine-datatable';
import './DataTable.css';

// The two bindings the community mount-contract test captures before this module evaluates, so
// a mounted test can prove the grid really came from the installed package. Deliberately NOT
// paired with the two-word header marker every new community wrapper must carry: the build
// drops any island whose source contains that phrase from its server-side prerender, and this
// wrapper must STAY in the SSR registry — its server output is the table a reader without
// JavaScript, and any crawler reading the HTML, actually sees. (Not the .md twin or the PDF:
// the Markdown export keeps an island's CHILDREN and this tag is self-closing, and the PDF
// renderer has no DataTable branch, so both drop the rows. The SSR output matters for the HTML
// page and for hydrating in place.)
// (Which is why this comment spells the phrase out nowhere: writing it would drop the island.)
// The islands bundle imports only the default export, so esbuild tree-shakes both of these.
export const communityPackage = 'mantine-datatable';
export const communityComponent = MantineDataTable;

// The island behind the built-in {% datatable %} tag (datatable.md). It wraps icflorescu's
// `mantine-datatable` — a feature-rich, dependency-free data grid built on @mantine/core. The
// macro hands us two parsed JSON arrays:
//
//   * `columns` — each {accessor, title?, textAlign?, width?, …}; `accessor`
//     names the field on a record row. This is the only required shape.
//   * `records`  — the row objects the table renders, one per <tr>.
//
// Every other DataTable prop (withTableBorder, withColumnBorders, striped,
// highlightOnHover, borderRadius, height, noRecordsText, the Mantine style system, …)
// flows straight through via {...rest}, so the full DataTable API stays reachable from the
// tag without the macro enumerating it.
//
// The tag deliberately exposes only the PRESENTATION surface. DataTable's sorting, row
// selection and pagination are all *controlled*: each needs both the current state and a
// handler to change it, and a build-time macro has nowhere to keep either. In particular a
// column marked `sortable` gets role="button"/tabIndex=0 on its header but NO click handler
// unless `onSortStatusChange` is also supplied — a focusable header announced to a screen reader
// as a button that does nothing. `sortable` is not a macro param, but that alone stops nothing:
// it can ride in inside the `columns` JSON. So datatable.md strips it per column and warns
// (_presentation_only) — there is no param to omit, there is an author payload to clean. Wiring
// sorting up for real means a state owner, not a macro param.
//
// SSR note: for static data the grid renders fine server-side — DataTable emits a plain
// semantic <table> of the supplied rows with no window/measurement needed at first paint, so
// renderToString bakes the whole table verbatim, and Aardvark hydrates it in place; the
// server and client render the same supplied records, so the markup matches.
//
// Defensive defaults: `columns`/`records` default to [] so a malformed/empty macro payload
// renders an empty table rather than throwing (DataTable requires both props to be arrays).

const DataTable = forwardRef(function DataTable(
  { columns = [], records = [], ...rest },
  ref,
) {
  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeRecords = Array.isArray(records) ? records : [];
  return (
    <MantineDataTable
      tableRef={ref}
      columns={safeColumns}
      records={safeRecords}
      {...rest}
    />
  );
});

export default DataTable;
