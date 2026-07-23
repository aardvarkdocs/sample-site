---
title: "Pill"
description: "The built-in pill tag — a small rounded chip, the token MultiSelect and TagsInput render for each value. Usage, options, and live examples."
---

# Pill

A built-in tag for a small rounded pill — the chip that
[MultiSelect](/components/combobox/multiselect/) and
[TagsInput](/components/combobox/tagsinput/) render for each value. Use it on its own
wherever you want a compact token. The label is the block body or a `text` param.

Use it as `{% raw %}{% pill %}…{% endPill %}{% endraw %}` in Markdown, or call it from
Python logic (loops, snippets) via `component('aardvark', 'pill', …)`.

## Basic pills

The label is the block body, or the `text` param for a self-closing tag:

{% pill %}react{% endPill %} {% pill text='v1.0' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% pill %}react{% endPill %}
{% pill text='v1.0' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'pill', children='react')
component('aardvark', 'pill', text='v1.0')
```
{% endAccordionSection %}
{% endAccordion %}

## Variant, remove button, disabled

`variant` is `default` or `contrast`. `withRemoveButton` shows an × (visual only here — the
real remove behavior lives inside MultiSelect and TagsInput). `disabled` dims the pill:

{% pill variant='contrast' %}contrast{% endPill %} {% pill withRemoveButton=true %}removable{% endPill %} {% pill disabled=true %}disabled{% endPill %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% pill variant='contrast' %}contrast{% endPill %}
{% pill withRemoveButton=true %}removable{% endPill %}
{% pill disabled=true %}disabled{% endPill %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'pill', children='contrast', variant='contrast')
component('aardvark', 'pill', children='removable', withRemoveButton=True)
component('aardvark', 'pill', children='disabled', disabled=True)
```
{% endAccordionSection %}
{% endAccordion %}

## Sizes and radius

`size` and `radius` both run `xs`–`xl`:

{% pill size='xs' %}xs{% endPill %} {% pill size='md' %}md{% endPill %} {% pill size='xl' radius='xl' %}xl{% endPill %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% pill size='xs' %}xs{% endPill %}
{% pill size='md' %}md{% endPill %}
{% pill size='xl' radius='xl' %}xl{% endPill %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'pill', children='xs', size='xs')
component('aardvark', 'pill', children='md', size='md')
component('aardvark', 'pill', children='xl', size='xl', radius='xl')
```
{% endAccordionSection %}
{% endAccordion %}

## Building a row of pills in Python

Because the tag is also a Python callable, a bare `{% raw %}{% … %}{% endraw %}` template
block can loop and emit a row of pills — handy when the labels come from data rather than
being typed out:

{%
print(' '.join(
    component('aardvark', 'pill', children=tag)
    for tag in ['docs', 'markdown', 'mantine', 'static-site']
))
%}

<br>

{% accordion %}
{% accordionSection title="Source: Python" %}
{% raw %}
```aardvark
{%
print(' '.join(
    component('aardvark', 'pill', children=tag)
    for tag in ['docs', 'markdown', 'mantine', 'static-site']
))
%}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Every attribute is optional; omit one to take its Mantine default. The label comes from the
block body, or from `text` when self-closing.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `text` | String | The label, when not using the block body. HTML-escaped. |
| `variant` | `default`, `contrast` | Pill style. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Pill size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl` | Corner radius. |
| `withRemoveButton` | `true`, `false` (default `false`) | Show an × remove button (visual only; no handler is wired in this standalone tag). |
| `disabled` | `true`, `false` (default `false`) | Render in a disabled state. |
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="Pill"]` — or through the Mantine Styles API classes (`.mantine-Pill-root` and its inner parts):

{% raw %}
```css
/* Every rendered Pill carries this island marker */
[data-aardvark-island="Pill"] { }

/* Mantine Styles API class on the root element */
.mantine-Pill-root { }
.mantine-Pill-label { }
.mantine-Pill-remove { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% pill attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}react{% endPill %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% pill attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}react{% endPill %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'pill', children='react', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
