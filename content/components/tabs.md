---
title: "Tabs"
description: "The built-in tabs tag — switch between Markdown panels with a sliding underline and a content crossfade. Usage, options, and live examples."
---

# Tabs

A **built-in** tag built from Mantine's `Tabs` pieces (`Tabs.List`, `Tabs.Tab`,
`Tabs.Panel`) behind one tag pair, with two motions layered on: the active
**underline slides** to the tab you click instead of jumping, and the panel
content **crossfades** in. Each tab's body is ordinary **Markdown** — headings,
lists, code, links, even nested `component(...)` calls — and renders as such.
Motion is suppressed for visitors who ask for `prefers-reduced-motion`.

## Usage

Wrap the set in `{% raw %}{% tabs %} … {% endTabs %}{% endraw %}`, and give each
panel its own `{% raw %}{% tab label="…" %} … {% endTab %}{% endraw %}`:

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

renders, live:

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

The `label` is the clickable tab; everything between the tab tags is its panel
body. Click between tabs to watch the underline slide and the content crossfade —
the panels above are deliberately different heights so the transition is visible.

## Options

Attributes on the open tag pass straight through as Mantine `Tabs` props, so the
full Tabs surface is available.

### `{% raw %}{% tabs %}{% endraw %}`

| Attribute | Effect |
| --- | --- |
| `defaultValue="…"` | Which tab is open on load (a tab's `value`). Use this, not `value`. |
| `variant="…"` | `default` / `outline` keep the sliding underline; `pills` uses Mantine's filled pill. |
| `orientation="vertical"` | Stack the tabs down the side. |
| `color="…"`, `radius="…"`, `grow`, `justify="…"` | Standard Mantine Tabs styling. |

### `{% raw %}{% tab %}{% endraw %}`

| Attribute | Effect |
| --- | --- |
| `label="…"` | The tab button text. |
| `value="…"` | Stable id for the tab (defaults to a slug of the label). |
| `disabled` | Render the tab disabled. |

## Pills

`variant="pills"` swaps the underline for Mantine's filled pill. The sliding bar
turns off automatically — pills already mark the active tab — while the content
still crossfades:

{% raw %}
```aardvark
{% tabs variant="pills" defaultValue="cli" %}
{% tab label="CLI" %}Build from the terminal with `vark build`.{% endTab %}
{% tab label="Library" %}Import `aardvark` and call the builder yourself.{% endTab %}
{% endTabs %}
```
{% endraw %}

{% tabs variant="pills" defaultValue="cli" %}
{% tab label="CLI" %}Build from the terminal with `vark build`.{% endTab %}
{% tab label="Library" %}Import `aardvark` and call the builder yourself.{% endTab %}
{% endTabs %}
