---
title: "Scroller"
description: "The built-in scroller tag — a low-level native-scroll container with the browser's own scrollbars. When to use it vs. ScrollArea, options, and a live example."
---

# Scroller

`scroller` is a **minimal, low-level scroll container** — a plain overflow box with the
**browser's native scrollbars**, no styled overlay bars and no JavaScript. Give it a fixed
height with `h` (and/or width with `w`) and its content scrolls; `axis` chooses which way. It's
built on [Box](/components/layout/box/) (it just adds an `overflow` style), so it inherits the same
spacing, sizing, and color props. For nicer, styled, auto-hiding overlay scrollbars that look
the same across platforms, use [ScrollArea](/components/layout/scrollarea/) — `scroller` is the
no-frills sibling. Close the block with `{% raw %}{% endScroller %}{% endraw %}` (one capital S).

Use it as `{% raw %}{% scroller %}…{% endScroller %}{% endraw %}` in Markdown, or call it from
Python logic (loops, snippets) via `component('aardvark', 'scroller', …)`.

## Demonstrations

Give it an `h` so the content can overflow; the block body is the content. By default it scrolls
vertically (`axis='y'`).

**Preview:**

{% scroller h='140' p='sm' bg='var(--mantine-color-gray-light)' %}
A native-scrolling region — the browser's own scrollbar, no styling applied.

This is deliberately plain: it's just a `Box` with `overflow-y: auto`. If you want a styled,
auto-hiding scrollbar, switch to the `scrollarea` tag.

Keep reading — there's more content here than fits in 140 pixels, so the native scrollbar
appears and you can scroll.
{% endScroller %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% scroller h='140' p='sm' bg='var(--mantine-color-gray-light)' %}
A native-scrolling region — the browser's own scrollbar, no styling applied.
Add enough text and it scrolls vertically inside the fixed 140px height.
{% endScroller %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'scroller',
          h='140', p='sm', bg='var(--mantine-color-gray-light)',
          children='A native-scrolling region — the browser\'s own scrollbar.')
```
{% endAccordionSection %}
{% endAccordion %}

### Horizontal scrolling

`axis='x'` scrolls sideways instead — useful for a wide table or a row of items that shouldn't
wrap. `axis='both'` enables scrolling on both axes.

**Preview:**

{% scroller axis='x' w='100%' p='sm' bg='var(--mantine-color-gray-light)' %}
<div style="display:flex; gap:1.5rem; white-space:nowrap;"><span>one</span><span>two</span><span>three</span><span>four</span><span>five</span><span>six</span><span>seven</span><span>eight</span><span>nine</span><span>ten</span><span>eleven</span><span>twelve</span></div>
{% endScroller %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% scroller axis='x' w='100%' p='sm' bg='var(--mantine-color-gray-light)' %}
<div style="display:flex; gap:1rem; white-space:nowrap;"><span>one</span>…<span>ten</span></div>
{% endScroller %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
row = '<div style="display:flex; gap:1rem; white-space:nowrap;">' + \
      ''.join(f'<span>{n}</span>' for n in ['one', 'two', 'three', 'four', 'five']) + \
      '</div>'
component('aardvark', 'scroller', axis='x', w='100%', p='sm', children=row)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Wrap a stack of [Paper](/components/layout/paper/) surfaces in a fixed-height `scroller` to keep a
long list inside a native-scrolling panel.

**Preview:**

{% scroller h='140' p='xs' bg='var(--mantine-color-gray-light)' %}
{% paper withBorder=true p='sm' radius='sm' mb='xs' %}First row{% endPaper %}
{% paper withBorder=true p='sm' radius='sm' mb='xs' %}Second row{% endPaper %}
{% paper withBorder=true p='sm' radius='sm' mb='xs' %}Third row{% endPaper %}
{% paper withBorder=true p='sm' radius='sm' mb='xs' %}Fourth row{% endPaper %}
{% paper withBorder=true p='sm' radius='sm' %}Fifth row — scroll for more{% endPaper %}
{% endScroller %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% scroller h='140' p='xs' bg='var(--mantine-color-gray-light)' %}
{% paper withBorder=true p='sm' radius='sm' mb='xs' %}First row{% endPaper %}
{% paper withBorder=true p='sm' radius='sm' %}…more rows…{% endPaper %}
{% endScroller %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
rows = ''.join(
    component('aardvark', 'paper', withBorder=True, p='sm', radius='sm', mb='xs',
              children=f'Row {i}')
    for i in range(1, 6)
)
component('aardvark', 'scroller', h='140', p='xs', children=rows)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `axis` | `y` (default, vertical) / `x` (horizontal) / `both` | Which way the box scrolls. |
| `h` / `w` | A CSS length, or a bare number (treated as pixels) | Height / width — give it an `h` so the content can overflow. |
| `miw` / `mih` / `maw` / `mah` | A CSS length, or a bare number (treated as pixels) | Min/max width and height. |
| `bg` | A theme color or CSS color | Background color. |
| `m` / `mt` / `mb` / `ml` / `mr` / `mx` / `my` | A Mantine size token or CSS length | Margin (all / top / bottom / left / right / horizontal / vertical). |
| `p` / `pt` / `pb` / `pl` / `pr` / `px` / `py` | A Mantine size token or CSS length | Padding (all / top / bottom / left / right / horizontal / vertical). |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |


## CSS Selectors

Each `scroller` carries `data-aardvark-island="Box"` on its wrapper; it renders a single element with no Mantine Styles API parts, so target the island wrapper.

{% raw %}
```css
[data-aardvark-island="Box"] {
  /* style every scroller on the page */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% scroller h='140' p='sm' bg='var(--mantine-color-gray-light)' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Lots of content to scroll through.
{% endScroller %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% scroller h='140' p='sm' bg='var(--mantine-color-gray-light)' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Lots of content to scroll through.
{% endScroller %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'scroller',
          h='140', p='sm', bg='var(--mantine-color-gray-light)',
          children='Lots of content to scroll through.',
          attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
