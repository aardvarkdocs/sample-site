---
title: "Notifications"
description: "Notifications — a runtime toast system you trigger from JavaScript. Mount the portal once, then call notifications.show(...) to pop a titled message into a viewport corner."
---

# Notifications

A **notifications** (toast) system you trigger from JavaScript. You mount the
portal once, anywhere on the page; from then on any code — a click handler, a
finished fetch, a form submit — can call `notifications.show({...})` to pop a
titled message into the corner of the viewport, where it auto-dismisses. There's
no component to render at the call site and no state to thread through your tree:
the call *is* the API.

Because that's a runtime call rather than static markup, this site represents it
with a small live demo snippet, `snippets/NotificationsDemo.jsx`, used as the
`{% raw %}{% NotificationsDemo %}{% endraw %}` tag. The snippet mounts
`<Notifications />` (the portal) and a button whose click fires a toast.

{% raw %}
```aardvark
{% NotificationsDemo %}
```
{% endraw %}

Click the button to show a notification:

{% NotificationsDemo %}

Under the hood the snippet does two things — mount the portal once, then call
`notifications.show(...)` from the button's click handler:

```jsx
import { Notifications, notifications } from '@mantine/notifications';

// once, anywhere on the page:
<Notifications />

// from any handler:
notifications.show({ title: 'Saved', message: 'Your changes were saved', color: 'teal' });
```

`notifications.show` takes a `title`, a `message`, a `color`, and more (an
`autoClose` timeout, an `icon`, a `loading` state, a `position`); the matching
`notifications.hide`, `.update`, and `.clean` manage toasts after they're shown.

## CSS Selectors

The demo mounts as a flat island, so the trigger and its wrapper carry the
island marker. Target it with the `data-aardvark-island` attribute:

{% raw %}
```css
/* The whole demo island (the trigger button + the mounted portal) */
[data-aardvark-island="NotificationsDemo"] {
  /* e.g. space it from surrounding prose */
  margin-block: 0.5rem;
}
```
{% endraw %}

The toasts themselves are rendered by Mantine into a fixed-position portal, so
they live **outside** the island in the DOM. Style them with Mantine's static
notification classes — the portal container and each individual notification:

{% raw %}
```css
/* The portal that holds the stack of toasts */
.mantine-Notifications-root {
  /* e.g. widen the toast column */
  width: 360px;
}

/* A single toast (title, message, accent line, close button) */
.mantine-Notification-root {
  /* e.g. add a subtle shadow */
  box-shadow: var(--mantine-shadow-lg);
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight
onto the demo's **trigger element** (the button a reader clicks). Use it to add
an `id`, a `data-*` hook, or a one-off inline handler without writing any JSX.
Author-supplied attributes are written after React commits, so they win over
React's own attribute writes.

The button below carries that extra `onclick`. Because the toast handler stays
attached too, clicking it both shows the notification and runs your handler:

{% NotificationsDemo attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% NotificationsDemo attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('NotificationsDemo', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
