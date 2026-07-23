---
title: "Reflection"
description: "The Reflection Community Component — paints a mirrored reflection beneath its content, with optional water ripple and contact shadow. Usage, options, and live examples."
menu: components
parent: community
weight: 64
---

# Reflection

`reflection` paints a **mirrored reflection** beneath the block body — the glassy
floor-reflection look. Turn on `ripple` for an animated water ripple, tune the mirror with
`reflectionOpacity` / `reflectionDistance` / `reflectionBlur`, and add a contact shadow with
the `shadow*` props.

A **Community Component** — wraps [Reflection](https://gfazioli.github.io/mantine-reflection/)
by **gfazioli**, **MIT** licensed, npm `@gfazioli/mantine-reflection`.

Use it as `{% raw %}{% reflection %}…{% endReflection %}{% endraw %}` in Markdown, or call it
from Python logic (loops, snippets) via `component('aardvark', 'reflection', …)`.

## Demonstrations

The block body is the content to reflect. With no props you get a clean static mirror
beneath it.

{% reflection %}
{% card title='Reflected' withBorder=true w=260 %}A mirrored copy of this card is painted below it.{% endCard %}
{% endReflection %}

<br>

{% raw %}
```aardvark
{% reflection %}
{% card title='Reflected' withBorder=true w=260 %}A mirrored copy of this card is painted below it.{% endCard %}
{% endReflection %}
```
{% endraw %}

### Water ripple

Turn on `ripple` for an animated water surface, then shape it with `rippleStrength`,
`rippleFrequency`, and `rippleSpeed`.

{% reflection ripple rippleStrength=8 rippleSpeed=3 %}
{% card title='On the water' withBorder=true w=260 %}The reflection below ripples like water.{% endCard %}
{% endReflection %}

<br>

{% raw %}
```aardvark
{% reflection ripple rippleStrength=8 rippleSpeed=3 %}
{% card title='On the water' withBorder=true w=260 %}The reflection below ripples like water.{% endCard %}
{% endReflection %}
```
{% endraw %}

### Mirror opacity and distance

`reflectionOpacity` fades the mirror, `reflectionDistance` pushes it away from the source,
and `reflectionBlur` softens it.

{% reflection reflectionOpacity=0.5 reflectionDistance=10 reflectionBlur=2 %}
{% card title='Soft mirror' withBorder=true w=260 %}A fainter, slightly blurred reflection set a little lower.{% endCard %}
{% endReflection %}

<br>

{% raw %}
```aardvark
{% reflection reflectionOpacity=0.5 reflectionDistance=10 reflectionBlur=2 %}
{% card title='Soft mirror' withBorder=true w=260 %}A fainter, slightly blurred reflection set a little lower.{% endCard %}
{% endReflection %}
```
{% endraw %}

### Contact shadow

Add a grounding shadow under the content with `shadowSize`, `shadowOpacity`, `shadowBlur`,
and `shadowColor`.

{% reflection shadowSize=24 shadowOpacity=0.3 shadowBlur=12 shadowColor='black' %}
{% card title='Grounded' withBorder=true w=260 %}A soft contact shadow sits beneath this card.{% endCard %}
{% endReflection %}

<br>

{% raw %}
```aardvark
{% reflection shadowSize=24 shadowOpacity=0.3 shadowBlur=12 shadowColor='black' %}
{% card title='Grounded' withBorder=true w=260 %}A soft contact shadow sits beneath this card.{% endCard %}
{% endReflection %}
```
{% endraw %}

## With other components

Reflection wraps anything — an image, a [Card](/components/data-display/card/), a
[Badge](/components/data-display/badge/). Here it mirrors a badge group.

{% reflection ripple reflectionOpacity=0.6 %}
{% group %}{% badge variant='filled' color='grape' %}New{% endBadge %}{% badge variant='light' %}Beta{% endBadge %}{% endGroup %}
{% endReflection %}

<br>

{% raw %}
```aardvark
{% reflection ripple reflectionOpacity=0.6 %}
{% group %}{% badge variant='filled' color='grape' %}New{% endBadge %}{% badge variant='light' %}Beta{% endBadge %}{% endGroup %}
{% endReflection %}
```
{% endraw %}

## Attributes

Omit any attribute to take its default. Bare flags (e.g. `ripple`) become `=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `ripple` | `true` / `false` (default `false`) | Animate the reflection as a water surface. |
| `rippleStrength` | A number (default `4`) | Ripple amplitude. |
| `rippleFrequency` | A number (default `0.01`) | Ripple frequency. |
| `rippleSpeed` | A number (default `3`) | Ripple animation speed. |
| `rippleOctaves` | A number (default `1`) | Layers of ripple noise. |
| `rippleSeed` | A number (default `1`) | Ripple random seed. |
| `reflectionOpacity` | A number `0`–`1` | Opacity of the mirrored copy. |
| `reflectionDistance` | A number | Gap between the content and its reflection. |
| `reflectionBlur` | A number | Blur applied to the reflection. |
| `reflectionStretch` | A number | Vertical stretch of the reflection. |
| `shadowSize` | A number | Size of the contact shadow. |
| `shadowOffset` | A number | Shadow vertical offset. |
| `shadowOpacity` | A number `0`–`1` | Shadow opacity. |
| `shadowBlur` | A number | Shadow blur. |
| `shadowColor` | A CSS color | Shadow color. |
| `disableChildren` | `true` / `false` (default `false`) | Render only the reflection, not the source content. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

## CSS Selector

The reflection effect is owned by the package's stylesheet (loaded automatically). aardvark
adds one stable hook for site overrides:

| Selector | Element |
| --- | --- |
| `[data-aardvark-reflection]` | The aardvark island wrapper around the Reflection root. |

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes (id, class, data-*, ARIA, inline style) onto
the rendered element — an escape hatch for anything not covered by a named attribute above.

{% reflection ripple attr={'id': 'hero-reflection', 'data-analytics': 'reflect'} %}
{% card title='Reflected' withBorder=true %}Content{% endCard %}
{% endReflection %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% reflection ripple attr={'id': 'hero-reflection', 'data-analytics': 'reflect'} %}
{% card title='Reflected' withBorder=true %}Content{% endCard %}
{% endReflection %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'reflection', ripple=True, attr={'id': 'hero-reflection', 'data-analytics': 'reflect'},
          children=component('aardvark', 'card', title='Reflected', withBorder=True, children='Content'))
```
{% endAccordionSection %}
{% endAccordion %}
