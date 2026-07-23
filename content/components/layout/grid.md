---
title: "Grid"
description: "The built-in grid tag — a flexible 12-column grid with spanning cells. The items/spans params, block-body cells, gap, grow, and a full attribute reference."
---

# Grid

`{% raw %}{% grid %}{% endraw %}` is a **built-in** tag for a flexible **12-column grid**
where cells can span a chosen number of columns. Use it when you want columns of *different*
widths — a sidebar next to a wide main area, say. For an equal-width grid, reach for
[`{% raw %}{% simplegrid %}{% endraw %}`](/components/layout/simplegrid/) instead.

Use it as `{% raw %}{% grid %}{% endraw %}` in Markdown, or call it from Python logic (loops,
snippets) via `component('aardvark', 'grid', …)`.

## Cells with `items`

The simplest way to lay out cells of different widths is the `items` param — a `|`-separated
list of cell texts — paired with `spans`, a comma-separated list of column spans (out of 12)
for each cell. This form is self-closing (no block body).

{% grid items='Sidebar|Main content area' spans='3,9' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% grid items='Sidebar|Main content area' spans='3,9' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'grid', items='Sidebar|Main content area', spans='3,9')
```
{% endAccordionSection %}
{% endAccordion %}

## Auto spans

A `span` of `auto` lets a cell take whatever width is left. Mix a fixed span with `auto`
cells to pin one column and let the rest share the remainder.

{% grid items='Fixed 4|Auto|Auto' spans='4,auto,auto' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% grid items='Fixed 4|Auto|Auto' spans='4,auto,auto' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'grid', items='Fixed 4|Auto|Auto', spans='4,auto,auto')
```
{% endAccordionSection %}
{% endAccordion %}

## Cells from the block body

Without `items`, each top-level block in the body becomes one cell — handy when a cell holds
richer Markdown than a plain string. Set `span` to give every body cell the same column span,
and `gap` to widen the gap between cells.

{% grid span=6 gap='lg' %}
{% badge fullWidth size='lg' %}Half{% endBadge %}

{% badge fullWidth size='lg' %}Half{% endBadge %}
{% endGrid %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% grid span=6 gap='lg' %}
{% badge fullWidth size='lg' %}Half{% endBadge %}

{% badge fullWidth size='lg' %}Half{% endBadge %}
{% endGrid %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
cell = component('aardvark', 'badge', fullWidth=True, size='lg', children='Half')
component('aardvark', 'grid', span='6', gap='lg',
          children=cell + '\n\n' + cell)
```
{% endAccordionSection %}
{% endAccordion %}

## Grow and custom column count

`grow` lets the last row's cells grow to fill the remaining width. `columns` changes the
total number of tracks — here a 6-column grid with two 2-span cells that grow to fill.

{% grid items='A|B' spans='2,2' columns=6 grow=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% grid items='A|B' spans='2,2' columns=6 grow=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'grid', items='A|B', spans='2,2', columns=6, grow=True)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Body cells are ordinary Markdown, so a grid is the natural frame for a dashboard row of rich
cells. Each top-level block becomes one cell; set the grid-wide `span` to size them — here two
half-width stat cards (`span=6` of 12).

{% grid span=6 gap='md' %}
{% card title='Revenue' %}A panel spanning half the row.{% endCard %}

{% card title='Today' %}A second panel beside it.{% endCard %}
{% endGrid %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% grid span=6 gap='md' %}
{% card title='Revenue' %}A panel spanning half the row.{% endCard %}

{% card title='Today' %}A second panel beside it.{% endCard %}
{% endGrid %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
left = component('aardvark', 'card', title='Revenue',
                 children='A panel spanning half the row.')
right = component('aardvark', 'card', title='Today',
                  children='A second panel beside it.')
component('aardvark', 'grid', span='6', gap='md',
          children=left + '\n\n' + right)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default (columns `12`, gap `md`, span `auto`).

| Attribute | Values | Description |
| --- | --- | --- |
| `items` | a `\|`-separated string of cell texts | Cells as a param (alternative to the block body). |
| `spans` | comma-separated, one per `items` cell — a number `1`–`12`, `auto`, or `content` | Column span for each `items` cell. |
| `span` | a number `1`–`12`, `auto`, or `content` | Default column span for every cell (used when a cell has no `spans` entry). |
| `columns` | a number (`12` default) | Total number of grid columns. |
| `gap` | `xs`–`xl` or any CSS value (`md` default) | Gap between cells. |
| `justify` | any CSS `justify-content` | Placement of the row of cells along the main axis. |
| `align` | any CSS `align-items` | Placement of the cells along the cross axis. |
| `grow` | `true`, `false` (default `false`) | Let the last row's cells grow to fill the remaining width. |
| `overflow` | `hidden`, `visible` (`hidden` default) | `overflow` on the grid root. Set `visible` to let content spill. |


## CSS Selectors

Each `grid` carries `data-aardvark-island="Grid"` on its wrapper, and Mantine exposes its parts as `mantine-Grid-*` classes — target either to style it from your theme CSS.

{% raw %}
```css
[data-aardvark-island="Grid"] {
  /* style every grid on the page */
}

.mantine-Grid-root {
  /* the root part */
}

.mantine-Grid-inner {
  /* the inner part */
}

.mantine-Grid-col {
  /* the col part */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% grid items='Sidebar|Main content area' spans='3,9' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% grid items='Sidebar|Main content area' spans='3,9' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'grid', items='Sidebar|Main content area', spans='3,9', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
