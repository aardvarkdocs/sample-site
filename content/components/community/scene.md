---
title: "Scene"
description: "The Scene community component — a decorative animated background that layers gradients, glow blobs, dot grids, and noise behind your content. Usage, options, and live examples."
menu: components
parent: community
weight: 60
---

# Scene

`scene` is a **decorative animated background**: it layers effects — gradients, glow blobs,
dot grids, and noise grain — behind the block body. Turn layers on with the flags `gradient`,
`glow`, `dotGrid`, and `noise`, tune each with a few color shortcuts, or pass `layersJson` for
full control. The block body is the foreground content rendered over the scene.

A **Community Component** — wraps [Scene](https://gfazioli.github.io/mantine-scene/) by
**gfazioli**, **MIT** licensed, npm `@gfazioli/mantine-scene`.

Use it as `{% raw %}{% scene … %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'scene', …)`.

## Demonstrations

### A gradient backdrop

Turn on the `gradient` layer and set `gradientFrom` / `gradientTo` to wash the background with
a color blend behind your content.

{% raw %}
```aardvark
{% scene gradient gradientFrom='indigo' gradientTo='grape' %}
### Layered over a gradient
A soft color wash sits behind this text.
{% endScene %}
```
{% endraw %}

{% scene gradient gradientFrom='indigo' gradientTo='grape' %}
### Layered over a gradient
A soft color wash sits behind this text.
{% endScene %}

### Glow and a dot grid

Stack layers by combining flags — here a `glow` blob and a `dotGrid`, each with its own color
shortcut (`glowColor`, `dotColor`).

{% raw %}
```aardvark
{% scene glow glowColor='cyan' dotGrid dotColor='blue' %}
### Glow + dots
Two layers compose back-to-front behind the content.
{% endScene %}
```
{% endraw %}

{% scene glow glowColor='cyan' dotGrid dotColor='blue' %}
### Glow + dots
Two layers compose back-to-front behind the content.
{% endScene %}

### Mouse-tracking interaction

Add `interactive` so the scene responds to the pointer, and `noise` for a subtle film grain.

{% raw %}
```aardvark
{% scene interactive glow glowColor='grape' noise %}
### Move your mouse
The glow follows the pointer; a noise layer adds grain.
{% endScene %}
```
{% endraw %}

{% scene interactive glow glowColor='grape' noise %}
### Move your mouse
The glow follows the pointer; a noise layer adds grain.
{% endScene %}

### Full control with `layersJson`

When the flag shortcuts aren't enough, pass `layersJson` — a JSON array of `{kind, …}`
descriptors, where `kind` is the layer type and the rest are that layer's props. Order is
back-to-front.

{% raw %}
```aardvark
{% scene layersJson='[{"kind":"gradient","type":"radial","from":"teal","to":"blue"},{"kind":"glow","color":"teal"},{"kind":"noise"}]' %}
### Composed from JSON
A radial gradient, a glow, and noise — fully specified.
{% endScene %}
```
{% endraw %}

{% scene layersJson='[{"kind":"gradient","type":"radial","from":"teal","to":"blue"},{"kind":"glow","color":"teal"},{"kind":"noise"}]' %}
### Composed from JSON
A radial gradient, a glow, and noise — fully specified.
{% endScene %}

## With other components

Use a Scene as the backdrop for a hero, then layer other built-in tags over it — here a
`{% raw %}{% title %}{% endraw %}` and a `{% raw %}{% badge %}{% endraw %}`.

{% raw %}
```aardvark
{% scene gradient gradientFrom='blue' gradientTo='cyan' glow %}
{% title order=2 %}Build with Aardvark{% endTitle %}
Status: {% badge color='green' %}stable{% endBadge %}
{% endScene %}
```
{% endraw %}

{% scene gradient gradientFrom='blue' gradientTo='cyan' glow %}
{% title order=2 %}Build with Aardvark{% endTitle %}
Status: {% badge color='green' %}stable{% endBadge %}
{% endScene %}

## Attributes

Omit any attribute to take its default. Bare flags (e.g. `gradient`, `glow`) become `=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `gradient` | `true` / `false` (default `false`) | Turn on the gradient layer. |
| `gradientFrom` / `gradientTo` | a Mantine color | Gradient start / end color. |
| `gradientType` | `radial` / `linear` / `conic` | Gradient shape. |
| `glow` | `true` / `false` (default `false`) | Turn on a glow blob layer. |
| `glowColor` | a Mantine color | Glow color. |
| `dotGrid` | `true` / `false` (default `false`) | Turn on a dot-grid layer. |
| `dotColor` | a Mantine color | Dot color. |
| `noise` | `true` / `false` (default `false`) | Turn on a noise / grain layer. |
| `layersJson` | a JSON array of `{kind, …}` descriptors | Full layer control; wins over the flags when set. |
| `fullscreen` | `true` / `false` (default `false`) | Fix the scene to cover the whole viewport. |
| `zIndex` | number | Stacking order of the scene. |
| `interactive` | `true` / `false` (default `false`) | Track the pointer (e.g. move the glow). |
| `interactiveEasing` | number | Easing factor for the interactive tracking. |
| `reducedMotion` | `auto` / `always` / `never` | Honor reduced-motion preferences. |
| `lazy` | `true` / `false` (default `false`) | Defer mounting until the scene scrolls into view. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

## CSS Selector

The scene mounts inside a wrapper carrying `data-aardvark-island="Scene"`, and Mantine's Scene
exposes Styles API class names you can target:

```css
/* The scene container that holds the layers + your content */
[data-aardvark-island='Scene'] .mantine-Scene-root { }
/* The foreground content layer (your block body) */
[data-aardvark-island='Scene'] .mantine-Scene-content { }
/* Individual effect layers (gradient / glow / dot grid / noise) */
[data-aardvark-island='Scene'] .mantine-Scene-layer { }
```

## Injecting Attributes

Use `attr={…}` to forward raw HTML attributes (data-*, ARIA, etc.) onto the rendered element —
they ride a separate channel from the React props, so they never collide with a component
prop.

{% scene gradient gradientFrom='indigo' gradientTo='grape'
   attr={'data-analytics': 'hero-scene', 'aria-hidden': 'true'} %}
Foreground content
{% endScene %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% scene gradient gradientFrom='indigo' gradientTo='grape'
   attr={'data-analytics': 'hero-scene', 'aria-hidden': 'true'} %}
Foreground content
{% endScene %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'scene', gradient=True, gradientFrom='indigo', gradientTo='grape',
          attr={'data-analytics': 'hero-scene', 'aria-hidden': 'true'}, children='Foreground content')
```
{% endAccordionSection %}
{% endAccordion %}
