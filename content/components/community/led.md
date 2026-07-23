---
title: "Led"
description: "The built-in led tag — a customizable LED status indicator with on/off state, color, variants, shapes, and animations."
menu: components
parent: community
weight: 20
---

# Led

`led` is a small LED status indicator — a glowing dot you can drive on or off, tint, shape,
and animate. Reach for it to show health, connection, or power state in a status panel.

A **Community Component** — wraps [Led](https://gfazioli.github.io/mantine-led/) by
**gfazioli**, **MIT** licensed, installed from npm as `@gfazioli/mantine-led`.

## Demonstrations

A bare `{% raw %}{% led %}{% endraw %}` renders a lit LED in the default style.

{% raw %}
```aardvark
{% led %}
```
{% endraw %}

{% led %}

### On and off

`value` drives the LED's state. Set `value=false` for an off LED, and `offColor` for the
color it shows when off.

{% raw %}
```aardvark
{% group %}
{% led value=true color='green' label='On' %}
{% led value=false offColor='gray' label='Off' %}
{% endGroup %}
```
{% endraw %}

{% group %}
{% led value=true color='green' label='On' %}
{% led value=false offColor='gray' label='Off' %}
{% endGroup %}

### Variants

Set `variant` to `flat`, `3d`, `neon`, or `dot` for different looks.

{% raw %}
```aardvark
{% group %}
{% led variant='flat' color='blue' %}
{% led variant='3d' color='blue' %}
{% led variant='neon' color='blue' %}
{% led variant='dot' color='blue' %}
{% endGroup %}
```
{% endraw %}

{% group %}
{% led variant='flat' color='blue' %}
{% led variant='3d' color='blue' %}
{% led variant='neon' color='blue' %}
{% led variant='dot' color='blue' %}
{% endGroup %}

### Shapes and sizes

`shape` (`circle`, `square`, `rectangle`) and `size` (`xs`–`xl`) control the form factor.

{% raw %}
```aardvark
{% group %}
{% led shape='circle' size='xl' color='grape' %}
{% led shape='square' size='lg' color='grape' %}
{% led shape='rectangle' size='md' color='grape' %}
{% endGroup %}
```
{% endraw %}

{% group %}
{% led shape='circle' size='xl' color='grape' %}
{% led shape='square' size='lg' color='grape' %}
{% led shape='rectangle' size='md' color='grape' %}
{% endGroup %}

### Animation

Turn on `animate` and pick an `animationType` (`pulse`, `flash`, `breathe`, `blink`,
`glow`) for an attention-drawing LED.

{% raw %}
```aardvark
{% group %}
{% led animate animationType='pulse' color='red' label='Pulse' %}
{% led animate animationType='blink' color='yellow' label='Blink' %}
{% led animate animationType='glow' color='cyan' label='Glow' %}
{% endGroup %}
```
{% endraw %}

{% group %}
{% led animate animationType='pulse' color='red' label='Pulse' %}
{% led animate animationType='blink' color='yellow' label='Blink' %}
{% led animate animationType='glow' color='cyan' label='Glow' %}
{% endGroup %}

### Label from the body

The block body becomes the LED's label when you don't set a plain-text `label`.

{% raw %}
```aardvark
{% led color='green' labelPosition='right' %}Service healthy{% endLed %}
```
{% endraw %}

{% led color='green' labelPosition='right' %}Service healthy{% endLed %}

## With other components

LEDs read well inside a status [card](/components/data-display/card/), one row per service.

{% raw %}
```aardvark
{% card title="System status" %}
{% stack gap='xs' %}
{% led value=true color='green' label='API' labelPosition='right' %}
{% led value=true color='green' label='Database' labelPosition='right' %}
{% led value=false offColor='red' animate animationType='blink' label='Cache' labelPosition='right' %}
{% endStack %}
{% endCard %}
```
{% endraw %}

{% card title="System status" %}
{% stack gap='xs' %}
{% led value=true color='green' label='API' labelPosition='right' %}
{% led value=true color='green' label='Database' labelPosition='right' %}
{% led value=false offColor='red' animate animationType='blink' label='Cache' labelPosition='right' %}
{% endStack %}
{% endCard %}

## Attributes

Omit any attribute to take its default. Bare flags (e.g. `animate`) become `=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `value` | `true` / `false` | On/off state. Omit for the package default; `value=false` is an explicitly-off LED. |
| `color` | Any theme color or CSS color | Color when lit. |
| `offColor` | Any theme color or CSS color | Color when off. |
| `size` | `xs`–`xl` | LED size. |
| `variant` | `flat`, `3d`, `neon`, `dot` | Visual style. |
| `shape` | `circle`, `square`, `rectangle` | Form factor. |
| `radius` | `xs`–`xl` | Corner rounding (for square/rectangle). |
| `animate` | `true` / `false` (default `false`) | Enable animation. |
| `animationType` | `pulse`, `flash`, `breathe`, `blink`, `glow` | Animation effect. |
| `animationDuration` | Number (seconds) | Animation speed. |
| `intensity` | Number | Glow strength. |
| `label` | String | Descriptive text next to the LED. |
| `labelPosition` | `left`, `right` | Label placement. |
| `tooltip` | String | Hover tooltip text. |
| `gradientFrom` | Any theme color or CSS color | Gradient start color. |
| `gradientTo` | Any theme color or CSS color | Gradient end color. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

The block body (between `{% raw %}{% led %}{% endraw %}` and `{% raw %}{% endLed %}{% endraw %}`) is used as the
label when no plain-text `label` is set.

## CSS Selector

The LED exposes Mantine Styles API selectors you can target with `classNames` in your own
React, or style directly:

| Selector | Element |
| --- | --- |
| `root` | The wrapper element. |
| `led` | The LED indicator itself. |
| `label` | The label text area. |
| `glow` | The outer glow layer. |
| `light` | The inner light reflection. |

Forward a class with `attr={…}` (see below) to scope a stylesheet rule to one instance.

## Injecting Attributes

The `attr={…}` channel forwards raw HTML attributes straight onto the rendered LED root —
use it for `id`, `class`, `data-*`, ARIA attributes, or anything else not exposed as a typed
parameter.

{% led color='green' attr={'class': 'status-led', 'data-service': 'api'} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% led color='green' attr={'class': 'status-led', 'data-service': 'api'} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'led', color='green',
          attr={'class': 'status-led', 'data-service': 'api'})
```
{% endAccordionSection %}
{% endAccordion %}
