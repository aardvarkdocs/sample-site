---
title: "Highlight"
description: "The built-in highlight tag — highlights every match of one or more
  substrings inside a longer run of text (the Mantine Highlight element), with color and
  the Text styling surface. Usage, options, and live examples."
---

# Highlight

`{% raw %}{% highlight %}{% endraw %}` is a **built-in** tag that **scans a run of text and
highlights every match** of one or more substrings. Give the term(s) to find and the text to
search, and each match is wrapped in a tinted `<mark>`. The text is the block body or a `text`
param; it's treated as plain text, so substring matching is reliable.

Use it as `{% raw %}{% highlight %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'highlight', …)`.

## Demonstrations

### Single term

Give the substring to find in `highlight`; every occurrence in the body is marked.

{% highlight highlight='Markdown' %}Write Markdown, get a site. Markdown in, HTML out.{% endHighlight %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% highlight highlight='Markdown' %}Write Markdown, get a site. Markdown in, HTML out.{% endHighlight %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'highlight', highlight='Markdown',
          children='Write Markdown, get a site. Markdown in, HTML out.')
```
{% endAccordionSection %}
{% endAccordion %}

### Multiple terms

Pass several comma-separated substrings in `highlight` and every match of any of them is
marked.

{% highlight highlight='fast, simple, static' %}Aardvark is fast, simple, and static — a static-site generator.{% endHighlight %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% highlight highlight='fast, simple, static' %}Aardvark is fast, simple, and static — a static-site generator.{% endHighlight %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'highlight', highlight=['fast', 'simple', 'static'],
          children='Aardvark is fast, simple, and static — a static-site generator.')
```
{% endAccordionSection %}
{% endAccordion %}

### Color and text styling

`color` tints the highlight; the Text typography props (`size`, `fw`, `c`, `ta`, `tt`, `td`,
`fs`) style the whole run.

{% highlight highlight='matched' color='lime' fw=600 size='lg' %}Only the matched word is highlighted; the rest is styled text.{% endHighlight %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% highlight highlight='matched' color='lime' fw=600 size='lg' %}Only the matched word is highlighted; the rest is styled text.{% endHighlight %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'highlight', highlight='matched', color='lime', fw='600', size='lg',
          children='Only the matched word is highlighted; the rest is styled text.')
```
{% endAccordionSection %}
{% endAccordion %}

### The text shortcut

For a one-liner, the `text` param is the plain-text alternative to the block body.

{% highlight highlight='id' text='Add an id for CSS or JS hooks.' id='hl-demo' color='grape' %}{% endHighlight %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% highlight highlight='id' text='Add an id for CSS or JS hooks.' id='hl-demo' color='grape' %}{% endHighlight %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'highlight', highlight='id', text='Add an id for CSS or JS hooks.',
          id='hl-demo', color='grape')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Highlight pairs naturally with other typography built-ins — here it marks a term inside a
[Blockquote](/components/typography/blockquote/).

{% blockquote icon='search' color='cyan' %}
{% highlight highlight='static' color='cyan' %}A static site is fast, a static site is cheap.{% endHighlight %}
{% endBlockquote %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% blockquote icon='search' color='cyan' %}
{% highlight highlight='static' color='cyan' %}A static site is fast, a static site is cheap.{% endHighlight %}
{% endBlockquote %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = component('aardvark', 'highlight', highlight='static', color='cyan',
                  children='A static site is fast, a static site is cheap.')
component('aardvark', 'blockquote', icon='search', color='cyan', children=inner)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `text` | Any string | The text to search, used when there's no block body. |
| `highlight` | One phrase, or several comma-separated (tag); a string or list of strings (Python) | The substring(s) to highlight — every match is wrapped in a `<mark>`. |
| `color` | Any theme color (e.g. `lime`, `grape`, `cyan`) | Highlight tint. |
| `size` | `xs` `sm` `md` `lg` `xl` | Text size of the whole run. |
| `fw` | Font-weight value (e.g. `600`) | Font weight of the run. |
| `c` | Any theme color | Text color of the run. |
| `ta` | `left` `center` `right` `justify` | Text align. |
| `tt` | `uppercase` `lowercase` `capitalize` | Text transform. |
| `td` | `underline` `line-through` `none` | Text decoration. |
| `fs` | `italic` `normal` | Font style. |
| `id` | Any string | HTML `id` on the rendered element, for CSS / JS selectors. |

The text to search is the block body or the `text` param. It's plain text — Mantine searches
it character by character — so Markdown inside it is **not** formatted. For a single fixed
phrase you wrap by hand, [Mark](/components/typography/mark/) is simpler.

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="Highlight"]`, or through the Mantine Styles API classes. Each matched substring is wrapped in a Mantine `Mark` (`.mantine-Mark-root`). The relevant classes:

{% raw %}
```css
/* Every rendered Highlight carries this island marker */
[data-aardvark-island="Highlight"] { }

/* Mantine Styles API classes */
.mantine-Highlight-root { }

/* Each highlighted substring */
.mantine-Mark-root { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% highlight highlight='Markdown' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}Write Markdown, get a site. Markdown in, HTML out.{% endHighlight %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% highlight highlight='Markdown' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}Write Markdown, get a site. Markdown in, HTML out.{% endHighlight %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'highlight', highlight='Markdown',
          children='Write Markdown, get a site. Markdown in, HTML out.', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
