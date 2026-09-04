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

Unlike the tags around it, `{% raw %}{% CodeBlock %}{% endraw %}` is **not built in**. It ships
as a **project snippet** (`snippets/CodeBlock.jsx` and the `CodeBlock.css` it imports), which
Aardvark exposes as a tag automatically because it sits in `snippets/`. It has to be a snippet:
Mantine's `CodeHighlight` needs a provider above it carrying a highlighter, and Shiki resolves its
grammars asynchronously — a Promise, not a value that fits in a Markdown attribute. To use it in
your own site, copy those two files into your `snippets/`; the npm packages they need,
`@mantine/code-highlight` and `shiki`, are already in the `package.json` that `vark new` writes.
Without the snippet the two forms differ: the tag stops the build with an unknown-tag error,
while `component('CodeBlock', …)` warns and leaves an HTML comment where the widget would be.

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

`language` picks the grammar. This site loads thirteen of them — `tsx`, `jsx`, `ts`, `js`,
`json`, `bash`, `shell`, `python`, `html`, `css`, `scss`, `yaml`, and `markdown` — and any
other value still renders, just un-tokenized. `withCopyButton` (on by default) toggles the
copy control in the top-right corner.

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
| `language` | One of the loaded grammars: `tsx`, `jsx`, `ts`, `js`, `json`, `bash`, `shell`, `python`, `html`, `css`, `scss`, `yaml`, `markdown` | Grammar used for tokenizing. Defaults to `tsx`. Any other value renders un-tokenized. |
| `withCopyButton` | bool (`true` / `false`, default `true`) | Show the copy-to-clipboard button. |

{% callout severity="info" title="Good to know" %}
Because the tokenizing happens in the browser, the HTML page ships a plain `<pre>` and gains its
colors once the page loads — a reader with scripts off still gets the correct, un-highlighted code.
The printed PDF and the Markdown served to agents **omit it entirely**: both keep an island's
children and drop its props, and this one carries its source in props, so there is nothing left to
keep. A fenced ` ``` ` block is highlighted at build time and survives into every format, which is
why prose uses fences by default.
{% endCallout %}

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
