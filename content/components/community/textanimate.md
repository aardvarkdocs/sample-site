---
title: "Text Animate"
description: "The textAnimate tag — a Community Component wrapping @gfazioli/mantine-text-animate
  to reveal or loop text with fade, blur, scale, and slide effects, animated by character, word,
  or line. Usage, options, and live examples."
menu: components
parent: community
weight: 320
---

# Text Animate

`{% raw %}{% textAnimate %}{% endraw %}` animates a run of text — revealing it (or looping it)
with an effect, broken up by character, word, or line. Reach for it on a hero headline, a
tagline, or anywhere a little motion earns its keep.

> **A Community Component** — wraps [TextAnimate](https://gfazioli.github.io/mantine-text-animate/)
> by **gfazioli**, **MIT** licensed, npm `@gfazioli/mantine-text-animate`.

Use it as `{% raw %}{% textAnimate %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'textAnimate', …)`. The text is the block body or
the plain-text `text` param.

## Demonstrations

### Basic reveal

`animate='in'` reveals the text once; `animation` picks the effect (fade, blur, scale, slideUp,
slideDown, slideLeft, slideRight, …); `by` sets the granularity (text, word, character, line).

{% textAnimate animate='in' animation='fade' by='word' %}
Documentation that moves with you
{% endTextAnimate %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% textAnimate animate='in' animation='fade' by='word' %}
Documentation that moves with you
{% endTextAnimate %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'textAnimate',
          animate='in', animation='fade', by='word',
          children='Documentation that moves with you')
```
{% endAccordionSection %}
{% endAccordion %}

### Looping animation

`animate='loop'` runs the effect continuously; `loopDelay` (ms) is the pause between cycles.
Per-character blur makes a nice attention-getter.

{% textAnimate animate='loop' animation='blur' by='character' loopDelay=1200 %}
Always shipping
{% endTextAnimate %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% textAnimate animate='loop' animation='blur' by='character' loopDelay=1200 %}
Always shipping
{% endTextAnimate %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

### Trigger on scroll

`trigger='inView'` holds the animation until the text scrolls into the viewport, so the reveal
plays as the reader reaches it. `duration` and `delay` (seconds) tune the timing.

{% textAnimate animate='in' animation='slideUp' by='line' trigger='inView' duration=0.6 %}
This line slides up the moment it enters the viewport.
{% endTextAnimate %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% textAnimate animate='in' animation='slideUp' by='line' trigger='inView' duration=0.6 %}
This line slides up the moment it enters the viewport.
{% endTextAnimate %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## With other components

Drop an animated headline inside a [Paper](/components/layout/paper/) surface to build a hero
card — the animation runs on the text while the surface stays put.

{% paper withBorder=true p='xl' radius='md' %}
{% textAnimate animate='in' animation='scale' by='word' %}
Build. Document. Ship.
{% endTextAnimate %}
{% endPaper %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% paper withBorder=true p='xl' radius='md' %}
{% textAnimate animate='in' animation='scale' by='word' %}
Build. Document. Ship.
{% endTextAnimate %}
{% endPaper %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `animate` | `in` / `out` / `loop` / `static` / `none` | Animation mode. `in` reveals once, `loop` runs continuously, `static` shows the text without motion. |
| `animation` | `fade` / `blur` / `scale` / `slideUp` / `slideDown` / `slideLeft` / `slideRight` (plus `*Elastic`, `blurUp`, `blurDown`) | The effect applied to each segment. |
| `by` | `text` / `word` / `character` / `line` | Granularity the text is split into for the animation. |
| `duration` | Number (seconds) | Length of the animation. |
| `delay` | Number (seconds) | Delay before the animation starts. |
| `segmentDelay` | Number (seconds) | Stagger between consecutive segments. |
| `loopDelay` | Integer (ms) | Pause between loop cycles (`animate='loop'`). |
| `trigger` | `inView` | Start when the text scrolls into view, instead of immediately. |
| `text` | string | Plain-text alternative to the block body (HTML-escaped). The block body wins when both are set. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element (see [Injecting Attributes](#injecting-attributes)). |

## CSS Selector

The mounted island is wrapped in an element carrying `data-aardvark-island="TextAnimate"`, so
you can target it from your own CSS:

```css
[data-aardvark-island='TextAnimate'] {
  font-size: 1.5rem;
}
```

The package drives the animation through its own data-attribute selectors
(`[data-text-animate]`, `[data-text-animate-animation]`, `[data-animating]`, …) and CSS
variables; the stylesheet ships from `@gfazioli/mantine-text-animate/styles.css`, imported
automatically by the island.

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes onto the rendered element — useful for `id`,
`data-*` hooks, ARIA, or analytics attributes that aren't component props:

{% textAnimate animate='in' animation='fade' by='word' attr={'id': 'hero-headline', 'data-role': 'headline'} %}
Tagged headline
{% endTextAnimate %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% textAnimate animate='in' animation='fade' by='word' attr={'id': 'hero-headline', 'data-role': 'headline'} %}
Tagged headline
{% endTextAnimate %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'textAnimate',
          animate='in', animation='fade', by='word',
          attr={'id': 'hero-headline', 'data-role': 'headline'},
          children='Tagged headline')
```
{% endAccordionSection %}
{% endAccordion %}
