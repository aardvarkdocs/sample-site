---
title: "Space"
description: "The built-in space tag — an empty spacer that adds horizontal or vertical room between elements. Usage and live examples."
---

# Space

`{% raw %}{% space %}{% endraw %}` is an **empty spacer** — it adds horizontal or vertical room
between elements without reaching for a margin. Set `h` for vertical space (above and below) or
`w` for horizontal space (between inline elements); each takes a Mantine size token (`xs`–`xl`)
or any CSS value. It is self-closing — there is no body.

Use it as `{% raw %}{% space %}{% endraw %}` in Markdown, or call it from Python logic (loops,
snippets) via `component('aardvark', 'space', …)`.

## Vertical space

`h` adds vertical room between stacked elements.

{% badge %}Above{% endBadge %}
{% space h='xl' %}
{% badge %}Below{% endBadge %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% badge %}Above{% endBadge %}
{% space h='xl' %}
{% badge %}Below{% endBadge %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'badge', children='Above')
component('aardvark', 'space', h='xl')
component('aardvark', 'badge', children='Below')
```
{% endAccordionSection %}
{% endAccordion %}

## Horizontal space

`w` adds room between inline elements. Wrapping the row in a
[`group`](/components/layout/group/) with `gap=0` lets the spacer do all the spacing.

{% group gap=0 %}
{% badge %}Left{% endBadge %}{% space w='xl' %}{% badge %}Right{% endBadge %}
{% endGroup %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% group gap=0 %}
{% badge %}Left{% endBadge %}{% space w='xl' %}{% badge %}Right{% endBadge %}
{% endGroup %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'group', gap='0', children=(
    component('aardvark', 'badge', children='Left')
    + component('aardvark', 'space', w='xl')
    + component('aardvark', 'badge', children='Right')
))
```
{% endAccordionSection %}
{% endAccordion %}

## CSS value

Both `h` and `w` accept any CSS length, not just the `xs`–`xl` tokens — handy when you need an
exact gap.

{% badge %}48px above the next badge{% endBadge %}
{% space h='48px' %}
{% badge %}Here{% endBadge %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% badge %}48px above the next badge{% endBadge %}
{% space h='48px' %}
{% badge %}Here{% endBadge %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'badge', children='48px above the next badge')
component('aardvark', 'space', h='48px')
component('aardvark', 'badge', children='Here')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

`space` sits between any two components. Here it adds breathing room between a
[`button`](/components/buttons/button/) and the [`badge`](/components/data-display/badge/)
that follows it.

{% group gap=0 align='center' %}
{% button text='Run' %}{% space w='lg' %}{% badge color='green' %}Idle{% endBadge %}
{% endGroup %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% group gap=0 align='center' %}
{% button text='Run' %}{% space w='lg' %}{% badge color='green' %}Idle{% endBadge %}
{% endGroup %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'group', gap='0', align='center', children=(
    component('aardvark', 'button', text='Run')
    + component('aardvark', 'space', w='lg')
    + component('aardvark', 'badge', color='green', children='Idle')
))
```
{% endAccordionSection %}
{% endAccordion %}

For finer control, the Mantine spacing props on any other tag (`mt`, `mb`, `mx`, …) cover most
cases without a separate spacer.

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `h` | `xs`, `sm`, `md`, `lg`, `xl`, or any CSS value | Vertical space (height of the spacer). |
| `w` | `xs`, `sm`, `md`, `lg`, `xl`, or any CSS value | Horizontal space (width of the spacer). |


## CSS Selectors

Each `space` carries `data-aardvark-island="Space"` on its wrapper; it renders a single spacer element with no Mantine Styles API parts, so target the island wrapper.

{% raw %}
```css
[data-aardvark-island="Space"] {
  /* style every space on the page */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% space h='xl' attr={'onclick': '''
const value = this.tagName;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% space h='xl' attr={'onclick': '''
const value = this.tagName;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'space', h='xl', attr={'onclick': '''
const value = this.tagName;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
