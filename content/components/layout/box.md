---
title: "Box"
description: "The built-in box tag — the base primitive every Mantine component is built on. Apply padding, margin, background, color, sizing, or a raw style to any block of content."
---

# Box

`box` is the **base primitive** — the plain element every other Mantine component is built on. It draws nothing of its own; it just forwards Mantine's *style props* (spacing, color, sizing, raw `style`) onto a `<div>` so you can tweak padding, margin, a background, or sizing without pulling in a styled component. Because every Mantine component inherits this same style-prop surface, the `p`/`m`/`bg`/`c`/`w` props you learn here work on `paper`, `button`, `text`, and the rest too.

Use it as `{% raw %}{% box %}{% endraw %}` in Markdown, or call it from Python logic (loops, snippets) via `component('aardvark', 'box', …)`.

## Demonstrations

The block body is the content; set any of the style props to shape it. Here a tinted background, padding, and a rounded corner via a raw `style`:

{% box bg='var(--mantine-color-blue-light)' p='md' style='border-radius: 8px' %}
A plain box with a tinted background, padding, and rounded corners.
{% endBox %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% box bg='var(--mantine-color-blue-light)' p='md' style='border-radius: 8px' %}
A plain box with a tinted background, padding, and rounded corners.
{% endBox %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'box',
    bg='var(--mantine-color-blue-light)',
    p='md',
    style='border-radius: 8px',
    children='A plain box with a tinted background, padding, and rounded corners.',
)
```
{% endAccordionSection %}
{% endAccordion %}

The spacing and sizing props take a Mantine token (`xs`–`xl`) or any CSS length. Here large horizontal and small vertical padding, constrained to a max width:

{% box bg='var(--mantine-color-grape-light)' px='xl' py='sm' maw='320px' %}
Constrained to 320px, with large horizontal and small vertical padding.
{% endBox %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% box bg='var(--mantine-color-grape-light)' px='xl' py='sm' maw='320px' %}
Constrained to 320px, with large horizontal and small vertical padding.
{% endBox %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'box',
    bg='var(--mantine-color-grape-light)',
    px='xl', py='sm', maw='320px',
    children='Constrained to 320px, with large horizontal and small vertical padding.',
)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Box is a layout wrapper, so it composes with any other tag. Here it adds a background and padding around a `paper` surface and a `divider`:

{% box bg='var(--mantine-color-gray-light)' p='lg' style='border-radius: 8px' %}
{% paper withBorder=true p='md' radius='md' %}
A panel sitting inside a tinted, padded box.
{% endPaper %}
{% divider my='md' %}
Box just forwards the style props — the content inside is ordinary Markdown.
{% endBox %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% box bg='var(--mantine-color-gray-light)' p='lg' style='border-radius: 8px' %}
{% paper withBorder=true p='md' radius='md' %}
A panel sitting inside a tinted, padded box.
{% endPaper %}
{% divider my='md' %}
Box just forwards the style props — the content inside is ordinary Markdown.
{% endBox %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = (
    component('aardvark', 'paper', withBorder=True, p='md', radius='md',
              children='A panel sitting inside a tinted, padded box.')
    + component('aardvark', 'divider', my='md')
    + 'Box just forwards the style props — the content inside is ordinary Markdown.'
)
component(
    'aardvark', 'box',
    bg='var(--mantine-color-gray-light)', p='lg',
    style='border-radius: 8px',
    children=inner,
)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Box has no styling of its own — omit any attribute to leave that property unset. Spacing and sizing values take a Mantine token (`xs`–`xl`) or any CSS length.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `bg` | A theme color (`blue.0`, `var(--mantine-color-blue-light)`) or any CSS color | Background color. |
| `c` | A theme color or any CSS color | Text color. |
| `opacity` | `0`–`1` | Element opacity. |
| `style` | A raw inline CSS string (`border-radius: 8px; color: red`) | Inline styles applied to the element. |
| `id` | Any string | HTML `id` on the rendered element, for CSS / JS selectors. |
| `m` / `mt` / `mb` / `ml` / `mr` / `mx` / `my` | Spacing token (`md`) or any CSS length | Margin — all sides, or a single side / axis. |
| `p` / `pt` / `pb` / `pl` / `pr` / `px` / `py` | Spacing token or any CSS length | Padding — all sides, or a single side / axis. |
| `w` / `h` | Any CSS length | Width / height. |
| `miw` / `mih` / `maw` / `mah` | Any CSS length | Min/max width and min/max height. |

`attr={...}` forwards raw HTML attributes (e.g. a `data-*` hook) onto the rendered element.


## CSS Selectors

Each `box` carries `data-aardvark-island="Box"` on its wrapper; it renders a single element with no Mantine Styles API parts, so target the island wrapper.

{% raw %}
```css
[data-aardvark-island="Box"] {
  /* style every box on the page */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% box bg='var(--mantine-color-blue-light)' p='md' style='border-radius: 8px' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
A plain box.
{% endBox %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% box bg='var(--mantine-color-blue-light)' p='md' style='border-radius: 8px' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
A plain box.
{% endBox %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'box',
    bg='var(--mantine-color-blue-light)',
    p='md',
    style='border-radius: 8px',
    children='A plain box.',
    attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''},
)
```
{% endAccordionSection %}
{% endAccordion %}
