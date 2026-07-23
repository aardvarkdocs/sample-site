---
title: "Splitter"
description: "The built-in splitter tag — two panels side by side (or stacked) with a divider between them. Usage, orientation, panel size, and live examples."
---

# Splitter

`{% raw %}{% splitter %}{% endraw %}` places **two panels side by side** (or stacked) with a
**draggable divider** between them — a quick way to show two resizable regions of content
together, like a label column beside a detail column. Provide the panels as the `first` and
`second` text params, or put the first panel in the block body and the second in `second`. Set
the first panel's initial size with `defaultSize` and lay the panels out with `orientation`;
drag the handle (or use the arrow keys when it's focused) to resize.

Use it as `{% raw %}{% splitter %}{% endraw %}` in Markdown, or call it from Python logic (loops,
snippets) via `component('aardvark', 'splitter', …)`.

## Body as the first panel

The block body becomes the first panel; `second` holds the second. `defaultSize` is the first
panel's initial size as a percentage (`50` default); drag the handle to change it.

{% splitter second='The second panel takes the remaining space.' defaultSize=40 %}
The first panel is 40% wide.
{% endSplitter %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% splitter second='The second panel takes the remaining space.' defaultSize=40 %}
The first panel is 40% wide.
{% endSplitter %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'splitter',
    second='The second panel takes the remaining space.',
    defaultSize=40,
    children='The first panel is 40% wide.',
)
```
{% endAccordionSection %}
{% endAccordion %}

## Both panels as params

Set `first` and `second` to skip the block body entirely — convenient when both panels are short
strings or when you are calling from Python.

{% splitter first='Label column' second='Detail column with the bulk of the content.' defaultSize=30 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% splitter first='Label column' second='Detail column with the bulk of the content.' defaultSize=30 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'splitter',
    first='Label column',
    second='Detail column with the bulk of the content.',
    defaultSize=30,
)
```
{% endAccordionSection %}
{% endAccordion %}

## Stacked (vertical)

`orientation='vertical'` stacks the panels with a horizontal divider between them; `defaultSize`
then sets the first (top) panel's initial height.

{% splitter first='Top panel' second='Bottom panel' orientation='vertical' defaultSize=50 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% splitter first='Top panel' second='Bottom panel' orientation='vertical' defaultSize=50 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'splitter',
    first='Top panel',
    second='Bottom panel',
    orientation='vertical',
    defaultSize=50,
)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

The block-body panel renders as Markdown, so the first panel can hold any other component. Here
it carries a [`badge`](/components/data-display/badge/) heading above a short description.

{% splitter second='The detail panel sits to the right and fills the rest of the row.' defaultSize=35 %}
{% badge color='grape' %}Overview{% endBadge %}

A short summary lives in the first panel.
{% endSplitter %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% splitter second='The detail panel sits to the right and fills the rest of the row.' defaultSize=35 %}
{% badge color='grape' %}Overview{% endBadge %}

A short summary lives in the first panel.
{% endSplitter %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'splitter',
    second='The detail panel sits to the right and fills the rest of the row.',
    defaultSize=35,
    children=(
        component('aardvark', 'badge', color='grape', children='Overview')
        + '\n\nA short summary lives in the first panel.'
    ),
)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `first` | text | First panel content. Omit it to use the block body as the first panel instead. |
| `second` | text | Second panel content. |
| `defaultSize` | percentage `0`–`100` (`50` default) | The first panel's initial width (`horizontal`) or height (`vertical`); drag the handle to change it. |
| `orientation` | `horizontal` (default), `vertical` | `horizontal` places panels side by side; `vertical` stacks them. |


## CSS Selectors

Each `splitter` carries `data-aardvark-island="Splitter"` on its wrapper, and Mantine exposes its parts as `mantine-Splitter-*` classes — target either to style it from your theme CSS.

{% raw %}
```css
[data-aardvark-island="Splitter"] {
  /* style every splitter on the page */
}

.mantine-Splitter-root {
  /* the root part */
}

.mantine-Splitter-pane {
  /* the pane part */
}

.mantine-Splitter-handle {
  /* the handle part */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% splitter second='The second panel takes the remaining space.' defaultSize=40 attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
The first panel.
{% endSplitter %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% splitter second='The second panel takes the remaining space.' defaultSize=40 attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
The first panel.
{% endSplitter %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'splitter',
    second='The second panel takes the remaining space.',
    defaultSize=40,
    attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''},
    children='The first panel.',
)
```
{% endAccordionSection %}
{% endAccordion %}
