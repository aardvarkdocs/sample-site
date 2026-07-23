---
title: "Popover"
description: "The built-in popover tag — a click-toggled floating panel anchored to a trigger button, with a full Markdown body. Usage, options, and live examples."
---

# Popover

A floating panel that toggles open when you **click** its trigger. `target` is the
trigger button's label; the block body is the panel content and is ordinary **Markdown** —
headings, lists, links, even nested tags. The panel toggles on click after the page
hydrates; pass `opened` to force it open for docs and screenshots.

Use it as `{% raw %}{% popover %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'popover', …)`.

## Demonstrations

### Basic

`target` is the button label; everything between the tags is the dropdown body. Click the
button to toggle it.

{% popover target='Account' position='bottom' shadow='md' withArrow=true %}
**Signed in as** aardvark

- [Profile](/)
- [Settings](/)
{% endPopover %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% popover target='Account' position='bottom' shadow='md' withArrow=true %}
**Signed in as** aardvark

- [Profile](/)
- [Settings](/)
{% endPopover %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'popover', target='Account', position='bottom',
          shadow='md', withArrow=True,
          children='**Signed in as** aardvark\n\n- [Profile](/)\n- [Settings](/)')
```
{% endAccordionSection %}
{% endAccordion %}

### Width, arrow, and trigger variant

`width='target'` makes the panel exactly as wide as its trigger; `withArrow` points at
the button; `targetVariant` restyles the trigger; and `arrowSize`, `offset`, and `radius`
tune the rest of the look.

{% popover target='More' width='target' withArrow=true arrowSize=8 offset=6 radius='md' position='bottom-start' targetVariant='light' %}
The panel matches the trigger's width.
{% endPopover %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% popover target='More' width='target' withArrow=true arrowSize=8 offset=6 radius='md' position='bottom-start' targetVariant='light' %}
The panel matches the trigger's width.
{% endPopover %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'popover', target='More', width='target',
          withArrow=True, arrowSize=8, offset=6, radius='md',
          position='bottom-start', targetVariant='light',
          children="The panel matches the trigger's width.")
```
{% endAccordionSection %}
{% endAccordion %}

### Focus and click-outside behavior

`trapFocus` keeps keyboard focus inside the panel (useful when it holds a form), and
`closeOnClickOutside=false` keeps the panel open when you click away.

{% popover target='Filter' trapFocus=true closeOnClickOutside=false shadow='md' width='240' %}
Keyboard focus is trapped here, and clicking outside won't dismiss it.
{% endPopover %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% popover target='Filter' trapFocus=true closeOnClickOutside=false shadow='md' width='240' %}
Keyboard focus is trapped here, and clicking outside won't dismiss it.
{% endPopover %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'popover', target='Filter', trapFocus=True,
          closeOnClickOutside=False, shadow='md', width='240',
          children="Keyboard focus is trapped here, and clicking outside "
                   "won't dismiss it.")
```
{% endAccordionSection %}
{% endAccordion %}

### Force it open

`opened=true` renders the dropdown open so you can see (and screenshot) its contents
without clicking:

{% popover target='Pinned' opened=true shadow='lg' width='260' %}
This panel is pinned open for the docs.
{% endPopover %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% popover target='Pinned' opened=true shadow='lg' width='260' %}
This panel is pinned open for the docs.
{% endPopover %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'popover', target='Pinned', opened=True,
          shadow='lg', width='260',
          children='This panel is pinned open for the docs.')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

The Markdown body can host other tags. Here the panel holds a
[Badge](/components/data-display/badge/) and a [Text](/components/typography/text/)
note, pinned open so you can see them:

{% popover target='Build' opened=true shadow='md' width='260' withArrow=true %}
{% badge color='green' variant='light' %}Passing{% endBadge %}

{% text size='sm' c='dimmed' %}Last run 3 minutes ago on `main`.{% endText %}
{% endPopover %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% popover target='Build' shadow='md' width='260' withArrow=true %}
{% badge color='green' variant='light' %}Passing{% endBadge %}

{% text size='sm' c='dimmed' %}Last run 3 minutes ago on `main`.{% endText %}
{% endPopover %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'popover', target='Build', shadow='md', width='260',
          withArrow=True,
          children=component('aardvark', 'badge', color='green',
                             variant='light', children='Passing')
                   + '\n\n'
                   + component('aardvark', 'text', size='sm', c='dimmed',
                               children='Last run 3 minutes ago on `main`.'))
```
{% endAccordionSection %}
{% endAccordion %}

## Popover vs. HoverCard vs. Menu

- **Popover** — a Markdown panel, on click (this tag).
- **[HoverCard](/components/overlays/hovercard/)** — a Markdown card, on hover.
- **[Menu](/components/overlays/menu/)** — a list of actions and links, on click.

## Attributes

Omit any attribute to take its Mantine default. The dropdown body is the block body (or,
from Python, `children`).

| Attribute | Valid values | Description |
| --- | --- | --- |
| `target` | string | The trigger button's label. Defaults to `Toggle`. |
| `position` | `bottom` (default), `top`, `left`, `right`, plus the `-start` / `-end` variants | Edge the dropdown anchors to. |
| `width` | integer (pixels), or `target` to match the trigger | Dropdown width. |
| `shadow` | `xs`–`xl` | Drop shadow on the dropdown. |
| `withArrow` | bare flag → `true` | Draw a pointer at the anchored edge. |
| `arrowSize` | integer (pixels) | Arrow size. |
| `offset` | integer (pixels) | Gap between the trigger and the dropdown. |
| `radius` | `xs`–`xl` or a number | Dropdown corner radius. |
| `trapFocus` | bare flag → `true` | Keep keyboard focus inside the dropdown while open. |
| `closeOnClickOutside` | `true` (default) / `false` | Close when clicking away. Set `false` to keep it open. |
| `targetVariant` | `filled`, `light`, `outline`, `subtle`, `default`, … | The trigger button's Mantine variant. |
| `opened` | bare flag → `true` | Force the dropdown open — handy for documentation and screenshots. |

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="Popover"]`, or through the Mantine Styles API classes. The dropdown mounts into a portal and its parts exist only while the popover is shown. The relevant classes:

{% raw %}
```css
/* Every rendered Popover carries this island marker */
[data-aardvark-island="Popover"] { }

/* Mantine Styles API classes */
.mantine-Popover-dropdown { }
.mantine-Popover-arrow { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — onto the rendered dropdown. Click **Account** to open the popover, then click inside it: the injected `onclick` reads the dropdown's text and alerts it.

{% popover target='Account' position='bottom' shadow='md' withArrow=true attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Click here to run the injected handler.
{% endPopover %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% popover target='Account' position='bottom' shadow='md' withArrow=true attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Click here to run the injected handler.
{% endPopover %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'popover', target='Account', position='bottom',
          shadow='md', withArrow=True, children='Click here to run the injected handler.',
          attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
