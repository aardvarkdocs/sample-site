---
title: "Badge"
description: "The built-in badge tag — labels, statuses, versions, and counts. Usage, options, and live examples (variants, colors, gradient, sections)."
---

# Badge

A **built-in** tag for small labels — statuses, versions, counts, and tags. It ships with
aardvark, so a badge is a single tag with no setup. For the underlying component and
every prop it accepts, see [Mantine's Badge docs](https://mantine.dev/core/badge/).

## Usage

The label is the block body or a `text` param. Set any of the options below; omit one and
it takes its default:

{% raw %}
```aardvark
{% badge text='New' color='green' %}
{% badge variant='outline' color='blue' %}Beta{% endBadge %}
```
{% endraw %}

renders, live:

{% badge text='New' color='green' %} {% badge variant='outline' color='blue' %}Beta{% endBadge %}

## Options

Omit any option to take its default.

| Param | Effect |
| --- | --- |
| `text` | Label, when not using the block body. |
| `variant` | `filled` (default), `light`, `outline`, `dot`, `transparent`, `white`, `default`, `gradient`. |
| `color` | Any theme color (`blue`, `green`, `grape`, …). |
| `size` | `xs`–`xl`. |
| `radius` | `xs`–`xl`. |
| `fullWidth` | Stretch to the container's width. |
| `circle` | Render as a circle — good for a single character or count. |
| `autoContrast` | Auto-pick a readable label color for the background. |
| `leftSection` / `rightSection` | Text shown before / after the label. |
| `gradientFrom` / `gradientTo` / `gradientDeg` | Gradient endpoints and angle, used with `variant='gradient'`. |

## Variants and colors

{% raw %}
```aardvark
{% badge %}filled{% endBadge %} {% badge variant='light' %}light{% endBadge %} {% badge variant='outline' %}outline{% endBadge %} {% badge variant='dot' %}dot{% endBadge %}
```
{% endraw %}

{% badge %}filled{% endBadge %} {% badge variant='light' %}light{% endBadge %} {% badge variant='outline' %}outline{% endBadge %} {% badge variant='dot' %}dot{% endBadge %}

{% badge color='green' %}green{% endBadge %} {% badge color='grape' %}grape{% endBadge %} {% badge color='orange' %}orange{% endBadge %} {% badge color='gray' %}gray{% endBadge %}

## Gradient

For `variant='gradient'`, set any of `gradientFrom`, `gradientTo`, `gradientDeg`:

{% raw %}
```aardvark
{% badge text='Pro' variant='gradient' gradientFrom='indigo' gradientTo='cyan' gradientDeg=90 %}
```
{% endraw %}

{% badge text='Pro' variant='gradient' gradientFrom='indigo' gradientTo='cyan' gradientDeg=90 %}

## Circle and sections

`circle` renders a round badge; `leftSection`/`rightSection` take text:

{% raw %}
```aardvark
{% badge color='red' circle=true size='lg' %}9{% endBadge %} {% badge variant='light' color='blue' rightSection='12' %}Updates{% endBadge %}
```
{% endraw %}

{% badge color='red' circle=true size='lg' %}9{% endBadge %} {% badge variant='light' color='blue' rightSection='12' %}Updates{% endBadge %}
