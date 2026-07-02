---
title: "JsonTree"
description: "The built-in jsontree tag — an interactive, collapsible JSON tree viewer with syntax highlighting, copy-to-clipboard, search, and configurable expansion depth. A Community Component wrapping @gfazioli/mantine-json-tree."
menu: components
parent: community
weight: 70
---

# JsonTree

`jsontree` renders any JSON-serializable value — an object, array, or scalar — as an
**interactive, collapsible tree** with syntax highlighting. Readers can expand and collapse
nodes, copy individual values or the whole document, search keys and values, and read the full
JSON path on hover. It hydrates into a fully interactive island in the browser, with no
JavaScript to write.

You pass the value to display as a JSON **string** through `data`; the tag parses it at build
time and hands the parsed value to the viewer. Use it as `{% raw %}{% jsontree %}{% endraw %}`
in Markdown, or call it from Python logic (loops, snippets) via
`component('aardvark', 'jsontree', …)`.

A **Community Component** — wraps [JsonTree](https://gfazioli.github.io/mantine-json-tree/) by
**gfazioli**, **MIT** licensed, npm `@gfazioli/mantine-json-tree`.

## Demonstrations

### Basic tree

Pass a JSON object string through `data`. By default the first couple of levels auto-expand:

{% jsontree data='{"name":"Aardvark","version":"1.0","tags":["docs","static"],"meta":{"stars":42,"active":true}}' %}

<br>

{% raw %}
```aardvark
{% jsontree data='{"name":"Aardvark","version":"1.0","tags":["docs","static"],"meta":{"stars":42,"active":true}}' %}
```
{% endraw %}

### Line numbers, indent guides, and item counts

Turn on `showLineNumbers`, `showIndentGuides`, and `showItemsCount` for a denser, more
inspectable layout — handy for larger payloads:

{% jsontree data='{"id":7,"items":[{"sku":"A1","qty":2},{"sku":"B2","qty":5}],"shipped":false}' showLineNumbers=true showIndentGuides=true showItemsCount=true %}

<br>

{% raw %}
```aardvark
{% jsontree data='{"id":7,"items":[{"sku":"A1","qty":2},{"sku":"B2","qty":5}],"shipped":false}' showLineNumbers=true showIndentGuides=true showItemsCount=true %}
```
{% endraw %}

### Search, copy, and a bordered container

`withSearch` adds a filter box that highlights and auto-expands matches; `withCopyAll` adds a
global copy button; `withBorder` wraps the tree in a bordered Paper. `rootName` labels the root
node:

{% jsontree data='{"user":{"name":"Ada","roles":["admin","editor"]},"flags":{"beta":true,"darkMode":false}}' rootName="config" withSearch=true withCopyAll=true withCopyToClipboard=true withBorder=true %}

<br>

{% raw %}
```aardvark
{% jsontree data='{"user":{"name":"Ada","roles":["admin","editor"]},"flags":{"beta":true,"darkMode":false}}' rootName="config" withSearch=true withCopyAll=true withCopyToClipboard=true withBorder=true %}
```
{% endraw %}

### Controlling expansion depth

`maxDepth` sets how many levels auto-expand: `0` collapses everything, a positive number
expands that many levels, and `-1` expands the whole tree. `withExpandAll` adds an
expand/collapse-all control:

{% jsontree data='{"a":{"b":{"c":{"d":"deep"}}},"list":[1,2,3]}' maxDepth=1 withExpandAll=true %}

<br>

{% raw %}
```aardvark
{% jsontree data='{"a":{"b":{"c":{"d":"deep"}}},"list":[1,2,3]}' maxDepth=1 withExpandAll=true %}
```
{% endraw %}

## With other components

A JSON tree sits naturally inside a [card](/components/data-display/card/) alongside other
content — here a short [text](/components/typography/text/) lead-in above an API-response
viewer:

{% card %}
{% text size='sm' c='dimmed' %}Example API response{% endText %}

{% jsontree data='{"status":200,"data":{"id":"u_123","email":"ada@example.com"},"cached":false}' rootName="response" withCopyAll=true %}
{% endCard %}

<br>

{% raw %}
```aardvark
{% card %}
{% text size='sm' c='dimmed' %}Example API response{% endText %}

{% jsontree data='{"status":200,"data":{"id":"u_123","email":"ada@example.com"},"cached":false}' rootName="response" withCopyAll=true %}
{% endCard %}
```
{% endraw %}

## Attributes

Every attribute is optional; omit one to take its upstream default. The body is ignored —
`jsontree` is a viewer, not a container.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `data` | JSON string | The value to display — an object, array, or scalar. Parsed at build time; a malformed value warns and degrades to an empty object. |
| `rootName` | String | Label for the root node (default `root`). |
| `maxDepth` | Integer | Levels to auto-expand: `0` collapsed, `-1` expand all (default `2`). |
| `size` | `xs`, `sm`, `md`, `lg`, `xl`, or a number | Font scale of the tree. |
| `maxHeight` | CSS length (string) | Cap the height; the tree scrolls past it. |
| `displayFunctions` | `as-string`, `hide`, `as-object` | How function values are rendered (default `as-string`). |
| `borderRadius` | `xs`, `sm`, `md`, `lg`, `xl` | Paper radius when `withBorder` is on (default `sm`). |
| `searchPlaceholder` | String | Placeholder for the search box when `withSearch` is on. |
| `defaultExpanded` | `true` / `false` (default `false`) | Expand all nodes by default. |
| `withBorder` | `true` / `false` (default `false`) | Wrap the tree in a bordered Paper. |
| `showLineNumbers` | `true` / `false` (default `false`) | Show line numbers down the side. |
| `showIndentGuides` | `true` / `false` (default `false`) | Show vertical indent guides. |
| `showItemsCount` | `true` / `false` (default `false`) | Show item counts for objects and arrays. |
| `showPathOnHover` | `true` / `false` (default `false`) | Show the full JSON path in a tooltip on hover. |
| `withCopyToClipboard` | `true` / `false` (default `false`) | Show a copy button on each node. |
| `withCopyAll` | `true` / `false` (default `false`) | Show a global copy-all button in the toolbar. |
| `withExpandAll` | `true` / `false` (default `false`) | Show the expand/collapse-all control. |
| `withSearch` | `true` / `false` (default `false`) | Show the search toggle and filter box. |
| `withKeyCountBadge` | `true` / `false` (default `false`) | Show a badge with the total key/item count. |
| `stickyHeader` | `true` / `false` (default `false`) | Keep the toolbar header sticky while scrolling. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

## CSS Selector

The viewer is an island wrapper carrying `data-aardvark-island="JsonTree"`; the upstream
component owns the inner tree chrome. Style or target it from your own CSS through the island
attribute or any `attr`-supplied id/class:

```css
/* The JsonTree island wrapper */
[data-aardvark-island="JsonTree"] {
  margin-block: var(--mantine-spacing-md);
}
```

The upstream package also exposes a rich set of CSS variables (e.g.
`--json-tree-color-string`, `--json-tree-color-number`, `--json-tree-color-key`,
`--json-tree-indent-guide-color-0`) and Styles API selectors — see the
[upstream documentation](https://gfazioli.github.io/mantine-json-tree/) for the full list.

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes (an `id`, `class`, `data-*`, ARIA attributes,
inline event handlers) straight onto the rendered element — exactly like
`component('aardvark', 'jsontree', attr={…})`. These ride the `data-aardvark-attr` channel,
not React props, so they don't collide with the component's own props:

{% jsontree data='{"hello":"world"}' attr={'id': 'demo-tree', 'data-role': 'json-viewer'} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% jsontree data='{"hello":"world"}' attr={'id': 'demo-tree', 'data-role': 'json-viewer'} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'jsontree', data='{"hello":"world"}',
          attr={'id': 'demo-tree', 'data-role': 'json-viewer'})
```
{% endAccordionSection %}
{% endAccordion %}
