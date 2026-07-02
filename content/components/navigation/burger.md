---
title: "Burger"
description: "The built-in burger tag — a hamburger / cross menu toggle on Mantine's Burger. Usage, options, and live examples (opened state, size, color, line thickness)."
---

# Burger

A **built-in** tag for the classic hamburger menu toggle, built on Mantine's `Burger`.
Set `opened=true` to render the **cross** (an open state) instead of the three lines, and
tune `size`, `color`, `lineSize` (bar thickness), and the morph transition. It is
presentational on its own — wire interactivity with an `onclick` handler or drive it from
a snippet.

Use it as {% raw %}`{% burger %}`{% endraw %} in Markdown, or call it from Python logic (loops, snippets) via `component('aardvark', 'burger', …)`.

## Demonstrations

### Closed and open

Without `opened`, the burger shows the three lines. Set `opened=true` to show the cross.
Always give it a `label` — it becomes the `aria-label`, since the button has no visible
text.

{% burger label='Open navigation' %} {% burger opened=true label='Close navigation' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% burger label='Open navigation' %}
{% burger opened=true label='Close navigation' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'burger', label='Open navigation')
component('aardvark', 'burger', opened=True, label='Close navigation')
```
{% endAccordionSection %}
{% endAccordion %}

### Sizes, colors, and line thickness

`size` takes `xs`–`xl` or any CSS size; `color` takes any theme color; `lineSize` sets
the bar thickness in pixels.

{% burger size='sm' label='Menu' %} {% burger size='lg' color='grape' label='Menu' %} {% burger size='xl' color='teal' lineSize=4 label='Menu' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% burger size='sm' label='Menu' %}
{% burger size='lg' color='grape' label='Menu' %}
{% burger size='xl' color='teal' lineSize=4 label='Menu' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'burger', size='sm', label='Menu')
component('aardvark', 'burger', size='lg', color='grape', label='Menu')
component('aardvark', 'burger', size='xl', color='teal', lineSize=4, label='Menu')
```
{% endAccordionSection %}
{% endAccordion %}

### Transition tuning

`transitionDuration` (ms) and `transitionTimingFunction` (any CSS timing function)
control the burger↔cross morph.

{% burger opened=true color='indigo' transitionDuration=600 transitionTimingFunction='ease-in-out' label='Close menu' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% burger opened=true color='indigo' transitionDuration=600 transitionTimingFunction='ease-in-out' label='Close menu' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'burger', opened=True, color='indigo',
    transitionDuration=600, transitionTimingFunction='ease-in-out',
    label='Close menu',
)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Burger is presentational on its own. To wire a real click, forward an `onclick` through
the island `attr={...}` channel; for true open/close state, drive it from a
[snippet](/authoring/components-and-snippets/) where you own the React state and pass
`opened`/`onClick` to `component('Burger', ...)`. Here it sits in a
{% raw %}`{% group %}`{% endraw %} next to a label.

{% group %}
{% burger label='Toggle navigation' %}
{% anchor url='/components/navigation/' c='dimmed' %}Navigation{% endAnchor %}
{% endGroup %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% group %}
{% burger label='Toggle navigation' attr={'onclick': 'document.body.classList.toggle(\'nav-open\')'} %}
{% anchor url='/components/navigation/' c='dimmed' %}Navigation{% endAnchor %}
{% endGroup %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
burger = component('aardvark', 'burger', label='Toggle navigation', attr={'onclick': "document.body.classList.toggle('nav-open')"})
link = component('aardvark', 'anchor', url='/components/navigation/', c='dimmed', children='Navigation')
component('aardvark', 'group', children=burger + link)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default. Burger renders a `<button>` and takes no body.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `opened` | `true` / `false` (default) | `true` shows the cross (open state); otherwise the three-line burger (closed). |
| `size` | `xs`, `sm`, `md`, `lg`, `xl`, or any CSS size | Overall size of the control. |
| `color` | Any theme color (`blue`, `grape`, …) | Color of the bars. |
| `lineSize` | An integer (pixels) | Thickness of each bar. |
| `transitionDuration` | An integer (milliseconds) | Duration of the burger↔cross morph. |
| `transitionTimingFunction` | A CSS timing function (`ease`, `ease-in-out`, …) | Easing of the morph. |
| `label` | Any string | Accessible name — rendered as `aria-label` (the button has no visible text). |

## CSS Selectors

The control mounts inside an island wrapper carrying `data-aardvark-island="Burger"`; Mantine's Styles API exposes the button root and the morphing bars.

{% raw %}
```css
[data-aardvark-island="Burger"]  /* the island wrapper */
.mantine-Burger-root             /* the <button> */
.mantine-Burger-burger           /* the three-line / cross glyph */
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) onto the rendered button — the same channel the `onclick` shortcut above rides.

{% burger label='Open navigation' attr={'onclick': '''
const value = this.getAttribute('aria-label');
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% burger label='Open navigation' attr={'onclick': '''
const value = this.getAttribute('aria-label');
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'burger', label='Open navigation', attr={'onclick': '''
const value = this.getAttribute('aria-label');
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
