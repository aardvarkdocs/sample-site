---
title: "Skeleton"
description: "The built-in skeleton tag — a shimmering placeholder for content that hasn't loaded, with height, width, radius, circle, visible, and animate. Usage, options, and live examples."
---

# Skeleton

A built-in tag for a loading placeholder — a shimmering grey block that stands in
for content that hasn't loaded yet. Set a `height` (and optionally a `width`),
`radius`, or `circle` for an avatar shape. Wrap real content as the block body and
reveal it with `visible=false`; `animate=false` stops the shimmer.

Use it as `{% raw %}{% skeleton %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'skeleton', …)`.

## Demonstrations

### Lines

Set a `height` and an optional `width` to mock up text lines:

{% skeleton height='1rem' %}
{% skeleton height='1rem' width='70%' %}
{% skeleton height='1rem' width='40%' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% skeleton height='1rem' %}
{% skeleton height='1rem' width='70%' %}
{% skeleton height='1rem' width='40%' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'skeleton', height='1rem')
component('aardvark', 'skeleton', height='1rem', width='70%')
component('aardvark', 'skeleton', height='1rem', width='40%')
```
{% endAccordionSection %}
{% endAccordion %}

### Circle and radius

`circle` makes an avatar-shaped placeholder (width and radius track the height);
`radius` rounds a rectangular one:

{% group %}
{% skeleton circle=true height='48' %}
{% skeleton height='48' width='200' radius='md' %}
{% endGroup %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% group %}
{% skeleton circle=true height='48' %}
{% skeleton height='48' width='200' radius='md' %}
{% endGroup %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'skeleton', circle=True, height='48')
component('aardvark', 'skeleton', height='48', width='200', radius='md')
```
{% endAccordionSection %}
{% endAccordion %}

### Static (no shimmer)

`animate=false` keeps a plain grey placeholder with no shimmer animation:

{% skeleton height='1rem' width='60%' animate=false %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% skeleton height='1rem' width='60%' animate=false %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'skeleton', height='1rem', width='60%', animate=False)
```
{% endAccordionSection %}
{% endAccordion %}

### Wrapping content

Wrap real content as the block body and reveal it with `visible=false` — the
skeleton overlays the content while `visible` is `true`:

{% skeleton visible=false %}
This content shows through once `visible=false`.
{% endSkeleton %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% skeleton visible=false %}
This content shows through once `visible=false`.
{% endSkeleton %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'skeleton', visible=False,
          children='This content shows through once `visible=false`.')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Compose a few skeletons into a card-style placeholder — a circle avatar beside two
lines, all inside a `{% raw %}{% paper %}{% endraw %}`:

{% paper withBorder=true p="md" radius="md" %}
{% group %}
{% skeleton circle=true height='40' %}
{% stack gap="xs" %}
{% skeleton height='0.8rem' width='160' %}
{% skeleton height='0.8rem' width='100' %}
{% endStack %}
{% endGroup %}
{% endPaper %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% paper withBorder=true p="md" radius="md" %}
{% group %}
{% skeleton circle=true height='40' %}
{% stack gap="xs" %}
{% skeleton height='0.8rem' width='160' %}
{% skeleton height='0.8rem' width='100' %}
{% endStack %}
{% endGroup %}
{% endPaper %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'skeleton', circle=True, height='40')
component('aardvark', 'skeleton', height='0.8rem', width='160')
component('aardvark', 'skeleton', height='0.8rem', width='100')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `height` | A number (px → rem) or any CSS value | Block height. |
| `width` | A number or CSS value | Block width. Defaults to `100%`; ignored when `circle` is set. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl`, or any CSS value | Corner rounding of a rectangular placeholder. |
| `circle` | bool (default `false`) | Render a circle (width and radius track the height) — good for an avatar placeholder. |
| `visible` | bool (default `true`) | When `false`, show the wrapped block body instead of the shimmer. |
| `animate` | bool (default `true`) | Toggle the shimmer animation. |
| *(body)* | Markdown | Content the skeleton overlays; revealed when `visible=false` (`children=` from Python). |


## CSS Selectors

Each `skeleton` carries `data-aardvark-island="Skeleton"` on its wrapper, and Mantine exposes its parts as `mantine-Skeleton-*` classes — target either to style it from your theme CSS.

{% raw %}
```css
[data-aardvark-island="Skeleton"] {
  /* style every skeleton on the page */
}

.mantine-Skeleton-root {
  /* the root part */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% skeleton height='1rem' attr={'onclick': '''
const value = this.tagName;
console.log('attr demo value:', value);
alert(value);
'''} %}
{% endSkeleton %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% skeleton height='1rem' attr={'onclick': '''
const value = this.tagName;
console.log('attr demo value:', value);
alert(value);
'''} %}
{% endSkeleton %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'skeleton', height='1rem', attr={'onclick': '''
const value = this.tagName;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
