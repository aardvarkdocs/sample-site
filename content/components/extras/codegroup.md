---
title: "CodeGroup"
description: "The built-in code-group tag — wrap several fenced code blocks and show them as
  language/file tabs, each with its own copy button. The chosen language syncs across every code
  group on the page and persists across page loads. Built on the same tab widget as Tabs, so it
  takes the same variants (pills or a sliding underline). Usage, live examples, and the attributes."
---

# CodeGroup

`{% raw %}{% codeGroup %}{% endraw %}` wraps a run of fenced code blocks and shows them as
**language / file tabs**, each with its own copy button. Reach for it when the same thing is
shown several ways — a request in `curl`, Python, and JavaScript; a config in YAML and TOML; a
file across a few languages — so the reader picks the tab they care about instead of scrolling
past the rest.

Every fenced block inside becomes one tab. The tab label comes from the block's language
(`json` → **JSON**), or from an explicit `title="…"` on the fence when you want a filename or a
custom name. The code is highlighted at build time with the same highlighter the site's
`` ``` `` fenced blocks use, so a tab looks exactly like an ordinary code block — just grouped.

Use it as `{% raw %}{% codeGroup %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'codeGroup', …)`. Close it with
`{% raw %}{% endCodeGroup %}{% endraw %}`.

{% callout title="CodeGroup or Tabs?" %}
A code group is the same tab widget as [**Tabs**](/components/navigation/tabs/) — same
[variants](#variants), same sliding underline, same crossfade — specialised for code. Reach for
**CodeGroup** when the tabs are the *same thing in different languages or files*: you get automatic
language labels, a copy / download button per tab, build-time highlighting, and a language choice
that [**syncs across every group on the page and persists**](#syncing-the-language-across-groups).
Reach for [**Tabs**](/components/navigation/tabs/) when the panels are *arbitrary Markdown* — prose,
lists, nested components, mixed content — that you label yourself and that should stay independent.
{% endCallout %}

## By language

Give each way its own fenced block and the languages become the tabs:

{% codeGroup %}
```bash
curl https://api.example.com/v1/users \
  -H "Authorization: Bearer $TOKEN"
```
```python
import requests

requests.get(
    "https://api.example.com/v1/users",
    headers={"Authorization": f"Bearer {token}"},
)
```
```javascript
await fetch("https://api.example.com/v1/users", {
  headers: { Authorization: `Bearer ${token}` },
});
```
{% endCodeGroup %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
~~~aardvark
{% codeGroup %}
```bash
curl https://api.example.com/v1/users \
  -H "Authorization: Bearer $TOKEN"
```
```python
import requests

requests.get(
    "https://api.example.com/v1/users",
    headers={"Authorization": f"Bearer {token}"},
)
```
```javascript
await fetch("https://api.example.com/v1/users", {
  headers: { Authorization: `Bearer ${token}` },
});
```
{% endCodeGroup %}
~~~
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## Named tabs with `title`

Add `title="…"` to a fence to label the tab yourself — a filename is the common case. The
language still drives the highlighting; only the label changes:

{% codeGroup %}
```json title="package.json"
{
  "name": "my-app",
  "version": "1.0.0"
}
```
```toml title="pyproject.toml"
[project]
name = "my-app"
version = "1.0.0"
```
{% endCodeGroup %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
~~~aardvark
{% codeGroup %}
```json title="package.json"
{
  "name": "my-app",
  "version": "1.0.0"
}
```
```toml title="pyproject.toml"
[project]
name = "my-app"
version = "1.0.0"
```
{% endCodeGroup %}
~~~
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## Choosing the opening language

Every code group on a page opens on the **same language** (see [Syncing the language across
groups](#syncing-the-language-across-groups) below) — by default the first code group's first tab.
To make a page open on a specific language, set `defaultValue` (a tab's label) on the **first** code
group; it seeds the language every group then opens on:

{% raw %}
~~~aardvark
{% codeGroup defaultValue="Python" %}
```bash
echo "shell is first in source…"
```
```python
print("…but the page opens on Python")
```
{% endCodeGroup %}
~~~
{% endraw %}

`defaultValue` only sets the first, pre-choice paint: once a reader picks a language it's remembered
(below) and that wins. On a *later* group it has no visible effect — the page's shared language has
already applied — so reach for it on the first group only.

## Syncing the language across groups

Code groups on a page share **one language choice**, from the very first paint: they all open on the
same language, and picking **Python** in any group switches every other group that has a Python tab
to it at once. The choice sticks, too — the next page you open starts on Python. It's remembered
per-reader in the browser, so a `curl`-first reader and a Python-first reader each read the docs in
the language they picked, across the whole site.

Try it — click a language in either group and watch the other follow:

{% codeGroup %}
```bash
curl https://api.example.com/v1/pets
```
```python
requests.get("https://api.example.com/v1/pets")
```
```javascript
await fetch("https://api.example.com/v1/pets");
```
{% endCodeGroup %}

{% codeGroup %}
```bash
curl https://api.example.com/v1/pets/1 -X DELETE
```
```python
requests.delete("https://api.example.com/v1/pets/1")
```
```javascript
await fetch("https://api.example.com/v1/pets/1", { method: "DELETE" });
```
{% endCodeGroup %}

The match is by the **tab label** — the language name, or a `title="…"` if you set one. A group that
doesn't have the picked language just stays on whatever it's showing.

## Variants

A code group is the same tab widget as [Tabs](/components/navigation/tabs/), so it takes the same
`variant`. It defaults to **`pills`** (the filled buttons above); pass `variant="default"` (or
`"outline"`) for the **sliding underline** instead — the same animated indicator `{% raw %}{% tabs %}{% endraw %}` uses:

{% codeGroup variant="default" %}
```bash
npm install my-app
```
```bash title="pnpm"
pnpm add my-app
```
```bash title="yarn"
yarn add my-app
```
{% endCodeGroup %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| *(body)* | Fenced code blocks | Each `` ``` `` (or `~~~`) fenced block becomes one tab, in source order. Written between `{% raw %}{% codeGroup %}{% endraw %}` and `{% raw %}{% endCodeGroup %}{% endraw %}`. |
| `defaultValue` | A tab label | On the **first** code group of a page, the language every group opens on; on a later group it only shows before the shared language applies. Overridden once a reader picks a language (remembered site-wide). Defaults to the first tab. Match the label — the language name (e.g. `JavaScript`) or a fence's `title`. |
| `variant` | `pills`, `default`, `outline` | The tab style, shared with [Tabs](/components/navigation/tabs/). Defaults to `pills`; `default` / `outline` give the sliding underline. |
| `attr` | `{…}` | Raw HTML attributes forwarded onto the widget's root element (see below). |

Per-tab, on the fence itself:

| Fence syntax | Description |
| --- | --- |
| ` ```lang ` | The language — drives both syntax highlighting and, unless overridden, the tab label (`json` → **JSON**). A fence with no language becomes a plain **Text** tab. |
| ` ```lang title="name" ` | An explicit tab label, typically a filename. The language still drives highlighting. |

Use a `~~~` fence (tildes) for a block whose own code contains a ` ``` ` run — the tab body is
taken verbatim.

## CSS Selectors

Each code group carries `data-aardvark-island="CodeGroup"` on its wrapper, and the rendered
Mantine `Tabs` exposes its parts as `mantine-Tabs-*` classes. The per-tab code reuses the site's
shared `.aardvark-code-block` / `.aardvark-code-actions` markup, so it styles identically to an
on-page fenced block.

{% raw %}
```css
[data-aardvark-island="CodeGroup"] {
  /* style every code group on the page */
}

.aardvark-code-group .mantine-Tabs-tab {
  /* a language / file tab */
}

.aardvark-code-group .aardvark-code-block {
  /* the active tab's code block */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes straight onto the rendered root element.

{% codeGroup attr={'id': 'install-group'} %}
```bash
npm install my-app
```
```bash title="yarn"
yarn add my-app
```
{% endCodeGroup %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
~~~aardvark
{% codeGroup attr={'id': 'install-group'} %}
```bash
npm install my-app
```
```bash title="yarn"
yarn add my-app
```
{% endCodeGroup %}
~~~
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}
