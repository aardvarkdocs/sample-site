---
title: "Progress"
description: "The built-in progress tag — a progress bar, single-value or multi-segment, with color, size, radius, and striped/animated variants. Usage, options, and live examples."
---

# Progress

A built-in tag for a progress bar. The simple form takes a single `value` (0–100)
plus `color`, `size`, `radius`, and the `striped` / `animated` toggles. For a
multi-segment bar, pass `sections` as a JSON array of objects — each accepting its
own `value`, `color`, `striped`, and `animated`.

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
break a bar into parts (for example, disk usage by category). Each section
accepts its own `striped` and `animated` flags:

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
| `value` | A number 0–100 | Fill percentage (simple, single-segment form). |
| `color` | Any theme color or a CSS color value | Bar color. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl`, or a number of px | Bar height. Defaults to Mantine's `md`. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl`, or a CSS value | Corner rounding. |
| `striped` | bool (default `false`) | Add diagonal stripes. |
| `animated` | bool (default `false`) | Animate the stripes (implies `striped`). |
| `sections` | A JSON array of `{value, color, striped?, animated?}` objects | Multi-segment bar. Each object is one colored segment; mutually exclusive with `value`. Invalid JSON degrades to a build-time HTML comment. |


## CSS Selectors

Each `progress` carries `data-aardvark-island="Progress"` on its wrapper, and Mantine exposes its parts as `mantine-Progress-*` classes — target either to style it from your theme CSS.

{% raw %}
```css
[data-aardvark-island="Progress"] {
  /* style every progress on the page */
}

.mantine-Progress-root {
  /* the root part */
}

.mantine-Progress-section {
  /* the section part */
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
