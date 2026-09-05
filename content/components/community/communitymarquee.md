---
title: "Community Marquee"
description: "The communityMarquee tag — a Community Component wrapping @gfazioli/mantine-marquee
  for scrolling tickers with isometric, circle, and 3D-tilt variants, fade-edge modes, and
  responsive vertical scroll. Usage, options, and live examples."
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
← scrolling the other way · keep it moving · ← scrolling the other way ·
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
Isometric · 3D ticker · Tilt and perspective · Isometric · 3D ticker ·
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
{% badge variant='light' color='grape' %}Fast{% endBadge %} {% badge variant='light' color='indigo' %}Themeable{% endBadge %} {% badge variant='light' color='teal' %}Accessible{% endBadge %} {% badge variant='light' color='orange' %}Open{% endBadge %}
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
| `duration` | Integer **seconds** | Time for one full loop. |
| `gap` | `xs`–`xl` or a CSS length (e.g. `2rem`) | Space between the items and between the looping copies. |
| `repeat` | Integer (minimum `2`) | How many times the content is cloned to fill the row. |
| `pauseOnHover` | `true` / `false` (default `false`) | Pause scrolling while the pointer is over the marquee. |
| `fadeEdges` | bare flag / `linear` / `ellipse` / `rect` | Fade the edges with a mask. A bare flag (or `linear`) fades the leading and trailing edges; `ellipse` fades all round; `rect` fades all four edges independently. |
| `fadeEdgesSize` | `xs`–`xl` or a CSS length | Size of the edge fade. |
| `tilt` | Integer (degrees, default `45`) | Plane inclination — how far the scroll plane tips back (`isometric`), or the viewing angle of the ring (`circle`). Ignored by the default variant. |
| `perspective` | Integer px (default `800`) | Depth of the 3D scene; smaller values exaggerate it. Isometric and circle variants only. |
| `rotate` | Integer (degrees, default `0`) | In-plane rotation applied after `tilt` (isometric variant). |
| `skew` | Integer (degrees, default `0`) | Horizontal shear of the plane (isometric variant). |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element (see [Injecting Attributes](#injecting-attributes)). |

{% callout severity="info" title="Good to know" %}
`duration` here is in **seconds**, while the built-in
[`{% raw %}{% marquee %}{% endraw %}`](/components/layout/marquee/) counts it in
milliseconds — so a value copied between the two tags is off by a factor of a thousand.

The body is rendered as a single inline row: inline Markdown and raw HTML pass through, but
block-level Markdown (paragraphs, lists, headings) does not, and blank lines are collapsed.
Keep each item on the same line, or wrap it in a tag that renders inline.
{% endCallout %}

## CSS Selector

| Selector | Targets |
| --- | --- |
| `[data-aardvark-island='CommunityMarquee']` | The wrapper around one ticker — the safest hook, and the only one that means *this* tag. |
| `.mantine-Marquee-root` | The ticker root, which carries `[data-variant]`, `[data-vertical]` and `[data-fade-edges]`. |
| `.mantine-Marquee-stage` / `.mantine-Marquee-plane` | The 3D stage and the tilted plane used by the `isometric` and `circle` variants. |

This ticker and the built-in [`{% raw %}{% marquee %}{% endraw %}`](/components/layout/marquee/)
both style themselves with `mantine-Marquee-*` classes, so a rule written against those names
hits **both** tags. Scope it under the island attribute above when you mean only this one.

The look is driven by CSS variables on the root — `--marquee-duration`, `--marquee-gap`,
`--marquee-fade-edge-size`, `--marquee-tilt`, `--marquee-perspective`, `--marquee-rotate`,
`--marquee-skew` — so most tweaks are a variable override. The stylesheet ships from
`@gfazioli/mantine-marquee/styles.css` and loads with the page.

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
Tagged for analytics · Accessible label · Tagged for analytics ·
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
