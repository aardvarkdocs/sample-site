---
title: "Anchor"
description: "The built-in anchor tag — a styled text link on Mantine's Anchor. Usage, options, and live examples (underline modes, color, weight, gradient)."
---

# Anchor

A **built-in** tag for a styled text link, built on Mantine's `Anchor` — a themed
`<a>` that carries the full **Text** styling surface. Set the destination with `url`
and style the label with `underline`, `c` (color), `size`, `fw` (weight), `inherit`,
and a gradient `variant`. The label is the block body or a `text` param.

Use it as {% raw %}`{% anchor %}`{% endraw %} in Markdown, or call it from Python logic (loops, snippets) via `component('aardvark', 'anchor', …)`.

## Demonstrations

### Basic link

The label is the block body (or a `text` param); `url` is the destination. Add
`target`/`rel`/`download` for the standard link attributes.

{% anchor url='/getting-started/quickstart/' %}Read the quickstart{% endAnchor %} · {% anchor url='https://mantine.dev' text='Mantine' target='_blank' rel='noopener' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% anchor url='/getting-started/quickstart/' %}Read the quickstart{% endAnchor %}
{% anchor url='https://mantine.dev' text='Mantine' target='_blank' rel='noopener' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'anchor', url='/getting-started/quickstart/', children='Read the quickstart')
component('aardvark', 'anchor', url='https://mantine.dev', text='Mantine', target='_blank', rel='noopener')
```
{% endAccordionSection %}
{% endAccordion %}

### Underline modes

`underline` controls when the underline shows: `always`, `hover` (the default),
`never`, or `not-hover`.

{% anchor url='/' underline='always' %}always{% endAnchor %} · {% anchor url='/' underline='hover' %}hover{% endAnchor %} · {% anchor url='/' underline='never' %}never{% endAnchor %} · {% anchor url='/' underline='not-hover' %}not-hover{% endAnchor %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% anchor url='/' underline='always' %}always{% endAnchor %}
{% anchor url='/' underline='hover' %}hover{% endAnchor %}
{% anchor url='/' underline='never' %}never{% endAnchor %}
{% anchor url='/' underline='not-hover' %}not-hover{% endAnchor %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
for mode in ('always', 'hover', 'never', 'not-hover'):
    component('aardvark', 'anchor', url='/', underline=mode, children=mode)
```
{% endAccordionSection %}
{% endAccordion %}

### Color, size, weight, and clamp

Style the text with `c` (any theme color or `dimmed`), `size` (`xs`–`xl`), `fw`
(font weight), `inherit` (match the surrounding text's font), and `lineClamp` (clamp
to N lines with an ellipsis).

{% anchor url='/' c='grape' fw='700' %}Bold grape{% endAnchor %} · {% anchor url='/' c='dimmed' size='xs' %}Small dimmed{% endAnchor %} · {% anchor url='/' size='xl' %}Extra large{% endAnchor %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% anchor url='/' c='grape' fw='700' %}Bold grape{% endAnchor %}
{% anchor url='/' c='dimmed' size='xs' %}Small dimmed{% endAnchor %}
{% anchor url='/' size='xl' %}Extra large{% endAnchor %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'anchor', url='/', c='grape', fw='700', children='Bold grape')
component('aardvark', 'anchor', url='/', c='dimmed', size='xs', children='Small dimmed')
component('aardvark', 'anchor', url='/', size='xl', children='Extra large')
```
{% endAccordionSection %}
{% endAccordion %}

### Gradient label

Set `variant='gradient'` and supply the gradient endpoints with `gradientFrom`,
`gradientTo`, and the angle `gradientDeg`.

{% anchor url='/' variant='gradient' gradientFrom='indigo' gradientTo='cyan' gradientDeg=90 fw='700' %}Gradient{% endAnchor %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% anchor url='/' variant='gradient' gradientFrom='indigo' gradientTo='cyan' gradientDeg=90 fw='700' %}Gradient{% endAnchor %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'anchor', url='/', variant='gradient',
    gradientFrom='indigo', gradientTo='cyan', gradientDeg=90, fw='700',
    children='Gradient',
)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Anchors sit naturally inside other components — here, one closes out a
{% raw %}`{% callout %}`{% endraw %} as the call to action.

{% callout severity='info' title='Next steps' %}
Ready to dive in? {% anchor url='/getting-started/quickstart/' fw='700' %}Open the quickstart{% endAnchor %}.
{% endCallout %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% callout severity='info' title='Next steps' %}
Ready to dive in? {% anchor url='/getting-started/quickstart/' fw='700' %}Open the quickstart{% endAnchor %}.
{% endCallout %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
link = component('aardvark', 'anchor', url='/getting-started/quickstart/', fw='700', children='Open the quickstart')
component('aardvark', 'callout', severity='info', title='Next steps', children=f'Ready to dive in? {link}.')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default. An `url` using a `javascript:`, `data:`,
`vbscript:`, `file:`, or `blob:` scheme is rejected at build time — use a relative
path or an `http(s)://` link.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `url` | A relative path or `http(s)://` URL (**required**) | The link destination (the `href`). Unsafe schemes are build-rejected. |
| `text` | Any string | The label, when not using the block body. |
| `target` | e.g. `_blank`, `_self` | Standard link `target` attribute. |
| `rel` | e.g. `noopener`, `nofollow` | Standard link `rel` attribute. |
| `download` | Filename, or a bare flag | Standard link `download` attribute. |
| `underline` | `always`, `hover` (default), `never`, `not-hover` | When the underline appears. |
| `c` | Any theme color (`blue`, `grape`, …) or `dimmed` | Text color. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl`, or any CSS size | Font size. |
| `fw` | A font weight (e.g. `500`, `700`) | Font weight. |
| `inherit` | `true` / `false` (default) | Inherit the surrounding text's font styles instead of Mantine's. |
| `lineClamp` | An integer | Clamp the label to N lines with an ellipsis. |
| `variant` | `gradient` | Render the label as a gradient (pair with the gradient props below). |
| `gradientFrom` | Any theme color | Gradient start color (with `variant='gradient'`). |
| `gradientTo` | Any theme color | Gradient end color (with `variant='gradient'`). |
| `gradientDeg` | A number (degrees) | Gradient angle (with `variant='gradient'`). |

## CSS Selectors

Each anchor mounts inside an island wrapper carrying `data-aardvark-island="Anchor"`, and the link itself is a Mantine `Anchor` — target either the wrapper or Mantine's Styles API class to restyle every anchor on the page.

{% raw %}
```css
[data-aardvark-island="Anchor"]  /* the island wrapper */
.mantine-Anchor-root             /* the rendered <a> */
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered link.

{% anchor url='/getting-started/quickstart/' attr={'onclick': '''
event.preventDefault();
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}Read the quickstart{% endAnchor %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% anchor url='/getting-started/quickstart/' attr={'onclick': '''
event.preventDefault();
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}Read the quickstart{% endAnchor %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'anchor', url='/getting-started/quickstart/', attr={'onclick': '''
event.preventDefault();
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''}, children='Read the quickstart')
```
{% endAccordionSection %}
{% endAccordion %}
