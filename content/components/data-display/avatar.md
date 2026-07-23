---
title: "Avatar"
description: "The built-in avatar tag — a user image with a graceful initials/placeholder fallback. Usage, options, and live examples (sizes, radius, variants, initials, gradient)."
---

# Avatar

A user avatar: an image that degrades gracefully to initials or a placeholder when the image
is missing or fails to load. Point `src` at an image; when there's no `src` (or it can't
load), the block body — or, with a `name`, auto-generated initials — is shown instead. It
ships with aardvark, so it's a single tag with no setup.

Use it as `{% raw %}{% avatar %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'avatar', …)`.

## Demonstrations

### Image, initials, and a body fallback

Three ways to fill an avatar: a real image (`src` + `alt`), auto-generated initials from a
`name`, or an explicit body. With `color='initials'`, the color is derived deterministically
from the `name`.

{% avatar name='Ada Lovelace' %} {% avatar name='Grace Hopper' color='initials' %} {% avatar %}AL{% endAvatar %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% avatar src='/avatar.png' alt='Ada Lovelace' %}
{% avatar name='Ada Lovelace' %}
{% avatar name='Grace Hopper' color='initials' %}
{% avatar %}AL{% endAvatar %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'avatar', src='/avatar.png', alt='Ada Lovelace')
component('aardvark', 'avatar', name='Ada Lovelace')
component('aardvark', 'avatar', name='Grace Hopper', color='initials')
component('aardvark', 'avatar', children='AL')
```
{% endAccordionSection %}
{% endAccordion %}

### Sizes and radius

`size` takes `xs`–`xl` or any CSS value; `radius` takes `xs`–`xl`, or `'100%'` (the default)
for a circle. A smaller `radius` squares off the corners.

{% avatar name='XS' size='xs' %} {% avatar name='MD' size='md' %} {% avatar name='XL' size='xl' %} {% avatar name='SQ' radius='sm' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% avatar name='XS' size='xs' %}
{% avatar name='MD' size='md' %}
{% avatar name='XL' size='xl' %}
{% avatar name='SQ' radius='sm' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'avatar', name='XS', size='xs')
component('aardvark', 'avatar', name='MD', size='md')
component('aardvark', 'avatar', name='XL', size='xl')
component('aardvark', 'avatar', name='SQ', radius='sm')
```
{% endAccordionSection %}
{% endAccordion %}

### Initials and color

With no `src`, `name` drives the initials. Pass any theme color to `color`, or use
`color='initials'` to derive a stable color from the name.

{% avatar name='Ada Lovelace' color='initials' %} {% avatar name='Grace Hopper' color='initials' %} {% avatar name='Alan Turing' color='grape' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% avatar name='Ada Lovelace' color='initials' %}
{% avatar name='Grace Hopper' color='initials' %}
{% avatar name='Alan Turing' color='grape' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'avatar', name='Ada Lovelace', color='initials')
component('aardvark', 'avatar', name='Grace Hopper', color='initials')
component('aardvark', 'avatar', name='Alan Turing', color='grape')
```
{% endAccordionSection %}
{% endAccordion %}

### Variants and gradient

`variant` accepts `filled`, `light`, `outline`, `transparent`, `white`, `default`, and
`gradient`. With `variant='gradient'`, set any of `gradientFrom` / `gradientTo` /
`gradientDeg` to control the gradient. `autoContrast` picks a readable text color for the
background.

{% avatar name='F' variant='filled' color='blue' %} {% avatar name='L' variant='light' color='blue' %} {% avatar name='O' variant='outline' color='blue' %} {% avatar name='W' variant='white' color='blue' %} {% avatar name='G' variant='gradient' gradientFrom='indigo' gradientTo='cyan' gradientDeg=90 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% avatar name='F' variant='filled' color='blue' %}
{% avatar name='L' variant='light' color='blue' %}
{% avatar name='O' variant='outline' color='blue' %}
{% avatar name='W' variant='white' color='blue' %}
{% avatar name='G' variant='gradient' gradientFrom='indigo' gradientTo='cyan' gradientDeg=90 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'avatar', name='F', variant='filled', color='blue')
component('aardvark', 'avatar', name='L', variant='light', color='blue')
component('aardvark', 'avatar', name='O', variant='outline', color='blue')
component('aardvark', 'avatar', name='W', variant='white', color='blue')
component('aardvark', 'avatar', name='G', variant='gradient',
          gradientFrom='indigo', gradientTo='cyan', gradientDeg=90)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

An avatar is a natural target for an
[`{% raw %}{% indicator %}{% endraw %}`](/components/data-display/indicator/), which puts a
count or status dot over its corner:

{% indicator label='3' color='red' %}{% avatar name='Ada Lovelace' %}{% endIndicator %} {% indicator color='green' processing=true %}{% avatar name='Grace Hopper' %}{% endIndicator %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% indicator label='3' color='red' %}
{% avatar name='Ada Lovelace' %}
{% endIndicator %}

{% indicator color='green' processing=true %}
{% avatar name='Grace Hopper' %}
{% endIndicator %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'indicator', label='3', color='red',
          children=component('aardvark', 'avatar', name='Ada Lovelace'))
component('aardvark', 'indicator', color='green', processing=True,
          children=component('aardvark', 'avatar', name='Grace Hopper'))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `src` | Image URL | The avatar image. When missing or broken, the fallback (body or initials) shows. |
| `name` | string | The user's name — used for initials and, with `color='initials'`, a deterministic color. |
| `alt` | string | Image `alt` text (and the placeholder's title). Always set this for accessibility. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl`, or any CSS value | The avatar's width and height. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl`, or any CSS value (`'100%'` is the default circle) | Corner rounding. |
| `color` | any theme color, or `initials` | Background/text color. `initials` derives a stable color from `name`. |
| `variant` | `filled`, `light`, `outline`, `transparent`, `white`, `default`, `gradient` | Visual style. |
| `autoContrast` | bool flag (default `false`) | Auto-pick a readable text color for the background. |
| `gradientFrom` | any theme color | Gradient start color (with `variant='gradient'`). |
| `gradientTo` | any theme color | Gradient end color (with `variant='gradient'`). |
| `gradientDeg` | integer | Gradient angle in degrees (with `variant='gradient'`). |
| body | text | Explicit fallback shown when there is no `src` (or it fails to load). |
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="Avatar"]` — or through the Mantine Styles API classes (`.mantine-Avatar-root` and its inner parts):

{% raw %}
```css
/* Every rendered Avatar carries this island marker */
[data-aardvark-island="Avatar"] { }

/* Mantine Styles API class on the root element */
.mantine-Avatar-root { }
.mantine-Avatar-placeholder { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% avatar name='Ada Lovelace' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% avatar name='Ada Lovelace' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'avatar', name='Ada Lovelace', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
