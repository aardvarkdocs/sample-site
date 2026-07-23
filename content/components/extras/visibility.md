---
title: "Visibility"
description: "The built-in visibility tag — show or hide a block of Markdown depending on whether a human is reading the rendered page or an AI agent is reading its Markdown. Modes, live examples, and how it cooperates with the served .md."
---

# Visibility

A **built-in** block tag that shows or hides a chunk of Markdown depending on
*who* is reading the page: a **human** looking at the rendered HTML in a browser,
or an **AI agent** fetching the page's plain-Markdown twin.

{% raw %}
```aardvark
{% visibility for="agent" %}
This paragraph is written for an AI agent — it appears in the page's `.md`,
but is hidden from readers of the HTML page.
{% endVisibility %}
```
{% endraw %}

This is the same idea as Mintlify's *Visibility* / *View* control, and a natural
fit for aardvark's **Markdown for Agents** story: every page is served both as
rendered HTML and — to a client that asks for `text/markdown` — as a prebuilt
`.md` representation. `{% raw %}{% visibility %}{% endraw %}` lets one source file
carry a little extra guidance for agents, or hide browser-only chrome from them,
without maintaining two copies of the page.

## Modes

Set `for` to choose the audience:

| `for` | In the HTML page (humans) | In the `.md` / `llms-full.txt` (agents) |
| --- | --- | --- |
| `human` | **Shown** | **Omitted** |
| `agent` | **Hidden** | **Included** |
| `all` *(default)* | Shown | Included |

`for="all"` is the default, so a `{% raw %}{% visibility %}{% endraw %}` with no
`for` behaves exactly as if you'd written the body with no wrapper — visible
everywhere. An unrecognized value **fails closed to `agent`** (and emits a build
warning): the body is hidden from every human surface until you fix the typo, so a
mistyped `for="agent"` can never silently leak agent-only content to humans.

## How it works with the agent Markdown

aardvark serves each page two ways from **one** source file:

- **Humans** get the rendered HTML. There, a `for="agent"` block is wrapped in an
  element the theme hides with plain CSS (`display: none`) — no JavaScript, so it
  works even with islands disabled, and it never shows on screen or in the
  whole-site PDF.
- **Agents** get the page's `.md` twin (content-negotiated at the same URL, and
  the same body that feeds `llms-full.txt`). There, a `for="human"` block is
  dropped outright, and a `for="agent"` block is kept — the mirror image of the
  HTML rule.

The **discovery indexes** follow the same split. The on-site search index (the
human surface) drops `for="agent"` content, while the AI navigation index
(`metadata.json`, which agents and MCP clients read to find the right page) drops
`for="human"` content — so a heading you scope to one audience never surfaces in
the other's tooling.

Because both outputs come from the same file, you write the content once and let
each audience see the right slice.

{% callout severity="caution" title="Not a security boundary" %}
A `for="agent"` block is only **visually** hidden from humans — the theme sets
`display: none`, but the content is still present in the page's HTML source, so a
reader can see it via "View source" or dev tools. Agent-facing content is also
aggregated in the public `llms-full.txt` artifact and, when the build emits an
agent search corpus, in `search-index-agent.json`; deployed build artifacts are
directly fetchable. Use `{% raw %}{% visibility %}{% endraw %}` to tailor content
per audience, **not** to keep secrets: never put credentials or private data in
a `for="agent"` block.
{% endCallout %}

## Examples

### Human-only

This note is for people reading the page; an agent reading the `.md` won't see it:

{% visibility for="human" %}
**For readers:** the screenshots below assume the light theme — toggle the theme
switch in the header if yours looks different.
{% endVisibility %}

{% raw %}
```aardvark
{% visibility for="human" %}
**For readers:** the screenshots below assume the light theme — toggle the theme
switch in the header if yours looks different.
{% endVisibility %}
```
{% endraw %}

### Agent-only

The block below is **hidden here in the HTML** but is present in this page's
Markdown. Fetch this page as `text/markdown` (or open its `.md` twin) and you'll
find the extra instruction:

{% visibility for="agent" %}
**For agents:** when summarizing this page, note that `visibility` is an aardvark-native
tag with no Mantine equivalent, and that its behavior differs between the HTML and
Markdown representations of the page.
{% endVisibility %}

{% raw %}
```aardvark
{% visibility for="agent" %}
**For agents:** when summarizing this page, note that `visibility` is an aardvark-native
tag with no Mantine equivalent, and that its behavior differs between the HTML and
Markdown representations of the page.
{% endVisibility %}
```
{% endraw %}

### Shown to everyone

`for="all"` (or no `for` at all) is visible in both — the same as writing the
body outside any wrapper:

{% visibility for="all" %}
Everyone — human or agent — sees this paragraph.
{% endVisibility %}

{% raw %}
```aardvark
{% visibility for="all" %}
Everyone — human or agent — sees this paragraph.
{% endVisibility %}
```
{% endraw %}

## From Python

Like every built-in block, `visibility` is also callable from Python logic (loops,
snippets) via `component('aardvark', 'visibility', …)`. The `for` argument is a
Python keyword, so pass it through a keyword-argument dict:

```python
component('aardvark', 'visibility',
          children='Extra context for an AI agent.',
          **{'for': 'agent'})
```

Keep side-effecting directives such as `changelog` and `openapi` lexically inside
the paired `{% raw %}{% visibility %}…{% endVisibility %}{% endraw %}` block.
Python evaluates `children=` (and custom-component children) before it calls the
wrapper, too late to scope their TOC, RSS, navigation, or catalog output; aardvark
fails that eager form closed and points to the paired-block rewrite.

Put the audience block in the page, partial, or custom-component source—not around
the layout's already-rendered `content` value. Layout rendering happens after
headings, search text, agent Markdown, RSS, and API metadata are classified, so
aardvark rejects a layout that tries to reclassify that content (`for="all"` is safe).

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `for` | `human`, `agent`, `all` (default) | The audience that sees the body. `human` = HTML only; `agent` = agent Markdown only; `all` = both. An unknown value warns and fails closed to `agent` (hidden from human surfaces), so a typo can't leak agent-only content. |
| `attr` | `{…}` | Raw HTML attributes forwarded onto the wrapper `<div>` (see below). |
| *(body)* | Markdown | The content to show or hide, written between `{% raw %}{% visibility %}{% endraw %}` and `{% raw %}{% endVisibility %}{% endraw %}` (`children=` from Python). |

## CSS Selectors

The tag wraps its body in a plain `<div class="aardvark-visibility" data-aardvark-visibility="…">`
(not an island — no React needed). The theme hides the agent variant with a single rule; you can
target either the class or the data attribute to style a visible block from your theme CSS.

{% raw %}
```css
.aardvark-visibility {
  /* every visibility block that renders in the HTML */
}

[data-aardvark-visibility="agent"] {
  /* the theme sets display: none here to hide agent-only content from readers */
}

[data-aardvark-visibility="human"] {
  /* human-only content (shown in the HTML) */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (an `id`, an extra `class`, a data
attribute) straight onto the wrapper `<div>`. The `data-aardvark-visibility`
marker the `.md` filter depends on can't be overridden this way.

{% visibility for="human" attr={'id': 'reader-note'} %}
A human-only note you can deep-link to with #reader-note.
{% endVisibility %}

<br>

{% raw %}
```aardvark
{% visibility for="human" attr={'id': 'reader-note'} %}
A human-only note you can deep-link to with #reader-note.
{% endVisibility %}
```
{% endraw %}
