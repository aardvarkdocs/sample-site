---
title: "CodeBlock"
description: "A runtime, in-browser code block — Shiki tokenizes the source on the client and
  the reader gets a copy button. Distinct from the build-time fence highlighter. Usage, a live
  example, and the attributes."
---

# CodeBlock

`{% raw %}{% CodeBlock %}{% endraw %}` is a **runtime** React code block: the source is handed
to [Shiki](https://shiki.style) in the browser, which tokenizes it and paints the highlighted
result, with a copy button on top. It hydrates into an interactive island, so the highlighting
is computed live on the page rather than baked in at build time.

This is **separate** from the site's fenced ` ``` ` code blocks. Those are highlighted once, at
build time, into static HTML — the default for prose. Reach for `{% raw %}{% CodeBlock %}{% endraw %}`
when you want a code block whose highlighting is produced at runtime by Shiki (for example, to
match a Shiki theme exactly, or to drive the source from data), and keep using fenced blocks for
ordinary inline documentation.

Use it as `{% raw %}{% CodeBlock %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('CodeBlock', …)`.

## A basic block

Pass the source as `code` and its `language`. Shiki tokenizes it on mount; until then a plain,
un-highlighted block is shown, so the page never waits on the tokenizer.

{% CodeBlock code='const greeting: string = "hello, world";' language='ts' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% CodeBlock code='const greeting: string = "hello, world";' language='ts' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('CodeBlock', code='const greeting: string = "hello, world";', language='ts')
```
{% endAccordionSection %}
{% endAccordion %}

## Languages and the copy button

`language` accepts any of Shiki's grammar ids (`tsx`, `python`, `bash`, `json`, `css`, …); an
unregistered language still renders, just un-tokenized. `withCopyButton` (on by default) toggles
the copy control in the top-right corner.

{% CodeBlock code='print(f"hello, {name}")' language='python' %}

{% CodeBlock code='echo "no copy button here"' language='bash' withCopyButton=false %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% CodeBlock code='print(f"hello, {name}")' language='python' %}

{% CodeBlock code='echo "no copy button here"' language='bash' withCopyButton=false %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('CodeBlock', code='print(f"hello, {name}")', language='python')

component('CodeBlock', code='echo "no copy button here"', language='bash', withCopyButton=False)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `code` | Any string | The source to highlight. For multi-line source, call it from Python (`component('CodeBlock', code=…)`) where the string can carry real line breaks. |
| `language` | A Shiki grammar id (`tsx`, `ts`, `python`, `bash`, `json`, …) | Grammar used for tokenizing. Defaults to `tsx`. |
| `withCopyButton` | bool (`true` / `false`, default `true`) | Show the copy-to-clipboard button. |

## CSS Selectors

Target the block from your theme CSS through its island marker or Mantine's runtime part classes.

{% raw %}
```css
/* The island root (the element CodeBlock forwards its ref to) */
[data-aardvark-island="CodeBlock"] {
}

/* Mantine's CodeHighlight parts (the root part is `codeHighlight`) */
.mantine-CodeHighlight-codeHighlight {
}
.mantine-CodeHighlight-pre {
}
.mantine-CodeHighlight-code {
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered
element.

{% CodeBlock code='x' language='ts' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% CodeBlock code='x' language='ts' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('CodeBlock', code='x', language='ts', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
