---
title: "Title"
description: "The built-in title tag — a Mantine heading (h1–h6) with an explicit level,
  visual size independent of the level, and the full typography surface: color, align,
  transform, weight. Usage, options, and live examples."
---

# Title

`{% raw %}{% title %}{% endraw %}` is a **built-in** tag for headings — the Mantine
Title element (`<h1>`–`<h6>`) with explicit control over the level and its styling. A
plain Markdown `#` heading still works for ordinary headings; reach for this tag when you
want a heading with a specific color, alignment, transform, or a visual size that differs
from its level.

Use it as `{% raw %}{% title %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'title', …)`.

## Demonstrations

### Order

`order` sets the heading level, `1`–`6` (`<h1>` … `<h6>`). It controls both the semantics
and the default visual size. Out-of-range values fall back to Mantine's default:

{% title order=1 %}Order 1{% endTitle %}
{% title order=3 %}Order 3{% endTitle %}
{% title order=6 %}Order 6{% endTitle %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% title order=1 %}Order 1{% endTitle %}
{% title order=3 %}Order 3{% endTitle %}
{% title order=6 %}Order 6{% endTitle %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
for n in (1, 3, 6):
    component('aardvark', 'title', children=f'Order {n}', order=n)
```
{% endAccordionSection %}
{% endAccordion %}

### Visual size

Set `size` to detach the visual size from the level — a small `<h2>` for SEO without a
giant heading, say. It takes a heading token (`h1`–`h6`), a Mantine size (`xs`–`xl`), or
any CSS size:

{% title order=2 size='h5' %}An h2 that looks like an h5{% endTitle %}
{% title order=2 size='3rem' %}An h2 at 3rem{% endTitle %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% title order=2 size='h5' %}An h2 that looks like an h5{% endTitle %}
{% title order=2 size='3rem' %}An h2 at 3rem{% endTitle %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'title', children='An h2 that looks like an h5', order=2, size='h5')
component('aardvark', 'title', children='An h2 at 3rem', order=2, size='3rem')
```
{% endAccordionSection %}
{% endAccordion %}

### Color, align, transform, weight

The usual typography props apply: `c` (color), `ta` (align), `tt` (transform), and `fw`
(weight). `lh` and `lts` tune line height and letter spacing:

{% title order=3 c='grape' ta='center' %}Centered grape heading{% endTitle %}
{% title order=3 tt='uppercase' fw=900 lts='0.1em' %}Bold spaced caps{% endTitle %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% title order=3 c='grape' ta='center' %}Centered grape heading{% endTitle %}
{% title order=3 tt='uppercase' fw=900 lts='0.1em' %}Bold spaced caps{% endTitle %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'title', children='Centered grape heading',
          order=3, c='grape', ta='center')
component('aardvark', 'title', children='Bold spaced caps',
          order=3, tt='uppercase', fw=900, lts='0.1em')
```
{% endAccordionSection %}
{% endAccordion %}

### Content and spacing

Give the heading inline with `text`, or as the block body. The block body renders inline
Markdown (`**bold**`, `` `code` ``, `[links]`). Margin props (`mt`, `mb`, …) space the
heading from its neighbours:

{% title order=4 text='Inline heading' %}
{% title order=4 mt='lg' mb='xs' %}Heading with **emphasis** and a `token`{% endTitle %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% title order=4 text='Inline heading' %}
{% title order=4 mt='lg' mb='xs' %}Heading with **emphasis** and a `token`{% endTitle %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'title', order=4, text='Inline heading')
component('aardvark', 'title', children='Heading with **emphasis** and a `token`',
          order=4, mt='lg', mb='xs')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Pair a title with [Text](/components/typography/text/) for a lead paragraph, or sit one
above a [Table](/components/typography/table/) as a section header. Here a heading and a
dimmed standfirst form a section intro:

{% title order=3 mb='xs' %}Quick start{% endTitle %}
{% text c='dimmed' %}Install the binary, scaffold a site, and run `vark build`.{% endText %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% title order=3 mb='xs' %}Quick start{% endTitle %}
{% text c='dimmed' %}Install the binary, scaffold a site, and run `vark build`.{% endText %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'title', children='Quick start', order=3, mb='xs')
component('aardvark', 'text',
          children='Install the binary, scaffold a site, and run `vark build`.',
          c='dimmed')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `text` | String | The heading text, when not using the block body. Plain text (no Markdown). |
| `order` | `1`–`6` | Heading level (`<h1>`–`<h6>`); sets semantics and default size. Out-of-range falls back to the default. |
| `size` | `h1`–`h6`, `xs`–`xl`, or any CSS size | Visual size, independent of `order`. |
| `c` | Theme color, `dimmed`, or any CSS color | Text color. |
| `ta` | `left`, `center`, `right`, `justify` | Text alignment. |
| `tt` | `uppercase`, `capitalize`, `lowercase`, `none` | Text transform. |
| `fw` | `bold`, `normal`, or a number (`700`) | Font weight. |
| `lh` | Number or any CSS line-height | Line height. |
| `lts` | Any CSS letter-spacing (`0.1em`) | Letter spacing. |
| `id` | String | HTML `id` on the rendered heading, for CSS / JS selectors and anchor links. |
| `m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my` | Mantine size token or any CSS value | Margin (all, top, bottom, left, right, horizontal, vertical). |

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="Title"]`, or through the Mantine Styles API classes:

{% raw %}
```css
/* Every rendered Title carries this island marker */
[data-aardvark-island="Title"] { }

/* Mantine Styles API classes */
.mantine-Title-root { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% title order=1 attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}Order 1{% endTitle %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% title order=1 attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}Order 1{% endTitle %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'title', children='Order 1', order=1, attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
