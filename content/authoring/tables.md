---
description: Every Markdown table is sortable, filterable, and striped by default —
  no special syntax or component required.
heading-icon: fa-solid fa-pen-nib
icon: fa-solid fa-table
menu: docs
title: Tables
weight: 25
---

# Tables

Write a normal GitHub-flavored Markdown table and the default theme enhances it
automatically — there's no special syntax or component to reach for:

- **Sortable headers.** Each column header is a button: click it to sort by that
  column, click again to reverse. Columns whose cells are all numbers sort
  numerically (commas, a leading currency sign and a trailing `%` are tolerated);
  everything else sorts as text.
- **Filter box.** Hover a table — or tab into it — and a search field appears
  above it; typing filters the rows live.
- **Styling.** The header row is filled with the body text color (with the page
  background as its text), and rows are lightly striped for readability. Both
  track the active light/dark color scheme.

It's progressive enhancement: with JavaScript disabled the table still renders
styled and striped — only the sorting and filtering need the small,
dependency-free `tables.js` the theme ships.

## Example

Click **Monthly downloads** to sort by size, or hover the table and type to filter.

| Package | Version | Monthly downloads |
| --- | --- | --- |
| markdown-it-py | 3.0 | 1,200,000 |
| mantine | 7.13 | 890,000 |
| esbuild | 0.21 | 4,500,000 |
| click | 8.1 | 9,800,000 |

## Turning sorting or filtering off

Both behaviors are on by default. Turn either off for the **whole site** in
`aardvark.config.yaml`:

```yaml
tables:
  sortable: false      # no click-to-sort headers
  filterable: false    # no filter box
```

A bare `tables: false` turns both off. Override per **page** in its front matter —
a page setting always wins over the site config:

```yaml
---
title: Release notes
sortableTables: false
filterableTables: false
---
```

The `sortable` switch also governs the tables in an API reference rendered with the
{% raw %}`{% openapi %}`{% endraw %} directive (those have no filter box, so
`filterableTables` only affects Markdown tables). Either way the table stays styled,
striped and horizontally scrollable — only the interactivity is removed.

## Notes

- Enhancement applies to any table with a header row and at least two body rows.
  Smaller tables are left as static — but still styled — tables.
- The filter field floats just above the table so revealing it never shifts the
  table (which keeps the sortable headers from moving out from under the cursor).
  If you wrap tables in a container with `overflow: hidden`, leave it room above —
  or use `overflow: visible` — so the field isn't clipped.
