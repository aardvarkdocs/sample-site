---
title: "Parallax"
description: "The Parallax Community Component — tilts its content in 3D toward the pointer, with optional light, glare, and shadow effects. Usage, options, and live examples."
menu: components
parent: community
weight: 63
---

# Parallax

`parallax` tilts the block body in **3D toward the pointer** for an interactive parallax
effect — hover (or, on touch, drag) over it and it leans. Tune the motion with `maxRotation`,
`perspective`, `hoverScale`, and `transitionDuration`, and layer on `lightEffect`,
`glareEffect`, and `shadowEffect` for shine and depth.

A **Community Component** — wraps [Parallax](https://gfazioli.github.io/mantine-parallax/) by
**gfazioli**, **MIT** licensed, npm `@gfazioli/mantine-parallax`.

Use it as `{% raw %}{% parallax %}…{% endParallax %}{% endraw %}` in Markdown, or call it from
Python logic (loops, snippets) via `component('aardvark', 'parallax', …)`.

## Demonstrations

The block body is the content to tilt. Give it a width and height (`w` / `h`) and hover over
it to see the effect.

{% parallax w=320 h=180 %}
{% card title='Hover me' withBorder=true %}This card tilts in 3D toward your pointer.{% endCard %}
{% endParallax %}

<br>

{% raw %}
```aardvark
{% parallax w=320 h=180 %}
{% card title='Hover me' withBorder=true %}This card tilts in 3D toward your pointer.{% endCard %}
{% endParallax %}
```
{% endraw %}

### Tilt amount and perspective

`maxRotation` caps how far it leans (degrees); `perspective` sets the 3D depth; `hoverScale`
zooms slightly on hover.

{% parallax w=320 h=180 maxRotation=25 perspective=600 hoverScale=1.05 %}
{% card title='Steep tilt' withBorder=true %}A stronger lean with a slight zoom on hover.{% endCard %}
{% endParallax %}

<br>

{% raw %}
```aardvark
{% parallax w=320 h=180 maxRotation=25 perspective=600 hoverScale=1.05 %}
{% card title='Steep tilt' withBorder=true %}A stronger lean with a slight zoom on hover.{% endCard %}
{% endParallax %}
```
{% endraw %}

### Light and glare

Turn on `lightEffect` for a moving highlight and `glareEffect` for a glossy sheen that
follows the pointer.

{% parallax w=320 h=180 lightEffect glareEffect glareMaxOpacity=0.4 %}
{% card title='Shiny' withBorder=true %}A light highlight and a glare sweep track the pointer.{% endCard %}
{% endParallax %}

<br>

{% raw %}
```aardvark
{% parallax w=320 h=180 lightEffect glareEffect glareMaxOpacity=0.4 %}
{% card title='Shiny' withBorder=true %}A light highlight and a glare sweep track the pointer.{% endCard %}
{% endParallax %}
```
{% endraw %}

### Spring and shadow

`springEffect` gives the tilt a bouncy spring (tuned by `springStiffness` / `springDamping`),
and `shadowEffect` adds a dynamic drop shadow.

{% parallax w=320 h=180 springEffect shadowEffect shadowColor='black' shadowBlur=24 %}
{% card title='Bouncy' withBorder=true %}A springy tilt with a moving shadow underneath.{% endCard %}
{% endParallax %}

<br>

{% raw %}
```aardvark
{% parallax w=320 h=180 springEffect shadowEffect shadowColor='black' shadowBlur=24 %}
{% card title='Bouncy' withBorder=true %}A springy tilt with a moving shadow underneath.{% endCard %}
{% endParallax %}
```
{% endraw %}

## With other components

Parallax wraps any content — a [Card](/components/data-display/card/), an image, a heading.
Here it tilts a title and a line of text.

{% parallax w=340 h=160 lightEffect %}
{% title order=3 %}Parallax{% endTitle %}
Hover anywhere on this panel to tilt it in 3D.
{% endParallax %}

<br>

{% raw %}
```aardvark
{% parallax w=340 h=160 lightEffect %}
{% title order=3 %}Parallax{% endTitle %}
Hover anywhere on this panel to tilt it in 3D.
{% endParallax %}
```
{% endraw %}

## Attributes

Omit any attribute to take its default. Bare flags (e.g. `lightEffect`) become `=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `disabled` | `true` / `false` (default `false`) | Freeze the tilt. |
| `perspective` | A number | 3D perspective depth. |
| `maxRotation` | A number (degrees) | Maximum tilt angle. |
| `hoverScale` | A number (default `1`) | Scale applied on hover. |
| `threshold` | A number | Pointer-movement threshold before tilting. |
| `transitionDuration` | A number (ms, default `300`) | Tilt transition time. |
| `transitionEasing` | A CSS easing (default `ease-out`) | Tilt transition easing. |
| `touchEnabled` | `true` / `false` (default on) | Respond to touch drags. |
| `resetOnLeave` | `true` / `false` (default on) | Return to flat when the pointer leaves. |
| `invertRotation` | `true` / `false` (default `false`) | Flip the tilt direction. |
| `lightEffect` | `true` / `false` (default `false`) | Pointer-following highlight. |
| `lightColor` | A CSS color | Highlight color. |
| `lightIntensity` | A number | Highlight strength. |
| `glareEffect` | `true` / `false` (default `false`) | Glossy glare sweep. |
| `glareColor` | A CSS color | Glare color. |
| `glareMaxOpacity` | A number `0`–`1` | Maximum glare opacity. |
| `shadowEffect` | `true` / `false` (default `false`) | Dynamic drop shadow. |
| `shadowColor` | A CSS color | Shadow color. |
| `shadowBlur` | A number | Shadow blur. |
| `springEffect` | `true` / `false` (default `false`) | Bouncy spring physics. |
| `springStiffness` | A number (default `150`) | Spring stiffness. |
| `springDamping` | A number (default `12`) | Spring damping. |
| `gyroscopeEnabled` | `true` / `false` (default `false`) | Tilt by device gyroscope. |
| `keyboardEnabled` | `true` / `false` (default `false`) | Tilt by arrow keys. |
| `w`, `h` | A number (px) or Mantine size token | Width / height of the panel. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

## CSS Selector

The parallax effect is owned by the package's stylesheet (loaded automatically). aardvark
adds one stable hook for site overrides:

| Selector | Element |
| --- | --- |
| `[data-aardvark-parallax]` | The aardvark island wrapper around the Parallax root. |

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes (id, class, data-*, ARIA, inline style) onto
the rendered element — an escape hatch for anything not covered by a named attribute above.

{% parallax w=320 h=180 lightEffect attr={'id': 'hero-parallax', 'data-analytics': 'tilt'} %}
{% card title='Hover me' withBorder=true %}Content{% endCard %}
{% endParallax %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% parallax w=320 h=180 lightEffect attr={'id': 'hero-parallax', 'data-analytics': 'tilt'} %}
{% card title='Hover me' withBorder=true %}Content{% endCard %}
{% endParallax %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'parallax', w=320, h=180, lightEffect=True,
          attr={'id': 'hero-parallax', 'data-analytics': 'tilt'},
          children=component('aardvark', 'card', title='Hover me', withBorder=True, children='Content'))
```
{% endAccordionSection %}
{% endAccordion %}
