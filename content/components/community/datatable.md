---
title: "DataTable"
description: "The built-in datatable tag — a themed data grid wrapping icflorescu's mantine-datatable. Columns and records as JSON, striped and bordered variants, column alignment, and attribute pass-through."
menu: components
parent: community
weight: 110
---

# DataTable

A **data grid** built on top of `@mantine/core`. Give it `columns` (a JSON array of column
definitions) and `records` (a JSON array of row objects), and it renders a clean, themed,
semantic table with borders, zebra striping, hover highlighting, per-column alignment and a
scrollable body — the presentation layer of a much larger grid, driven entirely from Markdown.

A **Community Component** — wraps [Mantine DataTable](https://icflorescu.github.io/mantine-datatable/)
by **icflorescu**, **MIT** licensed, npm `mantine-datatable`.

Use it as `{% raw %}{% datatable … %}{% endraw %}` in Markdown (it's self-closing — it takes no
body), or call it from Python logic (loops, snippets) via `component('aardvark', 'datatable', …)`.

## Demonstrations

Each `columns` entry has an `accessor` naming a field on the row objects in `records`; give it a
`title` to override the auto-generated header, and `textAlign` / `width` to shape the column.

{% datatable withTableBorder=true columns='[
  {"accessor":"name","title":"Name"},
  {"accessor":"role","title":"Role"},
  {"accessor":"commits","title":"Commits","textAlign":"right"}
]' records='[
  {"name":"Ada Lovelace","role":"Maintainer","commits":482},
  {"name":"Alan Turing","role":"Core","commits":351},
  {"name":"Grace Hopper","role":"Core","commits":297}
]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% datatable withTableBorder=true columns='[
  {"accessor":"name","title":"Name"},
  {"accessor":"role","title":"Role"},
  {"accessor":"commits","title":"Commits","textAlign":"right"}
]' records='[
  {"name":"Ada Lovelace","role":"Maintainer","commits":482},
  {"name":"Alan Turing","role":"Core","commits":351},
  {"name":"Grace Hopper","role":"Core","commits":297}
]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'datatable', withTableBorder=True,
          columns='[{"accessor":"name","title":"Name"}, …]',
          records='[{"name":"Ada Lovelace","role":"Maintainer","commits":482}, …]')
```
{% endAccordionSection %}
{% endAccordion %}

### Striped, with hover highlight

Turn on `striped` for zebra rows and `highlightOnHover` so the row under the cursor stands out.

{% datatable withTableBorder=true striped=true highlightOnHover=true columns='[
  {"accessor":"product","title":"Product"},
  {"accessor":"region","title":"Region"},
  {"accessor":"units","title":"Units","textAlign":"right"}
]' records='[
  {"product":"Aardvark Pro","region":"NA","units":1280},
  {"product":"Aardvark Pro","region":"EU","units":960},
  {"product":"Aardvark Team","region":"NA","units":540},
  {"product":"Aardvark Team","region":"APAC","units":410}
]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% datatable withTableBorder=true striped=true highlightOnHover=true columns='[
  {"accessor":"product","title":"Product"},
  {"accessor":"region","title":"Region"},
  {"accessor":"units","title":"Units","textAlign":"right"}
]' records='[
  {"product":"Aardvark Pro","region":"NA","units":1280},
  {"product":"Aardvark Pro","region":"EU","units":960},
  {"product":"Aardvark Team","region":"NA","units":540},
  {"product":"Aardvark Team","region":"APAC","units":410}
]' %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## With other components

A DataTable sits naturally inside a [Card](/components/data-display/card/) or
[Paper](/components/layout/paper/) surface — the table inherits the theme, and the surface gives
it a titled frame.

{% card title="Top contributors" withBorder=true %}
{% datatable columns='[
  {"accessor":"name","title":"Name"},
  {"accessor":"commits","title":"Commits","textAlign":"right"}
]' records='[
  {"name":"Ada Lovelace","commits":482},
  {"name":"Alan Turing","commits":351}
]' %}
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card title="Top contributors" withBorder=true %}
{% datatable columns='[
  {"accessor":"name","title":"Name"},
  {"accessor":"commits","title":"Commits","textAlign":"right"}
]' records='[
  {"name":"Ada Lovelace","commits":482},
  {"name":"Alan Turing","commits":351}
]' %}
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default. Bare flags (e.g. `striped`) become `=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `columns` | JSON array of column defs | Each `{accessor, title?, textAlign?, width?}`; `accessor` names the field on a record row. Required for a non-empty table. |
| `records` | JSON array of row objects | The rows to render, one per table row, keyed by each column's `accessor`. |
| `withTableBorder` | `true` / `false` (default `false`) | Draw a border around the whole table. |
| `withColumnBorders` | `true` / `false` (default `false`) | Draw vertical borders between columns. |
| `striped` | `true` / `false` (default `false`) | Zebra-stripe the rows. |
| `highlightOnHover` | `true` / `false` (default `false`) | Highlight the row under the cursor. |
| `noHeader` | `true` / `false` (default `false`) | Hide the column header row. |
| `height` | string (e.g. `400`, `60vh`) | Fix the table height; the body scrolls past it. |
| `borderRadius` | `xs` / `sm` / `md` / `lg` / `xl` or a size | Round the table corners. |
| `noRecordsText` | string | Text shown when `records` is empty. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element (see below). |

{% callout severity="info" title="Good to know" %}
Both JSON arrays are parsed at build time. A value that isn't a valid JSON array raises a
build warning and renders an empty table instead of failing the build, so an unexpectedly
blank grid usually means a bracket or a quote. Because the value is single-quoted in the tag,
keep the JSON's own strings in double quotes.

The tag is the grid's **presentation**: it takes columns, rows and the display toggles. Column
sorting, row selection and pagination are controlled features — the grid needs both the
current state and a handler to change it, which a static page has nowhere to keep. A column
marked `sortable` would get a header that looks and focuses like a button but never fires, so the
tag drops that key and warns instead of shipping it. Sort the records in the generator or the
Python caller that builds them.

Cell values are rendered as text, keyed by `accessor`. A record missing a column's key leaves
that cell empty rather than erroring.
{% endCallout %}

## CSS Selector

The grid's own class names are stable and unprefixed, and everything sits under the wrapper
attribute so a rule can be scoped to grids alone:

| Selector | Targets |
| --- | --- |
| `[data-aardvark-island="DataTable"]` | The wrapper around one grid. |
| `.mantine-datatable` | The grid root (`.mantine-datatable-with-border` when `withTableBorder` is on). |
| `.mantine-datatable-table` | The `<table>` itself. |
| `.mantine-datatable-header` | The header row. |
| `.mantine-datatable-scroll-area` | The scroll container around the body. |

The grid reads Mantine's theme CSS variables, so it matches the rest of the site out of the
box; its stylesheet loads with the page.

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes (data-, aria-, role, …) onto the rendered element,
exactly like `component('DataTable', attr={…})`. These ride a separate channel from the React
props above, so they reach the DOM untouched.

{% datatable attr={'data-role': 'contributors-grid', 'aria-label': 'Contributors'} columns='[
  {"accessor":"name","title":"Name"}
]' records='[{"name":"Ada Lovelace"}]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% datatable attr={'data-role': 'contributors-grid', 'aria-label': 'Contributors'} columns='[
  {"accessor":"name","title":"Name"}
]' records='[{"name":"Ada Lovelace"}]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'datatable',
          attr={'data-role': 'contributors-grid', 'aria-label': 'Contributors'},
          columns='[{"accessor":"name","title":"Name"}]',
          records='[{"name":"Ada Lovelace"}]')
```
{% endAccordionSection %}
{% endAccordion %}
