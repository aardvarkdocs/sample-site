---
title: "Border Animate"
description: "The borderAnimate tag — a Community Component wrapping @gfazioli/mantine-border-animate
  to wrap any content in an animated border: a traveling beam, a pulsating glow, or a subtle
  pulse. Usage, options, and live examples."
parent: community
weight: 330
---

# Border Animate

`{% raw %}{% borderAnimate %}{% endraw %}` wraps any content in an **animated border** — a beam
that travels around the edge, a diffused glow, or a subtle pulse. It's a nice way to draw the
eye to a card, a call-to-action, or a highlighted note.

> **A Community Component** — wraps [BorderAnimate](https://gfazioli.github.io/mantine-border-animate/)
> by **gfazioli**, **MIT** licensed, npm `@gfazioli/mantine-border-animate`.

The effect respects `prefers-reduced-motion`, so readers who opt out of motion see a static
border. Use it as `{% raw %}{% borderAnimate %}{% endraw %}` in Markdown, or call it from
Python logic (loops, snippets) via `component('aardvark', 'borderAnimate', …)`. The wrapped
content is the block body.

## Demonstrations

### Beam

`variant='beam'` (the default) sends a glowing beam traveling around the border. `duration`
(seconds) sets the lap time; `colorFrom` / `colorTo` set the gradient.

{% borderAnimate variant='beam' duration=4 radius='md' colorFrom='indigo' colorTo='cyan' %}
{% paper p='lg' radius='md' %}A beam traces this card's border.{% endPaper %}
{% endBorderAnimate %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% borderAnimate variant='beam' duration=4 radius='md' colorFrom='indigo' colorTo='cyan' %}
{% paper p='lg' radius='md' %}A beam traces this card's border.{% endPaper %}
{% endBorderAnimate %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'borderAnimate',
          variant='beam', duration=4, radius='md',
          colorFrom='indigo', colorTo='cyan',
          children=component('aardvark', 'paper', p='lg', radius='md',
                             children="A beam traces this card's border."))
```
{% endAccordionSection %}
{% endAccordion %}

### Beam modes

`beamMode` sets how the beam is drawn: `dot` (the default) runs a soft dot along the border
at constant speed, `wedge` sweeps a rotating gradient whose width `spread` sets in degrees,
and `comet` draws a bright head with a fading tail.

{% borderAnimate variant='beam' beamMode='comet' duration=4 radius='md' borderWidth='sm' colorFrom='blue' colorTo='violet' %}
{% paper p='lg' radius='md' %}A comet circles this card.{% endPaper %}
{% endBorderAnimate %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% borderAnimate variant='beam' beamMode='comet' duration=4 radius='md' borderWidth='sm' colorFrom='blue' colorTo='violet' %}
{% paper p='lg' radius='md' %}A comet circles this card.{% endPaper %}
{% endBorderAnimate %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

### Glow

`variant='glow'` surrounds the content with a soft, pulsating light. `blur` (xs–xl) controls
how diffuse it is.

{% borderAnimate variant='glow' duration=3 radius='md' blur='md' colorFrom='grape' colorTo='pink' %}
{% paper p='lg' radius='md' %}A glow pulses around this card.{% endPaper %}
{% endBorderAnimate %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% borderAnimate variant='glow' duration=3 radius='md' blur='md' colorFrom='grape' colorTo='pink' %}
{% paper p='lg' radius='md' %}A glow pulses around this card.{% endPaper %}
{% endBorderAnimate %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

### Pulse, paused on hover

`variant='pulse'` scales the border in and out; `pauseOnHover` freezes it while the pointer is
over the content.

{% borderAnimate variant='pulse' duration=2 radius='md' pauseOnHover=true colorFrom='teal' colorTo='lime' %}
{% paper p='lg' radius='md' %}Hover to pause the pulse.{% endPaper %}
{% endBorderAnimate %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% borderAnimate variant='pulse' duration=2 radius='md' pauseOnHover=true colorFrom='teal' colorTo='lime' %}
{% paper p='lg' radius='md' %}Hover to pause the pulse.{% endPaper %}
{% endBorderAnimate %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## With other components

Wrap any Aardvark content — here a [Badge](/components/data-display/badge/) gets a beam border
to mark a featured tier.

{% borderAnimate variant='beam' duration=3 radius='xl' colorFrom='orange' colorTo='red' %}
{% badge variant='filled' color='orange' size='xl' %}Featured{% endBadge %}
{% endBorderAnimate %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% borderAnimate variant='beam' duration=3 radius='xl' colorFrom='orange' colorTo='red' %}
{% badge variant='filled' color='orange' size='xl' %}Featured{% endBadge %}
{% endBorderAnimate %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default. Bare flags (e.g. `pauseOnHover`) become `=True`;
`animate` defaults on, so set it to `false` to turn it off.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `variant` | `beam` / `glow` / `pulse` (default `beam`) | The animation style. |
| `beamMode` | `dot` (default) / `wedge` / `comet` | How the beam is drawn (beam variant). `dot` runs a dot along the border at constant speed; `wedge` rotates a gradient wedge, which reads faster on the short edges of a rectangle; `comet` draws a head with a fading tail. |
| `size` | `xs`–`xl` or a number (default `sm`) | Size of the dot in `dot` mode. |
| `spread` | Number (degrees, default `36`) | Width of the wedge in `wedge` mode. |
| `duration` | Number (seconds, default `5`) | Animation speed (lap time). |
| `colorFrom` | A color (token or CSS color, default `yellow.6`) | Start of the gradient. |
| `colorTo` | A color (token or CSS color, default `violet.6`) | End of the gradient. |
| `radius` | A Mantine radius token, a number of px, or a CSS length (default `md`) | Border radius of the effect. |
| `blur` | `xs`–`xl`, a number, or a CSS length (default `xs`) | Softness of the glow (glow variant). |
| `progress` | Number `0`–`100` (default `100`) | Where the effect sits when `animate=false`, as a percentage of the way around the border. While the animation runs it only affects `comet`, shifting where the comet starts. |
| `borderWidth` | `xs`–`xl`, a number of px, or a CSS length (default `xs`) | Thickness of the animated border. |
| `borderOpacity` | Number `0`–`1` (default `1`) | Opacity of the effect. |
| `withMask` | `true` / `false` (default `true`, `false` for `glow`) | Clip the effect to the border (vs. fill behind the content). |
| `pauseOnHover` | `true` / `false` (default `false`) | Pause the animation while the pointer is over the content. |
| `animate` | `true` / `false` (default `true`) | Enable the animation (set `false` for a static border). |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element (see [Injecting Attributes](#injecting-attributes)). |

{% callout severity="info" title="Good to know" %}
The wrapper is an inline-block that hugs its content, and the border is drawn on its edge —
so set the corner rounding on **both** sides: a `radius` here that matches the wrapped
component's own radius, or the beam will trace a rectangle around a rounded card.

`progress` places the effect when `animate=false`. Reach for that pair when you want a
static gradient border and no motion at all; readers with `prefers-reduced-motion` already get
the static border automatically.
{% endCallout %}

## CSS Selector

Target the wrapper, the Styles API parts, or one animation state:

| Selector | Targets |
| --- | --- |
| `[data-aardvark-island='BorderAnimate']` | The Aardvark wrapper around the effect — the place to set layout and margins. |
| `.mantine-BorderAnimate-root` | The element the content sits in. |
| `.mantine-BorderAnimate-border` | The animated border layer of the `dot` / `wedge` beam, glow and pulse. |
| `.mantine-BorderAnimate-svg` / `.mantine-BorderAnimate-stroke` | The SVG ring and its stroke, which draw the `comet` beam. |
| `[data-variant='glow']` / `[data-beam-mode='wedge']` | One variant or beam mode. |
| `[data-animate='false']` / `[data-with-mask='false']` | The static border, or the unmasked (filled) effect. |

The look is driven by CSS variables on the root — `--border-animate-radius`,
`--border-animate-duration`, `--border-animate-width`, `--border-animate-color-from` /
`-color-to`, `--border-animate-blur`, `--border-animate-opacity` and
`--border-animate-progress` — so most tweaks are a variable override. The stylesheet ships
from `@gfazioli/mantine-border-animate/styles.css` and loads with the page.

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes onto the rendered element — useful for `id`,
`data-*` hooks, ARIA, or analytics attributes that aren't component props:

{% borderAnimate variant='beam' duration=4 radius='md' attr={'data-role': 'cta-frame'} %}
{% paper p='lg' radius='md' %}Tagged for analytics.{% endPaper %}
{% endBorderAnimate %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% borderAnimate variant='beam' duration=4 radius='md' attr={'data-role': 'cta-frame'} %}
{% paper p='lg' radius='md' %}Tagged for analytics.{% endPaper %}
{% endBorderAnimate %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'borderAnimate',
          variant='beam', duration=4, radius='md',
          attr={'data-role': 'cta-frame'},
          children=component('aardvark', 'paper', p='lg', radius='md',
                             children='Tagged for analytics.'))
```
{% endAccordionSection %}
{% endAccordion %}
