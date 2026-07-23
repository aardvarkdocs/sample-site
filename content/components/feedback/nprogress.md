---
title: "Navigation progress"
description: "A thin progress bar pinned to the very top of the page that you drive from JavaScript — start it, finish it, or set it to any value. Behavior, syntax, and a live demo."
---

# Navigation progress

A **navigation progress bar** is the thin line pinned to the very top of the page — the one
that trickles forward while a route loads and snaps to full when it arrives. Unlike most
components there's nothing static to drop into your prose: the bar is mounted once, then *driven
from JavaScript*. You `start()` it, `complete()` it, or `set()` it to any value between 0 and 100,
and it animates the rest.

The demo below ships as a project snippet (`snippets/NProgressDemo.jsx`) so you have something live
to click. It mounts the bar and wires three buttons to the API: **Run** starts the trickle and
finishes it after a beat (the way a page navigation looks), while **Start** and **Finish** expose
the two ends on their own. Click any of them and watch the line at the very top of this page.

{% NProgressDemo %}

Because the snippet is a project component, it's available as a tag with no setup:

{% raw %}
```aardvark
{% NProgressDemo %}
```
{% endraw %}

## How it works

The bar is a single `<NavigationProgress />` element — mount it once (the snippet does this for the
page), and from then on you move it with the imperative `nprogress` helpers rather than props:

- `nprogress.start()` — begin trickling toward the top edge (it eases forward but never reaches 100% on its own).
- `nprogress.complete()` — fill to 100% and fade out.
- `nprogress.set(value)` — jump to an exact percentage (0–100), e.g. tie it to upload progress.
- `nprogress.increment()` / `nprogress.decrement()` — nudge it by a step.
- `nprogress.reset()` — clear it back to the start with no animation.

That split — one mounted bar, an imperative API to drive it — is what makes it a snippet rather
than a one-shot tag: a static `{% raw %}{% tag %}{% endraw %}` can't expose `onClick` handlers that call
`nprogress.start()`. The snippet owns both halves: it renders `<NavigationProgress />` and the
controls that drive it. Customize it (different triggers, tie it to a real fetch, restyle the
buttons) by editing `snippets/NProgressDemo.jsx`.

## CSS Selectors

Every snippet instance mounts inside a wrapper carrying its island name, so you can target the demo
without touching the rest of the page:

{% raw %}
```css
/* The mounted snippet wrapper (the controls live inside it). */
[data-aardvark-island="NProgressDemo"] {
  margin-block: 1rem;
}
```
{% endraw %}

The bar itself is a Mantine `Progress`, so it carries that component's stable Styles API parts —
target the track with `.mantine-Progress-root` and the moving fill with `.mantine-Progress-section`:

{% raw %}
```css
/* Recolor the moving fill of the top-of-page bar. */
.mantine-Progress-section {
  background-color: var(--mantine-color-pink-6);
}
```
{% endraw %}

The bar's *own* layout (its fixed position at the top, the trailing glow) comes from
`@mantine/nprogress`'s stylesheet, which is hashed at build time (e.g. `.m_8f2832ae` for the bar
root). Those hashes change between Mantine releases, so prefer the stable `.mantine-Progress-*`
parts above when you restyle it.

## Injecting Attributes

`attr={...}` forwards raw HTML attributes straight onto the snippet's trigger — here the **Run**
button, which is where the snippet forwards its ref. Use it to attach an inline handler, a
`data-*` hook, or any attribute the component doesn't expose as a prop:

The live result — click **Run** to fire the injected `onclick` (it alerts the button's label)
*and* run the progress bar:

{% NProgressDemo attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% NProgressDemo attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('NProgressDemo', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

Attributes go on through a separate channel from React props, so they're written verbatim to the
DOM node and never collide with what Mantine manages. Avoid `class`/`style` there (the framework
owns those) — reach for the component's own props instead.
