---
title: "Blockquote"
description: "The built-in blockquote tag — a styled Mantine pull-quote with a citation
  line, accent color, radius, and an optional Tabler icon. Usage, options, and live
  examples."
---

# Blockquote

`{% raw %}{% blockquote %}{% endraw %}` is a **built-in** tag for pull-quotes — a quote set
off with an accent bar, an optional citation, and an optional icon. A plain Markdown `>`
quote still works for ordinary quotes; reach for this tag when you want the color, citation,
or icon. The quote text is the block body (rendered as Markdown) or the plain-text `text`
param.

Use it as `{% raw %}{% blockquote %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'blockquote', …)`.

## Demonstrations

### Basic quote with citation and icon

`cite` adds an attribution line below the quote; `icon` takes a [Tabler icon](https://tabler.io/icons)
name (fetched lazily at view time) for the corner badge.

{% blockquote cite='— Antoine de Saint-Exupéry' icon='quote' %}
Perfection is achieved not when there is nothing more to add, but when there is nothing
left to take away.
{% endBlockquote %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% blockquote cite='— Antoine de Saint-Exupéry' icon='quote' %}
Perfection is achieved not when there is nothing more to add, but when there is nothing
left to take away.
{% endBlockquote %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'blockquote',
          cite='— Antoine de Saint-Exupéry', icon='quote',
          children='Perfection is achieved not when there is nothing more to add, '
                   'but when there is nothing left to take away.')
```
{% endAccordionSection %}
{% endAccordion %}

### Citation only

Omit `icon` for Mantine's default (no badge). The body renders as Markdown, so emphasis and
links format.

{% blockquote cite='— Ada Lovelace' %}
That brain of mine is something **more than merely mortal**, as time will show.
{% endBlockquote %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% blockquote cite='— Ada Lovelace' %}
That brain of mine is something **more than merely mortal**, as time will show.
{% endBlockquote %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'blockquote', cite='— Ada Lovelace',
          children='That brain of mine is something **more than merely mortal**, '
                   'as time will show.')
```
{% endAccordionSection %}
{% endAccordion %}

### Color and radius

`color` tints the accent bar and icon (any theme color); `radius` rounds the corners
(`xs`–`xl` or any CSS value).

{% blockquote color='grape' radius='lg' icon='heart' %}
Make it work, make it right, make it fast.
{% endBlockquote %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% blockquote color='grape' radius='lg' icon='heart' %}
Make it work, make it right, make it fast.
{% endBlockquote %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'blockquote', color='grape', radius='lg', icon='heart',
          children='Make it work, make it right, make it fast.')
```
{% endAccordionSection %}
{% endAccordion %}

### Icon size and the text shortcut

`iconSize` adjusts the badge size in pixels. For a one-liner, the `text` param is the
plain-text shortcut for the body.

{% blockquote color='blue' icon='bulb' iconSize=48 text='A good idea, well framed.' %}{% endBlockquote %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% blockquote color='blue' icon='bulb' iconSize=48 text='A good idea, well framed.' %}{% endBlockquote %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'blockquote', color='blue', icon='bulb', iconSize=48,
          text='A good idea, well framed.')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

The block body is full Markdown, so it can host other built-in tags — here a
[Mark](/components/typography/mark/) highlight and inline [Code](/components/typography/code/)
inside the quote.

{% blockquote color='teal' icon='code' cite='— the docs' %}
Run {% code %}vark build{% endCode %} and you get a {% mark color='lime' %}static site{% endMark %}.
{% endBlockquote %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% blockquote color='teal' icon='code' cite='— the docs' %}
Run {% code %}vark build{% endCode %} and you get a {% mark color='lime' %}static site{% endMark %}.
{% endBlockquote %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
body = ("Run " + component('aardvark', 'code', children='vark build')
        + " and you get a "
        + component('aardvark', 'mark', color='lime', children='static site') + ".")
component('aardvark', 'blockquote', color='teal', icon='code', cite='— the docs',
          children=body)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `text` | Any string | The quote text, used when there's no block body (plain text — not rendered as Markdown). |
| `cite` | Any string | Attribution line shown below the quote. |
| `color` | Any theme color (e.g. `blue`, `grape`, `teal`) | Tints the accent bar and the icon. |
| `radius` | `xs` `sm` `md` `lg` `xl`, or any CSS length | Corner radius. |
| `icon` | A [Tabler icon](https://tabler.io/icons) name (e.g. `quote`, `bulb`, `heart`) | Glyph for the corner badge; fetched lazily at view time. |
| `iconSize` | Integer (pixels) | Size of the icon badge. |

The quote itself is the block body (rendered as Markdown — paragraphs, emphasis, links all
work), or the `text` param for a plain one-liner.

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="Blockquote"]`, or through the Mantine Styles API classes:

{% raw %}
```css
/* Every rendered Blockquote carries this island marker */
[data-aardvark-island="Blockquote"] { }

/* Mantine Styles API classes */
.mantine-Blockquote-root { }
.mantine-Blockquote-icon { }
.mantine-Blockquote-cite { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% blockquote cite='— Antoine de Saint-Exupéry' icon='quote' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.
{% endBlockquote %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% blockquote cite='— Antoine de Saint-Exupéry' icon='quote' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.
{% endBlockquote %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'blockquote', cite='— Antoine de Saint-Exupéry', icon='quote',
          children='Perfection is achieved not when there is nothing more to add, '
                   'but when there is nothing left to take away.',
          attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
