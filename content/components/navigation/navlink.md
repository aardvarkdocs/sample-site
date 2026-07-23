---
title: "NavLink"
description: "The built-in navlink tag — a navigation link with an icon, description, active state, and nested sub-links, on Mantine's NavLink. Usage, options, and live examples."
---

# NavLink

A **built-in** tag for a navigation link, built on Mantine's `NavLink`: a `label` with an
optional `description`, a left/right **icon** (any
[{% raw %}`{% icon %}`{% endraw %}](/components/data-display/icon/) spec), an `active`
state, a `variant` and `color`, and one level of **nested** sub-links via `items`.

Use it as {% raw %}`{% navlink %}`{% endraw %} in Markdown, or call it from Python logic (loops, snippets) via `component('aardvark', 'navlink', …)`.

## Demonstrations

### Label, description, icon, and active

The `label` is required; add a `description` for secondary text and `leftSection` /
`rightSection` for an icon. Set `active=true` to highlight the current link, and `href` to
render it as a real `<a>`.

{% navlink label='Dashboard' description='Your overview' leftSection='dashboard' href='/dashboard/' %}
{% navlink label='Active page' leftSection='star' active=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% navlink label='Dashboard' description='Your overview' leftSection='dashboard' href='/dashboard/' %}
{% navlink label='Active page' leftSection='star' active=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'navlink', label='Dashboard', description='Your overview', leftSection='dashboard', href='/dashboard/')
component('aardvark', 'navlink', label='Active page', leftSection='star', active=True)
```
{% endAccordionSection %}
{% endAccordion %}

### Variants and color

`variant` is `light` (the default), `filled`, or `subtle`; `color` sets the accent for the
active/hover state.

{% navlink label='Light' variant='light' active=true %}
{% navlink label='Filled' variant='filled' active=true color='grape' %}
{% navlink label='Subtle' variant='subtle' active=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% navlink label='Light' variant='light' active=true %}
{% navlink label='Filled' variant='filled' active=true color='grape' %}
{% navlink label='Subtle' variant='subtle' active=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'navlink', label='Light', variant='light', active=True)
component('aardvark', 'navlink', label='Filled', variant='filled', active=True, color='grape')
component('aardvark', 'navlink', label='Subtle', variant='subtle', active=True)
```
{% endAccordionSection %}
{% endAccordion %}

### Disabled, no-wrap, and right section

`disabled` dims and disables the link; `noWrap` keeps the label on one line; a
`rightSection` icon sits at the trailing edge (handy for a chevron or external-link mark).

{% navlink label='Disabled' leftSection='lock' disabled=true %}
{% navlink label='External docs' rightSection='external-link' href='https://mantine.dev' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% navlink label='Disabled' leftSection='lock' disabled=true %}
{% navlink label='External docs' rightSection='external-link' href='https://mantine.dev' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'navlink', label='Disabled', leftSection='lock', disabled=True)
component('aardvark', 'navlink', label='External docs', rightSection='external-link', href='https://mantine.dev')
```
{% endAccordionSection %}
{% endAccordion %}

### Nested sub-links

Pass nested sub-links as a JSON array in `items` — `children` is reserved for the block
body, so the nested data rides its own param. Set `defaultOpened=true` to start the group
expanded and `childrenOffset` to indent it. Nesting goes **one level** deep through the
tag.

{% navlink label='Settings' leftSection='settings' childrenOffset=20 defaultOpened=true items='[{"label":"Profile","href":"/profile/","leftSection":"user"},{"label":"Billing","href":"/billing/","leftSection":"credit-card"}]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% navlink label='Settings' leftSection='settings' childrenOffset=20 defaultOpened=true items='[{"label":"Profile","href":"/profile/","leftSection":"user"},{"label":"Billing","href":"/billing/","leftSection":"credit-card"}]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
import json
items = json.dumps([
    {'label': 'Profile', 'href': '/profile/', 'leftSection': 'user'},
    {'label': 'Billing', 'href': '/billing/', 'leftSection': 'credit-card'},
])
component('aardvark', 'navlink', label='Settings', leftSection='settings', childrenOffset=20, defaultOpened=True, items=items)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Build a navigation column by looping over a list of pages in Python and emitting a
{% raw %}`{% navlink %}`{% endraw %} for each, marking the current page `active`. Wrap the
run in a {% raw %}`{% stack %}`{% endraw %} for vertical spacing.

{% stack gap='xs' %}
{% navlink label='Overview' leftSection='home' href='/' %}
{% navlink label='Navigation' leftSection='compass' active=true %}
{% navlink label='Layout' leftSection='layout' href='/components/' %}
{% endStack %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% stack gap='xs' %}
{% navlink label='Overview' leftSection='home' href='/' %}
{% navlink label='Navigation' leftSection='compass' active=true %}
{% navlink label='Layout' leftSection='layout' href='/components/' %}
{% endStack %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
pages = [
    ('Overview', 'home', '/'),
    ('Navigation', 'compass', None),  # current page — active
    ('Layout', 'layout', '/components/'),
]
links = ''
for label, icon, href in pages:
    links += component('aardvark', 'navlink', label=label, leftSection=icon,
                       href=href or '', active=href is None)
component('aardvark', 'stack', gap='xs', children=links)
```
{% endAccordionSection %}
{% endAccordion %}

For deeper trees or fully custom link state, build a
[snippet](/authoring/components-and-snippets/) that nests `component('NavLink', ...)`
directly.

## Attributes

Omit any attribute to take its default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `label` | Any string (**required**) | The link text. |
| `description` | Any string | Secondary text below the label. |
| `href` | A relative path or URL | Destination — renders the link as an `<a>`. |
| `leftSection` | An icon spec (Tabler name, Font Awesome class, image path, emoji, or inline SVG) | Leading icon, exactly like [{% raw %}`{% icon %}`{% endraw %}](/components/data-display/icon/). |
| `rightSection` | An icon spec (as above) | Trailing icon. |
| `active` | `true` / `false` (default) | Highlight this link as the current one. |
| `variant` | `light` (default), `filled`, `subtle` | Visual style of the active/hover state. |
| `color` | Any theme color (`blue`, `grape`, …) | Accent color for the active/hover state. |
| `disabled` | `true` / `false` (default) | Dim and disable interaction. |
| `noWrap` | `true` / `false` (default) | Keep the label on one line. |
| `autoContrast` | `true` / `false` (default) | Auto-pick a readable label color against `color`. |
| `items` | JSON array of nested-link objects (`{label, href, leftSection, …}`) | One level of nested sub-links. |
| `childrenOffset` | An integer (pixels) | Indent of the nested group. |
| `defaultOpened` | `true` / `false` (default) | Whether the nested group starts expanded. |

## CSS Selectors

Each link mounts inside an island wrapper carrying `data-aardvark-island="NavLink"`; Mantine's Styles API breaks the rendered element into the root, label, description, and (for nested links) the chevron.

{% raw %}
```css
[data-aardvark-island="NavLink"]  /* the island wrapper */
.mantine-NavLink-root             /* the link/button */
.mantine-NavLink-label            /* the primary label */
.mantine-NavLink-description      /* the secondary line */
.mantine-NavLink-chevron          /* the expand chevron (nested links) */
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) onto the rendered link.

{% navlink label='Dashboard' description='Your overview' leftSection='dashboard' href='/dashboard/' attr={'onclick': '''
event.preventDefault();
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% navlink label='Dashboard' description='Your overview' leftSection='dashboard' href='/dashboard/' attr={'onclick': '''
event.preventDefault();
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'navlink', label='Dashboard', description='Your overview', leftSection='dashboard', href='/dashboard/', attr={'onclick': '''
event.preventDefault();
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
