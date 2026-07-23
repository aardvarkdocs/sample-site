---
title: "Ring progress"
description: "The built-in ringprogress tag — a circular donut progress ring with one or more colored sections, a center label, thickness, size, and rounded caps. Usage, options, and live examples."
---

# Ring progress

A built-in tag for a circular (donut) progress ring. Pass `sections` as a JSON
array of `{value, color}` objects — one arc per object — and optionally set a
center `label`, the `size` and `thickness` in px, and `roundCaps` for rounded arc
ends.

Use it as `{% raw %}{% ringprogress %}{% endraw %}` in Markdown, or call it from
Python logic (loops, snippets) via `component('aardvark', 'ringprogress', …)`.

## Demonstrations

### Single section

The minimal form — one section and a center label:

{% ringprogress sections='[{"value":40,"color":"cyan"}]' label="40%" %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% ringprogress sections='[{"value":40,"color":"cyan"}]' label="40%" %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'ringprogress',
          sections='[{"value":40,"color":"cyan"}]', label='40%')
```
{% endAccordionSection %}
{% endAccordion %}

### Multiple sections

Each object in `sections` is one colored arc; the values stack around the ring.
`size` sets the ring's width and height in px:

{% ringprogress sections='[{"value":40,"color":"cyan"},{"value":15,"color":"orange"},{"value":15,"color":"grape"}]' label="70%" size=140 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% ringprogress sections='[{"value":40,"color":"cyan"},{"value":15,"color":"orange"},{"value":15,"color":"grape"}]' label="70%" size=140 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'ringprogress', label='70%', size=140, sections=(
    '[{"value":40,"color":"cyan"},'
    '{"value":15,"color":"orange"},'
    '{"value":15,"color":"grape"}]'))
```
{% endAccordionSection %}
{% endAccordion %}

### Thickness and rounded caps

`thickness` sets the arc width in px; `roundCaps` rounds the ends of each arc:

{% ringprogress sections='[{"value":65,"color":"teal"}]' label="65%" thickness=16 roundCaps=true size=140 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% ringprogress sections='[{"value":65,"color":"teal"}]' label="65%" thickness=16 roundCaps=true size=140 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'ringprogress',
          sections='[{"value":65,"color":"teal"}]',
          label='65%', thickness=16, roundCaps=True, size=140)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Pair a ring with a caption underneath, grouped in a centered
`{% raw %}{% stack %}{% endraw %}`:

{% stack align="center" gap="xs" %}
{% ringprogress sections='[{"value":82,"color":"teal"}]' label="82%" size=120 %}
{% text size="sm" c="dimmed" %}Tests passing{% endText %}
{% endStack %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% stack align="center" gap="xs" %}
{% ringprogress sections='[{"value":82,"color":"teal"}]' label="82%" size=120 %}
{% text size="sm" c="dimmed" %}Tests passing{% endText %}
{% endStack %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'ringprogress',
          sections='[{"value":82,"color":"teal"}]', label='82%', size=120)
component('aardvark', 'text', size='sm', c='dimmed', children='Tests passing')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `sections` | A JSON array of `{value, color}` objects | **Required.** One arc per object. Invalid JSON degrades to a build-time HTML comment. |
| `size` | A number of px | Width and height of the ring. Defaults to Mantine's 120. |
| `thickness` | A number of px | Arc thickness. Defaults to Mantine's ~12. |
| `roundCaps` | bool (default `false`) | Round the ends of each arc. |
| `label` | Any string | Text shown in the center of the ring. |


## CSS Selectors

Each `ringprogress` carries `data-aardvark-island="RingProgress"` on its wrapper, and Mantine exposes its parts as `mantine-RingProgress-*` classes — target either to style it from your theme CSS.

{% raw %}
```css
[data-aardvark-island="RingProgress"] {
  /* style every ringprogress on the page */
}

.mantine-RingProgress-root {
  /* the root part */
}

.mantine-RingProgress-svg {
  /* the svg part */
}

.mantine-RingProgress-curve {
  /* the curve part */
}

.mantine-RingProgress-label {
  /* the label part */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% ringprogress sections='[{"value":40,"color":"cyan"}]' label="40%" attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% ringprogress sections='[{"value":40,"color":"cyan"}]' label="40%" attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'ringprogress',
          sections='[{"value":40,"color":"cyan"}]', label='40%', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
