---
title: "Compare"
description: "The Compare community component — an image-comparison slider you drag, hover, or auto-play to reveal one image over another. Usage, options, and live examples."
menu: components
parent: community
weight: 40
---

# Compare

`compare` is an **image-comparison slider**: two images stacked behind a divider you drag,
hover, or auto-play to reveal one over the other — the classic "before / after" widget. Give
it a `leftImage` and a `rightImage` (URLs) and it builds the comparison for you.

A **Community Component** — wraps [Compare](https://gfazioli.github.io/mantine-compare/) by
**gfazioli**, **MIT** licensed, npm `@gfazioli/mantine-compare`.

Use it as `{% raw %}{% compare … %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'compare', …)`.

## Demonstrations

### Drag (default)

The default `variant='drag'` lets the reader drag the divider across the image to reveal more
of one side or the other.

{% raw %}
```aardvark
{% compare
   leftImage='https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'
   rightImage='https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'
   leftAlt='Lake' rightAlt='Forest' aspectRatio='16/9' radius='md' %}
```
{% endraw %}

{% compare
   leftImage='https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'
   rightImage='https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'
   leftAlt='Lake' rightAlt='Forest' aspectRatio='16/9' radius='md' %}

### Hover

Set `variant='hover'` so the divider follows the pointer without a drag — move the mouse over
the image and the split tracks the cursor.

{% raw %}
```aardvark
{% compare variant='hover'
   leftImage='https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'
   rightImage='https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'
   leftAlt='Lake' rightAlt='Forest' aspectRatio='16/9' radius='md' %}
```
{% endraw %}

{% compare variant='hover'
   leftImage='https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'
   rightImage='https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'
   leftAlt='Lake' rightAlt='Forest' aspectRatio='16/9' radius='md' %}

### Labels and a horizontal divider

`leftLabel` / `rightLabel` add captions to each side, and `angle=90` rotates the divider to a
top/bottom comparison.

{% raw %}
```aardvark
{% compare angle=90 leftLabel='Before' rightLabel='After'
   leftImage='https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'
   rightImage='https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'
   leftAlt='Before' rightAlt='After' aspectRatio='16/9' radius='md' %}
```
{% endraw %}

{% compare angle=90 leftLabel='Before' rightLabel='After'
   leftImage='https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'
   rightImage='https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'
   leftAlt='Before' rightAlt='After' aspectRatio='16/9' radius='md' %}

### Auto-play

`autoPlay=true` slides the divider back and forth on its own; `autoPlaySpeed` (1-100) tunes
the pace.

{% raw %}
```aardvark
{% compare autoPlay=true autoPlaySpeed=40
   leftImage='https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'
   rightImage='https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'
   leftAlt='Lake' rightAlt='Forest' aspectRatio='16/9' radius='md' %}
```
{% endraw %}

{% compare autoPlay=true autoPlaySpeed=40
   leftImage='https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'
   rightImage='https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'
   leftAlt='Lake' rightAlt='Forest' aspectRatio='16/9' radius='md' %}

## With other components

Drop a Compare inside a [Paper](/components/layout/paper/) surface to frame it with the rest
of a section.

{% raw %}
```aardvark
{% paper withBorder=true p='md' radius='md' %}
{% compare variant='hover'
   leftImage='https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'
   rightImage='https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'
   leftAlt='Lake' rightAlt='Forest' aspectRatio='16/9' radius='md' %}
{% endPaper %}
```
{% endraw %}

{% paper withBorder=true p='md' radius='md' %}
{% compare variant='hover'
   leftImage='https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'
   rightImage='https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'
   leftAlt='Lake' rightAlt='Forest' aspectRatio='16/9' radius='md' %}
{% endPaper %}

## Attributes

Omit any attribute to take its default. Bare flags (e.g. `autoPlay`) become `=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `leftImage` | URL (string) | The image shown on the left / first side. |
| `rightImage` | URL (string) | The image shown on the right / second side. |
| `leftAlt` / `rightAlt` | string | Alt text for each image. |
| `leftLabel` / `rightLabel` | string | A caption rendered over each side. |
| `variant` | `drag` / `hover` / `fixed` (default `drag`) | How the divider is controlled. |
| `aspectRatio` | CSS ratio, e.g. `16/9` (default `16/9`) | Aspect ratio of the container. |
| `radius` | `xs`–`xl`, a number, or a CSS length (default `md`) | Corner rounding. |
| `angle` | `0`–`360` (default `0`) | Divider angle: `0` = vertical, `90` = horizontal. |
| `position` | `0`–`100` | Controlled divider position. |
| `defaultPosition` | `0`–`100` (default `50`) | Initial divider position (uncontrolled). |
| `minDragBound` / `maxDragBound` | `0`–`100` | Constrain how far the divider can travel. |
| `sliderColor` | a Mantine color | Divider line / handle color. |
| `sliderWidth` | number (px, default `2`) | Divider line width. |
| `keyboardStep` / `keyboardShiftStep` | number | Keyboard nudge size (and with Shift). |
| `autoPlay` | `true` / `false` (default `false`) | Continuously slide back and forth. |
| `autoPlaySpeed` | `1`–`100` (default `50`) | Auto-play pace (higher = faster). |
| `autoPlayEasing` | `linear` / `ease-in` / `ease-out` / `ease-in-out` / `spring` | Auto-play easing. |
| `disabled` | `true` / `false` (default `false`) | Disable all interaction. |
| `handleOnly` | `true` / `false` (default `false`) | Only drag from the handle, not the whole line. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

## CSS Selector

The component mounts inside a wrapper carrying `data-aardvark-island="Compare"`, and Mantine's
Compare exposes Styles API class names you can target:

```css
/* The whole comparison container */
[data-aardvark-island='Compare'] .mantine-Compare-root { }
/* The draggable divider line + handle */
[data-aardvark-island='Compare'] .mantine-Compare-sliderLine { }
[data-aardvark-island='Compare'] .mantine-Compare-sliderButton { }
/* The side labels */
[data-aardvark-island='Compare'] .mantine-Compare-leftLabel { }
[data-aardvark-island='Compare'] .mantine-Compare-rightLabel { }
```

## Injecting Attributes

Use `attr={…}` to forward raw HTML attributes (data-*, ARIA, etc.) onto the rendered element —
they ride a separate channel from the React props, so they never collide with a component
prop.

{% compare
   leftImage='/before.png' rightImage='/after.png'
   attr={'data-analytics': 'hero-compare', 'aria-label': 'Before and after'} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% compare
   leftImage='/before.png' rightImage='/after.png'
   attr={'data-analytics': 'hero-compare', 'aria-label': 'Before and after'} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'compare', leftImage='/before.png', rightImage='/after.png',
          attr={'data-analytics': 'hero-compare', 'aria-label': 'Before and after'})
```
{% endAccordionSection %}
{% endAccordion %}
