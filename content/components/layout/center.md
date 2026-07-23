---
title: "Center"
description: "The built-in center tag — centers its content both horizontally and vertically. Block and inline modes, sizing, and a full attribute reference."
---

# Center

`{% raw %}{% center %}{% endraw %}` is a **built-in** tag that centers its content **both
horizontally and vertically**. Give the container a height — with the `h` prop or from what's
around it — and the body lands in the middle. It ships with aardvark, so there's no setup.

Use it as `{% raw %}{% center %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'center', …)`.

## Block centering

By default Center is a block-level flex container. Set a height so there's room to center
within, and the body sits dead center.

{% center h=120 bg='var(--mantine-color-gray-1)' %}
{% badge size='lg' %}Centered{% endBadge %}
{% endCenter %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% center h=120 bg='var(--mantine-color-gray-1)' %}
{% badge size='lg' %}Centered{% endBadge %}
{% endCenter %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = component('aardvark', 'badge', size='lg', children='Centered')
component('aardvark', 'center', h=120,
          bg='var(--mantine-color-gray-1)', children=inner)
```
{% endAccordionSection %}
{% endAccordion %}

## Inline centering

`inline` switches the container to `inline-flex` — use it to vertically center an icon or
badge alongside a run of text rather than as a block.

{% center inline %}★ rated{% endCenter %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% center inline %}★ rated{% endCenter %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'center', inline=True, children='★ rated')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

The body is ordinary Markdown, so you can center a richer cluster — here a horizontal
[`{% raw %}{% group %}{% endraw %}`](/components/layout/group/) of buttons inside a tall,
tinted box.

{% center h=160 bg='var(--mantine-color-gray-1)' %}
{% group %}
{% button text='Accept' %}
{% button text='Decline' variant='outline' %}
{% endGroup %}
{% endCenter %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% center h=160 bg='var(--mantine-color-gray-1)' %}
{% group %}
{% button text='Accept' %}
{% button text='Decline' variant='outline' %}
{% endGroup %}
{% endCenter %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = component('aardvark', 'group',
                  children=component('aardvark', 'button', text='Accept')
                           + component('aardvark', 'button', text='Decline', variant='outline'))
component('aardvark', 'center', h=160,
          bg='var(--mantine-color-gray-1)', children=inner)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

`inline` is the one option of its own; everything else is the shared Mantine spacing/sizing
system. `h` is the one you'll reach for most, since centering vertically needs a height.

| Attribute | Values | Description |
| --- | --- | --- |
| `inline` | `true`, `false` (default `false`) | Render as `inline-flex` (center inline content) instead of a block `flex`. |
| `w` / `h` | `xs`–`xl` or any CSS size | Width / height of the container. `h` gives room to center vertically. |
| `miw` / `mih` | any CSS size | Minimum width / height. |
| `maw` / `mah` | any CSS size | Maximum width / height. |
| `m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my` | `xs`–`xl` or any CSS size | Margin — all sides, or a single side / axis. |
| `p`, `pt`, `pb`, `pl`, `pr`, `px`, `py` | `xs`–`xl` or any CSS size | Padding — all sides, or a single side / axis. |
| `bg` | a theme color or any CSS color | Background color. |
| `c` | a theme color or any CSS color | Text (content) color. |


## CSS Selectors

Each `center` carries `data-aardvark-island="Center"` on its wrapper, and Mantine exposes its parts as `mantine-Center-*` classes — target either to style it from your theme CSS.

{% raw %}
```css
[data-aardvark-island="Center"] {
  /* style every center on the page */
}

.mantine-Center-root {
  /* the root part */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% center h=120 bg='var(--mantine-color-gray-1)' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Centered both ways.
{% endCenter %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% center h=120 bg='var(--mantine-color-gray-1)' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Centered both ways.
{% endCenter %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'center', h=120,
          bg='var(--mantine-color-gray-1)', children='Centered both ways.',
          attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
