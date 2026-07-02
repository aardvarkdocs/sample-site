---
title: "Paper"
description: "The built-in paper tag — a card-like surface with a shadow, rounded corners, padding, and an optional border. Usage, options, and live examples."
---

# Paper

`paper` is a **surface** — a panel that lifts content off the page with a shadow, rounded corners, padding, and an optional border. It ships with aardvark, so a surface is a single tag with no setup. The block body is the panel content, and the tag adds a comfortable padding by default.

Use it as `{% raw %}{% paper %}{% endraw %}` in Markdown, or call it from Python logic (loops, snippets) via `component('aardvark', 'paper', …)`.

## Demonstrations

A surface with a shadow, rounded corners, a border, and roomy padding. Any Markdown goes inside — text, lists, even other tags:

{% paper shadow='md' radius='md' withBorder=true p='lg' %}
**A panel.** Drop any Markdown in here — text, lists, even other tags.
{% endPaper %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% paper shadow='md' radius='md' withBorder=true p='lg' %}
**A panel.** Drop any Markdown in here — text, lists, even other tags.
{% endPaper %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'paper',
    shadow='md', radius='md', withBorder=True, p='lg',
    children='**A panel.** Drop any Markdown in here — text, lists, even other tags.',
)
```
{% endAccordionSection %}
{% endAccordion %}

The `shadow` prop controls elevation — `xs` is subtle, `xl` floats:

{% paper shadow='xs' p='md' withBorder=true %}shadow xs, with border{% endPaper %}

{% paper shadow='md' p='md' %}shadow md{% endPaper %}

{% paper shadow='xl' p='md' %}shadow xl{% endPaper %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% paper shadow='xs' p='md' withBorder=true %}shadow xs, with border{% endPaper %}
{% paper shadow='md' p='md' %}shadow md{% endPaper %}
{% paper shadow='xl' p='md' %}shadow xl{% endPaper %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
for sh in ('xs', 'md', 'xl'):
    component('aardvark', 'paper', shadow=sh, p='md', children=f'shadow {sh}')
```
{% endAccordionSection %}
{% endAccordion %}

`withBorder` adds a 1px outline and `radius` rounds the corners — here with extra padding:

{% paper withBorder=true radius='lg' p='xl' %}
A bordered card with large corner rounding and extra padding.
{% endPaper %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% paper withBorder=true radius='lg' p='xl' %}
A bordered card with large corner rounding and extra padding.
{% endPaper %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'paper',
    withBorder=True, radius='lg', p='xl',
    children='A bordered card with large corner rounding and extra padding.',
)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

A surface is a natural container for other tags. Here a panel holds a `divider` and a `badge`:

{% paper shadow='sm' withBorder=true radius='md' p='lg' %}
**Release notes**
{% divider my='sm' %}
Version 2.0 is out {% badge color='green' %}new{% endBadge %}
{% endPaper %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% paper shadow='sm' withBorder=true radius='md' p='lg' %}
**Release notes**
{% divider my='sm' %}
Version 2.0 is out {% badge color='green' %}new{% endBadge %}
{% endPaper %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = (
    '**Release notes**'
    + component('aardvark', 'divider', my='sm')
    + 'Version 2.0 is out '
    + component('aardvark', 'badge', color='green', children='new')
)
component(
    'aardvark', 'paper',
    shadow='sm', withBorder=True, radius='md', p='lg',
    children=inner,
)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default (no shadow, no border). Padding defaults to `md`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `shadow` | `xs` / `sm` / `md` / `lg` / `xl` | Drop shadow / elevation. Omit for no shadow. |
| `radius` | `xs`–`xl`, or any CSS value | Corner rounding. |
| `withBorder` | bare flag or `true` / `false` (default `false`) | Add a 1px border. |
| `p` / `pt` / `pb` / `pl` / `pr` / `px` / `py` | Spacing token (`md`) or any CSS value | Padding — all sides, a side, or an axis. Defaults to `md`. |
| `m` / `mt` / `mb` / `ml` / `mr` / `mx` / `my` | Spacing token or any CSS value | Margin. |
| `bg` | A theme color or any CSS color | Background color. |
| `c` | A theme color or any CSS color | Text color. |
| `w` / `h` | Any CSS length | Width / height. |
| `miw` / `mih` / `maw` / `mah` | Any CSS length | Min/max width and min/max height. |

`attr={...}` forwards raw HTML attributes onto the rendered element.


## CSS Selectors

Each `paper` carries `data-aardvark-island="Paper"` on its wrapper, and Mantine exposes its parts as `mantine-Paper-*` classes — target either to style it from your theme CSS.

{% raw %}
```css
[data-aardvark-island="Paper"] {
  /* style every paper on the page */
}

.mantine-Paper-root {
  /* the root part */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% paper shadow='md' radius='md' withBorder=true p='lg' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
**A panel.**
{% endPaper %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% paper shadow='md' radius='md' withBorder=true p='lg' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
**A panel.**
{% endPaper %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'paper',
    shadow='md', radius='md', withBorder=True, p='lg',
    children='**A panel.**',
    attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''},
)
```
{% endAccordionSection %}
{% endAccordion %}
