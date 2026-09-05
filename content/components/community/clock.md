---
title: "Clock"
description: "The built-in clock tag — an analog clock that ticks live time, or shows a fixed time, with arcs, shapes, and timezone support."
parent: community
weight: 10
---

# Clock

`clock` is an analog clock. With no props it shows the live local time, ticking second by
second; give it a `value` and `running=false` to freeze it on a fixed time, or a `timezone`
to show another part of the world.

A **Community Component** — wraps [Clock](https://gfazioli.github.io/mantine-clock/) by
**gfazioli**, **MIT** licensed, installed from npm as `@gfazioli/mantine-clock`.

## Demonstrations

A bare `{% raw %}{% clock %}{% endraw %}` renders a live analog clock showing the current local time.

{% raw %}
```aardvark
{% clock %}
```
{% endraw %}

{% clock %}

### A fixed time

Pass a `value` (`"HH:MM"` or `"HH:MM:SS"`) with `running=false` to show a static time
instead of the live clock.

{% raw %}
```aardvark
{% clock value='10:09:36' running=false size='lg' %}
```
{% endraw %}

{% clock value='10:09:36' running=false size='lg' %}

### Timezones

Set `timezone` to an IANA timezone name to show the live time elsewhere.

{% raw %}
```aardvark
{% group %}
{% clock timezone='America/New_York' size='md' %}
{% clock timezone='Europe/London' size='md' %}
{% clock timezone='Asia/Tokyo' size='md' %}
{% endGroup %}
```
{% endraw %}

{% group %}
{% clock timezone='America/New_York' size='md' %}
{% clock timezone='Europe/London' size='md' %}
{% clock timezone='Asia/Tokyo' size='md' %}
{% endGroup %}

### Shape and second-hand behavior

`shape` (`circle` or `rounded-rect`) restyles the face, and `secondHandBehavior` (`smooth`,
`tick`, or `tick-half`) controls how the second hand moves.

{% raw %}
```aardvark
{% group %}
{% clock shape='circle' secondHandBehavior='smooth' size='md' %}
{% clock shape='rounded-rect' secondHandBehavior='tick' size='md' %}
{% endGroup %}
```
{% endraw %}

{% group %}
{% clock shape='circle' secondHandBehavior='smooth' size='md' %}
{% clock shape='rounded-rect' secondHandBehavior='tick' size='md' %}
{% endGroup %}

### Arcs

Toggle `withSecondsArc`, `withMinutesArc`, and `withHoursArc` to draw progress arcs around
the face.

{% raw %}
```aardvark
{% clock withSecondsArc withMinutesArc withHoursArc size='lg' %}
```
{% endraw %}

{% clock withSecondsArc withMinutesArc withHoursArc size='lg' %}

## With other components

A clock anchors a "current time" panel inside a [card](/components/data-display/card/).

{% raw %}
```aardvark
{% card title="Server time" %}
{% center %}
{% clock timezone='UTC' size='lg' withSecondsArc %}
{% endCenter %}
{% endCard %}
```
{% endraw %}

{% card title="Server time" %}
{% center %}
{% clock timezone='UTC' size='lg' withSecondsArc %}
{% endCenter %}
{% endCard %}

## Attributes

Omit any attribute to take its default (a live local-time clock). Bare flags (e.g.
`withSecondsArc`) become `=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `value` | `"HH:MM"` / `"HH:MM:SS"` | A fixed time to display (use with `running=false`). |
| `running` | `true` / `false` | Whether the clock ticks. Defaults to ticking; set `running=false` to freeze on `value`. |
| `timezone` | An IANA timezone name (e.g. `Asia/Tokyo`) | Show the live time for another zone. Defaults to local. |
| `size` | `xs`–`xl`, a number of px, or a CSS length (default `400` px) | Clock size. |
| `shape` | `circle` (default), `rounded-rect` | Face shape. |
| `secondHandBehavior` | `smooth`, `tick`, `tick-half`, `tick-high-freq` | How the second hand moves. |
| `withSecondsArc` | `true` / `false` (default `false`) | Draw the seconds progress arc. |
| `withMinutesArc` | `true` / `false` (default `false`) | Draw the minutes progress arc. |
| `withHoursArc` | `true` / `false` (default `false`) | Draw the hours progress arc. |
| `animateOnMount` | `true` / `false` (default `false`) | Play an entrance animation when the clock mounts. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

The clock takes no body.

{% callout severity="info" title="Good to know" %}
The clock is client-only, and it is left out of the build-time prerender — the page ships an
empty placeholder and the whole face is drawn once the page's JavaScript runs. A reader with
JavaScript turned off sees nothing there, so don't put the only copy of a time your page needs
to convey inside one.

`timezone` is passed to the clock verbatim, so any IANA zone name your reader's browser knows
works — the named zones in the examples are just the common ones.
{% endCallout %}

## CSS Selector

Every part of the face carries a stable `mantine-Clock-*` class you can target from
`custom.css` (the same names work as Styles API `classNames` keys in your own React):

| Selector | Targets |
| --- | --- |
| `.mantine-Clock-root` | The clock root. |
| `.mantine-Clock-clockFace` | The face background. |
| `.mantine-Clock-hourTick` / `.mantine-Clock-minuteTick` | The hour and minute tick marks. |
| `.mantine-Clock-number` / `.mantine-Clock-primaryNumber` / `.mantine-Clock-secondaryNumber` | The numerals. |
| `.mantine-Clock-hourHand` / `.mantine-Clock-minuteHand` / `.mantine-Clock-secondHand` | The three hands. |
| `.mantine-Clock-centerDot` | The center hub. |

Those classes are shared by every clock on the page; give one instance an `id` or a `data-*`
hook through `attr={…}` (see below) when a rule should apply to it alone.

## Injecting Attributes

The `attr={…}` channel forwards raw HTML attributes straight onto the rendered clock root —
use it for `id`, `data-*`, ARIA attributes, or anything else not exposed as a typed
parameter. Don't send `class`, `className`, or `style` through it: those are managed by the
component, and the page logs a console warning if you try.

{% clock timezone='UTC' attr={'id': 'office-clock', 'data-role': 'office-clock', 'aria-label': 'UTC time'} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% clock timezone='UTC' attr={'id': 'office-clock', 'data-role': 'office-clock', 'aria-label': 'UTC time'} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'clock', timezone='UTC',
          attr={'id': 'office-clock', 'data-role': 'office-clock',
                'aria-label': 'UTC time'})
```
{% endAccordionSection %}
{% endAccordion %}
