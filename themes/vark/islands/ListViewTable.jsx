import { forwardRef } from 'react';
import { ListViewTable as GfazioliListViewTable } from '@gfazioli/mantine-list-view-table';
import './ListViewTable.css';

// The island behind the built-in {% listviewtable %} tag
// (listviewtable.md). A **Community Component**: it wraps
// @gfazioli/mantine-list-view-table's <ListViewTable>, a Finder-style list-view table with
// optional column reordering and resizing.
//
// The macro JSON-parses the author's `data` (an array of row records) and `columns` (an array
// of column definitions — key/title/sortable/width/textAlign/sticky/…) and hands both through
// the JSON props channel. Per-column custom renderers (`renderCell`/`renderHeader`) are React
// functions and so can't ride a JSON channel — columns here are plain field projections, and
// cells display the record's value for the column key. Every other prop (withTableBorder,
// striped, highlightOnHover, stickyHeader, enableColumnReordering, enableColumnResizing, …)
// passes straight through via {...rest}, so the upstream API stays available. The package's
// stylesheet is pulled in through the co-located ListViewTable.css (a CSS @import, never a JS
// import — a package .css import crashes the SSR prerender under esbuild's --packages=external).
//
// Client-only, by its Community Component marker: ../components/README.md (The React components).
const ListViewTable = forwardRef(function ListViewTable(
  { data = [], columns = [], ...rest },
  ref,
) {
  return <GfazioliListViewTable ref={ref} data={data} columns={columns} {...rest} />;
});

export default ListViewTable;
