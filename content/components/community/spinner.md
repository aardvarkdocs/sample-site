---
title: "Spinner"
description: "The built-in spinner tag — an SVG loading spinner with animation variants, segment shapes, gradient colors, glow, and a determinate progress mode."
menu: components
parent: community
weight: 30
---

# Spinner

`spinner` is an SVG-based loading spinner with several animation variants, configurable
segment shapes, gradient colors, glow, and a determinate progress mode. Drop it in wherever
something is loading, or drive `progress` for a percentage-based indicator.

A **Community Component** — wraps [Spinner](https://gfazioli.github.io/mantine-spinner/) by
**gfazioli**, **MIT** licensed, installed from npm as `@gfazioli/mantine-spinner`.

## Demonstrations

A bare `{% raw %}{% spinner %}{% endraw %}` renders the default animated spinner.

{% raw %}
```aardvark
{% spinner %}
```
{% endraw %}

{% spinner %}

### Variants

Set `variant` to one of `fade`, `pulse`, `grow`, or `trail` for different animation styles.

{% raw %}
```aardvark
{% group %}
{% spinner variant='fade' %}
{% spinner variant='pulse' %}
{% spinner variant='grow' %}
{% spinner variant='trail' %}
{% endGroup %}
```
{% endraw %}

{% group %}
{% spinner variant='fade' %}
{% spinner variant='pulse' %}
{% spinner variant='grow' %}
{% spinner variant='trail' %}
{% endGroup %}

### Segments and shapes

`segments` sets how many spokes the spinner draws, and `segmentShape` (`line`, `dot`, or
`arc`) sets their shape.

{% raw %}
```aardvark
{% group %}
{% spinner segments=8 segmentShape='line' %}
{% spinner segments=12 segmentShape='dot' %}
{% spinner segments=6 segmentShape='arc' %}
{% endGroup %}
```
{% endraw %}

{% group %}
{% spinner segments=8 segmentShape='line' %}
{% spinner segments=12 segmentShape='dot' %}
{% spinner segments=6 segmentShape='arc' %}
{% endGroup %}

### Color and gradient

Set a `color` (any theme color), or pass `gradientFrom` / `gradientTo` for a two-color
gradient sweep.

{% raw %}
```aardvark
{% group %}
{% spinner color='grape' size='lg' %}
{% spinner gradientFrom='indigo' gradientTo='cyan' size='lg' %}
{% endGroup %}
```
{% endraw %}

{% group %}
{% spinner color='grape' size='lg' %}
{% spinner gradientFrom='indigo' gradientTo='cyan' size='lg' %}
{% endGroup %}

### Determinate progress

Pass `progress` (0–100) to turn the spinner into a determinate indicator. The body renders
in the center, so you can show the percentage.

{% raw %}
```aardvark
{% spinner progress=68 size='xl' %}68%{% endSpinner %}
```
{% endraw %}

{% spinner progress=68 size='xl' %}68%{% endSpinner %}

### Glow

`glow` adds a colored bloom around the spinner.

{% raw %}
```aardvark
{% spinner color='cyan' glow=8 size='lg' %}
```
{% endraw %}

{% spinner color='cyan' glow=8 size='lg' %}

## With other components

Spinners compose with the other built-in tags. Here one sits inside a
[card](/components/data-display/card/) next to loading copy.

{% raw %}
```aardvark
{% card title="Deploying" %}
{% group %}
{% spinner variant='trail' color='blue' %}
Pushing your site to the edge…
{% endGroup %}
{% endCard %}
```
{% endraw %}

{% card title="Deploying" %}
{% group %}
{% spinner variant='trail' color='blue' %}
Pushing your site to the edge…
{% endGroup %}
{% endCard %}

## Attributes

Omit any attribute to take its default. Numeric attributes keep a deliberate `0`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `variant` | `fade`, `pulse`, `grow`, `trail` | Animation style. |
| `segments` | Integer | Number of spinner segments (spokes). |
| `segmentShape` | `line`, `dot`, `arc` | Shape of each segment. |
| `size` | `xs`–`xl` or a number of px | Overall spinner size. |
| `thickness` | Number | Stroke thickness of each segment. |
| `inner` | Number | Inner radius of the spinner. |
| `color` | Any theme color or CSS color | Spinner color. |
| `direction` | `clockwise`, `counter-clockwise` | Rotation direction. |
| `duration` | Number (seconds) | One full animation cycle's duration. |
| `glow` | Number | Glow / bloom intensity (`0` = none). |
| `progress` | `0`–`100` | Determinate progress; renders a fixed indicator. |
| `minOpacity` | Number (0–1) | Lowest opacity a fading segment reaches. |
| `hueRotate` | `true` / `false` (default `false`) | Cycle segment hues for a rainbow effect. |
| `gradientFrom` | Any theme color or CSS color | Gradient start color. |
| `gradientTo` | Any theme color or CSS color | Gradient end color. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

The block body (between `{% raw %}{% spinner %}{% endraw %}` and `{% raw %}{% endSpinner %}{% endraw %}`) renders in
the center of the spinner — handy for a progress percentage.

## CSS Selector

The spinner is rendered as an SVG element. Its size is driven by the `--spinner-size` CSS
custom property (set from the `size` prop and any responsive `size` object via media
queries), so you can override sizing from your own stylesheet:

```css
.my-loader svg {
  --spinner-size: 64px;
}
```

Target a specific instance by forwarding a class with `attr={…}` (see below).

## Injecting Attributes

The `attr={…}` channel forwards raw HTML attributes straight onto the rendered spinner
element — use it for `id`, `class`, `data-*`, ARIA attributes, or anything else not exposed
as a typed parameter.

{% spinner color='cyan' attr={'class': 'my-loader', 'aria-label': 'Loading'} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% spinner color='cyan' attr={'class': 'my-loader', 'aria-label': 'Loading'} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'spinner', color='cyan', attr={'class': 'my-loader', 'aria-label': 'Loading'})
```
{% endAccordionSection %}
{% endAccordion %}
