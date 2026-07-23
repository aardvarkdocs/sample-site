---
title: "List"
description: "The built-in list tag — a Mantine List (ordered or unordered) with icon
  bullets, sizing, and spacing controls. Usage, options, and live examples."
---

# List

`{% raw %}{% list %}{% endraw %}` is a **built-in** tag for ordered and unordered lists. A
plain Markdown list still works for ordinary lists; reach for this tag when you want an icon
bullet, an explicit size, or custom spacing. Give the items in `items`, pipe-separated (or as
a JSON array); each item renders inline Markdown.

Use it as `{% raw %}{% list %}{% endraw %}` in Markdown, or call it from Python logic (loops,
snippets) via `component('aardvark', 'list', …)`.

## Demonstrations

### Unordered (the default)

Pass `items` pipe-separated; each becomes a bulleted item.

{% list items='First item | Second item | Third item' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% list items='First item | Second item | Third item' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'list', items='First item | Second item | Third item')
```
{% endAccordionSection %}
{% endAccordion %}

### Ordered

`type='ordered'` numbers the items instead of bulleting them.

{% list type='ordered' items='Clone the repo | Install deps | Run the build' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% list type='ordered' items='Clone the repo | Install deps | Run the build' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'list', type='ordered',
          items='Clone the repo | Install deps | Run the build')
```
{% endAccordionSection %}
{% endAccordion %}

### Icon bullets

Set `icon` to a [Tabler](https://tabler.io/icons) name to swap the bullet for an icon on
every item.

{% list icon='circle-check' items='Tests pass | Build is green | Docs updated' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% list icon='circle-check' items='Tests pass | Build is green | Docs updated' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'list', icon='circle-check',
          items='Tests pass | Build is green | Docs updated')
```
{% endAccordionSection %}
{% endAccordion %}

### Size, spacing, padding, center

`size` (`xs`–`xl`) sets the text size, `spacing` the gap between items, `withPadding` indents
the list from its container, and `center` vertically centers each item against its bullet.
Items render inline Markdown, so `**bold**`, `` `code` ``, and `[links]` all format.

{% list size='lg' spacing='md' withPadding=true center=true items='A **bold** item | An item with `code` | A [linked](https://mantine.dev) item' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% list size='lg' spacing='md' withPadding=true center=true items='A **bold** item | An item with `code` | A [linked](https://mantine.dev) item' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'list', size='lg', spacing='md', withPadding=True, center=True,
          items='A **bold** item | An item with `code` | A [linked](https://mantine.dev) item')
```
{% endAccordionSection %}
{% endAccordion %}

### JSON array items

When an item contains a literal pipe, pass `items` as a JSON array instead of a
pipe-separated string.

{% list items='["Pipe in a | value", "A plain item", "Another item"]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% list items='["Pipe in a | value", "A plain item", "Another item"]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'list', items='["Pipe in a | value", "A plain item", "Another item"]')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Items render inline Markdown, so `` `code` `` and `[links]` format inside each item.

{% list icon='arrow-right' items='Run `vark build` | Ship a [static site](https://aardvark.dev) | Watch it **just work**' %}

To compose items out of *other built-in tags* (Code, Mark, …), build the item strings in
Python and pass them as a list — the call form lets you mix tag output into each item.

{%
run = "Run " + component('aardvark', 'code', children='vark build')
ship = "Ship a " + component('aardvark', 'mark', color='lime', children='static site')
page.print(component('aardvark', 'list', icon='arrow-right', items=[run, ship]))
%}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% list icon='arrow-right' items='Run `vark build` | Ship a [static site](https://aardvark.dev) | Watch it **just work**' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
{% raw %}
```aardvark
{%
run = "Run " + component('aardvark', 'code', children='vark build')
ship = "Ship a " + component('aardvark', 'mark', color='lime', children='static site')
page.print(component('aardvark', 'list', icon='arrow-right', items=[run, ship]))
%}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `items` | Pipe-separated string (`First \| Second`) or a JSON array; Python also accepts a list | The list items. Each renders inline Markdown. Empty entries are dropped. |
| `type` | `unordered` (default) `ordered` | Bulleted or numbered list. |
| `size` | `xs` `sm` `md` `lg` `xl` | Text size. |
| `spacing` | A Mantine size token (`xs`–`xl`) | Gap between items. |
| `withPadding` | `true` / `false` (default `false`) | Indent the list from its left edge. |
| `center` | `true` / `false` (default `false`) | Vertically center each item against its bullet/icon. |
| `icon` | A [Tabler](https://tabler.io/icons) icon name (e.g. `circle-check`) | Used as the bullet for every item. |

Items render inline Markdown, so `**bold**`, `` `code` ``, and `[links]` all format.

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="List"]`, or through the Mantine Styles API classes:

{% raw %}
```css
/* Every rendered List carries this island marker */
[data-aardvark-island="List"] { }

/* Mantine Styles API classes */
.mantine-List-root { }
.mantine-List-item { }
.mantine-List-itemWrapper { }
.mantine-List-itemLabel { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% list items='First item | Second item | Third item' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% list items='First item | Second item | Third item' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'list', items='First item | Second item | Third item', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
