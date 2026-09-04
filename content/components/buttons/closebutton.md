---
title: "CloseButton"
description: "The built-in closebutton tag — Mantine's ✕ dismiss button. Size, radius,
  variant, color, disabled, and an optional custom icon to replace the default ✕."
---

# CloseButton

`{% raw %}{% closebutton %}{% endraw %}` is a **built-in** tag for a **dismiss button** —
the small ✕ you put on dialogs, alerts, chips, and panels. It ships the ✕ glyph, and
names itself `Close` for screen readers unless you give it a `label` of your own.

Use it as `{% raw %}{% closebutton %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'closebutton', …)`.

{% closebutton %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% closebutton %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'closebutton')
```
{% endAccordionSection %}
{% endAccordion %}

## Size and radius

`size` accepts `xs`–`xl`; `radius` accepts `xs`–`xl` or any CSS value.

{% closebutton size='xs' %} {% closebutton size='sm' %} {% closebutton size='md' %} {% closebutton size='lg' %} {% closebutton size='xl' radius='xl' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% closebutton size='xs' %}
{% closebutton size='sm' %}
{% closebutton size='md' %}
{% closebutton size='lg' %}
{% closebutton size='xl' radius='xl' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
for s in ('xs', 'sm', 'md', 'lg'):
    component('aardvark', 'closebutton', size=s)
component('aardvark', 'closebutton', size='xl', radius='xl')
```
{% endAccordionSection %}
{% endAccordion %}

## Variant and color

`variant` is `subtle` (default) or `transparent`; `color` tints the ✕ itself and takes any
theme or CSS color.

{% closebutton variant='subtle' %} {% closebutton variant='transparent' %} {% closebutton color='red' %} {% closebutton color='grape' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% closebutton variant='subtle' %}
{% closebutton variant='transparent' %}
{% closebutton color='red' %}
{% closebutton color='grape' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'closebutton', variant='subtle')
component('aardvark', 'closebutton', variant='transparent')
component('aardvark', 'closebutton', color='red')
component('aardvark', 'closebutton', color='grape')
```
{% endAccordionSection %}
{% endAccordion %}

## Custom icon

By default the button is a ✕. Pass an `icon` — any
[{% raw %}`{% icon %}`{% endraw %}](/components/data-display/icon/) spec — to replace it
(e.g. a trash can for a delete action). When the glyph changes meaning, set a `label` so
screen readers name it correctly. Add `filled` for the filled Tabler style of a bare
Tabler name.

{% closebutton icon='trash' label='Remove' %} {% closebutton icon='x' label='Dismiss' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% closebutton icon='trash' label='Remove' %}
{% closebutton icon='x' label='Dismiss' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'closebutton', icon='trash', label='Remove')
component('aardvark', 'closebutton', icon='x', label='Dismiss')
```
{% endAccordionSection %}
{% endAccordion %}

## Accessible name

A ✕ carries no text, so the button would otherwise reach a screen reader unnamed. It is
given an `aria-label` of `Close` for you; pass a `label` to replace that whenever the
button does something more specific (the example above names it "Remove").

## Disabled

{% closebutton disabled=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% closebutton disabled=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'closebutton', disabled=True)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

A close button belongs in the corner of a dismissible surface — here in the top-right of a
[callout](/components/feedback/callout/), laid out with a
`{% raw %}{% group %}{% endraw %}`:

{% callout severity='info' %}
{% group justify='space-between' %}
Heads up — you have unsaved changes.
{% closebutton label='Dismiss notice' %}
{% endGroup %}
{% endCallout %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% callout severity='info' %}
{% group justify='space-between' %}
Heads up — you have unsaved changes.
{% closebutton label='Dismiss notice' %}
{% endGroup %}
{% endCallout %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'closebutton', label='Dismiss notice')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default. Bare boolean flags (`filled`, `disabled`)
set the option to `True`; in Python pass `=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `icon` | Tabler name / Font Awesome class / image path / emoji / inline `<svg>` | An icon spec to replace the default ✕. Read like [{% raw %}`{% icon %}`{% endraw %}](/components/data-display/icon/). |
| `filled` | bool flag | Use the filled Tabler style for a bare Tabler name. |
| `label` | string | Accessible name (`aria-label`). Defaults to `Close`. |
| `variant` | `subtle` (default), `transparent` | Visual style. |
| `color` | theme color name or CSS color | Color of the ✕ glyph. |
| `size` | `xs`–`xl` (default `md`) | Button size. |
| `radius` | `xs`–`xl` or any CSS value | Corner radius. |
| `disabled` | bool flag | Render disabled. |
| `id` | string | HTML `id` on the rendered button. |
| `onclick` | JS expression string | JavaScript run on click. In Python pass `attr={'onclick': '…'}`. |
| `m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my` | size token or CSS value | Margin (Mantine spacing system). |

## CSS Selectors

Each close button mounts inside an island wrapper carrying `data-aardvark-island="CloseButton"`; Mantine's Styles API exposes the button root.

{% raw %}
```css
[data-aardvark-island="CloseButton"]  /* the island wrapper */
.mantine-CloseButton-root             /* the × <button> */
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) onto the rendered button — the same channel the `onclick` shortcut rides.

{% closebutton attr={'onclick': '''
const value = this.tagName;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% closebutton attr={'onclick': '''
const value = this.tagName;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'closebutton', attr={'onclick': '''
const value = this.tagName;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
