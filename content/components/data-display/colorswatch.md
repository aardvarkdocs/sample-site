---
title: "ColorSwatch"
description: "The built-in colorswatch tag — a swatch that displays a single color. Usage, options, and live examples (size, radius, shadow, content)."
---

# ColorSwatch

A swatch that displays one color — handy in palettes, legends, and design docs. The `color`
attribute takes any CSS color value: a hex, an `rgb()`/`rgba()`, or a named color. Swatches are
round out of the box; `radius` squares them off. An optional block body renders **inside** the
swatch.

Use it as `{% raw %}{% colorswatch %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'colorswatch', …)`.

## Demonstrations

### Color values

`color` accepts hex, `rgba()`, and named colors:

{% colorswatch color='#7048e8' %} {% colorswatch color='rgba(112, 72, 232, 0.5)' %} {% colorswatch color='#e64980' %} {% colorswatch color='#12b886' %} {% colorswatch color='#fab005' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% colorswatch color='#7048e8' %}
{% colorswatch color='rgba(112, 72, 232, 0.5)' %}
{% colorswatch color='#e64980' %}
{% colorswatch color='#12b886' %}
{% colorswatch color='#fab005' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'colorswatch', color='#7048e8')
component('aardvark', 'colorswatch', color='rgba(112, 72, 232, 0.5)')
component('aardvark', 'colorswatch', color='#e64980')
component('aardvark', 'colorswatch', color='#12b886')
component('aardvark', 'colorswatch', color='#fab005')
```
{% endAccordionSection %}
{% endAccordion %}

### Size, radius, and shadow

`size` sets the width and height (any CSS value). `radius` squares off the corners of the
default disc. `withShadow` is on by default — pass `withShadow=false` to drop the inner shadow.

{% colorswatch color='#7048e8' size='1rem' %} {% colorswatch color='#7048e8' size='2.5rem' %} {% colorswatch color='#7048e8' radius='sm' %} {% colorswatch color='#7048e8' withShadow=false %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% colorswatch color='#7048e8' size='1rem' %}
{% colorswatch color='#7048e8' size='2.5rem' %}
{% colorswatch color='#7048e8' radius='sm' %}
{% colorswatch color='#7048e8' withShadow=false %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'colorswatch', color='#7048e8', size='1rem')
component('aardvark', 'colorswatch', color='#7048e8', size='2.5rem')
component('aardvark', 'colorswatch', color='#7048e8', radius='sm')
component('aardvark', 'colorswatch', color='#7048e8', withShadow=False)
```
{% endAccordionSection %}
{% endAccordion %}

### Content inside the swatch

An optional block body renders inside the swatch — for example, a check to mark the selected
color:

{% colorswatch color='#12b886' size='2rem' %}{% icon 'check' %}{% endColorswatch %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% colorswatch color='#12b886' size='2rem' %}{% icon 'check' %}{% endColorswatch %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'colorswatch', color='#12b886', size='2rem',
          children=component('aardvark', 'icon', 'check'))
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Swatches line up well inside a [`{% raw %}{% group %}{% endraw %}`](/components/layout/group/)
as a legend or palette:

{% group gap='xs' %}
{% colorswatch color='#7048e8' %}
{% colorswatch color='#e64980' %}
{% colorswatch color='#12b886' %}
{% colorswatch color='#fab005' %}
{% endGroup %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% group gap='xs' %}
{% colorswatch color='#7048e8' %}
{% colorswatch color='#e64980' %}
{% colorswatch color='#12b886' %}
{% colorswatch color='#fab005' %}
{% endGroup %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
swatches = ''.join(
    component('aardvark', 'colorswatch', color=c)
    for c in ('#7048e8', '#e64980', '#12b886', '#fab005')
)
component('aardvark', 'group', gap='xs', children=swatches)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `color` | any CSS color value — `#fff`, `rgba(...)`, a named color (**required**) | The color the swatch displays. |
| `size` | any CSS value (default `28px`) | The swatch's width and height. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl`, or any CSS value | Corner rounding. A swatch is a full circle unless you set this. |
| `withShadow` | bool flag (default `true`) | Inner box-shadow. Set `withShadow=false` to remove it. |
| body | Markdown / components | Content rendered inside the swatch (e.g. a check icon). |

> **Good to know.** A translucent `color` — `rgba(…)`, an `#RRGGBBAA` hex — is drawn over a
> checkerboard so the transparency is visible rather than blending into the page, as the second
> swatch above shows. The swatch is a plain block with no label of its own, so pair it with
> text — or give it an `aria-label` through `attr={…}` — when the color itself carries the
> meaning.

## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="ColorSwatch"]` — or through the Mantine Styles API classes (`.mantine-ColorSwatch-root` and its inner parts):

{% raw %}
```css
/* Every rendered ColorSwatch carries this island marker */
[data-aardvark-island="ColorSwatch"] { }

/* Mantine Styles API class on the root element */
.mantine-ColorSwatch-root { }
.mantine-ColorSwatch-colorOverlay { }
.mantine-ColorSwatch-shadowOverlay { }
.mantine-ColorSwatch-alphaOverlay { }    /* the checkerboard behind a translucent color */
.mantine-ColorSwatch-childrenOverlay { } /* the block body, rendered inside the swatch */
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% colorswatch color='#7048e8' attr={'onclick': '''
const value = this.tagName;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% colorswatch color='#7048e8' attr={'onclick': '''
const value = this.tagName;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'colorswatch', color='#7048e8', attr={'onclick': '''
const value = this.tagName;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
