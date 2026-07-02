---
title: "Indicator"
description: "The built-in indicator tag — a dot or count badge positioned over the corner of another element. Usage, options, and live examples (label, position, color, border, processing)."
---

# Indicator

A small dot or label badge positioned over the corner of another element — a notification
count on an avatar, an online status on an icon, and so on. The block body is the element
being marked; the indicator is drawn over it. Set `label` for a count, or omit it for a plain
dot.

Use it as `{% raw %}{% indicator %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'indicator', …)`. Close the tag with
{% raw %}`{% endIndicator %}`{% endraw %}.

## Demonstrations

### Label, dot, and a pulsing status

Set `label` for a count; omit it for a plain dot; add `processing=true` for a pulsing
animation (a live status):

{% indicator label='3' color='red' %}{% avatar name='Ada Lovelace' %}{% endIndicator %} {% indicator color='blue' %}{% avatar name='Alan Turing' %}{% endIndicator %} {% indicator color='green' processing=true %}{% avatar name='Grace Hopper' %}{% endIndicator %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% indicator label='3' color='red' %}
{% avatar name='Ada Lovelace' %}
{% endIndicator %}

{% indicator color='blue' %}
{% avatar name='Alan Turing' %}
{% endIndicator %}

{% indicator color='green' processing=true %}
{% avatar name='Grace Hopper' %}
{% endIndicator %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'indicator', label='3', color='red',
          children=component('aardvark', 'avatar', name='Ada Lovelace'))
component('aardvark', 'indicator', color='blue',
          children=component('aardvark', 'avatar', name='Alan Turing'))
component('aardvark', 'indicator', color='green', processing=True,
          children=component('aardvark', 'avatar', name='Grace Hopper'))
```
{% endAccordionSection %}
{% endAccordion %}

### Position, border, and offset

`position` places the indicator at any corner or edge — `top-start`, `top-center`,
`top-end` (the default), `middle-start`, …, `bottom-end`. `withBorder` rings it; `offset`
nudges it inward (useful over a rounded target); `radius` rounds a labelled badge.

{% indicator label='1' position='top-start' %}{% avatar name='A' %}{% endIndicator %} {% indicator label='2' position='bottom-end' withBorder=true %}{% avatar name='B' %}{% endIndicator %} {% indicator label='9' position='top-end' offset=4 radius='sm' %}{% avatar name='C' %}{% endIndicator %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% indicator label='1' position='top-start' %}
{% avatar name='A' %}
{% endIndicator %}

{% indicator label='2' position='bottom-end' withBorder=true %}
{% avatar name='B' %}
{% endIndicator %}

{% indicator label='9' position='top-end' offset=4 radius='sm' %}
{% avatar name='C' %}
{% endIndicator %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'indicator', label='1', position='top-start',
          children=component('aardvark', 'avatar', name='A'))
component('aardvark', 'indicator', label='2', position='bottom-end', withBorder=True,
          children=component('aardvark', 'avatar', name='B'))
component('aardvark', 'indicator', label='9', position='top-end', offset=4, radius='sm',
          children=component('aardvark', 'avatar', name='C'))
```
{% endAccordionSection %}
{% endAccordion %}

### Size, disabled, and autoContrast

`size` sets the dot diameter in pixels. `disabled` renders only the child (no indicator) —
handy for toggling the badge in a loop. `autoContrast` picks a readable label color for the
background.

{% indicator color='grape' size=16 label='5' %}{% avatar name='D' %}{% endIndicator %} {% indicator color='yellow' label='2' autoContrast=true %}{% avatar name='E' %}{% endIndicator %} {% indicator label='0' disabled=true %}{% avatar name='F' %}{% endIndicator %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% indicator color='grape' size=16 label='5' %}
{% avatar name='D' %}
{% endIndicator %}

{% indicator color='yellow' label='2' autoContrast=true %}
{% avatar name='E' %}
{% endIndicator %}

{% indicator label='0' disabled=true %}
{% avatar name='F' %}
{% endIndicator %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'indicator', color='grape', size=16, label='5',
          children=component('aardvark', 'avatar', name='D'))
component('aardvark', 'indicator', color='yellow', label='2', autoContrast=True,
          children=component('aardvark', 'avatar', name='E'))
component('aardvark', 'indicator', label='0', disabled=True,
          children=component('aardvark', 'avatar', name='F'))
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

The body can be any element. Here a status dot rides on an
[`{% raw %}{% icon %}{% endraw %}`](/components/data-display/icon/); `inline` keeps the wrapper
flowing inline with surrounding text:

{% indicator color='green' size=10 offset=4 inline=true %}{% icon 'bell' size='lg' %}{% endIndicator %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% indicator color='green' size=10 offset=4 inline=true %}
{% icon 'bell' size='lg' %}
{% endIndicator %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'indicator', color='green', size=10, offset=4, inline=True,
          children=component('aardvark', 'icon', 'bell', size='lg'))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `label` | string | Text/count shown in the indicator. Omit it for a plain dot. |
| `color` | any theme color | The indicator's color. |
| `size` | integer (pixels; `10` by default) | Dot diameter. |
| `position` | `top-start`, `top-center`, `top-end` (default), `middle-start`, `middle-center`, `middle-end`, `bottom-start`, `bottom-center`, `bottom-end` | Where the indicator sits over the child. |
| `offset` | integer (pixels) | Nudge inward — useful over a rounded target. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl`, or any CSS value | Corner rounding of a labelled badge. |
| `withBorder` | bool flag (default `false`) | Draw a border around the indicator. |
| `processing` | bool flag (default `false`) | A pulsing animation. |
| `disabled` | bool flag (default `false`) | Render only the child (no indicator). |
| `inline` | bool flag (default `false`) | Lay the container out as an inline element. |
| `autoContrast` | bool flag (default `false`) | Auto-pick a readable label color for the background. |
| body | Markdown / components | The element the indicator is positioned over. |
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="Indicator"]` — or through the Mantine Styles API classes (`.mantine-Indicator-root` and its inner parts):

{% raw %}
```css
/* Every rendered Indicator carries this island marker */
[data-aardvark-island="Indicator"] { }

/* Mantine Styles API class on the root element */
.mantine-Indicator-root { }
.mantine-Indicator-indicator { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% indicator label='3' color='red' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}{% avatar name='Ada Lovelace' %}{% endIndicator %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% indicator label='3' color='red' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}{% avatar name='Ada Lovelace' %}{% endIndicator %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'indicator', label='3', color='red', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''}, children=component('aardvark', 'avatar', name='Ada Lovelace'))
```
{% endAccordionSection %}
{% endAccordion %}
