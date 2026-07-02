---
title: "Tabs"
description: "The built-in tabs tag — switch between Markdown panels with a sliding underline and a content crossfade. Usage, options, and live examples."
---

# Tabs

A built-in tag built from Mantine's `Tabs` pieces (`Tabs.List`, `Tabs.Tab`,
`Tabs.Panel`) behind one tag pair, with two motions layered on: the active underline
slides to the tab you click instead of jumping, and the panel content crossfades in.
Each tab's body is ordinary Markdown — headings, lists, code, links, even nested
`component(...)` calls — and renders as such. Motion is suppressed for visitors who
ask for `prefers-reduced-motion`.

Use it as `{% raw %}{% tabs %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'tabs', …)`. It is a compound block: the
`{% raw %}{% tabs %}{% endraw %}` wrapper holds one
`{% raw %}{% tab label="…" %}{% endraw %}` per panel.

## Default

Wrap the set in `{% raw %}{% tabs %} … {% endTabs %}{% endraw %}` and give each panel
its own `{% raw %}{% tab label="…" %} … {% endTab %}{% endraw %}`. Pick the tab open on
load with `defaultValue` (a tab's `value`, which defaults to a slug of its label). The
panels below are deliberately different heights so the crossfade is visible.

**Preview**

{% tabs defaultValue="install" %}
{% tab label="Install" %}
Run `npm install` to pull in the toolchain.
{% endTab %}
{% tab label="Configure" %}
Add an `aardvark.config.yaml`:

- set the site `title`
- point `content` at your Markdown
- pick a `theme` accent color
{% endTab %}
{% tab label="Build" %}
Run `vark build`, then serve the `build/` directory.
{% endTab %}
{% endTabs %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% tabs defaultValue="install" %}
{% tab label="Install" %}
Run `npm install` to pull in the toolchain.
{% endTab %}
{% tab label="Configure" %}
Add an `aardvark.config.yaml`:

- set the site `title`
- point `content` at your Markdown
- pick a `theme` accent color
{% endTab %}
{% tab label="Build" %}
Run `vark build`, then serve the `build/` directory.
{% endTab %}
{% endTabs %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
tabs = (
    component('aardvark', 'tab', label='Install',
              children='Run `npm install` to pull in the toolchain.')
    + component('aardvark', 'tab', label='Configure',
                children='Add an `aardvark.config.yaml`.')
    + component('aardvark', 'tab', label='Build',
                children='Run `vark build`, then serve the `build/` directory.')
)
component('aardvark', 'tabs', defaultValue='install', children=tabs)
```
{% endAccordionSection %}
{% endAccordion %}

## Pills

`variant="pills"` swaps the underline for Mantine's filled pill. The sliding bar
turns off automatically — pills already mark the active tab — while the content still
crossfades.

**Preview**

{% tabs variant="pills" defaultValue="cli" %}
{% tab label="CLI" %}Build from the terminal with `vark build`.{% endTab %}
{% tab label="Library" %}Import `aardvark` and call the builder yourself.{% endTab %}
{% endTabs %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% tabs variant="pills" defaultValue="cli" %}
{% tab label="CLI" %}Build from the terminal with `vark build`.{% endTab %}
{% tab label="Library" %}Import `aardvark` and call the builder yourself.{% endTab %}
{% endTabs %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
tabs = (
    component('aardvark', 'tab', label='CLI',
              children='Build from the terminal with `vark build`.')
    + component('aardvark', 'tab', label='Library',
                children='Import `aardvark` and call the builder yourself.')
)
component('aardvark', 'tabs', variant='pills', defaultValue='cli', children=tabs)
```
{% endAccordionSection %}
{% endAccordion %}

## Vertical, colored, and disabled tabs

`orientation="vertical"` stacks the tabs down the side; `color` accents the active
tab; `grow` makes the tabs share the row width; and a `disabled` flag on a tab makes
it non-interactive.

**Preview**

{% tabs orientation="vertical" color="grape" defaultValue="overview" %}
{% tab label="Overview" %}
A vertical tab list runs down the left, with panels to its right.
{% endTab %}
{% tab label="Details" %}
The active tab is tinted with the `color` you set — here, grape.
{% endTab %}
{% tab label="Coming soon" disabled %}
This panel is unreachable while the tab is disabled.
{% endTab %}
{% endTabs %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% tabs orientation="vertical" color="grape" defaultValue="overview" %}
{% tab label="Overview" %}
A vertical tab list runs down the left, with panels to its right.
{% endTab %}
{% tab label="Details" %}
The active tab is tinted with the `color` you set — here, grape.
{% endTab %}
{% tab label="Coming soon" disabled %}
This panel is unreachable while the tab is disabled.
{% endTab %}
{% endTabs %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
tabs = (
    component('aardvark', 'tab', label='Overview',
              children='A vertical tab list runs down the left.')
    + component('aardvark', 'tab', label='Details',
                children='The active tab is tinted with the `color` you set.')
    + component('aardvark', 'tab', label='Coming soon', disabled=True,
                children='This panel is unreachable while the tab is disabled.')
)
component(
    'aardvark', 'tabs',
    orientation='vertical', color='grape', defaultValue='overview', children=tabs,
)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

A tab's body is full Markdown, so it can host any other tag — a
`{% raw %}{% tree %}{% endraw %}` in one tab, a `{% raw %}{% callout %}{% endraw %}`
in another. This keeps long, alternative explanations from stacking down the page.

**Preview**

{% tabs defaultValue="files" %}
{% tab label="Files" %}
{% tree label="Example project" %}
{% folder name="src" defaultOpen %}
{% file name="app.py" %}{% endFile %}
{% endFolder %}
{% file name="README.md" %}{% endFile %}
{% endTree %}
{% endTab %}
{% tab label="Notes" %}
{% callout severity="info" %}
Each tab can hold a different kind of block.
{% endCallout %}
{% endTab %}
{% endTabs %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% tabs defaultValue="files" %}
{% tab label="Files" %}
{% tree label="Example project" %}
{% folder name="src" defaultOpen %}
{% file name="app.py" %}{% endFile %}
{% endFolder %}
{% file name="README.md" %}{% endFile %}
{% endTree %}
{% endTab %}
{% tab label="Notes" %}
{% callout severity="info" %}
Each tab can hold a different kind of block.
{% endCallout %}
{% endTab %}
{% endTabs %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
tree = component(
    'aardvark', 'tree', label='Example project',
    children=component(
        'aardvark', 'folder', name='src', defaultOpen=True,
        children=component('aardvark', 'file', name='app.py'),
    ) + component('aardvark', 'file', name='README.md'),
)
note = component('aardvark', 'callout', severity='info',
                 children='Each tab can hold a different kind of block.')
tabs = (
    component('aardvark', 'tab', label='Files', children=tree)
    + component('aardvark', 'tab', label='Notes', children=note)
)
component('aardvark', 'tabs', defaultValue='files', children=tabs)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Attributes on `{% raw %}{% tabs %}{% endraw %}` pass straight through as Mantine
`Tabs` props, so the full Tabs surface is available.

### `{% raw %}{% tabs %}{% endraw %}`

| Attribute | Valid values | Description |
| --- | --- | --- |
| `defaultValue` | a tab's `value` | Which tab is open on load. Use this, not `value` — a bare `value` makes Mantine controlled, so the tabs won't switch on click. |
| `variant` | `default`, `outline`, `pills` | `default` / `outline` keep the sliding underline; `pills` uses Mantine's filled pill (sliding bar off). |
| `orientation` | `horizontal` (default), `vertical` | Stack the tabs down the side when `vertical`. |
| `color` | any Mantine color (e.g. `blue`, `grape`) | Accent color for the active tab. |
| `radius` | `xs`–`xl` | Corner radius of the tab controls. |
| `grow` | bool flag | Make the tabs share the full row width. |
| `justify` | `left`, `center`, `right`, `apart`, … | Alignment of the tab list. |
| `keepMounted` | bool flag | Keep inactive panels mounted in the DOM. |

### `{% raw %}{% tab %}{% endraw %}`

| Attribute | Valid values | Description |
| --- | --- | --- |
| `label` | string | The clickable tab button text. |
| `value` | string | Stable id for the tab (defaults to a slug of the label). |
| `color` | any Mantine color | Accent color for this individual tab. |
| `disabled` | bool flag | Render the tab disabled (non-interactive). |

## CSS Selectors

The set mounts inside an island wrapper carrying `data-aardvark-island="Tabs"`; Mantine's Styles API breaks it into the root, the tab strip, each tab button (and its label), and the panel that shows the active tab's body.

{% raw %}
```css
[data-aardvark-island="Tabs"]  /* the island wrapper */
.mantine-Tabs-root             /* the whole component */
.mantine-Tabs-list             /* the row of tab buttons */
.mantine-Tabs-tab              /* a single tab button */
.mantine-Tabs-tabLabel         /* a tab's text */
.mantine-Tabs-panel            /* the active tab's body */
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — `id`, `data-*`, ARIA, analytics hooks — onto the
rendered tabs root. (Style it through the CSS parts above; set per-tab options like `color`,
`disabled`, or `value` on each `{% raw %}{% tab %}{% endraw %}`.)

{% tabs defaultValue="install" attr={'data-analytics': 'docs-tabs', 'aria-label': 'Setup steps'} %}
{% tab label="Install" %}Run `npm install` to pull in the toolchain.{% endTab %}
{% tab label="Configure" %}Add an `aardvark.config.yaml`.{% endTab %}
{% endTabs %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% tabs defaultValue="install" attr={'data-analytics': 'docs-tabs', 'aria-label': 'Setup steps'} %}
{% tab label="Install" %}Run `npm install` to pull in the toolchain.{% endTab %}
{% tab label="Configure" %}Add an `aardvark.config.yaml`.{% endTab %}
{% endTabs %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
tabs = (
    component('aardvark', 'tab', label='Install',
              children='Run `npm install` to pull in the toolchain.')
    + component('aardvark', 'tab', label='Configure',
                children='Add an `aardvark.config.yaml`.')
)
print(component('aardvark', 'tabs', defaultValue='install',
          attr={'data-analytics': 'docs-tabs', 'aria-label': 'Setup steps'}, children=tabs))
```
{% endAccordionSection %}
{% endAccordion %}
