---
title: "FocusTrap"
description: "The built-in focustrap tag — a low-level behavior primitive that keeps keyboard focus inside a region (the focus management behind modals and drawers)."
---

# FocusTrap

`focustrap` is a **focus-management behavior primitive**. While it's `active`, it traps keyboard focus inside its content: <kbd>Tab</kbd> and <kbd>Shift</kbd>+<kbd>Tab</kbd> cycle through the focusable elements *within* the region instead of leaving it. It's the focus behavior that powers modals and drawers, so a keyboard user can't tab "behind" an open dialog.

It renders **no visual chrome of its own**. The trapped child supplies the panel, form, or overlay you want readers to see.

Use it as `{% raw %}{% focustrap %}{% endraw %}` in Markdown, or call it from Python logic (loops, snippets) via `component('aardvark', 'focustrap', …)`. Close the block with `{% raw %}{% endFocustrap %}{% endraw %}` (one capital F).

## Demonstrations

Activate the demo, then press <kbd>Tab</kbd>. Focus moves into the trap and cycles through the field and buttons until you release it. With the trap off, <kbd>Tab</kbd> can reach the outside control.

{% FocusTrapDemo %}

<br>

Wrap a region whose focusable elements should be trapped; the block body is that region. In a real modal, mount the trap only while the overlay is open, or pass an `active` value from a stateful island:

{% focustrap active=false %}
<div style="display:flex; gap:0.5rem; align-items:center; padding:0.75rem; border:1px solid var(--mantine-color-default-border); border-radius:var(--mantine-radius-sm);"><input placeholder="first" /><button>second</button><a href="#">third</a></div>
{% endFocustrap %}

Set `active=false` to keep the region rendered while the focus trap is disengaged.

<br>

{% accordion %}
{% accordionSection title="Source: Live demo" %}
{% raw %}
```aardvark
{% FocusTrapDemo %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% focustrap %}
<div style="display:flex; gap:0.5rem; align-items:center;">
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
    '<div style="display:flex; gap:0.5rem; align-items:center;">'
    '<input placeholder="first" />'
    '<button>second</button>'
    '<a href="#">third</a>'
    '</div>'
)
component('aardvark', 'focustrap', children=region)
```
{% endAccordionSection %}
{% endAccordion %}

Use `active=false` to disable the trap without removing it. This is useful when a parent owns the open/closed state and only wants focus captured some of the time:

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

A trap wraps the focusable region of a custom overlay you build — for example the body of a `paper` panel acting as a dialog. This rendered example is disengaged so it does not capture page focus while you read:

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

Target FocusTrap from your own CSS with the island data attribute. FocusTrap is a behavior wrapper, so it renders no Mantine part classes of its own:

{% raw %}
```css
/* Every FocusTrap instance on the page */
[data-aardvark-island="FocusTrap"] { }

/* FocusTrap is a behavior wrapper — it renders no .mantine-FocusTrap-* parts,
   forwarding its markup through unchanged. Style its data attribute instead. */
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — onto the trapped element. FocusTrap is not itself a value input, so this example makes a `nativeselect` the trapped child and attaches `onchange` to that input. Choose an option: the handler reads the selected value, writes it back into the demo, logs it, and alerts it.

<div data-focustrap-attr-demo style="display:grid; gap:0.5rem; padding:0.75rem; border:1px solid var(--mantine-color-default-border); border-radius:var(--mantine-radius-sm);">
{% focustrap active=false attr={'onchange': '''
const value = event.target.value || '';
const root = event.target.closest('[data-focustrap-attr-demo]');
const output = root ? root.querySelector('[data-focustrap-output]') : null;
if (output) output.textContent = value ? 'Last value: ' + value : 'No value entered';
console.log('focustrap attr value:', value);
alert(value);
'''} %}
{% nativeselect label='Framework' data='React|Vue|Svelte|Angular' %}
{% endFocustrap %}
<small data-focustrap-output>Choose an option.</small>
</div>

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
<div data-focustrap-attr-demo>
{% focustrap active=false attr={'onchange': '''
const value = event.target.value || '';
const root = event.target.closest('[data-focustrap-attr-demo]');
const output = root ? root.querySelector('[data-focustrap-output]') : null;
if (output) output.textContent = value ? 'Last value: ' + value : 'No value entered';
console.log('focustrap attr value:', value);
alert(value);
'''} %}
{% nativeselect label='Framework' data='React|Vue|Svelte|Angular' %}
{% endFocustrap %}
<small data-focustrap-output>Choose an option.</small>
</div>
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
handler = '''
const value = event.target.value || '';
const root = event.target.closest('[data-focustrap-attr-demo]');
const output = root ? root.querySelector('[data-focustrap-output]') : null;
if (output) output.textContent = value ? 'Last value: ' + value : 'No value entered';
console.log('focustrap attr value:', value);
alert(value);
'''

field = component(
    'aardvark', 'focustrap',
    active=False,
    children=component('aardvark', 'nativeselect',
                       label='Framework', data='React|Vue|Svelte|Angular'),
    attr={'onchange': handler},
)

page.print(
    '<div data-focustrap-attr-demo>'
    + field
    + '<small data-focustrap-output>Choose an option.</small>'
    + '</div>'
)
```
{% endAccordionSection %}
{% endAccordion %}
