---
title: "ScrollArea"
description: "The built-in scrollarea tag — a scrollable region with styled, auto-hiding overlay scrollbars. Usage, options, and live examples."
---

# ScrollArea

`scrollarea` is a **scrollable region** with styled, auto-hiding overlay scrollbars — nicer than
the browser's default bars, and consistent across macOS, Windows, and Linux. Give it a fixed
height with `h` (and/or width with `w`) so its content can overflow and scroll. Use `type` to
control when the bars appear and `offsetScrollbars` to inset the content so the bars never
overlap it. Close the block with `{% raw %}{% endScrollarea %}{% endraw %}` (one capital S).

Use it as `{% raw %}{% scrollarea %}…{% endScrollarea %}{% endraw %}` in Markdown, or call it
from Python logic (loops, snippets) via `component('aardvark', 'scrollarea', …)`.

## Demonstrations

Constrain the height with `h`; the block body is the (overflowing) content. `type='always'`
keeps the styled bar visible.

**Preview:**

{% scrollarea h='160' type='always' %}
A tall block of content that overflows the 160px-tall area and scrolls.

Mantine's ScrollArea draws its own overlay scrollbar instead of the browser's, so it looks the
same on macOS, Windows, and Linux.

Keep scrolling — there's more here than fits in 160 pixels of height, which is the whole point
of constraining the area and letting the body overflow.

The bar tracks your position and (with `type='hover'`) fades out when you're not interacting.
{% endScrollarea %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% scrollarea h='160' type='always' %}
A tall block of content that overflows the 160px-tall area and scrolls.
Add enough paragraphs here and the styled scrollbar appears on the right.
{% endScrollarea %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'scrollarea',
          h='160', type='always',
          children='A tall block of content that overflows the area and scrolls.')
```
{% endAccordionSection %}
{% endAccordion %}

### Scrollbar visibility and offset

`type` controls when the bars appear — `always` keeps them visible, `hover` (the default) shows
them only while you interact, `scroll` shows them while you scroll, and `auto` shows them only
when content actually overflows. `offsetScrollbars=true` insets the content so the bar never
overlaps it; `scrollbarSize` sets the bar thickness in px.

**Preview** — `type='auto'`, so the bar appears only because this content overflows:

{% scrollarea h='120' type='auto' offsetScrollbars=true scrollbarSize=10 %}
With `offsetScrollbars`, the content is inset so the bar never overlaps it.

This area uses `type='auto'`, so the scrollbar appears only because the content here is taller
than 120 pixels — remove a few lines and the bar would disappear.
{% endScrollarea %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% scrollarea h='120' type='auto' offsetScrollbars=true scrollbarSize=10 %}
With offsetScrollbars, the content is inset so the bar never overlaps it.
{% endScrollarea %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'scrollarea',
          h='120', type='auto', offsetScrollbars=True, scrollbarSize=10,
          children='With offsetScrollbars, the content is inset so the bar never overlaps it.')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Wrap a tall stack of [Paper](/components/layout/paper/) surfaces in a `scrollarea` to keep a long
list within a fixed-height panel while the rest of the page stays put.

**Preview:**

{% scrollarea h='140' type='always' p='xs' %}
{% paper withBorder=true p='sm' radius='sm' mb='xs' %}First item{% endPaper %}
{% paper withBorder=true p='sm' radius='sm' mb='xs' %}Second item{% endPaper %}
{% paper withBorder=true p='sm' radius='sm' mb='xs' %}Third item{% endPaper %}
{% paper withBorder=true p='sm' radius='sm' mb='xs' %}Fourth item{% endPaper %}
{% paper withBorder=true p='sm' radius='sm' %}Fifth item — scroll to see the rest{% endPaper %}
{% endScrollarea %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% scrollarea h='140' type='always' p='xs' %}
{% paper withBorder=true p='sm' radius='sm' mb='xs' %}First item{% endPaper %}
{% paper withBorder=true p='sm' radius='sm' %}…more items…{% endPaper %}
{% endScrollarea %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
items = ''.join(
    component('aardvark', 'paper', withBorder=True, p='sm', radius='sm', mb='xs',
              children=f'Item {i}')
    for i in range(1, 6)
)
component('aardvark', 'scrollarea', h='140', type='always', p='xs', children=items)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default. Bare flags (e.g. `offsetScrollbars`) become `=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `type` | `hover` (default) / `scroll` / `always` / `auto` / `never` | When the scrollbars are shown. |
| `scrollbarSize` | An integer (px) | Scrollbar thickness. |
| `scrollHideDelay` | An integer (ms) | Delay before the bars hide (with `type='hover'` / `scroll`). |
| `offsetScrollbars` | `true` / `false` (default `false`) | Inset the content so the bars don't overlap it. |
| `h` / `w` | A size token or CSS length | Height / width of the viewport — give it an `h` so the content can overflow. |
| `miw` / `mih` / `maw` / `mah` | A size token or CSS length | Min/max width and height. |
| `m` / `mt` / `mb` / `ml` / `mr` / `mx` / `my` | A Mantine size token or CSS length | Margin (all / top / bottom / left / right / horizontal / vertical). |
| `p` / `pt` / `pb` / `pl` / `pr` / `px` / `py` | A Mantine size token or CSS length | Padding (all / top / bottom / left / right / horizontal / vertical). |
| `bg` | A theme color or CSS color | Background color. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |


## CSS Selectors

Each `scrollarea` carries `data-aardvark-island="ScrollArea"` on its wrapper, and Mantine exposes its parts as `mantine-ScrollArea-*` classes — target either to style it from your theme CSS.

{% raw %}
```css
[data-aardvark-island="ScrollArea"] {
  /* style every scrollarea on the page */
}

.mantine-ScrollArea-root {
  /* the root part */
}

.mantine-ScrollArea-viewport {
  /* the viewport part */
}

.mantine-ScrollArea-scrollbar {
  /* the scrollbar part */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% scrollarea h='160' type='always' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Lots of content to scroll through.
{% endScrollarea %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% scrollarea h='160' type='always' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Lots of content to scroll through.
{% endScrollarea %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'scrollarea',
          h='160', type='always',
          children='Lots of content to scroll through.',
          attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
