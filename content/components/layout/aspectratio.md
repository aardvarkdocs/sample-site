---
title: "AspectRatio"
description: "The built-in aspectratio tag — keeps its content at a fixed width-to-height ratio as it scales. Common ratios, sizing, and a full attribute reference."
---

# AspectRatio

`{% raw %}{% aspectratio %}{% endraw %}` is a **built-in** tag that keeps its content at a
**fixed width-to-height ratio** as it scales. It's the reliable way to embed a video, map, or
image so the box never jumps the layout while the media loads. The `ratio` is a plain number —
width divided by height — and the block body is the content that fills the box.

Use it as `{% raw %}{% aspectratio %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'aspectratio', …)`.

## Widescreen (16:9)

`1.7777` is the classic 16∶9 widescreen video ratio. Cap the size with `maw` (max width) so
the box doesn't stretch edge to edge.

{% aspectratio ratio=1.7777 maw=480 %}
{% center h='100%' bg='var(--mantine-color-gray-2)' %}16 ∶ 9{% endCenter %}
{% endAspectratio %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% aspectratio ratio=1.7777 maw=480 %}
{% center h='100%' bg='var(--mantine-color-gray-2)' %}16 ∶ 9{% endCenter %}
{% endAspectratio %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = component('aardvark', 'center', h='100%',
                  bg='var(--mantine-color-gray-2)', children='16 ∶ 9')
component('aardvark', 'aspectratio', ratio=1.7777, maw=480, children=inner)
```
{% endAccordionSection %}
{% endAccordion %}

## A square (1:1)

`ratio=1` makes a perfect square — useful for avatars, thumbnails, and icon tiles.

{% aspectratio ratio=1 maw=200 %}
{% center h='100%' bg='var(--mantine-color-gray-2)' %}1 ∶ 1{% endCenter %}
{% endAspectratio %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% aspectratio ratio=1 maw=200 %}
{% center h='100%' bg='var(--mantine-color-gray-2)' %}1 ∶ 1{% endCenter %}
{% endAspectratio %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = component('aardvark', 'center', h='100%',
                  bg='var(--mantine-color-gray-2)', children='1 ∶ 1')
component('aardvark', 'aspectratio', ratio=1, maw=200, children=inner)
```
{% endAccordionSection %}
{% endAccordion %}

## Standard (4:3)

`1.3333` is the 4∶3 ratio of older photos and slides.

{% aspectratio ratio=1.3333 maw=320 %}
{% center h='100%' bg='var(--mantine-color-gray-2)' %}4 ∶ 3{% endCenter %}
{% endAspectratio %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% aspectratio ratio=1.3333 maw=320 %}
{% center h='100%' bg='var(--mantine-color-gray-2)' %}4 ∶ 3{% endCenter %}
{% endAspectratio %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = component('aardvark', 'center', h='100%',
                  bg='var(--mantine-color-gray-2)', children='4 ∶ 3')
component('aardvark', 'aspectratio', ratio=1.3333, maw=320, children=inner)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

The body is ordinary Markdown, so the most common use is wrapping a media embed — here a
Markdown image — so the box holds its shape before the image arrives.

{% aspectratio ratio=1.7777 maw=480 %}
![A wide landscape placeholder](https://placehold.co/480x270?text=16:9)
{% endAspectratio %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% aspectratio ratio=1.7777 maw=480 %}
![A wide landscape placeholder](https://placehold.co/480x270?text=16:9)
{% endAspectratio %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
img = '![A wide landscape placeholder](https://placehold.co/480x270?text=16:9)'
component('aardvark', 'aspectratio', ratio=1.7777, maw=480, children=img)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

`ratio` is the one option of its own; everything else is the shared Mantine spacing/sizing
system. Omit any attribute to take its Mantine default (ratio `1`).

| Attribute | Values | Description |
| --- | --- | --- |
| `ratio` | a number, width ÷ height (`1` default) | The aspect ratio. `1.7777` ≈ 16∶9, `1.3333` ≈ 4∶3, `1` = square. |
| `w` / `h` | `xs`–`xl` or any CSS size | Width / height of the box. |
| `miw` / `mih` | any CSS size | Minimum width / height. |
| `maw` / `mah` | any CSS size | Maximum width / height — `maw` caps an embed's width. |
| `m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my` | `xs`–`xl` or any CSS size | Margin — all sides, or a single side / axis. |
| `p`, `pt`, `pb`, `pl`, `pr`, `px`, `py` | `xs`–`xl` or any CSS size | Padding — all sides, or a single side / axis. |
| `bg` | a theme color or any CSS color | Background color. |
| `c` | a theme color or any CSS color | Text (content) color. |


## CSS Selectors

Each `aspectratio` carries `data-aardvark-island="AspectRatio"` on its wrapper, and Mantine exposes its parts as `mantine-AspectRatio-*` classes — target either to style it from your theme CSS.

{% raw %}
```css
[data-aardvark-island="AspectRatio"] {
  /* style every aspectratio on the page */
}

.mantine-AspectRatio-root {
  /* the root part */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% aspectratio ratio=1.7777 maw=480 attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Keeps a 16:9 box.
{% endAspectratio %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% aspectratio ratio=1.7777 maw=480 attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Keeps a 16:9 box.
{% endAspectratio %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'aspectratio', ratio=1.7777, maw=480,
          children='Keeps a 16:9 box.', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
