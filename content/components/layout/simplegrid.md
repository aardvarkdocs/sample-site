---
title: "SimpleGrid"
description: "The built-in simplegrid tag — a responsive grid where every column is the same width. Usage, responsive columns and spacing, and live examples."
---

# SimpleGrid

`{% raw %}{% simplegrid %}{% endraw %}` lays its children out in a grid where **every column is
the same width** — the simplest way to arrange a row of equal cards or tiles that reflows to
fewer columns on narrow screens. Set the base column count with `cols`, the gaps with `spacing`
(horizontal) and `verticalSpacing` (vertical), and let any of those adapt per breakpoint with
the `*Sm`/`*Md`/`*Lg`/`*Xl` props. Each top-level block in the body becomes one grid cell.

Use it as `{% raw %}{% simplegrid %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'simplegrid', …)`.

## Fixed columns

`cols` sets the number of equal-width columns. Here three cells sit in three columns with the
default `md` spacing.

{% simplegrid cols=3 spacing='md' %}
{% badge size='lg' fullWidth %}One{% endBadge %}

{% badge size='lg' fullWidth %}Two{% endBadge %}

{% badge size='lg' fullWidth %}Three{% endBadge %}
{% endSimplegrid %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% simplegrid cols=3 spacing='md' %}
{% badge size='lg' fullWidth %}One{% endBadge %}

{% badge size='lg' fullWidth %}Two{% endBadge %}

{% badge size='lg' fullWidth %}Three{% endBadge %}
{% endSimplegrid %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'simplegrid', cols=3, spacing='md', children=(
    component('aardvark', 'badge', size='lg', fullWidth=True, children='One')
    + '\n\n'
    + component('aardvark', 'badge', size='lg', fullWidth=True, children='Two')
    + '\n\n'
    + component('aardvark', 'badge', size='lg', fullWidth=True, children='Three')
))
```
{% endAccordionSection %}
{% endAccordion %}

## Responsive columns

`cols` is the base column count; `colsSm` / `colsMd` / `colsLg` / `colsXl` override it at that
Mantine breakpoint and up. The grid below is one column on a phone, two on a tablet, and four on
a wide screen — resize the window to watch it reflow.

{% simplegrid cols=1 colsSm=2 colsLg=4 spacing='sm' %}
{% badge fullWidth %}A{% endBadge %}

{% badge fullWidth %}B{% endBadge %}

{% badge fullWidth %}C{% endBadge %}

{% badge fullWidth %}D{% endBadge %}
{% endSimplegrid %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% simplegrid cols=1 colsSm=2 colsLg=4 spacing='sm' %}
{% badge fullWidth %}A{% endBadge %}

{% badge fullWidth %}B{% endBadge %}

{% badge fullWidth %}C{% endBadge %}

{% badge fullWidth %}D{% endBadge %}
{% endSimplegrid %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'simplegrid', cols=1, colsSm=2, colsLg=4, spacing='sm', children=(
    component('aardvark', 'badge', fullWidth=True, children='A')
    + '\n\n'
    + component('aardvark', 'badge', fullWidth=True, children='B')
    + '\n\n'
    + component('aardvark', 'badge', fullWidth=True, children='C')
    + '\n\n'
    + component('aardvark', 'badge', fullWidth=True, children='D')
))
```
{% endAccordionSection %}
{% endAccordion %}

## Spacing and vertical spacing

`spacing` is the horizontal gap between columns; `verticalSpacing` is the gap between rows (it
defaults to `spacing` when omitted). Each is a Mantine size token or any CSS value, and each
takes per-breakpoint overrides — `spacingSm`, `verticalSpacingLg`, and so on.

{% simplegrid cols=2 spacing='xl' verticalSpacing='xs' %}
{% badge fullWidth %}One{% endBadge %}

{% badge fullWidth %}Two{% endBadge %}

{% badge fullWidth %}Three{% endBadge %}

{% badge fullWidth %}Four{% endBadge %}
{% endSimplegrid %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% simplegrid cols=2 spacing='xl' verticalSpacing='xs' %}
{% badge fullWidth %}One{% endBadge %}

{% badge fullWidth %}Two{% endBadge %}

{% badge fullWidth %}Three{% endBadge %}

{% badge fullWidth %}Four{% endBadge %}
{% endSimplegrid %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'simplegrid', cols=2, spacing='xl', verticalSpacing='xs', children=(
    component('aardvark', 'badge', fullWidth=True, children='One')
    + '\n\n'
    + component('aardvark', 'badge', fullWidth=True, children='Two')
    + '\n\n'
    + component('aardvark', 'badge', fullWidth=True, children='Three')
    + '\n\n'
    + component('aardvark', 'badge', fullWidth=True, children='Four')
))
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Each cell can hold any component, not just a badge. Here the grid arranges three
[`card`](/components/data-display/card/)s that reflow from three columns to one on a phone.

{% simplegrid cols=3 colsSm=1 spacing='md' %}
{% card title='Fast' %}Builds in seconds.{% endCard %}

{% card title='Typed' %}Schema-checked config.{% endCard %}

{% card title='Themed' %}One palette, everywhere.{% endCard %}
{% endSimplegrid %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% simplegrid cols=3 colsSm=1 spacing='md' %}
{% card title='Fast' %}Builds in seconds.{% endCard %}

{% card title='Typed' %}Schema-checked config.{% endCard %}

{% card title='Themed' %}One palette, everywhere.{% endCard %}
{% endSimplegrid %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'simplegrid', cols=3, colsSm=1, spacing='md', children=(
    component('aardvark', 'card', title='Fast', children='Builds in seconds.')
    + '\n\n'
    + component('aardvark', 'card', title='Typed', children='Schema-checked config.')
    + '\n\n'
    + component('aardvark', 'card', title='Themed', children='One palette, everywhere.')
))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `cols` | integer (`1` default) | Base number of equal-width columns. |
| `colsSm`, `colsMd`, `colsLg`, `colsXl` | integer | Column count at that breakpoint and up. |
| `spacing` | `xs`, `sm`, `md` (default), `lg`, `xl`, or any CSS value | Horizontal gap between columns. |
| `spacingSm`, `spacingMd`, `spacingLg`, `spacingXl` | Mantine size token or any CSS value | Horizontal gap at that breakpoint and up. |
| `verticalSpacing` | Mantine size token or any CSS value | Vertical gap between rows (defaults to `spacing`). |
| `verticalSpacingSm`, `verticalSpacingMd`, `verticalSpacingLg`, `verticalSpacingXl` | Mantine size token or any CSS value | Vertical gap at that breakpoint and up. |
| `m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my` | Mantine size token or any CSS value | Margin (all sides / top / bottom / left / right / horizontal / vertical). |
| `p`, `pt`, `pb`, `pl`, `pr`, `px`, `py` | Mantine size token or any CSS value | Padding (all sides / top / bottom / left / right / horizontal / vertical). |
| `bg` | color name or CSS color | Background color. |
| `c` | color name or CSS color | Text color. |
| `w`, `h` | Mantine size token or any CSS value | Width / height. |
| `miw`, `mih`, `maw`, `mah` | any CSS value | Min/max width and min/max height. |


## CSS Selectors

Each `simplegrid` carries `data-aardvark-island="SimpleGrid"` on its wrapper, and Mantine exposes its parts as `mantine-SimpleGrid-*` classes — target either to style it from your theme CSS.

{% raw %}
```css
[data-aardvark-island="SimpleGrid"] {
  /* style every simplegrid on the page */
}

.mantine-SimpleGrid-root {
  /* the root part */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% simplegrid cols=3 spacing='md' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
{% paper %}A{% endPaper %} {% paper %}B{% endPaper %} {% paper %}C{% endPaper %}
{% endSimplegrid %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% simplegrid cols=3 spacing='md' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
{% paper %}A{% endPaper %} {% paper %}B{% endPaper %} {% paper %}C{% endPaper %}
{% endSimplegrid %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'simplegrid', cols=3, spacing='md', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''}, children=(
    component('aardvark', 'paper', children='A')
    + ' '
    + component('aardvark', 'paper', children='B')
    + ' '
    + component('aardvark', 'paper', children='C')
))
```
{% endAccordionSection %}
{% endAccordion %}
