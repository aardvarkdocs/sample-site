---
title: "FocusTrap"
description: "The built-in focustrap tag — a low-level behavior primitive that keeps keyboard focus inside a region (the focus management behind modals and drawers)."
---

# FocusTrap

`focustrap` is a **focus-management behavior primitive**. While it's `active`, it traps keyboard focus inside its content: <kbd>Tab</kbd> and <kbd>Shift</kbd>+<kbd>Tab</kbd> cycle through the focusable elements *within* the region instead of leaving it. It's the focus behavior that powers modals and drawers, so a keyboard user can't tab "behind" an open dialog. It renders **no markup of its own** — it attaches keyboard handling to its single child — so there's nothing to *see*; the effect is only observable by tabbing. On a static docs page it has no visible effect; it's documented here for completeness and for when you build a custom overlay.

Use it as `{% raw %}{% focustrap %}{% endraw %}` in Markdown, or call it from Python logic (loops, snippets) via `component('aardvark', 'focustrap', …)`. Close the block with `{% raw %}{% endFocustrap %}{% endraw %}` (one capital F).

## Demonstrations

Wrap a region whose focusable elements should be trapped; the block body is that region. The example below uses `active=false` so it doesn't capture *your* page's keyboard focus while you read — in a real modal the trap is mounted on open, with `active` left at its default `true`:

{% focustrap active=false %}
<div style="display:flex; gap:0.5rem; align-items:center;"><input placeholder="first" /><button>second</button><a href="#">third</a></div>
{% endFocustrap %}

While the trap is active, tabbing cycles among just those three controls.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% focustrap %}
<div>
  <input placeholder="first" />
  <button>second</button>
  <a href="#">third</a>
</div>
{% endFocustrap %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
region = (
    '<div>'
    '<input placeholder="first" />'
    '<button>second</button>'
    '<a href="#">third</a>'
    '</div>'
)
component('aardvark', 'focustrap', children=region)
```
{% endAccordionSection %}
{% endAccordion %}

Set `active=false` to disable the trap without removing it — useful when a parent owns the open/closed state and only wants focus captured some of the time:

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% focustrap active=false %}
<div>
  <input placeholder="first" />
  <button>second</button>
</div>
{% endFocustrap %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'focustrap',
    active=False,
    children='<div><input placeholder="first" /><button>second</button></div>',
)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

A trap wraps the focusable region of a custom overlay you build — for example the body of a `paper` panel acting as a dialog. Here `active=false` again, so reading the page isn't disrupted:

{% paper withBorder=true shadow='md' radius='md' p='lg' %}
{% focustrap active=false %}
<div style="display:flex; gap:0.5rem; align-items:center;"><input placeholder="email" /><button>Subscribe</button></div>
{% endFocustrap %}
{% endPaper %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% paper withBorder=true shadow='md' radius='md' p='lg' %}
{% focustrap %}
<div style="display:flex; gap:0.5rem; align-items:center;"><input placeholder="email" /><button>Subscribe</button></div>
{% endFocustrap %}
{% endPaper %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
form = component(
    'aardvark', 'focustrap',
    children='<div style="display:flex; gap:0.5rem; align-items:center;">'
             '<input placeholder="email" /><button>Subscribe</button></div>',
)
component('aardvark', 'paper', withBorder=True, shadow='md', radius='md', p='lg',
          children=form)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `active` | bare flag or `true` / `false` (default `true`) | Whether the trap is engaged. Set `active=false` to disable it without removing it. |

`attr={...}` forwards raw HTML attributes onto the rendered element.

## CSS Selectors

Target a `{% focustrap %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every FocusTrap instance on the page */
[data-aardvark-island="FocusTrap"] { }

/* FocusTrap is a behavior wrapper — it renders no .mantine-FocusTrap-* parts,
   forwarding its markup through unchanged. Style its data attribute instead. */
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element.

{% focustrap active=false attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}{% textinput label='First' %}{% endFocustrap %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% focustrap active=false attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}{% textinput label='First' %}{% endFocustrap %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'focustrap', active=False,
          children=component('aardvark', 'textinput', label='First'),
          attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
