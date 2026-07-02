---
title: "Mantine React Table"
description: "Community Component — a TanStack-Table-based data grid (Mantine React Table) wrapped as a built-in tag. Takes columns + data JSON arrays. Usage, options, and a live example."
menu: components
parent: community
weight: 120
---

# Mantine React Table

`{% raw %}{% mantineReactTable %}{% endraw %}` renders a data grid from `columns` + `data`
arrays — the same shape [Mantine React Table](https://v2.mantine-react-table.com/) (a
data table built on [TanStack Table](https://tanstack.com/table)) consumes. Give it a JSON
array of column definitions and a JSON array of row objects and it lays the data out as a
table.

A **Community Component** — wraps [Mantine React Table](https://v2.mantine-react-table.com/)
by **KevinVandy**, **MIT** licensed, npm `mantine-react-table`.

{% callout severity='info' title='Pending Mantine 9 support' %}
Every published `mantine-react-table` release targets an **older Mantine line** — the v2
beta peers `@mantine/core ^7.9` and the v1 stable peers `@mantine/core ^6.0`. None peers
`@mantine/core ^9` / React 19, which is the line this site ships on, so the live data grid
(sorting, filtering, pagination, row selection) is **not** bundled yet. Until an upstream
Mantine-9-compatible release lands, this tag renders an **SSR-safe static table** built from
the same `columns` + `data` arrays — you see the headers and rows, just without the
interactive grid features. The author-facing API already matches the live grid, so when the
upstream release ships nothing in your content has to change.
{% endCallout %}

Use it as `{% raw %}{% mantineReactTable %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'mantineReactTable', …)`.

## Demonstrations

Give it `columns` — a JSON array of `{accessorKey, header}` objects — and `data`, a JSON
array of row objects keyed by those `accessorKey`s:

{% mantineReactTable columns='[{"accessorKey":"name","header":"Name"},{"accessorKey":"role","header":"Role"},{"accessorKey":"city","header":"City"}]' data='[{"name":"Ada Lovelace","role":"Engineer","city":"London"},{"name":"Grace Hopper","role":"Admiral","city":"New York"},{"name":"Alan Turing","role":"Researcher","city":"Manchester"}]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% mantineReactTable
   columns='[{"accessorKey":"name","header":"Name"},{"accessorKey":"role","header":"Role"},{"accessorKey":"city","header":"City"}]'
   data='[{"name":"Ada Lovelace","role":"Engineer","city":"London"},{"name":"Grace Hopper","role":"Admiral","city":"New York"},{"name":"Alan Turing","role":"Researcher","city":"Manchester"}]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'mantineReactTable',
          columns='[{"accessorKey":"name","header":"Name"},'
                  '{"accessorKey":"role","header":"Role"},'
                  '{"accessorKey":"city","header":"City"}]',
          data='[{"name":"Ada Lovelace","role":"Engineer","city":"London"},'
               '{"name":"Grace Hopper","role":"Admiral","city":"New York"},'
               '{"name":"Alan Turing","role":"Researcher","city":"Manchester"}]')
```
{% endAccordionSection %}
{% endAccordion %}

### Adding a caption

Pass `caption` for a descriptive table caption:

{% mantineReactTable caption='Pioneers of computing' columns='[{"accessorKey":"name","header":"Name"},{"accessorKey":"year","header":"Born"}]' data='[{"name":"Ada Lovelace","year":1815},{"name":"Alan Turing","year":1912}]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% mantineReactTable caption='Pioneers of computing'
   columns='[{"accessorKey":"name","header":"Name"},{"accessorKey":"year","header":"Born"}]'
   data='[{"name":"Ada Lovelace","year":1815},{"name":"Alan Turing","year":1912}]' %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## With other components

The grid sits happily inside the layout primitives. Here it's wrapped in a
[Paper](/components/layout/paper/) surface to give it a bordered, padded card:

{% paper withBorder=true p='md' radius='md' %}
{% mantineReactTable columns='[{"accessorKey":"pkg","header":"Package"},{"accessorKey":"license","header":"License"}]' data='[{"pkg":"mantine-react-table","license":"MIT"},{"pkg":"@tanstack/react-table","license":"MIT"}]' %}
{% endPaper %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% paper withBorder=true p='md' radius='md' %}
{% mantineReactTable
   columns='[{"accessorKey":"pkg","header":"Package"},{"accessorKey":"license","header":"License"}]'
   data='[{"pkg":"mantine-react-table","license":"MIT"},{"pkg":"@tanstack/react-table","license":"MIT"}]' %}
{% endPaper %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default. The `columns` and `data` values are **JSON strings**
— a JSON array, quoted as a single attribute value.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `columns` | A JSON array of column defs, each `{accessorKey, header}` | The grid's columns. `accessorKey` is the row-object key (a dotted path like `user.name` is supported); `header` is the column heading. |
| `data` | A JSON array of row objects | The rows. Each object is keyed by the columns' `accessorKey`s. |
| `caption` | A string | An optional table caption. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element (see below). |

A malformed or non-array `columns` / `data` value degrades to empty (with a build warning)
rather than aborting the build.

## CSS Selector

The island renders inside a wrapper you can target for page-level overrides:

```css
/* The Mantine React Table wrapper */
[data-aardvark-mrt] {
  /* … */
}

/* The fallback table inside it (a Mantine Table) */
[data-aardvark-mrt] table {
  /* … */
}
```

When the live Mantine-9 grid is bundled (see the note above), it will additionally carry
Mantine React Table's own `.mantine-react-table` / `[data-aardvark-mrt]` selectors.

## Injecting Attributes

Use `attr={…}` to pass raw HTML attributes straight onto the rendered element — handy for
`data-*` hooks, `id`, or ARIA attributes that aren't component props. The object rides a
separate channel, so it never collides with the grid's own props:

{% mantineReactTable attr={'data-testid': 'people-grid', 'id': 'people'} columns='[{"accessorKey":"name","header":"Name"}]' data='[{"name":"Ada"}]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% mantineReactTable attr={'data-testid': 'people-grid', 'id': 'people'}
   columns='[{"accessorKey":"name","header":"Name"}]'
   data='[{"name":"Ada"}]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'mantineReactTable',
          attr={'data-testid': 'people-grid', 'id': 'people'},
          columns='[{"accessorKey":"name","header":"Name"}]',
          data='[{"name":"Ada"}]')
```
{% endAccordionSection %}
{% endAccordion %}
