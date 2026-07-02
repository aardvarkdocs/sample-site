---
title: "Loader"
description: "The built-in loader tag — a spinner in three styles (oval, bars, dots), with size and color. Usage, options, and live examples."
---

# Loader

A built-in tag for a loading spinner. It takes no body — drop it wherever
something is loading and set any of the options below, or none for the default
oval spinner. The three `type` styles (`oval`, `bars`, `dots`), a `size`, and a
`color` cover every variant.

Use it as `{% raw %}{% loader %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'loader', …)`.

## Demonstrations

### Types

The three spinner styles — `oval` (the default), `bars`, and `dots`:

{% loader type='oval' %} {% loader type='bars' %} {% loader type='dots' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% loader type='oval' %} {% loader type='bars' %} {% loader type='dots' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'loader', type='oval')
component('aardvark', 'loader', type='bars')
component('aardvark', 'loader', type='dots')
```
{% endAccordionSection %}
{% endAccordion %}

### Size and color

`size` takes `xs`–`xl` or a number of px; `color` takes any theme color or CSS
value:

{% loader size='sm' %} {% loader size='lg' color='teal' %} {% loader type='dots' size='xl' color='orange' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% loader size='sm' %}
{% loader size='lg' color='teal' %}
{% loader type='dots' size='xl' color='orange' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'loader', size='sm')
component('aardvark', 'loader', size='lg', color='teal')
component('aardvark', 'loader', type='dots', size='xl', color='orange')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

A loader sits naturally beside other inline content — here next to a button, as
an in-progress affordance:

{% group %}
{% button variant="filled" %}Saving…{% endButton %}
{% loader type='dots' size='sm' %}
{% endGroup %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% group %}
{% button variant="filled" %}Saving…{% endButton %}
{% loader type='dots' size='sm' %}
{% endGroup %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'button', variant='filled', children='Saving…')
component('aardvark', 'loader', type='dots', size='sm')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `type` | `oval` (default), `bars`, `dots` | Spinner style. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl`, or a number of px | Size of the spinner. Defaults to Mantine's `md`. |
| `color` | Any theme color (`blue`, `green`, `grape`, …) or a CSS color value | Color of the spinner. |


## CSS Selectors

Each `loader` carries `data-aardvark-island="Loader"` on its wrapper, and Mantine exposes its parts as `mantine-Loader-*` classes — target either to style it from your theme CSS.

{% raw %}
```css
[data-aardvark-island="Loader"] {
  /* style every loader on the page */
}

.mantine-Loader-root {
  /* the root part */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% loader type='oval' attr={'onclick': '''
const value = this.tagName;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% loader type='oval' attr={'onclick': '''
const value = this.tagName;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'loader', type='oval', attr={'onclick': '''
const value = this.tagName;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
