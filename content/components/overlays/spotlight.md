---
title: "Spotlight"
description: "A Cmd+K-style command palette you open from JavaScript: a searchable
  overlay of actions, opened with spotlight.open(). Usage, the actions array, and a
  live example."
---

# Spotlight

A command palette — the Cmd+K overlay you see in editors and dashboards. It is a
searchable list of actions that floats over the page; you type to filter, arrow
through the matches, and press Enter to run one. It renders no visible chrome of its
own and starts closed, so it never covers the page on load. You open it imperatively
from JavaScript with `spotlight.open()` — wired here to a trigger button — or with its
registered keyboard shortcut.

Because the open call is imperative rather than a static prop, this page ships it as a
small self-contained snippet, `{% raw %}{% SpotlightDemo %}{% endraw %}`, that renders
the palette plus a button whose click calls `spotlight.open()`.

## Demonstrations

Click the button to open the palette, then type to filter the actions, arrow to a
match, and press Enter (or click) to run it. Escape closes it.

{% SpotlightDemo %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% SpotlightDemo %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## The actions array and spotlight.open()

The palette is driven by an **actions array** — the searchable command list. Each entry
is an object with an `id`, a `label`, an optional `description`, and an `onClick`
handler that runs when the action is triggered:

```jsx
const actions = [
  { id: 'home', label: 'Home', description: 'Go to the home page',
    onClick: () => { /* navigate, run a command, … */ } },
  { id: 'search', label: 'Search the site', keywords: ['find', 'lookup'],
    onClick: () => { /* … */ } },
];
```

The default filter matches the query against each action's `label`, `description`, and
`keywords`. Triggering an action runs its `onClick` and closes the palette.

Opening is imperative: any code can call `spotlight.open()` (and `spotlight.close()` /
`spotlight.toggle()`). Here the trigger button does it on click:

```jsx
import { Spotlight, spotlight } from '@mantine/spotlight';
import { Button } from '@mantine/core';

<>
  <Spotlight actions={actions} nothingFound="Nothing found…" />
  <Button onClick={spotlight.open}>Open command palette</Button>
</>
```

The full snippet lives at `snippets/SpotlightDemo.jsx`; because it sits in
`snippets/`, it is automatically invocable as `{% raw %}{% SpotlightDemo %}{% endraw %}`.

## CSS Selectors

The snippet mounts as an island whose wrapper carries
`data-aardvark-island="SpotlightDemo"`, so you can target the rendered demo as a whole:

{% raw %}
```css
/* The whole SpotlightDemo island (trigger button + the palette portal) */
[data-aardvark-island="SpotlightDemo"] {
  display: inline-block;
}
```
{% endraw %}

The palette itself renders into a portal at the end of `<body>`, outside the island
wrapper, and uses Mantine's per-part static classes. The two you reach for most are the
palette root and its search input:

{% raw %}
```css
/* The palette overlay's root element */
.mantine-Spotlight-root {
  border-radius: 12px;
}

/* The search input at the top of the palette */
.mantine-Spotlight-search {
  font-size: 1rem;
}
```
{% endraw %}

## Injecting Attributes

The snippet forwards its `ref` to the trigger button, so an `attr={…}` map lands on
that button's DOM node — the same raw-attribute channel the built-in button uses for
`onclick`. Pass any HTML attribute (including inline event handlers):

Here is that live — clicking the button both opens the palette and runs the injected
`onclick`:

{% SpotlightDemo attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% SpotlightDemo attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('SpotlightDemo', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
