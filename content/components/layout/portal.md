---
title: "Portal"
description: "The built-in portal tag — a low-level render-target primitive that renders its content into a different part of the DOM (e.g. document.body) to escape overflow and stacking contexts."
---

# Portal

`portal` is a low-level **render-target primitive**: it renders its children into a *different*
part of the DOM — by default the end of `document.body` — instead of where the tag sits in the
page. That lets overlays, popovers, and tooltips escape a parent's `overflow: hidden` or its
stacking context (`z-index`) so they're never clipped. It has no visual styling of its own, so
on a static docs page the portalled content simply appears at the bottom of the page rather than
inline — that's the primitive working as intended, not a bug. You'll mostly meet it indirectly,
inside Modal, Drawer, and Tooltip.

Use it as `{% raw %}{% portal %}{% endraw %}` in Markdown, or call it from Python logic (loops,
snippets) via `component('aardvark', 'portal', …)`.

## Demonstrations

The block body is the content that gets portalled out. By default it mounts at the end of
`document.body`, so on this page it renders below the normal content flow rather than at this
exact spot.

**Preview** (the portalled text appears at the bottom of the page, not here):

{% portal %}
This paragraph was portalled into document.body by the Portal docs page.
{% endPortal %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% portal %}
This paragraph is rendered into document.body, not here inline.
{% endPortal %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'portal',
          children='This paragraph is rendered into document.body, not here inline.')
```
{% endAccordionSection %}
{% endAccordion %}

### Targeting a specific node

Pass `target` (a CSS selector or element id) to mount into a specific element instead of
`document.body`. This is the same mechanism Mantine's overlay components use under the hood;
reach for the tag directly only when you're building a custom overlay yourself.

**Preview** — the body mounts into `#my-overlay-root` if that element exists, otherwise into
`document.body`:

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% portal target='#my-overlay-root' %}
…content rendered into #my-overlay-root…
{% endPortal %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'portal',
          target='#my-overlay-root',
          children='…content rendered into #my-overlay-root…')
```
{% endAccordionSection %}
{% endAccordion %}

### Reusing a single target node

Set `reuseTargetNode=true` so many portals share one generated target node instead of each
creating its own — handy when you portal a lot of small fragments and don't want a node per
portal.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% portal reuseTargetNode=true %}
…content sharing a single reused target node…
{% endPortal %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'portal',
          reuseTargetNode=True,
          children='…content sharing a single reused target node…')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Portal is most useful wrapping content that must escape a clipped container. Here a
[Paper](/components/layout/paper/) surface is portalled to `document.body` so it can't be cut
off by an ancestor's `overflow: hidden`.

**Preview** (the Paper renders at the bottom of the page):

{% portal %}
{% paper withBorder=true p='md' radius='md' %}This Paper was portalled to document.body so it escapes any clipping ancestor.{% endPaper %}
{% endPortal %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% portal %}
{% paper withBorder=true p='md' radius='md' %}This Paper was portalled to document.body so it escapes any clipping ancestor.{% endPaper %}
{% endPortal %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'portal',
          children=component('aardvark', 'paper',
                             withBorder=True, p='md', radius='md',
                             children='This Paper was portalled to document.body.'))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default. Bare flags (e.g. `reuseTargetNode`) become `=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `target` | A CSS selector or element id (string) | The element to render *into*, instead of `document.body`. |
| `reuseTargetNode` | `true` / `false` (default `false`) | Reuse a single shared target node across portals, rather than creating one per portal. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |


## CSS Selectors

Each `portal` carries `data-aardvark-island="Portal"` on its wrapper; it renders its content into `document.body` with no wrapper element, so target the island wrapper.

{% raw %}
```css
[data-aardvark-island="Portal"] {
  /* style every portal on the page */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% portal attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
This paragraph is portalled into document.body.
{% endPortal %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% portal attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
This paragraph is portalled into document.body.
{% endPortal %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'portal',
          children='This paragraph is portalled into document.body.',
          attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
