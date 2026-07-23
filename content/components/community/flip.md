---
title: "Flip"
description: "The Flip Community Component — a two-faced card that flips between a front and a back face on click. Usage, options, and live examples."
menu: components
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
| `flipped` | `true` / `false` | Controlled flip state. |
| `defaultFlipped` | `true` / `false` (default `false`) | Show the back face first. |
| `direction` | `horizontal` (default) / `vertical` | Axis the card rotates around. |
| `easing` | `ease` / `ease-in` / `ease-out` / `ease-in-out` (default) / `linear` / `spring` | Animation easing. |
| `duration` | A number (seconds, default `0.8`) | Flip animation duration. |
| `perspective` | A number | 3D perspective depth. |
| `disabled` | `true` / `false` (default `false`) | Freeze the flip. |
| `lazyBack` | `true` / `false` (default `false`) | Render the back face only once it's first shown. |
| `swipeable` | `true` / `false` (default `false`) | Flip on touch swipe. |
| `swipeThreshold` | A number (default `50`) | Swipe distance needed to flip. |
| `w`, `h` | A number (px) or Mantine size token | Width / height of the flip box. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

## CSS Selector

The package exposes these hooks you can target from your site CSS (e.g. a project stylesheet):

| Selector | Element |
| --- | --- |
| `.flip-container` | The container that holds both faces. |
| `.flip-front-face` | The front face. |
| `.flip-back-face` | The back face. |
| `[data-aardvark-flip]` | The aardvark island wrapper around the Flip root. |

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes (id, class, data-*, ARIA, inline style) onto
the rendered element — an escape hatch for anything not covered by a named attribute above.

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
