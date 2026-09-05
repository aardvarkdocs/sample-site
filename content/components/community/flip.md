---
title: "Flip"
description: "The Flip Community Component — a two-faced card that flips between a front and a back face on click. Usage, options, and live examples."
parent: community
weight: 62
---

# Flip

`flip` is a two-faced surface that rotates between a **front** and a **back** face. The block
body is the front face; set `back` for the back face. By default it flips on click; turn on
`swipeable` for touch flips, and use `direction`, `duration`, `easing`, and `perspective` to
shape the animation.

A **Community Component** — wraps [Flip](https://gfazioli.github.io/mantine-flip/) by
**gfazioli**, **MIT** licensed, npm `@gfazioli/mantine-flip`.

Use it as `{% raw %}{% flip %}…{% endFlip %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'flip', …)`.

## Demonstrations

The block body is the front face. Set `back` for the back face, then click the card to flip
it. Give it a width and height (`w` / `h`) so both faces share a box.

{% flip w=320 h=160 back='And this is the back. Click again to flip back.' %}
This is the front face. Click to flip.
{% endFlip %}

<br>

{% raw %}
```aardvark
{% flip w=320 h=160 back='And this is the back. Click again to flip back.' %}
This is the front face. Click to flip.
{% endFlip %}
```
{% endraw %}

### Flip direction

Set `direction` to `vertical` to flip top-over-bottom instead of the default `horizontal`.

{% flip w=320 h=160 direction='vertical' back='Flipped vertically.' %}
Vertical flip — click me.
{% endFlip %}

<br>

{% raw %}
```aardvark
{% flip w=320 h=160 direction='vertical' back='Flipped vertically.' %}
Vertical flip — click me.
{% endFlip %}
```
{% endraw %}

### Easing and duration

`easing` accepts `ease`, `ease-in`, `ease-out`, `ease-in-out` (the default), `linear`, or
`spring`; `duration` is the flip time in seconds (default `0.8`), and `perspective` is a CSS
length (e.g. `1200px`, default `1000px`) that sets the 3D depth.

{% flip w=320 h=160 easing='spring' duration=0.9 perspective='1200px' back='Sproing!' %}
A bouncy spring flip — click me.
{% endFlip %}

<br>

{% raw %}
```aardvark
{% flip w=320 h=160 easing='spring' duration=0.9 perspective='1200px' back='Sproing!' %}
A bouncy spring flip — click me.
{% endFlip %}
```
{% endraw %}

### Starting flipped

Set `defaultFlipped=true` to show the back face first.

{% flip w=320 h=160 defaultFlipped=true back='You are looking at the back face first.' %}
The hidden front face.
{% endFlip %}

<br>

{% raw %}
```aardvark
{% flip w=320 h=160 defaultFlipped=true back='You are looking at the back face first.' %}
The hidden front face.
{% endFlip %}
```
{% endraw %}

## With other components

The front face is the block body, so it can hold any other component. Here a
[Card](/components/data-display/card/) is the front face and a short message is the back.

{% flip w=340 h=200 back='Thanks for flipping! The back face is plain text.' %}
{% card title='Flip me' withBorder=true %}This whole card is the front face of a flip — click anywhere on it.{% endCard %}
{% endFlip %}

<br>

{% raw %}
```aardvark
{% flip w=340 h=200 back='Thanks for flipping! The back face is plain text.' %}
{% card title='Flip me' withBorder=true %}This whole card is the front face of a flip — click anywhere on it.{% endCard %}
{% endFlip %}
```
{% endraw %}

## Attributes

Omit any attribute to take its default. Bare flags (e.g. `swipeable`) become `=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `back` | Text | The back face content (plain text; HTML-escaped). |
| `flipped` | `true` | Pin the card to the back face — see *Good to know* below. |
| `defaultFlipped` | `true` / `false` (default `false`) | Show the back face first. |
| `direction` | `horizontal` (default) / `vertical` | Axis the card rotates around. |
| `easing` | Any CSS timing function (`ease-in-out` is the default; `linear`, `cubic-bezier(…)`, …) or `spring` | Animation easing. |
| `duration` | A number (seconds, default `0.8`) | Flip animation duration. |
| `perspective` | A CSS length, e.g. `1200px` (default `1000px`) | 3D perspective depth. It reaches CSS verbatim, so include the unit — a bare `1200` is not a length and the browser drops it. |
| `disabled` | `true` / `false` (default `false`) | Freeze the flip. |
| `lazyBack` | `true` / `false` (default `false`) | Render the back face only once it's first shown. |
| `swipeable` | `true` / `false` (default `false`) | Flip on touch swipe. |
| `swipeThreshold` | A number (default `50`) | Swipe distance needed to flip. |
| `w`, `h` | A number (px) or Mantine size token | Width / height of the flip box. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

{% callout severity="info" title="Good to know" %}
`back` is **plain text**: the value is HTML-escaped, so markup and other tags written there
show up literally. When the richer side needs components, make it the block body (the front
face) and add `defaultFlipped=true` so it is the side readers see first.

`flipped` is the *controlled* state. There is no attribute to change it afterwards, so
`flipped=true` pins the card to its back face and clicking does nothing — use
`defaultFlipped=true` for a card that starts flipped but still turns.

Both faces are stacked on top of each other and sized to the card, so the card itself has no
intrinsic height — always give it a `w` and an `h`, or it collapses to nothing.
{% endCallout %}

## CSS Selector

The card and both faces carry stable `mantine-Flip-*` classes you can target from
`custom.css`, and Aardvark's own wrapper attribute scopes a rule to flip cards only:

| Selector | Targets |
| --- | --- |
| `.mantine-Flip-root` | The card root (owns the `--flip-perspective` variable). |
| `.mantine-Flip-flip-container` | The container that holds both faces. |
| `.mantine-Flip-flip-front-face` | The front face. |
| `.mantine-Flip-flip-back-face` | The back face. |
| `[data-aardvark-flip]` | The Aardvark wrapper attribute on the Flip root. |

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes (`id`, `data-*`, ARIA) onto the rendered
element — an escape hatch for anything not covered by a named attribute above. Don't send
`class`, `className`, or `style` through it: those are managed by the component, and the page
logs a console warning if you try.

{% flip w=320 h=160 back='Back face' attr={'id': 'hero-flip', 'data-analytics': 'flip'} %}
Front face
{% endFlip %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% flip w=320 h=160 back='Back face' attr={'id': 'hero-flip', 'data-analytics': 'flip'} %}
Front face
{% endFlip %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'flip', w=320, h=160, back='Back face', children='Front face',
          attr={'id': 'hero-flip', 'data-analytics': 'flip'})
```
{% endAccordionSection %}
{% endAccordion %}
