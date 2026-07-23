---
title: "Typography"
description: "The built-in typography tag — Mantine's Typography component, which
  applies article prose styles to a block of Markdown or raw HTML. Usage and a live example."
---

# Typography

`{% raw %}{% typography %}{% endraw %}` is a **built-in** wrapper that applies Mantine's
article prose styles to whatever it contains — headings, paragraphs, lists, tables,
blockquotes, code, and links all get consistent spacing and type. It's the Mantine
Typography component. Reach for it around a chunk of generated or pasted HTML, or a
block of Markdown, that would otherwise be unstyled. The block body is the prose; close
with `{% raw %}{% endTypography %}{% endraw %}`.

Use it as `{% raw %}{% typography %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'typography', …)`.

{% callout severity="info" title="You usually don't need this" %}
Page content is **already** styled — aardvark applies its own article prose styles to every page
(the `.aardvark-content` surface), so your headings, lists, tables, code, and links look right
with no wrapper at all. `{% raw %}{% typography %}{% endraw %}` is included for **completeness**; reach
for it only to style a block of prose or raw HTML that sits **outside** that flow — content you
render **inside a portaled component** (a [modal](/components/overlays/modal/),
[dialog](/components/overlays/dialog/), or [popover](/components/overlays/popover/) body) that
React mounts outside the page's content container. In ordinary page Markdown it's a no-op.
{% endCallout %}

## Demonstrations

The provider takes no styling props of its own — it styles its children. Wrap a block of
Markdown and the headings, paragraphs, lists, blockquotes, code, and links all pick up the
article styles:

{% typography %}
## A styled article

This paragraph, the heading above, and everything below pick up Mantine's prose
styles — including **emphasis**, `inline code`, and [links](https://mantine.dev).

- A list item
- Another item

> A blockquote, styled to match.
{% endTypography %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% typography %}
## A styled article

This paragraph, the heading above, and everything below pick up Mantine's prose
styles — including **emphasis**, `inline code`, and [links](https://mantine.dev).

- A list item
- Another item

> A blockquote, styled to match.
{% endTypography %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
prose = '''
## A styled article

This paragraph, the heading above, and everything below pick up Mantine's prose
styles — including **emphasis**, `inline code`, and [links](https://mantine.dev).

- A list item
- Another item

> A blockquote, styled to match.
'''
component('aardvark', 'typography', children=prose)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

The provider styles plain prose; for finer control over a single run of text, reach for
[Text](/components/typography/text/) or [Title](/components/typography/title/) instead.
A common pattern is a standalone [Title](/components/typography/title/) above a
`{% raw %}{% typography %}{% endraw %}` block of body copy:

{% title order=3 mb='sm' %}Release notes{% endTitle %}
{% typography %}
What's new in this build:

1. Faster incremental rebuilds.
2. A new `{% raw %}{% table %}{% endraw %}` tag.

See the [changelog](https://mantine.dev) for the full list.
{% endTypography %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% title order=3 mb='sm' %}Release notes{% endTitle %}
{% typography %}
What's new in this build:

1. Faster incremental rebuilds.
2. A new {% table %} tag.

See the [changelog](https://mantine.dev) for the full list.
{% endTypography %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'title', children='Release notes', order=3, mb='sm')
component('aardvark', 'typography', children='''
What's new in this build:

1. Faster incremental rebuilds.
2. A new table tag.

See the [changelog](https://mantine.dev) for the full list.
''')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

`{% raw %}{% typography %}{% endraw %}` takes no attributes — the block body is the prose it
styles. It is rendered as Markdown, so anything you can write on a normal page works inside
it.

| Attribute | Valid values | Description |
| --- | --- | --- |
| _(body)_ | Markdown or raw HTML | The prose to style; everything between the tag and `{% raw %}{% endTypography %}{% endraw %}`. |

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="Typography"]`, or through the Mantine Styles API classes:

{% raw %}
```css
/* Every rendered Typography carries this island marker */
[data-aardvark-island="Typography"] { }

/* Mantine Styles API classes */
.mantine-Typography-root { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% typography attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
## A heading

A paragraph with a [link](/) and `inline code`.
{% endTypography %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% typography attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
## A heading

A paragraph with a [link](/) and `inline code`.
{% endTypography %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'typography', children='''
## A heading

A paragraph with a [link](/) and `inline code`.
''', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
