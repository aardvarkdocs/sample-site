---
title: "Tooltip"
description: "The built-in tooltip tag — a floating label shown on hover or focus of a target. Usage, options, and live examples (position, arrow, color, multiline)."
---

# Tooltip

A floating label that appears when you hover or focus a single target. The target is the
block body; `label` is the floating text. It ships with aardvark, so a tooltip is a
single tag pair with no setup. The tooltip reveals on hover or focus after the page
hydrates — pass `opened` to force it visible in docs and screenshots.

Use it as `{% raw %}{% tooltip %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'tooltip', …)`.

## Demonstrations

### Basic

Hover the target to reveal the label.

{% tooltip label='Saved 2 minutes ago' %}Hover me{% endTooltip %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% tooltip label='Saved 2 minutes ago' %}Hover me{% endTooltip %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'tooltip', label='Saved 2 minutes ago', children='Hover me')
```
{% endAccordionSection %}
{% endAccordion %}

### Position, color, and arrow

`position` anchors the tooltip on any edge (`top` / `bottom` / `left` / `right`, plus
the `-start` / `-end` variants), `color` tints its background, and `withArrow` draws a
pointer. Each tooltip below is pinned open so you can see all three at once:

{% tooltip label='Above, with an arrow' position='top' withArrow=true opened=true %}Top + arrow{% endTooltip %} &nbsp;&nbsp;&nbsp;
{% tooltip label='On the right' position='right' color='grape' withArrow=true opened=true %}Right + color{% endTooltip %} &nbsp;&nbsp;&nbsp;
{% tooltip label='Below the target' position='bottom' color='red' opened=true %}Bottom{% endTooltip %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% tooltip label='Above, with an arrow' position='top' withArrow=true %}Top + arrow{% endTooltip %}
{% tooltip label='On the right' position='right' color='grape' withArrow=true %}Right + color{% endTooltip %}
{% tooltip label='Below the target' position='bottom' color='red' %}Bottom{% endTooltip %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'tooltip', label='Above, with an arrow',
          position='top', withArrow=True, children='Top + arrow')
component('aardvark', 'tooltip', label='On the right',
          position='right', color='grape', withArrow=True, children='Right + color')
component('aardvark', 'tooltip', label='Below the target',
          position='bottom', color='red', children='Bottom')
```
{% endAccordionSection %}
{% endAccordion %}

### Multiline

For longer labels, turn on `multiline` and give it a `width` to wrap at. `radius`,
`offset`, `arrowSize`, `openDelay`, and `closeDelay` further tune the look and timing.

{% tooltip label='A longer tooltip that wraps onto several lines instead of stretching off the edge of the screen.' multiline=true width=220 withArrow=true radius='md' opened=true %}Long label{% endTooltip %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% tooltip label='A longer tooltip that wraps onto several lines instead of stretching off the edge of the screen.' multiline=true width=220 withArrow=true radius='md' %}Long label{% endTooltip %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'tooltip',
          label='A longer tooltip that wraps onto several lines instead of '
                'stretching off the edge of the screen.',
          multiline=True, width=220, withArrow=True, radius='md',
          children='Long label')
```
{% endAccordionSection %}
{% endAccordion %}

### Force it open

`opened=true` keeps the tooltip showing without a hover — useful in docs or to call out
a control:

{% tooltip label='Always visible' opened=true position='bottom' withArrow=true %}Pinned{% endTooltip %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% tooltip label='Always visible' opened=true position='bottom' withArrow=true %}Pinned{% endTooltip %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'tooltip', label='Always visible',
          opened=True, position='bottom', withArrow=True, children='Pinned')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

The target body can be any inline content — including another tag. Here a tooltip wraps a
[Badge](/components/data-display/badge/) so hovering the badge explains the status:

{% tooltip label='Deployed 4 minutes ago' position='top' withArrow=true opened=true %}{% badge color='green' variant='light' %}Live{% endBadge %}{% endTooltip %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% tooltip label='Deployed 4 minutes ago' position='top' withArrow=true %}{% badge color='green' variant='light' %}Live{% endBadge %}{% endTooltip %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'tooltip', label='Deployed 4 minutes ago',
          position='top', withArrow=True,
          children=component('aardvark', 'badge', color='green',
                             variant='light', children='Live'))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default. The target is the block body (or, from
Python, `children`).

| Attribute | Valid values | Description |
| --- | --- | --- |
| `label` | string | The floating text shown over the target. |
| `position` | `top` (default), `bottom`, `left`, `right`, plus the `-start` / `-end` variants | Edge the tooltip anchors to. |
| `color` | any theme color (`blue`, `dark`, `red`, `grape`, …) | Background color of the tooltip. |
| `withArrow` | bare flag → `true` | Draw a small pointer at the anchored edge. |
| `arrowSize` | integer (pixels) | Arrow size. |
| `offset` | integer (pixels) | Gap between the target and the tooltip. |
| `multiline` | bare flag → `true` | Allow the label to wrap (pair with `width`). |
| `width` | integer (pixels) | Max width, for multiline labels. |
| `radius` | `xs`–`xl` or a number | Corner radius of the tooltip. |
| `openDelay` | integer (milliseconds) | Delay before showing on hover. |
| `closeDelay` | integer (milliseconds) | Delay before hiding after the pointer leaves. |
| `transition` | `fade`, `pop`, `scale`, `skew-up`, … | Show/hide transition. |
| `transitionDuration` | integer (milliseconds) | Transition length. |
| `opened` | bare flag → `true` | Force the tooltip open — handy for documentation and screenshots. |

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="Tooltip"]`, or through the Mantine Styles API classes. The tooltip mounts into a portal and its parts exist only while it is shown. The relevant classes:

{% raw %}
```css
/* Every rendered Tooltip carries this island marker */
[data-aardvark-island="Tooltip"] { }

/* Mantine Styles API classes */
.mantine-Tooltip-tooltip { }
.mantine-Tooltip-arrow { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert. (Unlike the other overlays, `attr` lands on the **target** here, not the floating tooltip — Mantine merges a Tooltip ref onto the target element, so the bubble can't be addressed directly.)

{% tooltip label='Saved 2 minutes ago' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}Hover me{% endTooltip %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% tooltip label='Saved 2 minutes ago' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}Hover me{% endTooltip %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'tooltip', label='Saved 2 minutes ago', children='Hover me', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
