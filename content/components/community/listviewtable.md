---
title: "ListViewTable"
description: "The built-in listviewtable tag — a Finder-style list-view table with sortable columns and optional drag-to-reorder and resize. A Community Component wrapping @gfazioli/mantine-list-view-table."
menu: components
parent: community
weight: 71
---

# ListViewTable

`listviewtable` renders a **Finder-style list-view table** — rows of records under sortable
column headers, with optional **drag-to-reorder** and **drag-to-resize** columns. It hydrates
into a fully interactive island in the browser, with no JavaScript to write.

You pass two JSON **strings**: `data`, an array of row record objects, and `columns`, an array
of `{key, title, sortable, width, textAlign, sticky}` column definitions. The tag parses both
at build time and hands them to the table. Use it as
`{% raw %}{% listviewtable %}{% endraw %}` in Markdown, or call it from Python logic (loops,
snippets) via `component('aardvark', 'listviewtable', …)`.

A **Community Component** — wraps
[ListViewTable](https://gfazioli.github.io/mantine-list-view-table/) by **gfazioli**, **MIT**
licensed, npm `@gfazioli/mantine-list-view-table`.

## Demonstrations

### Basic list view

A `data` array of records and a `columns` array of definitions. Each column's `key` selects the
field to display; `title` labels the header and `sortable` lets the reader sort by it:

{% listviewtable data='[{"name":"Documents","kind":"Folder","size":"--"},{"name":"README.md","kind":"Markdown","size":"2.1 KB"},{"name":"package.json","kind":"JSON","size":"1.8 KB"},{"name":"src","kind":"Folder","size":"--"}]' columns='[{"key":"name","title":"Name","sortable":true},{"key":"kind","title":"Kind","sortable":true,"width":140},{"key":"size","title":"Size","sortable":true,"width":120,"textAlign":"right"}]' %}

<br>

{% raw %}
```aardvark
{% listviewtable data='[{"name":"Documents","kind":"Folder","size":"--"},{"name":"README.md","kind":"Markdown","size":"2.1 KB"},{"name":"package.json","kind":"JSON","size":"1.8 KB"},{"name":"src","kind":"Folder","size":"--"}]' columns='[{"key":"name","title":"Name","sortable":true},{"key":"kind","title":"Kind","sortable":true,"width":140},{"key":"size","title":"Size","sortable":true,"width":120,"textAlign":"right"}]' %}
```
{% endraw %}

### Borders, striping, and hover highlight

Turn on `withTableBorder`, `withColumnBorders`, `striped`, and `highlightOnHover` for a more
table-like, scannable look:

{% listviewtable data='[{"name":"Ada Lovelace","role":"Admin","status":"Active"},{"name":"Alan Turing","role":"Editor","status":"Active"},{"name":"Grace Hopper","role":"Viewer","status":"Invited"}]' columns='[{"key":"name","title":"Name","sortable":true},{"key":"role","title":"Role","sortable":true,"width":140},{"key":"status","title":"Status","width":140}]' withTableBorder=true withColumnBorders=true striped=true highlightOnHover=true %}

<br>

{% raw %}
```aardvark
{% listviewtable data='[{"name":"Ada Lovelace","role":"Admin","status":"Active"},{"name":"Alan Turing","role":"Editor","status":"Active"},{"name":"Grace Hopper","role":"Viewer","status":"Invited"}]' columns='[{"key":"name","title":"Name","sortable":true},{"key":"role","title":"Role","sortable":true,"width":140},{"key":"status","title":"Status","width":140}]' withTableBorder=true withColumnBorders=true striped=true highlightOnHover=true %}
```
{% endraw %}

### Reorderable and resizable columns

`enableColumnReordering` lets readers drag column headers to reorder them;
`enableColumnResizing` lets them drag the column edges to resize. Set a `height` to cap the
table and scroll the body:

{% listviewtable data='[{"id":1,"task":"Write docs","owner":"Ada","due":"2024-06-01"},{"id":2,"task":"Ship release","owner":"Alan","due":"2024-06-04"},{"id":3,"task":"Review PRs","owner":"Grace","due":"2024-06-02"}]' columns='[{"key":"task","title":"Task","sortable":true},{"key":"owner","title":"Owner","sortable":true,"width":140},{"key":"due","title":"Due","sortable":true,"width":140,"textAlign":"right"}]' enableColumnReordering=true enableColumnResizing=true withTableBorder=true %}

<br>

{% raw %}
```aardvark
{% listviewtable data='[{"id":1,"task":"Write docs","owner":"Ada","due":"2024-06-01"},{"id":2,"task":"Ship release","owner":"Alan","due":"2024-06-04"},{"id":3,"task":"Review PRs","owner":"Grace","due":"2024-06-02"}]' columns='[{"key":"task","title":"Task","sortable":true},{"key":"owner","title":"Owner","sortable":true,"width":140},{"key":"due","title":"Due","sortable":true,"width":140,"textAlign":"right"}]' enableColumnReordering=true enableColumnResizing=true withTableBorder=true %}
```
{% endraw %}

## With other components

A list view sits naturally inside a [card](/components/data-display/card/) alongside other
content — here a short [text](/components/typography/text/) lead-in above a files table:

{% card %}
{% text size='sm' c='dimmed' %}Recent files{% endText %}

{% listviewtable data='[{"name":"report.pdf","size":"482 KB"},{"name":"notes.txt","size":"3 KB"}]' columns='[{"key":"name","title":"Name","sortable":true},{"key":"size","title":"Size","width":120,"textAlign":"right"}]' withTableBorder=true highlightOnHover=true %}
{% endCard %}

<br>

{% raw %}
```aardvark
{% card %}
{% text size='sm' c='dimmed' %}Recent files{% endText %}

{% listviewtable data='[{"name":"report.pdf","size":"482 KB"},{"name":"notes.txt","size":"3 KB"}]' columns='[{"key":"name","title":"Name","sortable":true},{"key":"size","title":"Size","width":120,"textAlign":"right"}]' withTableBorder=true highlightOnHover=true %}
{% endCard %}
```
{% endraw %}

## Attributes

Every attribute is optional except that a useful table needs both `data` and `columns`; omit
any other to take its upstream default. The body is ignored — `listviewtable` is a viewer, not
a container.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `data` | JSON array string | The rows — an array of record objects. Parsed at build time; a malformed value warns and degrades to an empty array. |
| `columns` | JSON array string | The columns — an array of `{key, title, sortable, width, minWidth, maxWidth, textAlign, sticky, noWrap, ellipsis, hidden}` objects. `key` selects the record field; `title` labels the header. |
| `height` | CSS length (string) | Cap the table height; the body scrolls past it. |
| `rowKey` | String | Record field to use as the unique row key. |
| `borderRadius` | `xs`, `sm`, `md`, `lg`, `xl` | Outer container radius when `withTableBorder` is on (default `sm`). |
| `striped` | `true` / `false` (default `false`) | Stripe alternate rows. |
| `withTableBorder` | `true` / `false` (default `false`) | Draw a border around the table. |
| `withColumnBorders` | `true` / `false` (default `false`) | Draw borders between columns. |
| `withRowBorders` | `true` / `false` (default `true`) | Draw borders between rows. |
| `highlightOnHover` | `true` / `false` (default `false`) | Highlight a row on hover. |
| `stickyHeader` | `true` / `false` (default `false`) | Keep the header row sticky while the body scrolls. |
| `tabularNums` | `true` / `false` (default `false`) | Use tabular (fixed-width) numerals. |
| `enableColumnReordering` | `true` / `false` (default `false`) | Let readers drag column headers to reorder. |
| `enableColumnResizing` | `true` / `false` (default `false`) | Let readers drag column edges to resize. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

Per-column custom cell renderers (`renderCell` / `renderHeader`) are React functions, so they
can't ride this JSON channel; columns here are plain field projections that display the record's
value for each column `key`.

## CSS Selector

The table is an island wrapper carrying `data-aardvark-island="ListViewTable"`; the upstream
component owns the inner table chrome. Style or target it from your own CSS through the island
attribute or any `attr`-supplied id/class:

```css
/* The ListViewTable island wrapper */
[data-aardvark-island="ListViewTable"] {
  margin-block: var(--mantine-spacing-md);
}
```

The upstream package also exposes CSS variables (e.g. `--lvt-border-color`,
`--lvt-shadow-color`, `--list-view-cell-font-size`) and Styles API selectors for the header,
rows, cells, and sticky columns — see the
[upstream documentation](https://gfazioli.github.io/mantine-list-view-table/) for the full list.

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes (an `id`, `class`, `data-*`, ARIA attributes,
inline event handlers) straight onto the rendered element — exactly like
`component('aardvark', 'listviewtable', attr={…})`. These ride the `data-aardvark-attr`
channel, not React props, so they don't collide with the component's own props:

{% listviewtable data='[{"name":"file.txt","size":"1 KB"}]' columns='[{"key":"name","title":"Name"},{"key":"size","title":"Size"}]' attr={'id': 'demo-table', 'data-role': 'file-list'} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% listviewtable data='[{"name":"file.txt","size":"1 KB"}]' columns='[{"key":"name","title":"Name"},{"key":"size","title":"Size"}]' attr={'id': 'demo-table', 'data-role': 'file-list'} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'listviewtable',
          data='[{"name":"file.txt","size":"1 KB"}]',
          columns='[{"key":"name","title":"Name"},{"key":"size","title":"Size"}]',
          attr={'id': 'demo-table', 'data-role': 'file-list'})
```
{% endAccordionSection %}
{% endAccordion %}
