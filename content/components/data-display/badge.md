---
title: "Badge"
description: "The built-in badge tag — labels, statuses, versions, and counts. Usage, options, and live examples (variants, colors, gradient, sections)."
---

# Badge

A **built-in** tag for small labels — statuses, versions, counts, and tags. It ships with
aardvark, so a badge is a single tag with no setup. The label is the block body or a `text`
param. Use it as `{% raw %}{% badge %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'badge', …)`.

## Demonstrations

### Variants

Every Mantine badge variant — `filled` (the default), `light`, `outline`, `dot`,
`transparent`, `white`, and `default`:

{% badge %}filled{% endBadge %} {% badge variant='light' %}light{% endBadge %} {% badge variant='outline' %}outline{% endBadge %} {% badge variant='dot' %}dot{% endBadge %} {% badge variant='transparent' %}transparent{% endBadge %} {% badge variant='white' %}white{% endBadge %} {% badge variant='default' %}default{% endBadge %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% badge %}filled{% endBadge %}
{% badge variant='light' %}light{% endBadge %}
{% badge variant='outline' %}outline{% endBadge %}
{% badge variant='dot' %}dot{% endBadge %}
{% badge variant='transparent' %}transparent{% endBadge %}
{% badge variant='white' %}white{% endBadge %}
{% badge variant='default' %}default{% endBadge %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
for v in ('filled', 'light', 'outline', 'dot', 'transparent', 'white', 'default'):
    page.print(component('aardvark', 'badge', variant=v, children=v))
```
{% endAccordionSection %}
{% endAccordion %}

### Colors

`color` takes any theme color (`blue`, `green`, `grape`, …) or any CSS color:

{% badge color='green' %}green{% endBadge %} {% badge color='grape' %}grape{% endBadge %} {% badge color='orange' %}orange{% endBadge %} {% badge color='gray' %}gray{% endBadge %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% badge color='green' %}green{% endBadge %}
{% badge color='grape' %}grape{% endBadge %}
{% badge color='orange' %}orange{% endBadge %}
{% badge color='gray' %}gray{% endBadge %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
for c in ('green', 'grape', 'orange', 'gray'):
    page.print(component('aardvark', 'badge', color=c, children=c))
```
{% endAccordionSection %}
{% endAccordion %}

### Sizes and radius

`size` and `radius` both take `xs`–`xl`:

{% badge size='xs' %}xs{% endBadge %} {% badge size='sm' %}sm{% endBadge %} {% badge size='md' %}md{% endBadge %} {% badge size='lg' %}lg{% endBadge %} {% badge size='xl' radius='xl' %}xl{% endBadge %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% badge size='xs' %}xs{% endBadge %}
{% badge size='sm' %}sm{% endBadge %}
{% badge size='md' %}md{% endBadge %}
{% badge size='lg' %}lg{% endBadge %}
{% badge size='xl' radius='xl' %}xl{% endBadge %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
for s in ('xs', 'sm', 'md', 'lg', 'xl'):
    page.print(component('aardvark', 'badge', size=s, children=s))
```
{% endAccordionSection %}
{% endAccordion %}

### Gradient

`variant='gradient'` paints the badge with a gradient; set any of `gradientFrom`,
`gradientTo`, and `gradientDeg` to control the endpoints and angle:

{% badge text='Pro' variant='gradient' gradientFrom='indigo' gradientTo='cyan' gradientDeg=90 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% badge text='Pro' variant='gradient' gradientFrom='indigo' gradientTo='cyan' gradientDeg=90 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'badge', text='Pro', variant='gradient',
          gradientFrom='indigo', gradientTo='cyan', gradientDeg=90)
```
{% endAccordionSection %}
{% endAccordion %}

### Circle, sections, and full width

`circle` renders a round badge — good for a single character or count.
`leftSection`/`rightSection` take text shown before/after the label, and `fullWidth`
stretches the badge to its container:

{% badge color='red' circle=true size='lg' %}9{% endBadge %} {% badge variant='light' color='blue' rightSection='12' %}Updates{% endBadge %} {% badge variant='light' color='teal' leftSection='v' %}2.0{% endBadge %}

{% badge fullWidth=true color='grape' %}full width{% endBadge %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% badge color='red' circle=true size='lg' %}9{% endBadge %}
{% badge variant='light' color='blue' rightSection='12' %}Updates{% endBadge %}
{% badge variant='light' color='teal' leftSection='v' %}2.0{% endBadge %}
{% badge fullWidth=true color='grape' %}full width{% endBadge %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'badge', color='red', circle=True, size='lg', children='9')
component('aardvark', 'badge', variant='light', color='blue', rightSection='12', children='Updates')
component('aardvark', 'badge', variant='light', color='teal', leftSection='v', children='2.0')
component('aardvark', 'badge', fullWidth=True, color='grape', children='full width')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

A badge sits naturally inside a heading, list, or another component — here it labels a
{% raw %}{% card %}{% endraw %} title and rides alongside an {% raw %}{% icon %}{% endraw %}:

Status: {% icon "circle-check" color="green" %} {% badge color='green' variant='light' %}Stable{% endBadge %}

{% card title="Releases" %}
The latest build {% badge color='green' %}New{% endBadge %} ships today.
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
Status: {% icon "circle-check" color="green" %} {% badge color='green' variant='light' %}Stable{% endBadge %}

{% card title="Releases" %}
The latest build {% badge color='green' %}New{% endBadge %} ships today.
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
body = "The latest build " + component('aardvark', 'badge', color='green', children='New') + " ships today."
page.print(component('aardvark', 'card', title='Releases', children=body))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| (body) / `text` | string | The label. Use the block body, or the `text` param when not using a body. |
| `variant` | `filled` (default), `light`, `outline`, `dot`, `transparent`, `white`, `default`, `gradient` | Visual style. |
| `color` | any theme color (`blue`, `green`, `grape`, …) or any CSS color | Badge color. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Badge size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl` | Corner rounding. |
| `fullWidth` | bool flag (`true`/`false`) | Stretch to the container's width. Defaults to `false`. |
| `circle` | bool flag (`true`/`false`) | Render as a circle — good for a single character or count. Defaults to `false`. |
| `autoContrast` | bool flag (`true`/`false`) | Auto-pick a readable label color for the background. Defaults to `false`. |
| `leftSection` | string | Text shown before the label. |
| `rightSection` | string | Text shown after the label. |
| `gradientFrom` | any theme/CSS color | Gradient start color, used with `variant='gradient'`. |
| `gradientTo` | any theme/CSS color | Gradient end color, used with `variant='gradient'`. |
| `gradientDeg` | integer (degrees) | Gradient angle, used with `variant='gradient'`. |
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="Badge"]` — or through the Mantine Styles API classes (`.mantine-Badge-root` and its inner parts):

{% raw %}
```css
/* Every rendered Badge carries this island marker */
[data-aardvark-island="Badge"] { }

/* Mantine Styles API class on the root element */
.mantine-Badge-root { }
.mantine-Badge-label { }
.mantine-Badge-section { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% badge color='green' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}Stable{% endBadge %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% badge color='green' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}Stable{% endBadge %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'badge', color='green', children='Stable', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
