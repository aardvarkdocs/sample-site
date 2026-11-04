import { forwardRef, useState } from 'react';
import { Pagination as MantinePagination } from '@mantine/core';

// The island behind the built-in {% pagination %} tag (pagination.md). Mantine's
// Pagination is a controlled component (it needs a `value` and an `onChange`), so a
// pure build-time macro can't make it interactive — the active page has to live in
// client state. This thin wrapper owns that state with useState so the control is
// clickable out of the box.
//
// Every documentable prop (total, siblings, boundaries, size, radius, color,
// withEdges, withControls, disabled, gap, autoContrast) flows straight through.
// `defaultValue` seeds the initial page (default 1).
//
// SSR note: useState's initial value is deterministic, so the build-time prerender
// bakes the page-1 (or defaultValue) state; the client re-render wires up onChange.
const Pagination = forwardRef(function Pagination(
  { defaultValue = 1, ...rest },
  ref,
) {
  const [page, setPage] = useState(defaultValue);
  return <MantinePagination ref={ref} value={page} onChange={setPage} {...rest} />;
});

export default Pagination;
