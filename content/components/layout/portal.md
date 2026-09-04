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
This paragraph was portalled into document.body by the Portal docs page.
{% endPortal %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'portal',
          children='This paragraph was portalled into document.body by the Portal docs page.')
```
{% endAccordionSection %}
{% endAccordion %}

### Targeting a specific node

Pass `target` (a CSS selector) to mount into a specific element instead of `document.body`. This is
the same mechanism Mantine's overlay components use under the hood; reach for the tag directly only
when you're building a custom overlay yourself.

**Preview** — the dashed box below is an ordinary element written earlier in this page, and the
portal that follows it renders *into* it:

<div id="portal-demo-target" style="border: 1px dashed var(--mantine-color-default-border); border-radius: 8px; padding: 1rem; min-height: 3.5rem;"></div>

{% portal target='#portal-demo-target' %}
This paragraph was written further down the page and portalled into the dashed box.
{% endPortal %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
<div id="portal-demo-target" style="border: 1px dashed var(--mantine-color-default-border); border-radius: 8px; padding: 1rem; min-height: 3.5rem;"></div>

{% portal target='#portal-demo-target' %}
This paragraph was written further down the page and portalled into the dashed box.
{% endPortal %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'portal',
          target='#portal-demo-target',
          children='This paragraph was written further down the page '
                   'and portalled into the dashed box.')
```
{% endAccordionSection %}
{% endAccordion %}

The selector has to match an element that is already on the page when the portal mounts. A `target`
that matches nothing does **not** fall back to `document.body` — the content is rendered into a
detached node and never appears, with no error to tell you so.

### One shared node, or one node each

Portals without a `target` share a single generated node at the end of `document.body`, so
portalling a hundred small fragments adds one element rather than a hundred. That is the default.

Set `reuseTargetNode=false` when a portal needs a container of its own — for instance when you
style or measure the node itself, and a neighbouring portal's content sharing it would get in the
way. Each such portal appends its own node on mount and removes it again when it unmounts.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% portal reuseTargetNode=false %}
…content that gets a target node of its own…
{% endPortal %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'portal',
          reuseTargetNode=False,
          children='…content that gets a target node of its own…')
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
                             children='This Paper was portalled to document.body '
                                      'so it escapes any clipping ancestor.'))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `target` | A CSS selector (string) | The element to render *into*, instead of `document.body`. It must already exist on the page. |
| `reuseTargetNode` | `true` (default) / `false` | Share one generated target node with the page's other portals. Set `false` to give this portal a node of its own. Ignored when `target` is set. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

### Good to know

- The portalled content is placed by the page's JavaScript, so it is absent from the page a reader
  sees before scripts run. Keep anything essential outside a portal. The plain-Markdown and PDF
  renderings are unaffected: both unwrap the portal and keep its content inline, where the tag sits.
- The tag leaves an empty placeholder where it sits and the content moves elsewhere, so it does not
  hold space in the page flow. Without a `target`, the content lands at the very end of the
  document — below the footer — which is why the demos above ask you to look at the bottom of the
  page.
- `reuseTargetNode` only applies when there is no `target`: with a `target` the content goes into
  that element and no node is generated at all.


## CSS Selectors

Each `portal` carries `data-aardvark-island="Portal"` where the tag sits, but that element is left
empty — styling it will not reach the content, which has moved. Style the node the content lands
in instead: a generated node carries `data-portal`, and the node shared between portals also
carries `data-mantine-shared-portal-node`. With a `target`, the content is inside the element you
named, so style that.

{% raw %}
```css
/* The placeholder the tag leaves behind — empty, so there is nothing here to style. */
[data-aardvark-island="Portal"] {
}

/* Every generated target node, wherever its content came from. */
[data-portal] {
  position: relative;
  z-index: 400;
}

/* Just the one node the page's portals share. */
[data-mantine-shared-portal-node] {
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) onto the element the content is
rendered *into* — the target node, not the empty placeholder where the tag sits. The default shared
node is therefore the wrong place to put them: every portal on the page renders into that one node,
so a handler left there answers for all of their content, and a `target` would hang your attributes
on an element the page already owns. Give the portal a node of its own with `reuseTargetNode=false`
and the attributes belong to it alone.

{% portal reuseTargetNode=false attr={'onclick': '''
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
{% portal reuseTargetNode=false attr={'onclick': '''
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
          reuseTargetNode=False,
          children='This paragraph is portalled into document.body.',
          attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
