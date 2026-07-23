---
title: "Rings progress"
description: "The built-in ringsprogress tag — a multi-ring (concentric) progress indicator from the Mantine community. Pass rings as JSON, set size, gap, glow, animation, a center label, and live examples."
parent: community
weight: 10
---

# Rings progress

A built-in tag for a **multi-ring (concentric)** progress indicator — several donut rings
nested inside one another, each filling to its own value. Pass `rings` as a JSON array of
`{value, color}` objects (one ring per object) and optionally set the overall `size`, the
`gap` between rings, a center `label`, and flair like `glow`, `animate`, and `showValues`.

> **Not the same as `{% raw %}{% ringprogress %}{% endraw %}`.** Aardvark also ships a singular
> [Ring progress](/components/feedback/ringprogress/) tag that wraps Mantine **core**'s
> `RingProgress` (one ring, multiple arcs). This `{% raw %}{% ringsprogress %}{% endraw %}` tag
> is the *plural* community widget — multiple concentric rings — so the two never collide.

A **Community Component** — wraps [RingsProgress](https://gfazioli.github.io/mantine-rings-progress/)
by **gfazioli**, **MIT** licensed, npm `@gfazioli/mantine-rings-progress`.

## Demonstrations

### Basic rings

Give each ring a `value` (0–100) and a `color`. Rings are drawn from the outside in.

{% raw %}
```aardvark
{% ringsprogress rings='[{"value":75,"color":"cyan"},{"value":50,"color":"orange"},{"value":25,"color":"grape"}]' size=180 %}
```
{% endraw %}

{% ringsprogress rings='[{"value":75,"color":"cyan"},{"value":50,"color":"orange"},{"value":25,"color":"grape"}]' size=180 %}

### Center label and values

Set `label` for text in the middle of the rings, and `showValues=true` to print each ring's
value at the end of its arc.

{% raw %}
```aardvark
{% ringsprogress rings='[{"value":80,"color":"teal"},{"value":55,"color":"indigo"}]' size=200 label='68%' showValues=true %}
```
{% endraw %}

{% ringsprogress rings='[{"value":80,"color":"teal"},{"value":55,"color":"indigo"}]' size=200 label='68%' showValues=true %}

### Glow and animation

`glow=true` adds a neon glow; `animate=true` plays an entrance animation as the rings fill.

{% raw %}
```aardvark
{% ringsprogress rings='[{"value":90,"color":"lime"},{"value":60,"color":"pink"},{"value":30,"color":"violet"}]' size=200 glow=true animate=true %}
```
{% endraw %}

{% ringsprogress rings='[{"value":90,"color":"lime"},{"value":60,"color":"pink"},{"value":30,"color":"violet"}]' size=200 glow=true animate=true %}

### Gap, thickness, and direction

`gap` sets the space between rings (px), `thickness` the stroke width, and `direction`
flips the fill between `clockwise` (default) and `counterclockwise`. Arc ends are rounded by
default; set `roundCaps=false` for square ends.

{% raw %}
```aardvark
{% ringsprogress rings='[{"value":70,"color":"blue"},{"value":45,"color":"red"}]' size=180 gap=10 thickness=14 direction='counterclockwise' roundCaps=false %}
```
{% endraw %}

{% ringsprogress rings='[{"value":70,"color":"blue"},{"value":45,"color":"red"}]' size=180 gap=10 thickness=14 direction='counterclockwise' roundCaps=false %}

## With other components

Drop a rings indicator inside a [Card](/components/data-display/card/) to build a compact stat tile.

{% raw %}
```aardvark
{% card title="Quarterly goals" %}
{% ringsprogress rings='[{"value":82,"color":"teal"},{"value":64,"color":"cyan"},{"value":40,"color":"indigo"}]' size=160 label='Q3' %}
{% endCard %}
```
{% endraw %}

{% card title="Quarterly goals" %}
{% ringsprogress rings='[{"value":82,"color":"teal"},{"value":64,"color":"cyan"},{"value":40,"color":"indigo"}]' size=160 label='Q3' %}
{% endCard %}

## Attributes

Omit any attribute to take its default. Bare flags (e.g. `glow`) become `=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `rings` | **Required.** A JSON array of `{value, color}` objects | One ring per object; `value` is 0–100, `color` a Mantine color name or CSS color. |
| `size` | Integer (px) | Overall diameter of the outermost ring. |
| `thickness` | Integer (px) | Stroke width of each ring (overridable per-ring in the JSON). |
| `gap` | Integer (px) | Space between adjacent rings. |
| `roundCaps` | `true` / `false` (default `true`) | Round the ends of each arc; set `roundCaps=false` for square ends. |
| `animate` | `true` / `false` (default `false`) | Play an entrance animation as the rings fill. |
| `glow` | `true` / `false` (default `false`) | Add a neon glow effect. |
| `showValues` | `true` / `false` (default `false`) | Print each ring's value at the end of its arc. |
| `startAngle` | Integer (degrees) | Starting position of the arcs. |
| `direction` | `clockwise` (default) / `counterclockwise` | Fill direction. |
| `label` | String | Text shown in the center. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

## CSS Selector

The component renders inside an island wrapper carrying
`data-aardvark-island="RingsProgress"`, with the vendor's own class names on the SVG inside.
Target the wrapper to position or space the widget:

```css
[data-aardvark-island="RingsProgress"] {
  margin-inline: auto;
}
```

## Injecting Attributes

Use `attr={…}` to forward raw HTML attributes (ids, `data-*`, ARIA) straight onto the rendered
root — handy for testing hooks or scripting.

{% ringsprogress rings='[{"value":60,"color":"cyan"}]' size=160 attr={'data-testid': 'cpu-rings', 'aria-label': 'CPU usage'} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% ringsprogress rings='[{"value":60,"color":"cyan"}]' size=160 attr={'data-testid': 'cpu-rings', 'aria-label': 'CPU usage'} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'ringsprogress', rings='[{"value":60,"color":"cyan"}]', size=160,
          attr={'data-testid': 'cpu-rings', 'aria-label': 'CPU usage'})
```
{% endAccordionSection %}
{% endAccordion %}
