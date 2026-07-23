---
title: "Overlay"
description: "The built-in overlay tag — a dimming or gradient veil over a box, for
  spotlighting content or a disabled state. Usage, options, and live examples."
---

# Overlay

A **built-in** tag for a dimming veil over a box — for spotlighting content, a hover
scrim, or a disabled state. The tag wraps the veil in a sized box so it's visible
right here on the page, and the block body renders centered on top of the veil. Tune
the veil with `color`, `backgroundOpacity`, `blur`, and `radius`, or swap the flat
color for a `gradientFrom`/`gradientTo`/`gradientDeg` linear gradient.

Use it as `{% raw %}{% overlay %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'overlay', …)`.

## Demonstrations

A flat dimming veil — set the `color` and `backgroundOpacity` (`0`–`1`); the body
sits centered above it:

{% overlay color='#000' backgroundOpacity=0.6 %}
{% text c='white' fw='700' %}Spotlighted content{% endText %}
{% endOverlay %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% overlay color='#000' backgroundOpacity=0.6 %}
{% text c='white' fw='700' %}Spotlighted content{% endText %}
{% endOverlay %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
label = component('aardvark', 'text', c='white', fw='700', children='Spotlighted content')
component('aardvark', 'overlay', color='#000', backgroundOpacity=0.6, children=label)
```
{% endAccordionSection %}
{% endAccordion %}

### A blurred veil

`blur` frosts whatever sits behind the veil (in px); `radius` rounds the box:

{% overlay color='#000' backgroundOpacity=0.35 blur=4 radius='md' %}
{% text c='white' fw='700' %}Frosted{% endText %}
{% endOverlay %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% overlay color='#000' backgroundOpacity=0.35 blur=4 radius='md' %}
{% text c='white' fw='700' %}Frosted{% endText %}
{% endOverlay %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
label = component('aardvark', 'text', c='white', fw='700', children='Frosted')
component('aardvark', 'overlay', color='#000', backgroundOpacity=0.35, blur=4, radius='md', children=label)
```
{% endAccordionSection %}
{% endAccordion %}

### A gradient veil

Pass `gradientFrom` / `gradientTo` / `gradientDeg` for a fade instead of a flat
color — its start/end colors and angle:

{% overlay gradientFrom='rgba(0,0,0,0.8)' gradientTo='rgba(0,0,0,0)' gradientDeg=0 %}
{% text c='white' fw='700' %}Bottom-up fade{% endText %}
{% endOverlay %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% overlay gradientFrom='rgba(0,0,0,0.8)' gradientTo='rgba(0,0,0,0)' gradientDeg=0 %}
{% text c='white' fw='700' %}Bottom-up fade{% endText %}
{% endOverlay %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
label = component('aardvark', 'text', c='white', fw='700', children='Bottom-up fade')
component(
    'aardvark', 'overlay',
    gradientFrom='rgba(0,0,0,0.8)',
    gradientTo='rgba(0,0,0,0)',
    gradientDeg=0,
    children=label,
)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

The body is ordinary Markdown, so any tag can sit on the veil. Here a
[button](/components/buttons/button/) reads as a call to action through a
dimmed scrim:

{% overlay color='#000' backgroundOpacity=0.5 radius='md' %}
{% button text='Unlock this section' variant='filled' color='grape' %}
{% endOverlay %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% overlay color='#000' backgroundOpacity=0.5 radius='md' %}
{% button text='Unlock this section' variant='filled' color='grape' %}
{% endOverlay %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
cta = component('aardvark', 'button', text='Unlock this section', variant='filled', color='grape')
component('aardvark', 'overlay', color='#000', backgroundOpacity=0.5, radius='md', children=cta)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Values | Description |
| --- | --- | --- |
| `color` | any CSS color | Veil color. |
| `backgroundOpacity` | float `0`–`1` | Veil opacity. |
| `blur` | float (px) | Backdrop blur behind the veil. |
| `radius` | `xs`–`xl` or a number | Corner radius of the box. |
| `zIndex` | integer | Stacking order. |
| `gradientFrom` | any CSS color | Start color of a linear-gradient veil (used in place of a flat `color`). |
| `gradientTo` | any CSS color | End color of the gradient. |
| `gradientDeg` | integer (degrees) | Angle of the gradient. |

Setting any of `gradientFrom` / `gradientTo` / `gradientDeg` composes a
`linear-gradient` veil and overrides the flat `color`. Unset gradient endpoints
default to a dark-to-transparent fade at `90°`.

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="Overlay"]`, or through the Mantine Styles API classes:

{% raw %}
```css
/* Every rendered Overlay carries this island marker */
[data-aardvark-island="Overlay"] { }

/* Mantine Styles API classes */
.mantine-Overlay-root { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% overlay color='#000' backgroundOpacity=0.6 attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
{% text c='white' fw='700' %}Spotlighted content{% endText %}
{% endOverlay %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% overlay color='#000' backgroundOpacity=0.6 attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
{% text c='white' fw='700' %}Spotlighted content{% endText %}
{% endOverlay %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
label = component('aardvark', 'text', c='white', fw='700', children='Spotlighted content')
print(component('aardvark', 'overlay', color='#000', backgroundOpacity=0.6, children=label, attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''}))
```
{% endAccordionSection %}
{% endAccordion %}
