---
title: "Tree"
description: "The built-in tree tag — a nested file/folder explorer with collapsible folders, indentation guides, and per-file source you can open in a modal. Usage, options, and live examples."
---

# Tree

A **built-in** tag that renders a nested file/folder explorer: collapsible folders with
indentation guide lines and language-aware icons, full keyboard navigation, and `defaultOpen`,
`href`, `comment`, and `highlighted` options. It goes one step further: give a
`{% raw %}{% file %}{% endraw %}` a body of source code and the file becomes
**clickable**, opening that code centered in a **modal** as a standard fenced code
block (so the site's syntax highlighting styles it). A file with an empty body is a
plain, non-clickable leaf.

## Usage

Wrap the structure in `{% raw %}{% tree %} … {% endTree %}{% endraw %}`, nest
`{% raw %}{% folder name="…" %} … {% endFolder %}{% endraw %}` and
`{% raw %}{% file name="…" %} … {% endFile %}{% endraw %}` inside it, and put a
file's source between its tags:

{% raw %}
```aardvark
{% tree label="Project files" %}
{% folder name="src" defaultOpen %}
{% file name="app.py" %}
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def root():
    return {"status": "ok"}
{% endFile %}
{% folder name="utils" %}
{% file name="text.py" %}
def slugify(value: str) -> str:
    return value.strip().lower().replace(" ", "-")
{% endFile %}
{% endFolder %}
{% endFolder %}
{% file name="package.json" %}
{
  "name": "demo",
  "scripts": { "build": "vark build" }
}
{% endFile %}
{% file name="README.md" comment="start here" %}{% endFile %}
{% endTree %}
```
{% endraw %}

renders, live:

{% tree label="Project files" %}
{% folder name="src" defaultOpen %}
{% file name="app.py" %}
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def root():
    return {"status": "ok"}
{% endFile %}
{% folder name="utils" %}
{% file name="text.py" %}
def slugify(value: str) -> str:
    return value.strip().lower().replace(" ", "-")
{% endFile %}
{% endFolder %}
{% endFolder %}
{% file name="package.json" %}
{
  "name": "demo",
  "scripts": { "build": "vark build" }
}
{% endFile %}
{% file name="README.md" comment="start here" %}{% endFile %}
{% endTree %}

Click a file with a body — **app.py**, **text.py**, **package.json** — to open its
source in a modal (with a copy button). **README.md** has no body, so it's a plain
leaf with a trailing comment. Folders collapse on click; the icon tracks the file
extension. The whole tree is keyboard-navigable: focus it and use the arrow keys
(↑ ↓ to move, → ← to expand/collapse, **Enter** to open a file), `Home`/`End`, etc.

## Links, comments, and highlights

A `href` turns a name into a link (a bodyless file with `href` is a plain link); a
`comment` adds a trailing note in muted monospace (auto-prefixed with `#`); and
`highlighted` tints a row to draw the eye:

{% raw %}
```aardvark
{% tree %}
{% folder name="docs" defaultOpen comment="published to the site" %}
{% file name="index.md" href="/" %}{% endFile %}
{% file name="config.yaml" highlighted %}
title: My Site
theme:
  accent: indigo
{% endFile %}
{% endFolder %}
{% endTree %}
```
{% endraw %}

{% tree %}
{% folder name="docs" defaultOpen comment="published to the site" %}
{% file name="index.md" href="/" %}{% endFile %}
{% file name="config.yaml" highlighted %}
title: My Site
theme:
  accent: indigo
{% endFile %}
{% endFolder %}
{% endTree %}

## Options

| Tag | Attribute | Effect |
| --- | --- | --- |
| `{% raw %}{% tree %}{% endraw %}` | `label="…"` | Accessible name for the tree (sets `aria-label`); use it when a page has more than one. |
| `{% raw %}{% folder %}{% endraw %}` | `name="…"` | Folder label (required). |
| | `defaultOpen` | Start expanded instead of collapsed. |
| | `openable=false` | Static folder — always open, no chevron, no toggle. |
| | `href="…"` | Link the folder name (shown underlined). |
| | `comment="…"` | Trailing muted-monospace note, auto-prefixed with `#`. |
| | `highlighted` | Tint the row with the accent color. |
| `{% raw %}{% file %}{% endraw %}` | `name="…"` | File name (required); sets the icon and the code language. |
| | *(body)* | Source code → opens in a modal on click. An empty body is a plain leaf. |
| | `lang="…"` | Override the language guessed from the extension (e.g. `lang="bash"`). |
| | `href="…"` | Link a bodyless file (ignored when the file has a code body — that opens the modal). |
| | `comment="…"`, `highlighted` | As for folders. |

The file body is captured verbatim and shown as a fenced code block — the template
engine does **not** execute inside it, so ordinary source code (even code that looks
like template syntax) is safe as-is. A **balanced** `{% raw %}{% file %} … {% endFile %}{% endraw %}`
pair — e.g. when documenting the tree's own syntax — is fine too: the close-tag scanner
depth-counts, so it pairs them. The only case that needs a raw block is a **lone,
unbalanced** end-tag (a `{% raw %}{% endFile %}{% endraw %}`,
`{% raw %}{% endFolder %}{% endraw %}`, or `{% raw %}{% endTree %}{% endraw %}` with no
matching opener), which would otherwise close the block early — the engine runs before
Markdown.
