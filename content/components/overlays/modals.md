---
title: "Modals manager"
description: "A live demo of @mantine/modals — the imperative modal manager you call from
  JavaScript (modals.openConfirmModal / open) instead of placing a dialog in the markup.
  Behavior, syntax, CSS selectors, and attribute injection."
---

# Modals manager

`@mantine/modals` is an **imperative modal manager**: instead of placing a dialog in
the page, you call a function — `modals.openConfirmModal()`, `modals.open()`,
`modals.openContextModal()` — from an event handler, and the manager mounts, stacks,
and tears down the dialog for you. A single `<ModalsProvider>` near the root owns the
open-modal state and renders each dialog into a portal; closing one (via its action,
the close button, the backdrop, or Escape) pops it off the stack. Because that whole
surface lives at runtime — a function you call, not a static element — there is no
single tag that captures it. So this page demonstrates it with a small, self-contained
island: a button that opens a confirm dialog through the manager.

The `{% raw %}{% ModalsDemo %}{% endraw %}` tag below comes from
`snippets/ModalsDemo.jsx`, which wraps a Mantine `Button` in `<ModalsProvider>` and, on
click, calls `modals.openConfirmModal({ title, children, labels })`. Defining the snippet
is what makes it addressable as a tag; see the
[component libraries](/components/extras/component-libraries/) guide for the broader
snippet-to-tag mechanism.

## Demonstration

Click the button to open a confirm dialog. It has a title, a body, and the two labelled
action buttons (`OK` / `Cancel`); dismiss it from either button, the backdrop, or Escape.

{% ModalsDemo %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% ModalsDemo %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: snippet" %}
{% raw %}
```jsx
import { forwardRef } from 'react';
import { Button } from '@mantine/core';
import { ModalsProvider, modals } from '@mantine/modals';

const ModalsDemo = forwardRef(function ModalsDemo(props, ref) {
  return (
    <ModalsProvider>
      <Button
        ref={ref}
        {...props}
        onClick={() =>
          modals.openConfirmModal({
            title: 'Confirm',
            children: 'Proceed?',
            labels: { confirm: 'OK', cancel: 'Cancel' },
          })
        }
      >
        Open confirm dialog
      </Button>
    </ModalsProvider>
  );
});

export default ModalsDemo;
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## ModalsProvider and modals.openConfirmModal

Two pieces make the manager work:

- **`ModalsProvider`** is the host. Mount it once around the part of the tree that opens
  dialogs (in the demo, around the trigger button); it holds the open-modal state and
  portals each dialog above the page. Nothing renders until you ask it to, so the page
  loads with no panel over the content.
- **`modals.openConfirmModal(payload)`** pushes a ready-made confirm dialog onto the
  manager and returns its id. The payload's `title` and `children` fill the header and
  body, and `labels: { confirm, cancel }` names the two action buttons; pass
  `onConfirm` / `onCancel` handlers to react to the choice. Sibling calls — `modals.open()`
  for an arbitrary body, `modals.openContextModal()` for a pre-registered modal, and
  `modals.closeAll()` — drive the same manager.

Because these are runtime calls rather than props, they live in the snippet's JavaScript,
not in the Markdown — the tag just renders the wired-up trigger.

## CSS Selectors

The island's mount point carries `data-aardvark-island="ModalsDemo"`, so you can target
the trigger (and anything the snippet renders at its root) without touching the snippet:

{% raw %}
```css
/* The demo's mount point — the trigger button lives here */
[data-aardvark-island="ModalsDemo"] {
  display: inline-block;
}
```
{% endraw %}

The dialog itself is rendered by the manager into a portal, so its Mantine parts are
addressable by their standard Styles-API class names — but only **once a modal is open**
(the portal is empty until then):

{% raw %}
```css
/* Present only while a dialog is open */
.mantine-Modal-root {
  z-index: 1000;
}

.mantine-Modal-content {
  border-radius: var(--mantine-radius-md);
}
```
{% endraw %}

## Injecting Attributes

The snippet forwards its `ref` to the trigger button, so an `attr={...}` map lands as raw
DOM attributes on that button (the `attr` channel applies them through the forwarded ref,
separate from React props). Use it to attach an inline handler or any HTML attribute the
React prop surface doesn't cover:

(`ModalsDemo` is a custom snippet wrapping the modals **manager** — not one of the built-in
overlay tags — so it keeps `attr` on its trigger button. The built-in
[{% raw %}`{% modal %}`{% endraw %}](/components/overlays/modal/) tag, by contrast, now attaches
`attr` to the opened overlay.)

The live result — clicking it both runs the injected `onclick` and opens the dialog:

{% ModalsDemo attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% ModalsDemo attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('ModalsDemo', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
