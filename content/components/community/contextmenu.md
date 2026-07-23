---
title: "ContextMenu"
description: "The community ContextMenu tag — a right-click context menu wrapping the mantine-contextmenu extension. Usage, options, and live examples."
menu: components
parent: community
weight: 10
---

# ContextMenu

A **right-click context menu**: right-click the target and a floating menu of actions appears
at the cursor. `label` is the visible target text; `items` is a JSON array describing the
menu entries — actions and dividers. The menu opens on a real right-click after the page
hydrates, so in a static screenshot you'll see only the target box; right-click it in a live
browser to open the menu.

A **Community Component** — wraps [mantine-contextmenu](https://icflorescu.github.io/mantine-contextmenu/)
by **Ionut-Cristian Florescu**, **MIT** licensed, npm `mantine-contextmenu`.

Use it as `{% raw %}{% contextmenu %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'contextmenu', …)`.

Each entry in `items` is a small JSON object:

- **An action** — a `key`, a `title`, plus optional `href` (navigates there when picked on a
  static page), `color` (e.g. `red` for a destructive action), and `icon` (a Tabler icon
  name, e.g. `copy`).
- **A divider** — `{"divider": true}`, a horizontal rule between groups.

## Demonstrations

### Actions, icons, and dividers

Each action takes a `key` and a `title`; add an `icon` (a Tabler icon name) for a leading
glyph, a `color` to tint a destructive action, and a `{"divider": true}` entry to rule off a
group.

{% contextmenu label='Right-click this card' items='[
  {"key": "copy", "title": "Copy to clipboard", "icon": "copy"},
  {"key": "download", "title": "Download", "icon": "download"},
  {"divider": true},
  {"key": "delete", "title": "Delete", "icon": "trash", "color": "red"}
]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% contextmenu label='Right-click this card' items='[
  {"key": "copy", "title": "Copy to clipboard", "icon": "copy"},
  {"key": "download", "title": "Download", "icon": "download"},
  {"divider": true},
  {"key": "delete", "title": "Delete", "icon": "trash", "color": "red"}
]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'contextmenu', label='Right-click this card', items='''[
  {"key": "copy", "title": "Copy to clipboard", "icon": "copy"},
  {"key": "download", "title": "Download", "icon": "download"},
  {"divider": true},
  {"key": "delete", "title": "Delete", "icon": "trash", "color": "red"}
]''')
```
{% endAccordionSection %}
{% endAccordion %}

### Link actions

Give an action an `href` and picking it navigates there — the only meaningful side effect a
static page can take. Relative paths and `http(s)://` links are allowed; unsafe schemes are
rejected at build time.

{% contextmenu label='Right-click for links' items='[
  {"key": "docs", "title": "Open the docs", "icon": "book", "href": "/"},
  {"key": "repo", "title": "View on GitHub", "icon": "brand-github", "href": "https://github.com/"}
]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% contextmenu label='Right-click for links' items='[
  {"key": "docs", "title": "Open the docs", "icon": "book", "href": "/"},
  {"key": "repo", "title": "View on GitHub", "icon": "brand-github", "href": "https://github.com/"}
]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'contextmenu', label='Right-click for links', items='''[
  {"key": "docs", "title": "Open the docs", "icon": "book", "href": "/"},
  {"key": "repo", "title": "View on GitHub", "icon": "brand-github", "href": "https://github.com/"}
]''')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Because `items` is plain data, a Python caller can build the menu from a loop — for example
mapping a list of pages to link actions — and render it under a
[Text](/components/typography/text/) heading:

{% text fw='600' %}Right-click for documentation sections{% endText %}

{% contextmenu label='Right-click here' items='[
  {"key": "start", "title": "Getting started", "href": "/"},
  {"key": "components", "title": "Components", "href": "/"},
  {"key": "config", "title": "Configuration", "href": "/"}
]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% text fw='600' %}Right-click for documentation sections{% endText %}

{% contextmenu label='Right-click here' items='[
  {"key": "start", "title": "Getting started", "href": "/"},
  {"key": "components", "title": "Components", "href": "/"},
  {"key": "config", "title": "Configuration", "href": "/"}
]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
import json

pages = [
    ('start', 'Getting started', '/'),
    ('components', 'Components', '/'),
    ('config', 'Configuration', '/'),
]
items = json.dumps([{'key': k, 'title': t, 'href': u} for k, t, u in pages])

component('aardvark', 'text', fw='600',
          children='Right-click for documentation sections')
component('aardvark', 'contextmenu', label='Right-click here', items=items)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `label` | string | The visible right-click target text. Defaults to `Right-click here`. |
| `items` | JSON array string | The menu entries. Each is an action object (`key`, `title`, plus optional `href`, `color`, and a Tabler `icon` name) or a divider object (`{"divider": true}`). |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered target element. See [Injecting Attributes](#injecting-attributes). |

## CSS Selector

The right-click target carries the class `aardvark-contextmenu-target`; target it to restyle
the surface authors see on the page:

```css
.aardvark-contextmenu-target {
  background: var(--mantine-color-gray-0);
}
```

The floating menu itself is styled by the upstream `mantine-contextmenu` stylesheet, which
the component pulls in automatically.

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes onto the rendered target element — useful for
`id`, `data-*`, ARIA attributes, or anything not exposed as a named param:

{% contextmenu label='Right-click me' attr={'id': 'demo-context', 'data-role': 'menu-target'} items='[{"key": "x", "title": "Action"}]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% contextmenu label='Right-click me' attr={'id': 'demo-context', 'data-role': 'menu-target'} items='[{"key": "x", "title": "Action"}]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'contextmenu', label='Right-click me',
          attr={'id': 'demo-context', 'data-role': 'menu-target'},
          items='[{"key": "x", "title": "Action"}]')
```
{% endAccordionSection %}
{% endAccordion %}
