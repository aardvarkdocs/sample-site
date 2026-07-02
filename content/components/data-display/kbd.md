---
title: "Kbd"
description: "The built-in kbd tag — a keyboard key for documenting shortcuts. Usage, options, and live examples."
---

# Kbd

Renders a `<kbd>` styled like a physical keyboard key — for documenting shortcuts such as
Ctrl, ⌘, or Enter. The key text is the block body, or a `text` attribute when you don't need
a body.

Use it as `{% raw %}{% kbd %}{% endraw %}` in Markdown, or call it from Python logic (loops,
snippets) via `component('aardvark', 'kbd', …)`. Close the tag with
{% raw %}`{% endKbd %}`{% endraw %}.

## Demonstrations

### A shortcut, inline

The block body is the key text. Drop keys inline in a sentence:

Press {% kbd %}Ctrl{% endKbd %} + {% kbd %}C{% endKbd %} to copy.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
Press {% kbd %}Ctrl{% endKbd %} + {% kbd %}C{% endKbd %} to copy.
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
ctrl = component('aardvark', 'kbd', children='Ctrl')
c = component('aardvark', 'kbd', children='C')
f"Press {ctrl} + {c} to copy."
```
{% endAccordionSection %}
{% endAccordion %}

### Sizes

`size` scales the key from `xs` to `xl` (`sm` is the default):

{% kbd size='xs' %}esc{% endKbd %} {% kbd size='sm' %}tab{% endKbd %} {% kbd size='md' %}shift{% endKbd %} {% kbd size='lg' %}enter{% endKbd %} {% kbd size='xl' %}space{% endKbd %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% kbd size='xs' %}esc{% endKbd %}
{% kbd size='sm' %}tab{% endKbd %}
{% kbd size='md' %}shift{% endKbd %}
{% kbd size='lg' %}enter{% endKbd %}
{% kbd size='xl' %}space{% endKbd %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'kbd', size='xs', children='esc')
component('aardvark', 'kbd', size='sm', children='tab')
component('aardvark', 'kbd', size='md', children='shift')
component('aardvark', 'kbd', size='lg', children='enter')
component('aardvark', 'kbd', size='xl', children='space')
```
{% endAccordionSection %}
{% endAccordion %}

### The `text` shorthand

When you don't need a block body, set `text` instead — handy in a loop or a one-liner:

{% kbd text='⌘' %} {% kbd text='K' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% kbd text='⌘' %} {% kbd text='K' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'kbd', text='⌘')
component('aardvark', 'kbd', text='K')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Keys read naturally inside running [`{% raw %}{% text %}{% endraw %}`](/components/typography/text/),
where they document a shortcut mid-sentence:

{% text %}Open the command palette with {% kbd text='⌘' %} {% kbd text='K' %}.{% endText %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% text %}Open the command palette with {% kbd text='⌘' %} {% kbd text='K' %}.{% endText %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
cmd = component('aardvark', 'kbd', text='⌘')
k = component('aardvark', 'kbd', text='K')
component('aardvark', 'text', children=f'Open the command palette with {cmd} {k}.')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `text` | string | The key text, when not using the block body. |
| `size` | `xs`, `sm` (default), `md`, `lg`, `xl` | Scales the key. |
| body | text | The key text (the rich form; takes precedence over `text`). |
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="Kbd"]` — or through the Mantine Styles API classes (`.mantine-Kbd-root` and its inner parts):

{% raw %}
```css
/* Every rendered Kbd carries this island marker */
[data-aardvark-island="Kbd"] { }

/* Mantine Styles API class on the root element */
.mantine-Kbd-root { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% kbd attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}Ctrl{% endKbd %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% kbd attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}Ctrl{% endKbd %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'kbd', children='Ctrl', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
