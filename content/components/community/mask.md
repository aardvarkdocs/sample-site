---
title: "Mask"
description: "The Mask community component — a cursor-follow spotlight that reveals its content through a soft gradient mask tracking the pointer. Usage, options, and live examples."
menu: components
parent: community
weight: 41
---

# Mask

`mask` is a **cursor-follow spotlight**: it reveals its content through a soft radial or linear
gradient that can track the pointer, so only the area under (or near) the cursor is fully
visible while the rest fades away. Reach for it to add a "flashlight" reveal over an image, a
hero, or a block of text.

A **Community Component** — wraps [Mask](https://gfazioli.github.io/mantine-mask/) by
**gfazioli**, **MIT** licensed, npm `@gfazioli/mantine-mask`.

> This is a different component from [MaskInput](/components/inputs/maskinput/), the formatted
> text input. The bare name `mask` was free, so this spotlight keeps the natural name.

Use it as `{% raw %}{% mask … %}{% endraw %}` in Markdown, or call it from Python logic (loops,
snippets) via `component('aardvark', 'mask', …)`. The block body is the content the spotlight
reveals.

## Demonstrations

### Static radial mask

By default the mask is a static radial spotlight centered on the content. The block body is
revealed through it.

{% raw %}
```aardvark
{% mask variant='radial' maskRadius='200px' %}
{% paper withBorder=true p='xl' radius='md' %}
## Spotlight
This whole panel sits behind a soft radial mask — the center is sharp and the edges fade.
{% endPaper %}
{% endMask %}
```
{% endraw %}

{% mask variant='radial' maskRadius='200px' %}
{% paper withBorder=true p='xl' radius='md' %}
## Spotlight
This whole panel sits behind a soft radial mask — the center is sharp and the edges fade.
{% endPaper %}
{% endMask %}

### Cursor-follow spotlight

Set `withCursorMask=true` so the spotlight follows the pointer. `easing` (0-1) controls how
smoothly it trails the cursor.

{% raw %}
```aardvark
{% mask withCursorMask=true maskRadius='160px' easing=0.15 %}
{% paper withBorder=true p='xl' radius='md' %}
Move your cursor across this panel — the bright spotlight tracks the pointer and the rest
dims behind the mask.
{% endPaper %}
{% endMask %}
```
{% endraw %}

{% mask withCursorMask=true maskRadius='160px' easing=0.15 %}
{% paper withBorder=true p='xl' radius='md' %}
Move your cursor across this panel — the bright spotlight tracks the pointer and the rest
dims behind the mask.
{% endPaper %}
{% endMask %}

### Inverted mask

`invertMask=true` flips the effect — the center is hidden and the surroundings are shown,
like a vignette punched out of the middle.

{% raw %}
```aardvark
{% mask withCursorMask=true invertMask=true maskRadius='140px' %}
{% paper withBorder=true p='xl' radius='md' %}
With the mask inverted, the area under the cursor is the part that fades out.
{% endPaper %}
{% endMask %}
```
{% endraw %}

{% mask withCursorMask=true invertMask=true maskRadius='140px' %}
{% paper withBorder=true p='xl' radius='md' %}
With the mask inverted, the area under the cursor is the part that fades out.
{% endPaper %}
{% endMask %}

### Reveal on hover

`activation='hover'` keeps the content fully visible until the pointer enters, then engages
the mask — a subtle reveal-on-hover.

{% raw %}
```aardvark
{% mask activation='hover' withCursorMask=true maskRadius='180px' %}
{% paper withBorder=true p='xl' radius='md' %}
This panel is plain until you hover it — then the spotlight switches on.
{% endPaper %}
{% endMask %}
```
{% endraw %}

{% mask activation='hover' withCursorMask=true maskRadius='180px' %}
{% paper withBorder=true p='xl' radius='md' %}
This panel is plain until you hover it — then the spotlight switches on.
{% endPaper %}
{% endMask %}

## With other components

Mask wraps any content, including an [Image](/components/data-display/image/) — the spotlight
then reveals the photo as the cursor moves.

{% raw %}
```aardvark
{% mask withCursorMask=true maskRadius='180px' %}
{% image src='https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800' alt='Forest' zoom=false %}
{% endMask %}
```
{% endraw %}

{% mask withCursorMask=true maskRadius='180px' %}
{% image src='https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800' alt='Forest' zoom=false %}
{% endMask %}

## Attributes

Omit any attribute to take its default. Bare flags (e.g. `withCursorMask`) become `=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `variant` | `radial` / `linear` (default `radial`) | Mask gradient shape. |
| `withCursorMask` | `true` / `false` (default `false`) | Make the spotlight follow the cursor. |
| `activation` | `always` / `hover` / `focus` / `pointer` (default `always`) | When the mask is active. |
| `maskRadius` | number (px) or a CSS length (default `240`) | Radius of the spotlight. |
| `maskRadiusX` / `maskRadiusY` | number or CSS length | Override the radius per axis. |
| `maskOpacity` | `0`–`1` (default `1`) | Opacity of the masked content. |
| `maskFeather` | `0`–`100` | Edge softness: `0` = hard, `100` = full fade (overrides the stops below). |
| `maskTransparencyStart` / `maskTransparencyEnd` | percentage | Gradient start / end stops. |
| `maskX` / `maskY` | percentage (default `50`) | Static spotlight center when not following the cursor. |
| `maskAngle` | number or CSS angle (default `90`) | Gradient angle when `variant='linear'`. |
| `easing` | `0`–`1` (default `0.12`) | Cursor-follow smoothing (lower = slower trail). |
| `animation` | `lerp` / `none` (default `lerp`) | `lerp` eases toward the cursor; `none` snaps instantly. |
| `invertMask` | `true` / `false` (default `false`) | Hide the center and show the surroundings. |
| `cursorOffsetX` / `cursorOffsetY` | number (px) | Offset the spotlight from the cursor. |
| `trackPointerOnDocument` | `true` / `false` (default `false`) | Track the pointer across the whole page. |
| `clampToBounds` | `true` / `false` (default `false`) | Keep the spotlight inside the container. |
| `clampPadding` | number (px) | Extra padding when `clampToBounds` is on. |
| `recenterOnResize` / `recenterOnChildrenChange` | `true` / `false` (default `false`) | Recenter the static mask on layout changes. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

## CSS Selector

The component mounts inside a wrapper carrying `data-aardvark-island="Mask"`, and Mantine's
Mask exposes Styles API class names you can target:

```css
/* The masked container */
[data-aardvark-island='Mask'] .mantine-Mask-root { }
/* The gradient mask layer itself */
[data-aardvark-island='Mask'] .mantine-Mask-mask { }
```

The mask geometry rides CSS variables (`--mask-radius`, `--mask-opacity`,
`--mask-transparency-start`, `--mask-transparency-end`) you can also override.

## Injecting Attributes

Use `attr={…}` to forward raw HTML attributes (data-*, ARIA, etc.) onto the rendered element —
they ride a separate channel from the React props, so they never collide with a component
prop.

{% mask withCursorMask=true attr={'data-analytics': 'spotlight', 'data-section': 'hero'} %}
{% paper withBorder=true p='xl' radius='md' %}
The spotlight follows your cursor, and the rendered element carries the injected
`data-analytics` and `data-section` attributes.
{% endPaper %}
{% endMask %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% mask withCursorMask=true attr={'data-analytics': 'spotlight', 'data-section': 'hero'} %}
{% paper withBorder=true p='xl' radius='md' %}
The spotlight follows your cursor, and the rendered element carries the injected
`data-analytics` and `data-section` attributes.
{% endPaper %}
{% endMask %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'mask', withCursorMask=True,
          attr={'data-analytics': 'spotlight', 'data-section': 'hero'},
          children=component('aardvark', 'paper', withBorder=True, p='xl', radius='md',
                             children='The spotlight follows your cursor, and the rendered element carries the injected `data-analytics` and `data-section` attributes.'))
```
{% endAccordionSection %}
{% endAccordion %}
