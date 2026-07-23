---
title: "TableOfContents"
description: "The built-in tableofcontents tag — an on-page contents list that scrapes the current page's headings and highlights the one in view, on Mantine's TableOfContents."
---

# TableOfContents

A built-in tag for an on-page table of contents, built on Mantine's
`TableOfContents`. It scrapes the current page's headings at runtime and highlights
the one in view as you scroll (scroll-spy), so it always reflects wherever you drop
it — there's no list to maintain. The headings come from the live DOM, so the
build-time prerender bakes an empty list and the client fills it in on load.

Use it as `{% raw %}{% tableofcontents %}{% endraw %}` in Markdown, or call it from
Python logic (loops, snippets) via `component('aardvark', 'tableofcontents', …)`.

## Default

With no attributes it tracks every `h1`–`h3` inside the page's content and indents
each level. The entries below are this page's own headings, and the active one
updates as you scroll.

**Preview**

{% tableofcontents %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% tableofcontents %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'tableofcontents')
```
{% endAccordionSection %}
{% endAccordion %}

## Depth and indentation

`depth` (1–6) caps which heading levels appear; `depthOffset` sets the pixels of
indent added per level. Here we include `h1`–`h2` only, with a wider indent.

**Preview**

{% tableofcontents depth=2 depthOffset=24 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% tableofcontents depth=2 depthOffset=24 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'tableofcontents', depth=2, depthOffset=24)
```
{% endAccordionSection %}
{% endAccordion %}

## Variant, color, size, and radius

`variant` switches the active-entry treatment (`light`, `filled`, `none`); `color`
sets its accent; `size` and `radius` (`xs`–`xl`) scale the labels and the rounding.
`autoContrast` picks a readable label color against `color`.

**Preview**

{% tableofcontents variant='filled' color='grape' size='lg' radius='md' autoContrast=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% tableofcontents variant='filled' color='grape' size='lg' radius='md' autoContrast=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'tableofcontents',
    variant='filled', color='grape', size='lg', radius='md', autoContrast=True,
)
```
{% endAccordionSection %}
{% endAccordion %}

## Custom selector

By default the contents tracks every `h1`–`h{depth}` inside the page's content
(`.aardvark-content`), so site chrome (nav and footer) is never picked up. Pass an
explicit `selector` to track a different heading set — say only the `h2`s:

**Preview**

{% tableofcontents depth=4 variant='filled' color='blue' selector='.aardvark-content h2' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% tableofcontents depth=4 variant='filled' color='blue' selector='.aardvark-content h2' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'tableofcontents',
    depth=4, variant='filled', color='blue', selector='.aardvark-content h2',
)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Because a table of contents is just another tag, you can drop it inside any block —
for example pinned into an `{% raw %}{% accordion %}{% endraw %}` section, or beside
prose in a `{% raw %}{% card %}{% endraw %}`. Here it sits in its own accordion
section so it can be folded away.

**Preview**

{% accordion %}
{% accordionSection title="On this page" %}
{% tableofcontents depth=2 %}
{% endAccordionSection %}
{% endAccordion %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% accordion %}
{% accordionSection title="On this page" %}
{% tableofcontents depth=2 %}
{% endAccordionSection %}
{% endAccordion %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
toc = component('aardvark', 'tableofcontents', depth=2)
section = component(
    'aardvark', 'accordionSection', title='On this page', children=toc,
)
component('aardvark', 'accordion', children=section)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `depth` | `1`–`6` (int; default `3`) | Highest heading level to include — `3` tracks `h1`–`h3`. Also shapes the default selector. |
| `depthOffset` | int (pixels) | Indent added per heading level. Omitted → Mantine's default. |
| `variant` | `light` (default), `filled`, `none` | Treatment of the active entry. |
| `color` | any Mantine color (e.g. `blue`, `grape`, `#7048e8`) | Accent color for the active entry. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Label size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl` | Corner radius of the active highlight. |
| `autoContrast` | bool (default `false`) | Auto-pick a readable label color against `color`. |
| `selector` | a CSS selector | Headings to track. Overrides the default (`h1`–`h{depth}` inside `.aardvark-content`). |

## CSS Selectors

The widget mounts inside an island wrapper carrying `data-aardvark-island="TableOfContents"`; Mantine's Styles API exposes the list root and each heading link.

{% raw %}
```css
[data-aardvark-island="TableOfContents"]  /* the island wrapper */
.mantine-TableOfContents-root             /* the list of headings */
.mantine-TableOfContents-control          /* a single heading link */
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) onto the rendered widget.

{% tableofcontents attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% tableofcontents attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'tableofcontents', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
