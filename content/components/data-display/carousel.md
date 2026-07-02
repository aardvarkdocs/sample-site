---
title: "Carousel"
description: "The built-in carousel and slide tags — a swipeable strip of slides with controls and indicators. Usage, the slide nesting, and a live example."
---

# Carousel

A **slides carousel**: a strip of slides the reader swipes, drags, or steps through with the
prev/next controls and indicator dots. Put one `{% raw %}{% slide %}{% endraw %}` block per
slide inside a `{% raw %}{% carousel %}{% endraw %}`. It's embla-backed and measures the live
container on mount, so it renders in the browser and hydrates into an interactive island.

Use it as `{% raw %}{% carousel %}…{% endCarousel %}{% endraw %}` in Markdown (with nested
`{% raw %}{% slide %}{% endraw %}` blocks), or call it from Python logic (loops, snippets) via
`component('aardvark', 'carousel', …)` and `component('aardvark', 'slide', …)`.

## A basic carousel

Each `{% raw %}{% slide %}{% endraw %}` body is the slide content (rendered as Markdown). Set
`slideSize` and `slideGap` to fit more than one slide in view at a time.

{% carousel slideSize='70%' slideGap='md' withIndicators=true loop=true %}
{% slide %}
**Slide one** — the first panel in the strip.
{% endSlide %}
{% slide %}
**Slide two** — drag, swipe, or use the arrows.
{% endSlide %}
{% slide %}
**Slide three** — `loop` wraps back to the start.
{% endSlide %}
{% endCarousel %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% carousel slideSize='70%' slideGap='md' withIndicators=true loop=true %}
{% slide %}
**Slide one** — the first panel in the strip.
{% endSlide %}
{% slide %}
**Slide two** — drag, swipe, or use the arrows.
{% endSlide %}
{% slide %}
**Slide three** — `loop` wraps back to the start.
{% endSlide %}
{% endCarousel %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'carousel', slideSize='70%', slideGap='md',
          withIndicators=True, loop=True,
          children=(component('aardvark', 'slide', children='**Slide one**')
                    + component('aardvark', 'slide', children='**Slide two**')
                    + component('aardvark', 'slide', children='**Slide three**')))
```
{% endAccordionSection %}
{% endAccordion %}

## Orientation and sizing

Set `orientation='vertical'` for a top-to-bottom carousel — vertical needs a `height`. Use
`controlSize` and `controlsOffset` to tune the arrow buttons, and turn `withControls` off for a
swipe-only carousel.

{% carousel orientation='vertical' height='180' slideGap='sm' withControls=true %}
{% slide %}
**Top** — a vertical strip stacks its slides.
{% endSlide %}
{% slide %}
**Middle** — scroll with the arrows or drag.
{% endSlide %}
{% slide %}
**Bottom** — `height` is required when vertical.
{% endSlide %}
{% endCarousel %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% carousel orientation='vertical' height='180' slideGap='sm' withControls=true %}
{% slide %}
**Top** — a vertical strip stacks its slides.
{% endSlide %}
{% slide %}
**Middle** — scroll with the arrows or drag.
{% endSlide %}
{% slide %}
**Bottom** — `height` is required when vertical.
{% endSlide %}
{% endCarousel %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Set these on `{% raw %}{% carousel %}{% endraw %}`; omit any to take its Mantine default.
`{% raw %}{% slide %}{% endraw %}` takes no attributes of its own — its body is the slide
content.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `slideSize` | percentage (`70%`) or a number | Slide width relative to the viewport. |
| `slideGap` | `xs`–`xl` or a CSS length | Gap between slides. |
| `height` | a CSS height | Slides container height; required for `vertical`. |
| `h` | `xs`–`xl` or a CSS length | Mantine height shorthand on the root box. |
| `orientation` | `horizontal`, `vertical` | Scroll direction. |
| `controlSize` | a CSS width (e.g. `26`) | Size of the prev/next controls. |
| `controlsOffset` | `xs`–`xl` or a CSS value | Distance of the controls from the edges. |
| `initialSlide` | integer | Index of the slide shown first. |
| `loop` | bool (`true` / `false`) | Wrap from the last slide back to the first. |
| `withControls` | bool (`true` / `false`) | Show the prev/next arrows (default `true`). |
| `withIndicators` | bool (`true` / `false`) | Show the indicator dots (default `false`). |
| `withKeyboardEvents` | bool (`true` / `false`) | Arrow keys switch slides (default `true`). |

## CSS Selectors

The carousel hydrates from a server-rendered island wrapper, so you can target it before
hydration with the Aardvark island attributes, then reach into the Mantine parts once it
mounts. The island name stays the bare component (`Carousel` / `CarouselSlide`); the library
key rides a separate `data-aardvark-lib`:

{% raw %}
```css
/* The carousel and slide island wrappers (any library). */
[data-aardvark-island="Carousel"] { }
[data-aardvark-island="CarouselSlide"] { }

/* Scope to this library only (in case another library exposes a same-named component). */
[data-aardvark-lib="carousel"][data-aardvark-island="Carousel"] { }

/* The mounted Mantine parts, once the island hydrates. */
.mantine-Carousel-root { }       /* the carousel root */
.mantine-Carousel-slide { }      /* each slide */
.mantine-Carousel-controls { }   /* the prev/next control group */
.mantine-Carousel-indicators { } /* the indicator dots */
```
{% endraw %}

## Injecting Attributes

Pass `attr={...}` to forward raw HTML attributes — a `data-*` hook, an `id`, an event handler —
straight onto the carousel's rendered element. In Markdown the dict is written inline; in Python
it's the `attr=` keyword.

{% carousel withIndicators=true attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
{% slide %}
**Tap the carousel** — the click handler reports its text content.
{% endSlide %}
{% slide %}
**Second slide** — the handler is on the carousel root, not the slides.
{% endSlide %}
{% endCarousel %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% carousel withIndicators=true attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
{% slide %}
**Tap the carousel** — the click handler reports its text content.
{% endSlide %}
{% slide %}
**Second slide** — the handler is on the carousel root, not the slides.
{% endSlide %}
{% endCarousel %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'carousel', withIndicators=True, attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''},
          children=(component('aardvark', 'slide',
                              children='**Tap the carousel** — the click handler reports its text content.')
                    + component('aardvark', 'slide',
                                children='**Second slide** — the handler is on the carousel root, not the slides.')))
```
{% endAccordionSection %}
{% endAccordion %}

Whatever JavaScript you put in `onclick` ships straight to readers' browsers; you can lock that
down site-wide with the `attrPolicy` block in `aardvark.config.yaml`.
