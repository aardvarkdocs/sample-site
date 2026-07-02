---
title: "Text"
description: "The built-in text tag — style any run of text with the full Mantine Text
  surface: weight, size, style, decoration, transform, alignment, color, gradient,
  truncation, and the spacing system. Usage, options, and live examples."
---

# Text

`{% raw %}{% text %}{% endraw %}` is a **built-in** tag for styled text — every Mantine
Text capability (weight, size, color, alignment, transform, gradient, truncation, …)
exposed as a single tag with no setup. Reach for it when plain Markdown emphasis isn't
enough: a colored lead paragraph, an uppercase label, a gradient heading, a clamped
excerpt.

Use it as `{% raw %}{% text %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'text', …)`.

## Demonstrations

### Content

Give the text inline with `text`, or as the block body. The block body is the richer
form — it renders **inline Markdown** (`**bold**`, `*italic*`, `` `code` ``, and
`[links](/)`), so you can format inside the styled run. Bare URLs in the block body
auto-link, and the typographer applies (straight quotes → curly, `--` → en-dash). The
inline `text` shortcut, by contrast, is plain text: no Markdown, no auto-linking, and no
typography substitutions.

{% text text='Inline content (plain).' %}
{% text c='grape' %}Block content with **bold** and a `code` span.{% endText %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% text text='Inline content (plain).' %}
{% text c='grape' %}Block content with **bold** and a `code` span.{% endText %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'text', text='Inline content (plain).')
component('aardvark', 'text', children='Block content with **bold** and a `code` span.', c='grape')
```
{% endAccordionSection %}
{% endAccordion %}

### Typography

Set the weight (`fw`), size (`size` or `fz`), style (`fs`), decoration (`td`),
transform (`tt`), alignment (`ta`), font family (`ff`), line height (`lh`), and letter
spacing (`lts`):

{% text fw=700 %}Bold{% endText %}
{% text fs='italic' %}Italic{% endText %}
{% text td='underline' %}Underlined{% endText %}
{% text tt='uppercase' lts='0.1em' %}Spaced caps{% endText %}
{% text size='xl' ff='monospace' %}Extra large monospace{% endText %}
{% text ta='center' %}Centered{% endText %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% text fw=700 %}Bold{% endText %}
{% text fs='italic' %}Italic{% endText %}
{% text td='underline' %}Underlined{% endText %}
{% text tt='uppercase' lts='0.1em' %}Spaced caps{% endText %}
{% text size='xl' ff='monospace' %}Extra large monospace{% endText %}
{% text ta='center' %}Centered{% endText %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'text', children='Bold', fw=700)
component('aardvark', 'text', children='Italic', fs='italic')
component('aardvark', 'text', children='Underlined', td='underline')
component('aardvark', 'text', children='Spaced caps', tt='uppercase', lts='0.1em')
component('aardvark', 'text', children='Extra large monospace', size='xl', ff='monospace')
component('aardvark', 'text', children='Centered', ta='center')
```
{% endAccordionSection %}
{% endAccordion %}

### Color

`c` takes any theme color, the special `dimmed`, or any CSS color value:

{% text c='primary' fw=600 %}Primary{% endText %}
{% text c='red' %}Red{% endText %}
{% text c='dimmed' %}Dimmed secondary text{% endText %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% text c='primary' fw=600 %}Primary{% endText %}
{% text c='red' %}Red{% endText %}
{% text c='dimmed' %}Dimmed secondary text{% endText %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'text', children='Primary', c='primary', fw=600)
component('aardvark', 'text', children='Red', c='red')
component('aardvark', 'text', children='Dimmed secondary text', c='dimmed')
```
{% endAccordionSection %}
{% endAccordion %}

### Gradient

Set `variant='gradient'` and any of `gradientFrom`, `gradientTo`, `gradientDeg` for
gradient text — pair it with a large `fz` and a bold `fw` for a hero heading:

{% text variant='gradient' gradientFrom='indigo' gradientTo='cyan' gradientDeg=45 fz='2.5rem' fw=900 %}Gradient heading{% endText %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% text variant='gradient' gradientFrom='indigo' gradientTo='cyan' gradientDeg=45 fz='2.5rem' fw=900 %}Gradient heading{% endText %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'text', children='Gradient heading',
          variant='gradient', gradientFrom='indigo', gradientTo='cyan',
          gradientDeg=45, fz='2.5rem', fw=900)
```
{% endAccordionSection %}
{% endAccordion %}

### Truncation

`truncate` clips to a single line with an ellipsis (`truncate='start'` clips the start
instead); `lineClamp` clips to a fixed number of lines. Both need a width to act on —
`maw` caps it here:

{% text truncate maw='20rem' %}This sentence is far too long to fit on one short line and will be cut off.{% endText %}
{% text lineClamp=2 maw='20rem' %}This longer passage is clamped to two lines: anything past the second line is hidden behind an ellipsis so cards and previews stay tidy and the same height.{% endText %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% text truncate maw='20rem' %}This sentence is far too long to fit on one short line and will be cut off.{% endText %}
{% text lineClamp=2 maw='20rem' %}This longer passage is clamped to two lines: anything past the second line is hidden behind an ellipsis.{% endText %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'text',
          children='This sentence is far too long to fit on one short line and will be cut off.',
          truncate=True, maw='20rem')
component('aardvark', 'text',
          children='This longer passage is clamped to two lines: anything past the second line is hidden behind an ellipsis.',
          lineClamp=2, maw='20rem')
```
{% endAccordionSection %}
{% endAccordion %}

### Inline placement

By default `{% raw %}{% text %}{% endraw %}` is a **block** — its own paragraph. To style a run
of text **inside a sentence**, add `span` (it renders as an inline `<span>`, so it doesn't break
the paragraph):

Ship it when the badge turns {% text span=true c='green' fw=700 %}green{% endText %} — never while it's {% text span=true c='red' fw=700 %}red{% endText %}.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
Ship it when the badge turns {% text span=true c='green' fw=700 %}green{% endText %} — never while it's {% text span=true c='red' fw=700 %}red{% endText %}.
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'text', children='green', span=True, c='green', fw=700)
component('aardvark', 'text', children='red', span=True, c='red', fw=700)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Set a [Title](/components/typography/title/) above a `{% raw %}{% text %}{% endraw %}`
standfirst, or use a `span` run to highlight a word inside ordinary prose. Build a legend
from a Python loop:

{% title order=4 mb='xs' %}Status key{% endTitle %}
{% text span=true c='green' fw=700 %}Passing{% endText %}
{% text span=true c='red' fw=700 %} · Failing{% endText %}
{% text span=true c='dimmed' %} · Skipped{% endText %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% title order=4 mb='xs' %}Status key{% endTitle %}
{% text span=true c='green' fw=700 %}Passing{% endText %}
{% text span=true c='red' fw=700 %} · Failing{% endText %}
{% text span=true c='dimmed' %} · Skipped{% endText %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'title', children='Status key', order=4, mb='xs')
for label, color in [('Passing', 'green'), (' · Failing', 'red'), (' · Skipped', 'dimmed')]:
    component('aardvark', 'text', children=label, span=True, c=color,
              fw=700 if color != 'dimmed' else None)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `text` | String | The text, when not using the block body. Plain (no Markdown). |
| `size` | `xs`–`xl`, or any CSS size | Font size. |
| `fz` | `xs`–`xl`, or any CSS size (`1.25rem`) | Font size (alias of `size`). |
| `fw` | `bold`, `normal`, or a number (`700`) | Font weight. |
| `fs` | `italic`, `normal` | Font style. |
| `td` | `underline`, `line-through`, `none` | Text decoration. |
| `tt` | `uppercase`, `capitalize`, `lowercase`, `none` | Text transform. |
| `ta` | `left`, `center`, `right`, `justify` | Text alignment. |
| `c` | Theme color, `dimmed`, or any CSS color | Text color. |
| `ff` | `monospace`, `heading`, `text`, or a CSS family | Font family. |
| `lh` | Number or any CSS line-height | Line height. |
| `lts` | Any CSS letter-spacing (`0.1em`) | Letter spacing. |
| `variant` | `text` (default), `gradient` | Render style; `gradient` enables the gradient props. |
| `gradientFrom` | Theme color or CSS color | Gradient start color (with `variant='gradient'`). |
| `gradientTo` | Theme color or CSS color | Gradient end color (with `variant='gradient'`). |
| `gradientDeg` | Number (degrees) | Gradient angle (with `variant='gradient'`). |
| `truncate` | `true`, `start`, `end` | Single-line ellipsis — bare flag / `true` clips the end, `start` clips the start. |
| `lineClamp` | Positive integer | Clip to this many lines. |
| `inline` | `true`, `false` | Set line height to 1 (tight — to vertically center a single line). A typography tweak only; does **not** make the text flow inline — use `span` for that. Default `false`. |
| `inherit` | `true`, `false` | Inherit font properties from the parent (e.g. inside a heading). Default `false`. |
| `span` | `true`, `false` | Render inline (a `<span>`) so it sits mid-sentence. Otherwise the tag is a block paragraph. Default `false`. |
| `id` | String | HTML `id` on the rendered element, for CSS / JS selectors. |
| `m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my` | Mantine size token or any CSS value | Margin (all, top, bottom, left, right, horizontal, vertical). |
| `p`, `pt`, `pb`, `pl`, `pr`, `px`, `py` | Mantine size token or any CSS value | Padding (all, top, bottom, left, right, horizontal, vertical). |
| `bg` | Theme color or any CSS color | Background color. |
| `opacity` | `0`–`1` | Opacity. |
| `w`, `h`, `miw`, `mih`, `maw`, `mah` | Mantine size token or any CSS value | Width / height and their min / max. |

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="Text"]`, or through the Mantine Styles API classes:

{% raw %}
```css
/* Every rendered Text carries this island marker */
[data-aardvark-island="Text"] { }

/* Mantine Styles API classes */
.mantine-Text-root { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% text c='grape' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}Block content with **bold** and a `code` span.{% endText %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% text c='grape' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}Block content with **bold** and a `code` span.{% endText %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'text', children='Block content with **bold** and a `code` span.', c='grape', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
