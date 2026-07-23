---
title: "Container"
description: "The built-in container tag — centers content horizontally and caps its width with a comfortable side gutter. Size tokens, fluid mode, and a full attribute reference."
---

# Container

`{% raw %}{% container %}{% endraw %}` is a **built-in** tag that **centers content
horizontally** and caps it to a comfortable reading width with a side gutter. It's the
wrapper you reach for around a block of prose or a centered section. Set `size` to choose the
max width, or `fluid` to take the full width while keeping the gutter.

Use it as `{% raw %}{% container %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'container', …)`.

## Sized column

`size` is a Mantine size token (`xs`–`xl`) or any CSS width — it sets the **max content
width**. Smaller tokens make a narrower column. A tinted background and padding make the
bounds visible.

{% container size='xs' bg='var(--mantine-color-gray-1)' p='md' %}
A narrow, centered column of content with a gutter on each side.
{% endContainer %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% container size='xs' bg='var(--mantine-color-gray-1)' p='md' %}
A narrow, centered column of content with a gutter on each side.
{% endContainer %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'container', size='xs',
          bg='var(--mantine-color-gray-1)', p='md',
          children='A narrow, centered column of content with a gutter on each side.')
```
{% endAccordionSection %}
{% endAccordion %}

## A wider size

Bump `size` up to widen the column. `lg` is roomy enough for two-column content or a wide
section.

{% container size='lg' bg='var(--mantine-color-gray-1)' p='md' %}
A wider centered column — size='lg'.
{% endContainer %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% container size='lg' bg='var(--mantine-color-gray-1)' p='md' %}
A wider centered column — size='lg'.
{% endContainer %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'container', size='lg',
          bg='var(--mantine-color-gray-1)', p='md',
          children="A wider centered column — size='lg'.")
```
{% endAccordionSection %}
{% endAccordion %}

## Fluid

`fluid` ignores `size` and takes the full available width, keeping only the gutter — handy
for a full-bleed section that still wants side padding.

{% container fluid bg='var(--mantine-color-gray-1)' p='md' %}
Full width, with a gutter.
{% endContainer %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% container fluid bg='var(--mantine-color-gray-1)' p='md' %}
Full width, with a gutter.
{% endContainer %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'container', fluid=True,
          bg='var(--mantine-color-gray-1)', p='md',
          children='Full width, with a gutter.')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

The body is ordinary Markdown, so Container makes a tidy frame for a centered
[`{% raw %}{% stack %}{% endraw %}`](/components/layout/stack/) — a heading, a paragraph, and
a call to action capped at a readable width.

{% container size='sm' bg='var(--mantine-color-gray-1)' p='lg' %}
{% stack gap='sm' %}
{% badge size='lg' %}Welcome{% endBadge %}

A short, readable intro paragraph that stays narrow enough to scan comfortably.

{% button text='Get started' %}
{% endStack %}
{% endContainer %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% container size='sm' bg='var(--mantine-color-gray-1)' p='lg' %}
{% stack gap='sm' %}
{% badge size='lg' %}Welcome{% endBadge %}

A short, readable intro paragraph that stays narrow enough to scan comfortably.

{% button text='Get started' %}
{% endStack %}
{% endContainer %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = component('aardvark', 'stack', gap='sm', children=(
    component('aardvark', 'badge', size='lg', children='Welcome')
    + '\n\nA short, readable intro paragraph that stays narrow enough to scan comfortably.\n\n'
    + component('aardvark', 'button', text='Get started')))
component('aardvark', 'container', size='sm',
          bg='var(--mantine-color-gray-1)', p='lg', children=inner)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

`size` and `fluid` are the options of their own; everything else is the shared Mantine
spacing/sizing system. Omit any attribute to take its Mantine default (size `md`).

| Attribute | Values | Description |
| --- | --- | --- |
| `size` | `xs`–`xl` or any CSS value (`md` default) | Max content width. Smaller tokens = narrower column. |
| `fluid` | `true`, `false` (default `false`) | Take the full width (ignoring `size`), keeping the gutter. |
| `w` / `h` | `xs`–`xl` or any CSS size | Width / height of the container. |
| `miw` / `mih` | any CSS size | Minimum width / height. |
| `maw` / `mah` | any CSS size | Maximum width / height. |
| `m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my` | `xs`–`xl` or any CSS size | Margin — all sides, or a single side / axis. |
| `p`, `pt`, `pb`, `pl`, `pr`, `px`, `py` | `xs`–`xl` or any CSS size | Padding — all sides, or a single side / axis. |
| `bg` | a theme color or any CSS color | Background color. |
| `c` | a theme color or any CSS color | Text (content) color. |


## CSS Selectors

Each `container` carries `data-aardvark-island="Container"` on its wrapper, and Mantine exposes its parts as `mantine-Container-*` classes — target either to style it from your theme CSS.

{% raw %}
```css
[data-aardvark-island="Container"] {
  /* style every container on the page */
}

.mantine-Container-root {
  /* the root part */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% container size='xs' bg='var(--mantine-color-gray-1)' p='md' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Centered, max-width content.
{% endContainer %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% container size='xs' bg='var(--mantine-color-gray-1)' p='md' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Centered, max-width content.
{% endContainer %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'container', size='xs',
          bg='var(--mantine-color-gray-1)', p='md',
          children='Centered, max-width content.', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
