---
title: "Breadcrumbs"
description: "The built-in breadcrumbs tag — a breadcrumb trail from a JSON or compact pipe-delimited list of crumbs, on Mantine's Breadcrumbs. Usage, options, and live examples."
---

# Breadcrumbs

A **built-in** tag for a breadcrumb trail, built on Mantine's `Breadcrumbs`. Pass the
crumbs in `items` — either a compact comma-separated list of `Label | /href` pairs or a
JSON array of `{label, href}` objects — and set the `separator`. A crumb with no `href`
(typically the last, current one) renders as plain "you are here" text.

Use it as {% raw %}`{% breadcrumbs %}`{% endraw %} in Markdown, or call it from Python logic (loops, snippets) via `component('aardvark', 'breadcrumbs', …)`.

## Demonstrations

### Compact form

The **compact** form is a comma-separated list of `Label | /href` pairs. Drop the
`| href` on a crumb to render it as plain text — the last (current) crumb usually has
no link.

{% breadcrumbs items='Home | /, Components | /components/, Breadcrumbs' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% breadcrumbs items='Home | /, Components | /components/, Breadcrumbs' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'breadcrumbs', items='Home | /, Components | /components/, Breadcrumbs')
```
{% endAccordionSection %}
{% endAccordion %}

### JSON form

The **JSON** form is an array of `{label, href}` objects — handy when a label itself
contains a comma or a pipe. Omit `href` to render a crumb as plain text.

{% breadcrumbs items='[{"label":"Home","href":"/"},{"label":"Docs","href":"/getting-started/"},{"label":"This page"}]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% breadcrumbs items='[{"label":"Home","href":"/"},{"label":"Docs","href":"/getting-started/"},{"label":"This page"}]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'breadcrumbs',
    items='[{"label":"Home","href":"/"},{"label":"Docs","href":"/getting-started/"},{"label":"This page"}]',
)
```
{% endAccordionSection %}
{% endAccordion %}

### Separator and spacing

`separator` sets the character drawn between crumbs (defaults to `/`); `separatorMargin`
sets the space around it — a Mantine size (`xs`–`xl`) or any CSS value.

{% breadcrumbs items='Home | /, Guides | /getting-started/, Setup' separator='→' separatorMargin='md' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% breadcrumbs items='Home | /, Guides | /getting-started/, Setup' separator='→' separatorMargin='md' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'breadcrumbs',
    items='Home | /, Guides | /getting-started/, Setup',
    separator='→', separatorMargin='md',
)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Build a trail in Python from a list of pages — the loop-friendly form — and pair it with
other built-ins. Here the crumbs are assembled into the compact string before the tag is
called.

{% breadcrumbs items='Home | /, Components | /components/, Navigation | /components/navigation/, Breadcrumbs' separator='/' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% breadcrumbs items='Home | /, Components | /components/, Navigation | /components/navigation/, Breadcrumbs' separator='/' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
trail = [
    ('Home', '/'),
    ('Components', '/components/'),
    ('Navigation', '/components/navigation/'),
    ('Breadcrumbs', None),  # current page — no href
]
items = ', '.join(f'{label} | {href}' if href else label for label, href in trail)
component('aardvark', 'breadcrumbs', items=items, separator='/')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `items` | JSON array of `{label, href}`, **or** a comma-separated list of `Label \| /href` pairs (**required**) | The crumbs. A crumb with no `href` (or the last crumb) renders as plain, dimmed "you are here" text. |
| `separator` | Any string (defaults to `/`) | The character drawn between crumbs. |
| `separatorMargin` | A Mantine size (`xs`–`xl`) or any CSS value | The space around the separator. |

## CSS Selectors

The trail renders inside an island wrapper carrying `data-aardvark-island="Breadcrumbs"`, with Mantine's Styles API classes on the row, each crumb, and the separator between them.

{% raw %}
```css
[data-aardvark-island="Breadcrumbs"]  /* the island wrapper */
.mantine-Breadcrumbs-root             /* the crumb row */
.mantine-Breadcrumbs-breadcrumb       /* a single crumb */
.mantine-Breadcrumbs-separator        /* the divider between crumbs */
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) onto the rendered trail.

{% breadcrumbs items='Home | /, Components | /components/, Breadcrumbs' attr={'onclick': '''
event.preventDefault();
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% breadcrumbs items='Home | /, Components | /components/, Breadcrumbs' attr={'onclick': '''
event.preventDefault();
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'breadcrumbs', items='Home | /, Components | /components/, Breadcrumbs', attr={'onclick': '''
event.preventDefault();
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
