---
title: "Menu"
description: "The built-in menu tag — a dropdown of actions and links anchored to a trigger button, with section labels and dividers. Usage, options, and live examples."
---

# Menu

A dropdown menu of actions and links anchored to a trigger button. `label` is the trigger
button; `items` is a JSON array describing the entries — actions, links, section
headings, and dividers. The dropdown opens on click (or hover) after the page hydrates,
so in a static screenshot you'll see only the trigger button; click it in a live browser
to open the menu.

Use it as `{% raw %}{% menu %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'menu', …)`.

Each entry in `items` is a small JSON object:

- **An item** — a `label`, plus optional `href` (renders the item as a link), `color`
  (e.g. `red` for a destructive action), and `disabled`. A `javascript:`, `data:` or
  other unsafe link scheme fails the build, so a bad link is reported instead of
  silently dropped.
- **A section heading** — `{"section": "…"}`, a non-clickable group label.
- **A divider** — `{"divider": true}`, a horizontal rule.

## Demonstrations

### Sections and dividers

A `section` entry adds a non-clickable group label; a `divider` entry draws a rule
between groups.

{% menu label='Actions' items='[
  {"section": "Account"},
  {"label": "Profile", "href": "/"},
  {"label": "Settings", "href": "/"},
  {"divider": true},
  {"label": "Sign out", "color": "red"}
]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% menu label='Actions' items='[
  {"section": "Account"},
  {"label": "Profile", "href": "/"},
  {"label": "Settings", "href": "/"},
  {"divider": true},
  {"label": "Sign out", "color": "red"}
]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'menu', label='Actions', items='''[
  {"section": "Account"},
  {"label": "Profile", "href": "/"},
  {"label": "Settings", "href": "/"},
  {"divider": true},
  {"label": "Sign out", "color": "red"}
]''')
```
{% endAccordionSection %}
{% endAccordion %}

### Links, colors, and disabled items

An `href` turns an item into a link; `color` tints a destructive action; `disabled`
greys one out. `targetVariant` restyles the trigger, `position` anchors the dropdown, and
`withArrow` points it at the button.

{% menu label='Repo' targetVariant='light' position='bottom-start' withArrow=true items='[
  {"label": "View on GitHub", "href": "https://github.com/"},
  {"label": "Download .zip", "href": "/"},
  {"divider": true},
  {"label": "Archive", "disabled": true},
  {"label": "Delete", "color": "red"}
]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% menu label='Repo' targetVariant='light' position='bottom-start' withArrow=true items='[
  {"label": "View on GitHub", "href": "https://github.com/"},
  {"label": "Download .zip", "href": "/"},
  {"divider": true},
  {"label": "Archive", "disabled": true},
  {"label": "Delete", "color": "red"}
]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'menu', label='Repo', targetVariant='light',
          position='bottom-start', withArrow=True, items='''[
  {"label": "View on GitHub", "href": "https://github.com/"},
  {"label": "Download .zip", "href": "/"},
  {"divider": true},
  {"label": "Archive", "disabled": true},
  {"label": "Delete", "color": "red"}
]''')
```
{% endAccordionSection %}
{% endAccordion %}

### Open on hover

Set `trigger='hover'` to open the menu on hover instead of click. `width`, `shadow`,
`offset`, and `radius` size and style the dropdown.

{% menu label='Hover' trigger='hover' width=180 shadow='lg' offset=4 radius='md' items='[{"label": "One"}, {"label": "Two"}]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% menu label='Hover' trigger='hover' width=180 shadow='lg' offset=4 radius='md' items='[{"label": "One"}, {"label": "Two"}]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'menu', label='Hover', trigger='hover', width=180,
          shadow='lg', offset=4, radius='md',
          items='[{"label": "One"}, {"label": "Two"}]')
```
{% endAccordionSection %}
{% endAccordion %}

### Keep the menu open after a click

By default the menu closes once an item is chosen. Set `closeOnItemClick=false` to keep
it open — handy for a menu of toggles.

{% menu label='View' closeOnItemClick=false items='[
  {"section": "Toggles"},
  {"label": "Show grid"},
  {"label": "Show rulers"},
  {"label": "Snap to pixels"}
]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% menu label='View' closeOnItemClick=false items='[
  {"section": "Toggles"},
  {"label": "Show grid"},
  {"label": "Show rulers"},
  {"label": "Snap to pixels"}
]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'menu', label='View', closeOnItemClick=False, items='''[
  {"section": "Toggles"},
  {"label": "Show grid"},
  {"label": "Show rulers"},
  {"label": "Snap to pixels"}
]''')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Because `items` is plain data, a Python caller can build the menu from a loop — for
example, mapping a list of pages to link entries — and render it alongside a
[Text](/components/typography/text/) heading:

{% text fw='600' %}Documentation{% endText %}

{% menu label='Sections' position='bottom-start' items='[
  {"label": "Getting started", "href": "/"},
  {"label": "Components", "href": "/"},
  {"label": "Configuration", "href": "/"}
]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% text fw='600' %}Documentation{% endText %}

{% menu label='Sections' position='bottom-start' items='[
  {"label": "Getting started", "href": "/"},
  {"label": "Components", "href": "/"},
  {"label": "Configuration", "href": "/"}
]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
import json

pages = [
    ('Getting started', '/'),
    ('Components', '/'),
    ('Configuration', '/'),
]
items = json.dumps([{'label': name, 'href': url} for name, url in pages])

component('aardvark', 'text', fw='600', children='Documentation')
component('aardvark', 'menu', label='Sections',
          position='bottom-start', items=items)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `label` | string | The trigger button's text. Defaults to `Menu`. |
| `items` | JSON array string | The menu entries. Each is an item object (`label`, plus optional `href`, `color`, `disabled`), a section object (`{"section": "…"}`), or a divider object (`{"divider": true}`). |
| `position` | `bottom-start`, `bottom`, `top`, `right-start`, … (plus `-start` / `-end` variants) | Edge the dropdown anchors to. |
| `width` | integer (pixels) | Dropdown width. |
| `shadow` | `xs`–`xl` | Drop shadow on the dropdown. |
| `trigger` | `click` (default), `hover`, `click-hover` | How the menu opens. Plain `hover` cannot be opened from the keyboard — prefer `click-hover` when you want the hover convenience without losing keyboard access. |
| `withArrow` | bare flag → `true` | Draw a pointer at the anchored edge. |
| `offset` | integer (pixels) | Gap between the trigger and the dropdown. |
| `radius` | `xs`–`xl` or a number | Dropdown corner radius. |
| `targetVariant` | `filled`, `light`, `outline`, `subtle`, `default`, … | The trigger button's Mantine variant. |
| `closeOnItemClick` | `true` (default) / `false` | Close the menu after an item is chosen. Set `false` to keep it open. |

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="Menu"]`, or through the Mantine Styles API classes. The dropdown mounts into a portal and its parts exist only while the menu is open. The relevant classes:

{% raw %}
```css
/* Every rendered Menu carries this island marker */
[data-aardvark-island="Menu"] { }

/* Mantine Styles API classes */
.mantine-Menu-dropdown { }
.mantine-Menu-item { }
.mantine-Menu-label { }
.mantine-Menu-divider { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — onto the rendered dropdown. Open the menu and click an item: the injected `onclick` reads the dropdown's text and alerts it.

{% menu label='Actions' items='[
  {"section": "Account"},
  {"label": "Profile"},
  {"label": "Sign out", "color": "red"}
]' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% menu label='Actions' items='[
  {"section": "Account"},
  {"label": "Profile"},
  {"label": "Sign out", "color": "red"}
]' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'menu', label='Actions', items='''[
  {"section": "Account"},
  {"label": "Profile"},
  {"label": "Sign out", "color": "red"}
]''', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
