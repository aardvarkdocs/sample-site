---
title: "Stack"
description: "The built-in stack tag — a flex column that stacks its children vertically with a consistent gap. Usage, options (justify, align, gap), and live examples."
---

# Stack

`{% raw %}{% stack %}{% endraw %}` stacks its children in a **vertical column** with a
consistent gap — the column counterpart to
[`{% raw %}{% group %}{% endraw %}`](/components/layout/group/). It is a flex column: control
where children sit along the column (`justify`), how they line up across it (`align`), and the
space between them (`gap`). By default `align` is `stretch`, so children fill the width. The
block body is the content.

Use it as `{% raw %}{% stack %}{% endraw %}` in Markdown, or call it from Python logic (loops,
snippets) via `component('aardvark', 'stack', …)`.

## Basic column

With no options, children stretch to the full width and stack with the default `md` gap.

{% stack %}
{% button text='Top' %}
{% button text='Middle' %}
{% button text='Bottom' %}
{% endStack %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% stack %}
{% button text='Top' %}
{% button text='Middle' %}
{% button text='Bottom' %}
{% endStack %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'stack', children=(
    component('aardvark', 'button', text='Top')
    + component('aardvark', 'button', text='Middle')
    + component('aardvark', 'button', text='Bottom')
))
```
{% endAccordionSection %}
{% endAccordion %}

## Align (cross axis)

`align` sets `align-items` — how children line up across the column. The default is `stretch`
(children fill the width); use `center`, `flex-start`, or `flex-end` to size children to their
content and position them.

{% stack align='center' %}
{% badge %}One{% endBadge %}
{% badge %}Two{% endBadge %}
{% badge %}Three{% endBadge %}
{% endStack %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% stack align='center' %}
{% badge %}One{% endBadge %}
{% badge %}Two{% endBadge %}
{% badge %}Three{% endBadge %}
{% endStack %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'stack', align='center', children=(
    component('aardvark', 'badge', children='One')
    + component('aardvark', 'badge', children='Two')
    + component('aardvark', 'badge', children='Three')
))
```
{% endAccordionSection %}
{% endAccordion %}

## Justify (main axis)

`justify` sets `justify-content` — where children sit along the column when the stack is taller
than its content. The default is `flex-start`; `center`, `flex-end`, and `space-between` need a
fixed height (`h`) to have a visible effect.

{% stack justify='space-between' h=160 align='center' %}
{% badge %}First{% endBadge %}
{% badge %}Last{% endBadge %}
{% endStack %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% stack justify='space-between' h=160 align='center' %}
{% badge %}First{% endBadge %}
{% badge %}Last{% endBadge %}
{% endStack %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'stack', justify='space-between', h=160, align='center', children=(
    component('aardvark', 'badge', children='First')
    + component('aardvark', 'badge', children='Last')
))
```
{% endAccordionSection %}
{% endAccordion %}

## Gap

`gap` is the space between children — a Mantine size token (`xs`–`xl`) or any CSS value
(`4px`, `2rem`). The default is `md`.

{% stack gap='xs' align='center' %}
{% badge %}One{% endBadge %}
{% badge %}Two{% endBadge %}
{% badge %}Three{% endBadge %}
{% endStack %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% stack gap='xs' align='center' %}
{% badge %}One{% endBadge %}
{% badge %}Two{% endBadge %}
{% badge %}Three{% endBadge %}
{% endStack %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'stack', gap='xs', align='center', children=(
    component('aardvark', 'badge', children='One')
    + component('aardvark', 'badge', children='Two')
    + component('aardvark', 'badge', children='Three')
))
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

`stack` composes with any other tag. Here it stacks a heading badge above a
[`group`](/components/layout/group/) of action [`button`](/components/buttons/button/)s.

{% stack gap='sm' %}
{% badge size='lg' color='grape' %}Project settings{% endBadge %}
{% group %}
{% button text='Save' %} {% button text='Cancel' variant='default' %}
{% endGroup %}
{% endStack %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% stack gap='sm' %}
{% badge size='lg' color='grape' %}Project settings{% endBadge %}
{% group %}
{% button text='Save' %} {% button text='Cancel' variant='default' %}
{% endGroup %}
{% endStack %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'stack', gap='sm', children=(
    component('aardvark', 'badge', size='lg', color='grape', children='Project settings')
    + component('aardvark', 'group', children=(
        component('aardvark', 'button', text='Save')
        + component('aardvark', 'button', text='Cancel', variant='default')
    ))
))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `justify` | `flex-start` (default), `center`, `flex-end`, `space-between`, `space-around`, `space-evenly` | `justify-content` for the column — where children sit on the main axis (needs a fixed height to show). |
| `align` | `stretch` (default), `center`, `flex-start`, `flex-end` | `align-items` — how children line up on the cross axis. |
| `gap` | `xs`, `sm`, `md` (default), `lg`, `xl`, or any CSS value | Space between children. |
| `m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my` | Mantine size token or any CSS value | Margin (all sides / top / bottom / left / right / horizontal / vertical). |
| `p`, `pt`, `pb`, `pl`, `pr`, `px`, `py` | Mantine size token or any CSS value | Padding (all sides / top / bottom / left / right / horizontal / vertical). |
| `bg` | color name or CSS color | Background color. |
| `c` | color name or CSS color | Text color. |
| `w`, `h` | Mantine size token or any CSS value | Width / height. |
| `miw`, `mih`, `maw`, `mah` | any CSS value | Min/max width and min/max height. |


## CSS Selectors

Each `stack` carries `data-aardvark-island="Stack"` on its wrapper, and Mantine exposes its parts as `mantine-Stack-*` classes — target either to style it from your theme CSS.

{% raw %}
```css
[data-aardvark-island="Stack"] {
  /* style every stack on the page */
}

.mantine-Stack-root {
  /* the root part */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% stack attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
{% badge %}one{% endBadge %} {% badge %}two{% endBadge %}
{% endStack %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% stack attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
{% badge %}one{% endBadge %} {% badge %}two{% endBadge %}
{% endStack %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'stack', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''}, children=(
    component('aardvark', 'badge', children='one')
    + ' '
    + component('aardvark', 'badge', children='two')
))
```
{% endAccordionSection %}
{% endAccordion %}
