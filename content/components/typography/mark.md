---
title: "Mark"
description: "The built-in mark tag — a tinted highlighted text run (the Mantine Mark
  element) for drawing the eye to a phrase mid-sentence. Usage, options, and live
  examples."
---

# Mark

`{% raw %}{% mark %}{% endraw %}` is a **built-in** tag for highlighted text — a tinted
`<mark>` run you drop mid-sentence to draw the eye to a phrase. It's always inline, so it
flows with the surrounding text. The highlighted text is the block body (inline Markdown) or
a plain-text `text` param.

Use it as `{% raw %}{% mark %}{% endraw %}` in Markdown, or call it from Python logic (loops,
snippets) via `component('aardvark', 'mark', …)`.

## Demonstrations

### Inline highlight

Drop `{% raw %}{% mark %}{% endraw %}` mid-sentence to tint a phrase; it flows with the
surrounding text.

Aardvark turns {% mark %}Markdown{% endMark %} into a static site.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
Aardvark turns {% mark %}Markdown{% endMark %} into a static site.
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'mark', children='Markdown')
```
{% endAccordionSection %}
{% endAccordion %}

### Color

`color` takes any theme color; it defaults to yellow.

{% mark %}yellow{% endMark %} {% mark color='lime' %}lime{% endMark %} {% mark color='cyan' %}cyan{% endMark %} {% mark color='pink' %}pink{% endMark %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% mark %}yellow{% endMark %} {% mark color='lime' %}lime{% endMark %} {% mark color='cyan' %}cyan{% endMark %} {% mark color='pink' %}pink{% endMark %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'mark', children='yellow')
component('aardvark', 'mark', color='lime', children='lime')
component('aardvark', 'mark', color='cyan', children='cyan')
component('aardvark', 'mark', color='pink', children='pink')
```
{% endAccordionSection %}
{% endAccordion %}

### Markdown content and the text shortcut

The block body renders inline Markdown, so you can format inside the run. A `text` param is
the plain-text shortcut.

{% mark color='yellow' %}A **bold** word and a `token`{% endMark %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% mark color='yellow' %}A **bold** word and a `token`{% endMark %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'mark', color='yellow', children='A **bold** word and a `token`')
# plain-text shortcut:
component('aardvark', 'mark', color='yellow', text='A plain phrase')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Because Mark is inline, it nests cleanly inside other built-ins — here it tints a word inside
a [List](/components/typography/list/) item and a [Blockquote](/components/typography/blockquote/).

{% blockquote icon='highlight' %}
The build is {% mark color='lime' %}green{% endMark %} when every link resolves.
{% endBlockquote %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% blockquote icon='highlight' %}
The build is {% mark color='lime' %}green{% endMark %} when every link resolves.
{% endBlockquote %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
body = ("The build is "
        + component('aardvark', 'mark', color='lime', children='green')
        + " when every link resolves.")
component('aardvark', 'blockquote', icon='highlight', children=body)
```
{% endAccordionSection %}
{% endAccordion %}

## Mark vs Highlight

Use `{% raw %}{% mark %}{% endraw %}` for a **fixed phrase** you wrap by hand. To highlight
**every occurrence** of a substring inside a longer passage, reach for
[Highlight](/components/typography/highlight/) instead — it scans the text and marks each
match for you.

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `text` | Any string | The text, used when there's no block body (plain text). |
| `color` | Any theme color (e.g. `lime`, `cyan`, `pink`) | Highlight tint. Defaults to yellow. |

The highlighted text is the block body (inline Markdown — `**bold**`, `` `code` ``, `[links]`)
or the `text` param.

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="Mark"]`, or through the Mantine Styles API classes:

{% raw %}
```css
/* Every rendered Mark carries this island marker */
[data-aardvark-island="Mark"] { }

/* Mantine Styles API classes */
.mantine-Mark-root { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

Aardvark turns {% mark attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}Markdown{% endMark %} into a static site.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
Aardvark turns {% mark attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}Markdown{% endMark %} into a static site.
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'mark', children='Markdown', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
