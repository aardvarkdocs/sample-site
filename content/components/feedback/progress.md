---
title: "Progress"
description: "The built-in progress tag — a progress bar, single-value or multi-segment, with color, size, radius, and striped/animated variants. Usage, options, and live examples."
---

# Progress

A built-in tag for a progress bar. The simple form takes a single `value` (0–100)
plus `color`, `size`, `radius`, and the `striped` / `animated` toggles. For a
multi-segment bar, pass `sections` as a JSON array of objects — each accepting its
own `value`, `color`, `striped`, `animated`, and a `label` drawn inside the segment.

Use it as `{% raw %}{% progress %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'progress', …)`.

## Demonstrations

### Value

Set `value` from 0 to 100:

{% progress value=65 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% progress value=65 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'progress', value=65)
```
{% endAccordionSection %}
{% endAccordion %}

### Size, radius, and color

`size` takes `xs`–`xl` or a number of px for the bar height; `radius` rounds the
corners; `color` sets the fill:

{% progress value=30 size="sm" color="grape" %}

{% progress value=75 size="xl" radius="xl" color="cyan" %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% progress value=30 size="sm" color="grape" %}
{% progress value=75 size="xl" radius="xl" color="cyan" %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'progress', value=30, size='sm', color='grape')
component('aardvark', 'progress', value=75, size='xl', radius='xl', color='cyan')
```
{% endAccordionSection %}
{% endAccordion %}

### Striped and animated

`striped` adds diagonal stripes; `animated` animates them (and implies `striped`):

{% progress value=55 striped=true %}

{% progress value=55 animated=true color="orange" %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% progress value=55 striped=true %}
{% progress value=55 animated=true color="orange" %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'progress', value=55, striped=True)
component('aardvark', 'progress', value=55, animated=True, color='orange')
```
{% endAccordionSection %}
{% endAccordion %}

### Multiple segments

Pass `sections` as a JSON array — each object is one colored segment. Use it to
break a bar into parts (for example, disk usage by category). Each section accepts
its own `striped` and `animated` flags, and a `label` rendered inside the segment:

{% progress sections='[{"value":35,"color":"cyan"},{"value":25,"color":"orange"},{"value":15,"color":"grape"}]' size="xl" %}

{% progress sections='[{"value":40,"color":"teal","striped":true},{"value":20,"color":"red","animated":true}]' size="lg" radius="md" %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% progress sections='[{"value":35,"color":"cyan"},{"value":25,"color":"orange"},{"value":15,"color":"grape"}]' size="xl" %}
{% progress sections='[{"value":40,"color":"teal","striped":true},{"value":20,"color":"red","animated":true}]' size="lg" radius="md" %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'progress', size='xl', sections=(
    '[{"value":35,"color":"cyan"},'
    '{"value":25,"color":"orange"},'
    '{"value":15,"color":"grape"}]'))
component('aardvark', 'progress', size='lg', radius='md', sections=(
    '[{"value":40,"color":"teal","striped":true},'
    '{"value":20,"color":"red","animated":true}]'))
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Label a bar with a `{% raw %}{% text %}{% endraw %}` line above it, grouped in a
`{% raw %}{% stack %}{% endraw %}`:

{% stack gap="xs" %}
{% text size="sm" fw="500" %}Storage used — 70%{% endText %}
{% progress value=70 color="teal" %}
{% endStack %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% stack gap="xs" %}
{% text size="sm" fw="500" %}Storage used — 70%{% endText %}
{% progress value=70 color="teal" %}
{% endStack %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'text', size='sm', fw='500', children='Storage used — 70%')
component('aardvark', 'progress', value=70, color='teal')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `value` | A number 0–100 | Fill percentage (simple, single-segment form). Ignored when `sections` is set. |
| `color` | Any theme color or a CSS color value | Bar color. Ignored when `sections` is set — put `color` on each section instead. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl`, or a number of px | Bar height. Defaults to Mantine's `md`. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl`, or a CSS value | Corner rounding. |
| `striped` | bool (default `false`) | Add diagonal stripes. Ignored when `sections` is set — put `striped` on the section instead. |
| `animated` | bool (default `false`) | Animate the stripes (implies `striped`). Ignored when `sections` is set — put `animated` on the section instead. |
| `sections` | A JSON array of `{value, color, striped?, animated?, label?}` objects | Multi-segment bar. Each object is one colored segment, and `label` is drawn inside it. Invalid JSON degrades to a build-time HTML comment. |

{% callout title="Good to know" severity="info" %}
`sections` and the single-value form are two different bars, not two ways to configure
one. When `sections` is set the bar is built from those segments alone: `value`, `color`,
`striped`, and `animated` on the tag are dropped, and only `size` and `radius` still
apply. Set the color and the stripe flags on each section object instead.
{% endCallout %}

## CSS Selectors

The two forms mount under different island names: the single-value bar is
`data-aardvark-island="Progress"`, and the multi-segment one is
`data-aardvark-island="ProgressRoot"`. Both render Mantine's `Progress` parts, so the
`mantine-Progress-*` classes reach either one — use those to style every bar at once.

{% raw %}
```css
[data-aardvark-island="Progress"] {
  /* style every single-value progress bar on the page */
}

[data-aardvark-island="ProgressRoot"] {
  /* style every multi-segment progress bar on the page */
}

.mantine-Progress-root {
  /* the root part — both forms */
}

.mantine-Progress-section {
  /* the section part — the fill, and each segment of a multi-segment bar */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% progress value=65 attr={'onclick': '''
const value = this.tagName;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% progress value=65 attr={'onclick': '''
const value = this.tagName;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'progress', value=65, attr={'onclick': '''
const value = this.tagName;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
