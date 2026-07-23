---
title: "Border Animate"
description: "The borderAnimate tag — a Community Component wrapping @gfazioli/mantine-border-animate
  to wrap any content in an animated border: a traveling beam, a pulsating glow, or a subtle
  pulse. Usage, options, and live examples."
menu: components
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
`withMask` and `animate` default on, so set them to `false` to turn them off.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `variant` | `beam` / `glow` / `pulse` (default `beam`) | The animation style. |
| `beamMode` | `path` / `conic` (default `path`) | How the beam is rendered (beam variant). |
| `size` | `xs`–`xl` | Beam / effect size. |
| `duration` | Number (seconds) | Animation speed (lap time). |
| `colorFrom` | A color (token or CSS color) | Start of the gradient. |
| `colorTo` | A color (token or CSS color) | End of the gradient. |
| `radius` | A Mantine radius token or CSS length | Border radius of the effect. |
| `blur` | `xs`–`xl` | Softness of the glow (glow variant). |
| `angle` | Integer (degrees) | A static rotation angle for the border. |
| `borderWidth` | A CSS length (e.g. `2px`) | Thickness of the animated border. |
| `borderOpacity` | Number `0`–`1` | Opacity of the effect. |
| `withMask` | `true` / `false` (default `true`) | Clip the effect to the border (vs. fill behind the content). |
| `pauseOnHover` | `true` / `false` (default `false`) | Pause the animation while the pointer is over the content. |
| `animate` | `true` / `false` (default `true`) | Enable the animation (set `false` for a static border). |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element (see [Injecting Attributes](#injecting-attributes)). |

## CSS Selector

The mounted island is wrapped in an element carrying `data-aardvark-island="BorderAnimate"`, so
you can target it from your own CSS:

```css
[data-aardvark-island='BorderAnimate'] {
  display: inline-block;
}
```

The package draws the border through its own data-attribute selectors (`[data-variant]`,
`[data-beam-mode]`, `[data-animate]`, `[data-with-mask]`, …) and CSS variables
(`--border-animate-angle`, `--border-animate-blur`, …); the stylesheet ships from
`@gfazioli/mantine-border-animate/styles.css`, imported automatically by the island.

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
