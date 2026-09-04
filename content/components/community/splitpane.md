---
title: "SplitPane"
description: "Community Component — two resizable panes with a styled, draggable resizer, wrapping @gfazioli/mantine-split-pane. Orientation, pane sizing, resizer styling, and live examples."
menu: components
parent: community
weight: 30
---

# SplitPane

`{% raw %}{% splitpane %}{% endraw %}` places **two resizable panes** with a **styled, draggable
resizer** between them — drag the handle to reapportion the space. Provide the panes as the
`first` and `second` text params, or put the first pane in the block body and the second in
`second`.

A **Community Component** — wraps [Split Pane](https://gfazioli.github.io/mantine-split-pane/) by
**gfazioli**, **MIT** licensed, npm `@gfazioli/mantine-split-pane`.

This is a different component from the Mantine-core
[`splitter`](/components/layout/splitter/) builtin; reach for `splitpane` when you want the
package's richer, themeable resizer handle (variants, a knob, custom colors).

Use it as `{% raw %}{% splitpane %}{% endraw %}` in Markdown, or call it from Python logic (loops,
snippets) via `component('aardvark', 'splitpane', …)`.

## Demonstrations

### Body as the first pane

The block body becomes the first pane; `second` holds the second. Drag the resizer to change the
split.

{% raw %}
```aardvark
{% splitpane second='The second pane takes the remaining space.' %}
This is the first pane (from the block body).
{% endSplitpane %}
```
{% endraw %}

{% splitpane second='The second pane takes the remaining space.' %}
This is the first pane (from the block body).
{% endSplitpane %}

### Both panes as params

Set `first` and `second` to skip the block body entirely — convenient when both panes are short
strings or when you are calling from Python.

{% raw %}
```aardvark
{% splitpane first='Label column' second='Detail column with the bulk of the content.' %}
```
{% endraw %}

{% splitpane first='Label column' second='Detail column with the bulk of the content.' %}

### Stacked (horizontal)

The package splits **side by side** by default (`orientation='vertical'`). Pass
`orientation='horizontal'` to **stack** the panes with a horizontal resizer between them.

{% raw %}
```aardvark
{% splitpane first='Top pane' second='Bottom pane' orientation='horizontal' %}
```
{% endraw %}

{% splitpane first='Top pane' second='Bottom pane' orientation='horizontal' %}

### A styled resizer

Style the handle with `variant`, `color`, `size`, and `knobSize`. Here a dashed grape resizer with
a larger knob.

{% raw %}
```aardvark
{% splitpane first='Left' second='Right' variant='dashed' color='grape' size='lg' knobSize='xl' %}
```
{% endraw %}

{% splitpane first='Left' second='Right' variant='dashed' color='grape' size='lg' knobSize='xl' %}

## With other components

The block-body pane renders as Markdown, so the first pane can hold any other component. Here it
carries a [`badge`](/components/data-display/badge/) heading above a short description.

{% raw %}
```aardvark
{% splitpane second='The detail pane sits to the right and fills the rest of the row.' %}
{% badge color='grape' %}Overview{% endBadge %}

A short summary lives in the first pane.
{% endSplitpane %}
```
{% endraw %}

{% splitpane second='The detail pane sits to the right and fills the rest of the row.' %}
{% badge color='grape' %}Overview{% endBadge %}

A short summary lives in the first pane.
{% endSplitpane %}

## Attributes

Omit any attribute to take its default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `first` | text | First pane content. Omit it to use the block body as the first pane instead. |
| `second` | text | Second pane content. |
| `orientation` | `vertical` (default, side by side), `horizontal` (stacked) | How the two panes are laid out. |
| `initialSize` | a width/height, e.g. `'30%'` or `'240px'` | The first pane's initial size. |
| `variant` | `default`, `filled`, `outline`, `transparent`, `gradient`, `dotted`, `dashed` | The resizer handle style. `dotted` and `dashed` also reveal the grab knob on hover. |
| `color` | a Mantine color | The resizer color. |
| `size` | `xs`–`xl` (default `sm`) or a number | The resizer thickness. |
| `radius` | `xs`–`xl` (default `xs`) or a number | The resizer corner radius. |
| `knobSize` | `xs`–`xl` (default `sm`) or a number | Size of the resizer's grab knob. The knob appears on hover when `variant` is `dotted` or `dashed`; the other variants draw a plain bar. |
| `attr={…}` | an object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

## CSS Selector

The split renders inside an island wrapper you can target in custom CSS:

```css
[data-aardvark-island="SplitPane"] {
  /* your overrides */
}
```

The handle's look rides CSS variables — `--split-resizer-size`, `--split-resizer-color`,
`--split-resizer-knob-size`, and more — but the resizer writes them onto itself as it renders,
so setting them on an ancestor has no effect. Use the `size`, `color`, `radius` and `knobSize`
attributes above; to reach the handle from CSS, target it directly and override the inline
value with `!important`:

```css
[data-testid='demo-split'] .mantine-SplitResizer-root {
  --split-resizer-size: 8px !important;
}
```

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes (data attributes, ARIA) straight onto the
rendered element — handy for hooks your own CSS or scripts key off. Keep `class`, `className`
and `style` out of it: React manages those on this element, so the runtime warns and your value
can be overwritten. Reach for a `data-*` hook and a stylesheet rule instead.

{% splitpane first='Left' second='Right' attr={'data-testid': 'demo-split', 'aria-label': 'Demo split'} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% splitpane first='Left' second='Right' attr={'data-testid': 'demo-split', 'aria-label': 'Demo split'} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'splitpane', first='Left', second='Right',
          attr={'data-testid': 'demo-split', 'aria-label': 'Demo split'})
```
{% endAccordionSection %}
{% endAccordion %}
