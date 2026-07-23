---
title: "Group"
description: "The built-in group tag — a flex row that lays its children out horizontally with consistent gaps. Usage, options (justify, align, gap, wrap, grow), and live examples."
---

# Group

`{% raw %}{% group %}{% endraw %}` lays its children out in a **horizontal row** with a
consistent gap — the everyday way to put buttons, badges, or chips side by side. It is a
flex row: control where children sit on the main axis (`justify`), how they line up on the
cross axis (`align`), the space between them (`gap`), whether they wrap (`wrap`), and whether
they share the row width equally (`grow`). The block body is the content.

Use it as `{% raw %}{% group %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'group', …)`.

## Basic row

With no options, children sit at the start of the row with the default `md` gap.

{% group %}
{% badge %}One{% endBadge %} {% badge %}Two{% endBadge %} {% badge %}Three{% endBadge %}
{% endGroup %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% group %}
{% badge %}One{% endBadge %} {% badge %}Two{% endBadge %} {% badge %}Three{% endBadge %}
{% endGroup %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'group', children=(
    component('aardvark', 'badge', children='One')
    + component('aardvark', 'badge', children='Two')
    + component('aardvark', 'badge', children='Three')
))
```
{% endAccordionSection %}
{% endAccordion %}

## Justify (main axis)

`justify` sets `justify-content` — where the children sit along the row. Common values are
`flex-start` (default), `center`, `flex-end`, `space-between`, and `space-around`.

{% group justify='center' %}
{% badge %}One{% endBadge %} {% badge %}Two{% endBadge %} {% badge %}Three{% endBadge %}
{% endGroup %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% group justify='center' %}
{% badge %}One{% endBadge %} {% badge %}Two{% endBadge %} {% badge %}Three{% endBadge %}
{% endGroup %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'group', justify='center', children=(
    component('aardvark', 'badge', children='One')
    + component('aardvark', 'badge', children='Two')
    + component('aardvark', 'badge', children='Three')
))
```
{% endAccordionSection %}
{% endAccordion %}

## Align (cross axis)

`align` sets `align-items` — how children line up across the row when they differ in height.
Values include `center` (default), `flex-start`, `flex-end`, and `stretch`.

{% group align='flex-end' %}
{% badge size='xs' %}xs{% endBadge %} {% badge size='lg' %}lg{% endBadge %} {% badge size='xl' %}xl{% endBadge %}
{% endGroup %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% group align='flex-end' %}
{% badge size='xs' %}xs{% endBadge %} {% badge size='lg' %}lg{% endBadge %} {% badge size='xl' %}xl{% endBadge %}
{% endGroup %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'group', align='flex-end', children=(
    component('aardvark', 'badge', size='xs', children='xs')
    + component('aardvark', 'badge', size='lg', children='lg')
    + component('aardvark', 'badge', size='xl', children='xl')
))
```
{% endAccordionSection %}
{% endAccordion %}

## Gap

`gap` is the space between children — a Mantine size token (`xs`–`xl`) or any CSS value
(`8px`, `2rem`). The default is `md`.

{% group gap='xl' %}
{% badge %}One{% endBadge %} {% badge %}Two{% endBadge %} {% badge %}Three{% endBadge %}
{% endGroup %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% group gap='xl' %}
{% badge %}One{% endBadge %} {% badge %}Two{% endBadge %} {% badge %}Three{% endBadge %}
{% endGroup %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'group', gap='xl', children=(
    component('aardvark', 'badge', children='One')
    + component('aardvark', 'badge', children='Two')
    + component('aardvark', 'badge', children='Three')
))
```
{% endAccordionSection %}
{% endAccordion %}

## Wrap

`wrap` sets `flex-wrap`. The default is `wrap` (children flow onto the next line when they
run out of room); set `wrap='nowrap'` to force everything onto a single line.

{% group wrap='nowrap' %}
{% badge %}One{% endBadge %} {% badge %}Two{% endBadge %} {% badge %}Three{% endBadge %} {% badge %}Four{% endBadge %}
{% endGroup %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% group wrap='nowrap' %}
{% badge %}One{% endBadge %} {% badge %}Two{% endBadge %} {% badge %}Three{% endBadge %} {% badge %}Four{% endBadge %}
{% endGroup %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'group', wrap='nowrap', children=(
    component('aardvark', 'badge', children='One')
    + component('aardvark', 'badge', children='Two')
    + component('aardvark', 'badge', children='Three')
    + component('aardvark', 'badge', children='Four')
))
```
{% endAccordionSection %}
{% endAccordion %}

## Grow

`grow` (a bare flag) makes each child share the row width equally. By default
`preventGrowOverflow` is on, so each child reserves an equal slice and a wide child can't push
the others around; set `preventGrowOverflow='false'` to let children size to their content.

{% group grow %}
{% button text='Left' %} {% button text='Middle' %} {% button text='Right' %}
{% endGroup %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% group grow %}
{% button text='Left' %} {% button text='Middle' %} {% button text='Right' %}
{% endGroup %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'group', grow=True, children=(
    component('aardvark', 'button', text='Left')
    + component('aardvark', 'button', text='Middle')
    + component('aardvark', 'button', text='Right')
))
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

`group` composes with any other tag. Here it puts a [`button`](/components/buttons/button/)
and two [`badge`](/components/data-display/badge/)s on one line, pushed apart with
`justify='space-between'`.

{% group justify='space-between' align='center' %}
{% button text='Deploy' %}
{% group gap='xs' %}
{% badge color='green' %}Ready{% endBadge %} {% badge color='blue' variant='light' %}v2{% endBadge %}
{% endGroup %}
{% endGroup %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% group justify='space-between' align='center' %}
{% button text='Deploy' %}
{% group gap='xs' %}
{% badge color='green' %}Ready{% endBadge %} {% badge color='blue' variant='light' %}v2{% endBadge %}
{% endGroup %}
{% endGroup %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'group', justify='space-between', align='center', children=(
    component('aardvark', 'button', text='Deploy')
    + component('aardvark', 'group', gap='xs', children=(
        component('aardvark', 'badge', color='green', children='Ready')
        + component('aardvark', 'badge', color='blue', variant='light', children='v2')
    ))
))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `justify` | `flex-start` (default), `center`, `flex-end`, `space-between`, `space-around`, `space-evenly` | `justify-content` for the row — where children sit on the main axis. |
| `align` | `center` (default), `flex-start`, `flex-end`, `stretch`, `baseline` | `align-items` — how children line up on the cross axis. |
| `gap` | `xs`, `sm`, `md` (default), `lg`, `xl`, or any CSS value | Space between children. |
| `wrap` | `wrap` (default), `nowrap`, `wrap-reverse` | `flex-wrap` for the row. |
| `grow` | bare flag (off by default) | Make children share the row width equally. |
| `preventGrowOverflow` | `true` (default), `false` | With `grow`, reserve equal width so a wide child can't push others; set `false` to let children size to content. |
| `m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my` | Mantine size token or any CSS value | Margin (all sides / top / bottom / left / right / horizontal / vertical). |
| `p`, `pt`, `pb`, `pl`, `pr`, `px`, `py` | Mantine size token or any CSS value | Padding (all sides / top / bottom / left / right / horizontal / vertical). |
| `bg` | color name or CSS color | Background color. |
| `c` | color name or CSS color | Text color. |
| `w`, `h` | Mantine size token or any CSS value | Width / height. |
| `miw`, `mih`, `maw`, `mah` | any CSS value | Min/max width and min/max height. |


## CSS Selectors

Each `group` carries `data-aardvark-island="Group"` on its wrapper, and Mantine exposes its parts as `mantine-Group-*` classes — target either to style it from your theme CSS.

{% raw %}
```css
[data-aardvark-island="Group"] {
  /* style every group on the page */
}

.mantine-Group-root {
  /* the root part */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% group attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
{% badge %}one{% endBadge %} {% badge %}two{% endBadge %}
{% endGroup %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% group attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
{% badge %}one{% endBadge %} {% badge %}two{% endBadge %}
{% endGroup %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = (component('aardvark', 'badge', children='one')
         + ' '
         + component('aardvark', 'badge', children='two'))
print(component('aardvark', 'group', children=inner, attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''}))
```
{% endAccordionSection %}
{% endAccordion %}
