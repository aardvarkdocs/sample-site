---
title: "Pagination"
description: "The built-in pagination tag — an interactive pager on Mantine's Pagination whose active page tracks clicks. Usage, options, and live examples."
---

# Pagination

A **built-in** tag for an interactive pager, built on Mantine's `Pagination`. Set `total`
(the number of pages) and the active page **tracks clicks out of the box** — the tag ships
the client state Mantine's controlled component needs. Tune the shape with `siblings`,
`boundaries`, `withEdges`, and `withControls`, and the look with `size`, `radius`, `color`,
and `gap`.

Use it as {% raw %}`{% pagination %}`{% endraw %} in Markdown, or call it from Python logic (loops, snippets) via `component('aardvark', 'pagination', …)`.

## Demonstrations

### Basic pager

Only `total` is required. Seed the initial page with `defaultValue` (defaults to `1`).
Click a page below — the active state follows.

{% pagination total=10 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% pagination total=10 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'pagination', total=10)
```
{% endAccordionSection %}
{% endAccordion %}

### Shape — siblings, boundaries, and edges

`siblings` sets how many page buttons flank the current page; `boundaries` sets how many
are pinned at each end; `withEdges` adds first/last jump buttons. `defaultValue` picks the
page shown on load.

{% pagination total=20 defaultValue=10 siblings=2 boundaries=2 withEdges=true color='grape' radius='xl' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% pagination total=20 defaultValue=10 siblings=2 boundaries=2 withEdges=true color='grape' radius='xl' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'pagination', total=20, defaultValue=10,
    siblings=2, boundaries=2, withEdges=True, color='grape', radius='xl',
)
```
{% endAccordionSection %}
{% endAccordion %}

### Controls off

`withControls` is on by default (the prev/next arrows). Turn it off with
`withControls=false`; `disabled` dims and disables the whole control.

{% pagination total=8 withControls=false %}
{% pagination total=8 disabled=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% pagination total=8 withControls=false %}
{% pagination total=8 disabled=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'pagination', total=8, withControls=False)
component('aardvark', 'pagination', total=8, disabled=True)
```
{% endAccordionSection %}
{% endAccordion %}

### Sizes, radius, and gap

`size` and `radius` take `xs`–`xl`; `gap` sets the space between buttons (a Mantine size or
any CSS value).

{% pagination total=5 size='sm' %}
{% pagination total=5 size='lg' gap='xl' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% pagination total=5 size='sm' %}
{% pagination total=5 size='lg' gap='xl' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'pagination', total=5, size='sm')
component('aardvark', 'pagination', total=5, size='lg', gap='xl')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Compute the page count in Python from a collection and a page size, then render the pager.
Here the pager sits under a {% raw %}`{% stack %}`{% endraw %} caption.

{% stack gap='xs' align='center' %}
Page 1 of 4
{% pagination total=4 color='indigo' %}
{% endStack %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% stack gap='xs' align='center' %}
Page 1 of 4
{% pagination total=4 color='indigo' %}
{% endStack %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
import math
items, per_page = 37, 10
total = math.ceil(items / per_page)  # -> 4 pages
caption = f'Page 1 of {total}'
pager = component('aardvark', 'pagination', total=total, color='indigo')
component('aardvark', 'stack', gap='xs', align='center', children=caption + pager)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `total` | A positive integer (**required**) | Number of pages. |
| `defaultValue` | An integer (defaults to `1`) | The page shown on load. |
| `siblings` | An integer | Page buttons on each side of the current page. |
| `boundaries` | An integer | Page buttons pinned at the start and end. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Size of the buttons. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl` | Corner radius of the buttons. |
| `color` | Any theme color (`blue`, `grape`, …) | Active-page color. |
| `gap` | A Mantine size or any CSS value | Space between buttons. |
| `withEdges` | `true` / `false` (default) | Show first/last jump buttons. |
| `withControls` | `true` (default) / `false` | Show the prev/next arrows. |
| `disabled` | `true` / `false` (default) | Dim and disable the whole control. |
| `autoContrast` | `true` / `false` (default) | Auto-pick a readable label color against `color`. |

## CSS Selectors

The control mounts inside an island wrapper carrying `data-aardvark-island="Pagination"`; Mantine's Styles API exposes the row, each page button, and the truncation dots.

{% raw %}
```css
[data-aardvark-island="Pagination"]  /* the island wrapper */
.mantine-Pagination-root             /* the button row */
.mantine-Pagination-control          /* a single page / arrow button */
.mantine-Pagination-dots             /* the … truncation marker */
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) onto the rendered control.

{% pagination total=10 attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% pagination total=10 attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'pagination', total=10, attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
