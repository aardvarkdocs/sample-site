---
title: "DataTable"
description: "The built-in datatable tag — a feature-rich data grid wrapping icflorescu's mantine-datatable. Columns/records as JSON, live sorting and striped variants, and attribute pass-through."
menu: components
parent: community
weight: 110
---

# DataTable

A feature-rich **data grid** built on top of `@mantine/core`. Give it `columns` (a JSON array
of column definitions) and `records` (a JSON array of row objects), and it renders a clean,
themed, semantic table — server-side for the static rows, hydrating into an interactive island
for sorting and selection.

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
Mark a column `sortable` and the header becomes clickable once the grid hydrates in the browser.

{% datatable withTableBorder=true striped=true highlightOnHover=true columns='[
  {"accessor":"product","title":"Product","sortable":true},
  {"accessor":"region","title":"Region"},
  {"accessor":"units","title":"Units","textAlign":"right","sortable":true}
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
  {"accessor":"product","title":"Product","sortable":true},
  {"accessor":"region","title":"Region"},
  {"accessor":"units","title":"Units","textAlign":"right","sortable":true}
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
| `columns` | JSON array of column defs | Each `{accessor, title?, textAlign?, sortable?, width?}`; `accessor` names the field on a record row. Required for a non-empty table. |
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

## CSS Selector

The tag mounts an island wrapper you can target directly. The grid itself carries
`mantine-datatable`'s own classes, but everything sits under the island marker:

```css
/* The DataTable island wrapper */
[data-aardvark-island="DataTable"] {
  /* … */
}
```

`mantine-datatable` ships its own stylesheet (pulled in automatically via a CSS `@import` in the
component's co-located stylesheet), and the grid reads Mantine's theme CSS variables, so it
matches the rest of the site out of the box.

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
