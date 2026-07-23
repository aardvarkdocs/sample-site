---
title: "Code"
description: "The built-in code tag — inline or block code rendered verbatim with the
  Mantine Code element, with an optional background tint. Usage, options, and live
  examples."
---

# Code

`{% raw %}{% code %}{% endraw %}` is a **built-in** tag for code styling. It shows its
content **verbatim** — no Markdown, no syntax highlighting: by default an inline `<code>`
run for a short token mid-sentence, or a standalone block with `block`. For highlighted,
multi-line source, use a fenced ` ``` ` code block instead; reach for this tag when you want
a styled token inline or a quick tinted block.

Use it as `{% raw %}{% code %}{% endraw %}` in Markdown, or call it from Python logic (loops,
snippets) via `component('aardvark', 'code', …)`.

## Demonstrations

### Inline (the default)

By default `{% raw %}{% code %}{% endraw %}` is **inline** — it sits in a sentence without
breaking the paragraph. The code is the block body, or the inline `code` param.

Run {% code %}npm install aardvark{% endCode %} to get started.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
Run {% code %}npm install aardvark{% endCode %} to get started.
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'code', code='npm install aardvark')
```
{% endAccordionSection %}
{% endAccordion %}

### Block

Add `block` for a standalone, padded `<pre>`-style block instead of an inline run.

{% code block=true %}export AARDVARK_KEY=aardvark_live_…{% endCode %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% code block=true %}export AARDVARK_KEY=aardvark_live_…{% endCode %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'code', block=True, children='export AARDVARK_KEY=aardvark_live_…')
```
{% endAccordionSection %}
{% endAccordion %}

### Color

`color` tints the background — handy for a positive / negative cue.

{% code color='green' %}200 OK{% endCode %} {% code color='red' %}404 Not Found{% endCode %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% code color='green' %}200 OK{% endCode %} {% code color='red' %}404 Not Found{% endCode %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'code', color='green', children='200 OK')
component('aardvark', 'code', color='red', children='404 Not Found')
```
{% endAccordionSection %}
{% endAccordion %}

### Verbatim content

The content is shown literally — angle brackets and ampersands read as themselves, and
Markdown is **not** processed.

{% code %}<Component prop="value" />{% endCode %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% code %}<Component prop="value" />{% endCode %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'code', code='<Component prop="value" />')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Inline code reads naturally inside other built-ins — here a status token inside a
[Blockquote](/components/typography/blockquote/), and a tinted token in a
[List](/components/typography/list/) item.

{% blockquote icon='terminal-2' cite='— the release notes' %}
A healthy build ends with {% code color='green' %}Built 182 page(s){% endCode %}.
{% endBlockquote %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% blockquote icon='terminal-2' cite='— the release notes' %}
A healthy build ends with {% code color='green' %}Built 182 page(s){% endCode %}.
{% endBlockquote %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
body = ("A healthy build ends with "
        + component('aardvark', 'code', color='green', children='Built 182 page(s)') + ".")
component('aardvark', 'blockquote', icon='terminal-2', cite='— the release notes',
          children=body)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `code` | Any string | The code text, used when there's no block body. Shown verbatim. |
| `block` | `true` / `false` (default `false`) | Render a standalone `<pre>`-style block instead of an inline `<code>` run. |
| `color` | Any theme color (e.g. `green`, `red`) | Background tint. |

The code is the block body or the `code` param; either way it's shown literally (no Markdown,
no syntax highlighting). For highlighted, multi-line source, use a fenced ` ``` ` code block —
it gets the site's full syntax highlighting, which `{% raw %}{% code %}{% endraw %}` (verbatim
by design) does not.

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="Code"]`, or through the Mantine Styles API classes:

{% raw %}
```css
/* Every rendered Code carries this island marker */
[data-aardvark-island="Code"] { }

/* Mantine Styles API classes */
.mantine-Code-root { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

Run {% code attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}npm install aardvark{% endCode %} to get started.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
Run {% code attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}npm install aardvark{% endCode %} to get started.
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'code', children='npm install aardvark', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
