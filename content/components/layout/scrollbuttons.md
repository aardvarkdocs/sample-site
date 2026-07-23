---
title: "Scroll Buttons"
description: "The built-in scrollbuttons tag — a horizontal scroller with prev/next chevron buttons for paging a wide row of content. Usage, options, and live examples."
---

# Scroll Buttons

`scrollbuttons` is a **horizontal scroller with prev/next buttons**. The block body is a wide row of content that scrolls sideways, and chevron controls fade in at each edge so a reader can page through it a screenful at a time. The controls only show when there is more content to reach in that direction, and the row can also be dragged with the pointer. It is the right tool for a strip of cards, a row of images, or any rail too wide for the page.

This is a different widget from `scroller`, which is a plain native-overflow box with the browser's own scrollbars — `scrollbuttons` adds the paging chevron controls.

Use it as `{% raw %}{% scrollbuttons %}{% endraw %}` in Markdown, or call it from Python logic (loops, snippets) via `component('aardvark', 'scrollbuttons', …)`.

## Demonstrations

The block body is the scrolling row; give the children enough width to overflow so the controls have something to page to. `scrollAmount` sets how many pixels each chevron click moves:

{% scrollbuttons scrollAmount=240 %}
{% group wrap='nowrap' gap='md' %}
{% paper withBorder=true radius='md' p='lg' w='200' %}First card{% endPaper %}
{% paper withBorder=true radius='md' p='lg' w='200' %}Second card{% endPaper %}
{% paper withBorder=true radius='md' p='lg' w='200' %}Third card{% endPaper %}
{% paper withBorder=true radius='md' p='lg' w='200' %}Fourth card{% endPaper %}
{% paper withBorder=true radius='md' p='lg' w='200' %}Fifth card{% endPaper %}
{% paper withBorder=true radius='md' p='lg' w='200' %}Sixth card{% endPaper %}
{% endGroup %}
{% endScrollbuttons %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% scrollbuttons scrollAmount=240 %}
{% group wrap='nowrap' gap='md' %}
{% paper withBorder=true radius='md' p='lg' w='200' %}First card{% endPaper %}
{% paper withBorder=true radius='md' p='lg' w='200' %}Second card{% endPaper %}
{% paper withBorder=true radius='md' p='lg' w='200' %}Third card{% endPaper %}
{% paper withBorder=true radius='md' p='lg' w='200' %}Fourth card{% endPaper %}
{% paper withBorder=true radius='md' p='lg' w='200' %}Fifth card{% endPaper %}
{% paper withBorder=true radius='md' p='lg' w='200' %}Sixth card{% endPaper %}
{% endGroup %}
{% endScrollbuttons %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
cards = ''.join(
    component('aardvark', 'paper', withBorder=True, radius='md', p='lg', w='200',
              children=label)
    for label in ('First card', 'Second card', 'Third card',
                  'Fourth card', 'Fifth card', 'Sixth card')
)
row = component('aardvark', 'group', wrap='nowrap', gap='md', children=cards)
component('aardvark', 'scrollbuttons', scrollAmount=240, children=row)
```
{% endAccordionSection %}
{% endAccordion %}

Pin both controls on with `showStartControl` / `showEndControl` (so they show even at the ends), and `controlSize` resizes the chevron buttons:

{% scrollbuttons showStartControl=true showEndControl=true controlSize='48' %}
{% group wrap='nowrap' gap='sm' %}
{% badge size='xl' color='blue' %}React{% endBadge %}
{% badge size='xl' color='grape' %}Mantine{% endBadge %}
{% badge size='xl' color='green' %}Markdown{% endBadge %}
{% badge size='xl' color='orange' %}Static{% endBadge %}
{% badge size='xl' color='red' %}Islands{% endBadge %}
{% badge size='xl' color='teal' %}Themes{% endBadge %}
{% badge size='xl' color='indigo' %}Search{% endBadge %}
{% badge size='xl' color='pink' %}Analytics{% endBadge %}
{% endGroup %}
{% endScrollbuttons %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% scrollbuttons showStartControl=true showEndControl=true controlSize='48' %}
{% group wrap='nowrap' gap='sm' %}
{% badge size='xl' color='blue' %}React{% endBadge %}
{% badge size='xl' color='grape' %}Mantine{% endBadge %}
{% badge size='xl' color='green' %}Markdown{% endBadge %}
{% badge size='xl' color='orange' %}Static{% endBadge %}
{% badge size='xl' color='red' %}Islands{% endBadge %}
{% badge size='xl' color='teal' %}Themes{% endBadge %}
{% badge size='xl' color='indigo' %}Search{% endBadge %}
{% badge size='xl' color='pink' %}Analytics{% endBadge %}
{% endGroup %}
{% endScrollbuttons %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
badges = ''.join(
    component('aardvark', 'badge', size='xl', color=c, children=label)
    for c, label in (('blue', 'React'), ('grape', 'Mantine'), ('green', 'Markdown'),
                     ('orange', 'Static'), ('red', 'Islands'), ('teal', 'Themes'),
                     ('indigo', 'Search'), ('pink', 'Analytics'))
)
row = component('aardvark', 'group', wrap='nowrap', gap='sm', children=badges)
component('aardvark', 'scrollbuttons',
          showStartControl=True, showEndControl=True, controlSize='48', children=row)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `scrollAmount` | An integer, pixels (default `200`) | How far each chevron click scrolls the row. |
| `controlSize` | A number or CSS length (default `60px`) | Size of the chevron control buttons. |
| `edgeGradientColor` | Any CSS color (default the page background) | Color of the fade behind the controls. |
| `draggable` | bare flag or `true` / `false` (default `true`) | Allow dragging the row with the pointer. Set `false` to disable. |
| `showStartControl` | `true` / `false` (default `false`) | Keep the start (left) control visible even at that end. |
| `showEndControl` | `true` / `false` (default `false`) | Keep the end (right) control visible even at that end. |

`attr={...}` forwards raw HTML attributes onto the rendered element.

## CSS Selectors

Each `scrollbuttons` mounts as an island, so its outer wrapper carries `data-aardvark-island="Scroller"` — a stable hook independent of Mantine's hashed class names. Inside, the native Scroller exposes its Styles API parts as `mantine-Scroller-*` classes: `root` is the component, `container` the clipping frame, `content` the scrolling track that holds the children, `control` each chevron button, and `chevron` the icon within a control.

{% raw %}
```css
/* The island wrapper — the most stable selector. */
[data-aardvark-island="Scroller"] {
  margin-block: 1rem;
}

/* Mantine Styles API parts. */
.mantine-Scroller-root {}
.mantine-Scroller-container {}
.mantine-Scroller-content {}      /* the scrolling track of children */
.mantine-Scroller-control {       /* the prev / next chevron buttons */
  background: var(--mantine-color-body);
}
.mantine-Scroller-chevron {}      /* the icon inside a control */
```
{% endraw %}

## Injecting Attributes

`attr={...}` passes raw HTML attributes straight onto the rendered element — handy for ids, data hooks, ARIA, or inline handlers the macro doesn't expose as named options. Pass a dictionary literal; every key/value lands verbatim on the element.

Below, an injected `onclick` reports the element's text content when the row is clicked:

{% scrollbuttons attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
{% group wrap='nowrap' gap='md' %}
{% paper withBorder=true radius='md' p='lg' w='200' %}Click anywhere on this row{% endPaper %}
{% paper withBorder=true radius='md' p='lg' w='200' %}to see its text content{% endPaper %}
{% paper withBorder=true radius='md' p='lg' w='200' %}via the injected handler{% endPaper %}
{% paper withBorder=true radius='md' p='lg' w='200' %}then keep scrolling{% endPaper %}
{% endGroup %}
{% endScrollbuttons %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% scrollbuttons attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
{% group wrap='nowrap' gap='md' %}
{% paper withBorder=true radius='md' p='lg' w='200' %}Click anywhere on this row{% endPaper %}
{% paper withBorder=true radius='md' p='lg' w='200' %}to see its text content{% endPaper %}
{% paper withBorder=true radius='md' p='lg' w='200' %}via the injected handler{% endPaper %}
{% paper withBorder=true radius='md' p='lg' w='200' %}then keep scrolling{% endPaper %}
{% endGroup %}
{% endScrollbuttons %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
cards = ''.join(
    component('aardvark', 'paper', withBorder=True, radius='md', p='lg', w='200',
              children=label)
    for label in ('Click anywhere on this row', 'to see its text content',
                  'via the injected handler', 'then keep scrolling')
)
row = component('aardvark', 'group', wrap='nowrap', gap='md', children=cards)
print(component('aardvark', 'scrollbuttons', children=row, attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''}))
```
{% endAccordionSection %}
{% endAccordion %}
