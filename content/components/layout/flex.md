---
title: "Flex"
description: "The built-in flex tag — a flexbox container exposing the full CSS flex surface (direction, wrap, justify, align, gap). All options and a full attribute reference."
---

# Flex

`{% raw %}{% flex %}{% endraw %}` is a **built-in** tag for a flexbox container with the
**full CSS flex surface** as props. Where
[`{% raw %}{% group %}{% endraw %}`](/components/layout/group/) and
[`{% raw %}{% stack %}{% endraw %}`](/components/layout/stack/) are opinionated row/column
shortcuts, `flex` gives you `direction`, `wrap`, `justify`, `align`, and per-axis gaps
directly. Reach for it when you need precise control over the flex layout.

Use it as `{% raw %}{% flex %}{% endraw %}` in Markdown, or call it from Python logic (loops,
snippets) via `component('aardvark', 'flex', …)`.

## Justify and align

`justify` is the CSS `justify-content` and `align` is `align-items`. Together they place the
children along the main and cross axes — here pushed to the edges and vertically centered.

{% flex justify='space-between' align='center' gap='md' %}
{% badge %}Left{% endBadge %} {% badge %}Right{% endBadge %}
{% endFlex %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% flex justify='space-between' align='center' gap='md' %}
{% badge %}Left{% endBadge %} {% badge %}Right{% endBadge %}
{% endFlex %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = (component('aardvark', 'badge', children='Left')
         + ' '
         + component('aardvark', 'badge', children='Right'))
component('aardvark', 'flex', justify='space-between',
          align='center', gap='md', children=inner)
```
{% endAccordionSection %}
{% endAccordion %}

## Direction

`direction` is any CSS `flex-direction` — `row` (the default), `column`, `row-reverse`, or
`column-reverse`. A `column` direction stacks the children top to bottom.

{% flex direction='column' gap='sm' %}
{% button text='First' %} {% button text='Second' %}
{% endFlex %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% flex direction='column' gap='sm' %}
{% button text='First' %} {% button text='Second' %}
{% endFlex %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = (component('aardvark', 'button', text='First')
         + ' '
         + component('aardvark', 'button', text='Second'))
component('aardvark', 'flex', direction='column', gap='sm', children=inner)
```
{% endAccordionSection %}
{% endAccordion %}

## Wrap and per-axis gaps

`wrap` is any CSS `flex-wrap` (`nowrap`, `wrap`, `wrap-reverse`); when children wrap onto a
new line, `rowGap` and `columnGap` set the gaps independently — vertical and horizontal.

{% flex wrap='wrap' rowGap='lg' columnGap='xs' maw=260 %}
{% badge %}One{% endBadge %} {% badge %}Two{% endBadge %} {% badge %}Three{% endBadge %} {% badge %}Four{% endBadge %} {% badge %}Five{% endBadge %}
{% endFlex %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% flex wrap='wrap' rowGap='lg' columnGap='xs' maw=260 %}
{% badge %}One{% endBadge %} {% badge %}Two{% endBadge %} {% badge %}Three{% endBadge %} {% badge %}Four{% endBadge %} {% badge %}Five{% endBadge %}
{% endFlex %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = ' '.join(
    component('aardvark', 'badge', children=t)
    for t in ('One', 'Two', 'Three', 'Four', 'Five'))
component('aardvark', 'flex', wrap='wrap', rowGap='lg',
          columnGap='xs', maw=260, children=inner)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

The body is ordinary Markdown, so Flex makes a clean toolbar — a label pushed left, actions
pushed right.

{% flex justify='space-between' align='center' gap='md' bg='var(--mantine-color-gray-1)' p='sm' %}
{% badge size='lg' %}Filters{% endBadge %}
{% group gap='xs' %}
{% button text='Reset' variant='subtle' %}
{% button text='Apply' %}
{% endGroup %}
{% endFlex %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% flex justify='space-between' align='center' gap='md' bg='var(--mantine-color-gray-1)' p='sm' %}
{% badge size='lg' %}Filters{% endBadge %}
{% group gap='xs' %}
{% button text='Reset' variant='subtle' %}
{% button text='Apply' %}
{% endGroup %}
{% endFlex %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
actions = component('aardvark', 'group', gap='xs', children=(
    component('aardvark', 'button', text='Reset', variant='subtle')
    + component('aardvark', 'button', text='Apply')))
inner = component('aardvark', 'badge', size='lg', children='Filters') + actions
component('aardvark', 'flex', justify='space-between', align='center',
          gap='md', bg='var(--mantine-color-gray-1)', p='sm', children=inner)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Flex sets no defaults of its own — it's a thin Box over CSS flex, so an omitted option falls
back to the CSS initial value. The flex options come first; the rest is the shared Mantine
spacing/sizing system.

| Attribute | Values | Description |
| --- | --- | --- |
| `direction` | `row`, `column`, `row-reverse`, `column-reverse` | CSS `flex-direction`. |
| `wrap` | `nowrap`, `wrap`, `wrap-reverse` | CSS `flex-wrap`. |
| `justify` | any CSS `justify-content` (`flex-start`, `center`, `space-between`, …) | Placement along the main axis. |
| `align` | any CSS `align-items` (`stretch`, `center`, `flex-start`, …) | Placement along the cross axis. |
| `gap` | `xs`–`xl` or any CSS value | Gap on both axes. |
| `rowGap` | `xs`–`xl` or any CSS value | Vertical gap only. |
| `columnGap` | `xs`–`xl` or any CSS value | Horizontal gap only. |
| `w` / `h` | `xs`–`xl` or any CSS size | Width / height of the container. |
| `miw` / `mih` | any CSS size | Minimum width / height. |
| `maw` / `mah` | any CSS size | Maximum width / height. |
| `m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my` | `xs`–`xl` or any CSS size | Margin — all sides, or a single side / axis. |
| `p`, `pt`, `pb`, `pl`, `pr`, `px`, `py` | `xs`–`xl` or any CSS size | Padding — all sides, or a single side / axis. |
| `bg` | a theme color or any CSS color | Background color. |
| `c` | a theme color or any CSS color | Text (content) color. |


## CSS Selectors

Each `flex` carries `data-aardvark-island="Flex"` on its wrapper, and Mantine exposes its parts as `mantine-Flex-*` classes — target either to style it from your theme CSS.

{% raw %}
```css
[data-aardvark-island="Flex"] {
  /* style every flex on the page */
}

.mantine-Flex-root {
  /* the root part */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% flex justify='space-between' align='center' gap='md' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Left {% space w='md' %} Right
{% endFlex %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% flex justify='space-between' align='center' gap='md' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Left {% space w='md' %} Right
{% endFlex %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = 'Left ' + component('aardvark', 'space', w='md') + ' Right'
print(component('aardvark', 'flex', justify='space-between', align='center',
          gap='md', children=inner, attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''}))
```
{% endAccordionSection %}
{% endAccordion %}
