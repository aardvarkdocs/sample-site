---
title: "Community Marquee"
description: "The communityMarquee tag — a Community Component wrapping @gfazioli/mantine-marquee
  for scrolling tickers with isometric, circle, and 3D-tilt variants, fade-edge modes, and
  responsive vertical scroll. Usage, options, and live examples."
menu: components
parent: community
weight: 310
---

# Community Marquee

`{% raw %}{% communityMarquee %}{% endraw %}` is a scrolling ticker with extra flair — content
that slides continuously across the row (logos, announcements, a tagline). On top of the
left/right/up/down scroll of the built-in
[`{% raw %}{% marquee %}{% endraw %}`](/components/layout/marquee/), this variant adds
isometric and circle layouts, fade-edge modes, repeat control, and 3D tilt/perspective/rotate/skew.

> **A Community Component** — wraps [Marquee](https://gfazioli.github.io/mantine-marquee/) by
> **gfazioli**, **MIT** licensed, npm `@gfazioli/mantine-marquee`.

Because Mantine core already ships a native `Marquee` (the one behind the built-in
`{% raw %}{% marquee %}{% endraw %}`), the community variant is registered under the distinct
tag **`communityMarquee`** so the two never collide — both are available.

Use it as `{% raw %}{% communityMarquee %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'communityMarquee', …)`.

## Demonstrations

### Basic ticker

The block body is the scrolling content. `direction` (left, right, up, down) sets the scroll
axis; `duration` is the seconds for one loop.

{% communityMarquee duration=20 %}
Ship docs faster · Built-in components · No JavaScript to write · Markdown all the way down ·
{% endCommunityMarquee %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% communityMarquee duration=20 %}
Ship docs faster · Built-in components · No JavaScript to write · Markdown all the way down ·
{% endCommunityMarquee %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'communityMarquee', duration=20,
          children='Ship docs faster · Built-in components · No JavaScript to write ·')
```
{% endAccordionSection %}
{% endAccordion %}

### Pause on hover and fade edges

`pauseOnHover` stops the scroll while the pointer is over it; `fadeEdges` softens the edges so
content fades in and out instead of clipping (set it to a bare flag for the default fade, or
name a mode — `linear`, `ellipse`, `rect`).

{% communityMarquee duration=25 pauseOnHover=true fadeEdges='linear' %}
React · Mantine · Aardvark · Static sites · Islands · Markdown ·
{% endCommunityMarquee %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% communityMarquee duration=25 pauseOnHover=true fadeEdges='linear' %}
React · Mantine · Aardvark · Static sites · Islands · Markdown ·
{% endCommunityMarquee %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

### Reverse direction

`direction='right'` scrolls the other way; `direction='up'` / `direction='down'` scroll
vertically.

{% communityMarquee direction='right' duration=20 %}
← scrolling the other way · keep it moving · ← scrolling the other way ·
{% endCommunityMarquee %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% communityMarquee direction='right' duration=20 %}
← scrolling the other way · keep it moving ·
{% endCommunityMarquee %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

### Isometric variant

`variant='isometric'` tilts the row into a 3D plane; tune it with `tilt`, `perspective`,
`rotate`, and `skew`.

{% communityMarquee variant='isometric' duration=22 tilt=45 %}
Isometric · 3D ticker · Tilt and perspective · Isometric · 3D ticker ·
{% endCommunityMarquee %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% communityMarquee variant='isometric' duration=22 tilt=45 %}
Isometric · 3D ticker · Tilt and perspective ·
{% endCommunityMarquee %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## With other components

The scrolling content can be any Aardvark tags, already rendered — here a row of
[Badges](/components/data-display/badge/) glides across as a feature ticker.

{% communityMarquee duration=18 gap='1.5rem' %}
{% badge variant='light' color='grape' %}Fast{% endBadge %} {% badge variant='light' color='indigo' %}Themeable{% endBadge %} {% badge variant='light' color='teal' %}Accessible{% endBadge %} {% badge variant='light' color='orange' %}Open{% endBadge %}
{% endCommunityMarquee %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% communityMarquee duration=18 gap='1.5rem' %}
{% badge variant='light' color='grape' %}Fast{% endBadge %} {% badge variant='light' color='indigo' %}Themeable{% endBadge %} {% badge variant='light' color='teal' %}Accessible{% endBadge %}
{% endCommunityMarquee %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default. Bare flags (e.g. `pauseOnHover`, `fadeEdges`) become
`=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `direction` | `left` / `right` / `up` / `down` (default `left`) | Scroll axis and direction. Maps to the package's `vertical` (up/down) + `reverse` (right/down). |
| `variant` | `default` / `isometric` / `circle` | Layout variant. `isometric` and `circle` add a 3D / ring presentation. |
| `duration` | Integer (seconds) | Seconds for one full loop. |
| `gap` | A CSS length (e.g. `2rem`) | Space between the looping copies of the content. |
| `repeat` | Integer | How many times the content is cloned to fill the row. |
| `pauseOnHover` | `true` / `false` (default `false`) | Pause scrolling while the pointer is over the marquee. |
| `fadeEdges` | bare flag / `linear` / `ellipse` / `rect` | Fade the leading/trailing edges. A bare flag uses the default fade; a named value picks the mask shape. |
| `fadeEdgesSize` | `xs`–`xl` or a percentage | Size of the edge fade. |
| `tilt` | Integer (degrees) | 3D tilt angle (isometric variant). |
| `perspective` | Integer (px) | Depth of the 3D scene (3D variants). |
| `rotate` | Integer (degrees) | In-plane rotation (isometric variant). |
| `skew` | Integer (degrees) | Horizontal skew (isometric variant). |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element (see [Injecting Attributes](#injecting-attributes)). |

## CSS Selector

The mounted island is wrapped in an element carrying `data-aardvark-island="CommunityMarquee"`,
so you can target the whole ticker from your own CSS:

```css
[data-aardvark-island='CommunityMarquee'] {
  margin-block: 2rem;
}
```

The package itself styles the track and fade with its own data-attribute selectors
(`[data-variant]`, `[data-vertical]`, `[data-fade-edges]`) and CSS variables
(`--marquee-gap`, `--marquee-fade-edge-size`, …); the stylesheet ships from
`@gfazioli/mantine-marquee/styles.css`, imported automatically by the island.

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes onto the rendered element — useful for `id`,
`data-*` hooks, ARIA, or analytics attributes that aren't component props:

{% communityMarquee duration=20 attr={'data-analytics': 'home-ticker', 'aria-label': 'Feature ticker'} %}
Tagged for analytics · Accessible label · Tagged for analytics ·
{% endCommunityMarquee %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% communityMarquee duration=20 attr={'data-analytics': 'home-ticker', 'aria-label': 'Feature ticker'} %}
Tagged for analytics · Accessible label ·
{% endCommunityMarquee %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'communityMarquee', duration=20,
          attr={'data-analytics': 'home-ticker', 'aria-label': 'Feature ticker'},
          children='Tagged for analytics · Accessible label ·')
```
{% endAccordionSection %}
{% endAccordion %}
