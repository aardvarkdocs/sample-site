---
title: "Tree"
description: "The built-in tree tag — a nested file/folder explorer with collapsible folders, indentation guides, and per-file source you can open in a modal. Usage, options, and live examples."
---

# Tree

A built-in tag that renders a nested file/folder explorer: collapsible folders with
indentation guide lines and language-aware icons, full keyboard navigation, and
per-row `defaultOpen`, `href`, `comment`, and `highlighted` options. Give a
`{% raw %}{% file %}{% endraw %}` a body of source code and the file becomes
clickable, opening that code centered in a modal as a standard fenced code block (so
the site's syntax highlighting styles it). A file with an empty body is a plain,
non-clickable leaf.

Use it as `{% raw %}{% tree %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'tree', …)`. It is a compound block: the
`{% raw %}{% tree %}{% endraw %}` wrapper nests
`{% raw %}{% folder name="…" %}{% endraw %}` and
`{% raw %}{% file name="…" %}{% endraw %}` tags inside it.

## Default

Wrap the structure in `{% raw %}{% tree %} … {% endTree %}{% endraw %}`, nest
`{% raw %}{% folder name="…" %} … {% endFolder %}{% endraw %}` and
`{% raw %}{% file name="…" %} … {% endFile %}{% endraw %}` inside it, and put a file's
source between its tags. Click a file with a body (**app.py**, **text.py**,
**package.json**) to open its source in a modal with a copy button; **README.md** has
no body, so it's a plain leaf. Folders collapse on click, and the whole tree is
keyboard-navigable (focus it, then ↑ ↓ to move, → ← to expand/collapse, **Enter** to
open a file).

**Preview**

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

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
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
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
src = component(
    'aardvark', 'folder', name='src', defaultOpen=True,
    children=(
        component('aardvark', 'file', name='app.py',
                  children='app = FastAPI()')
        + component(
            'aardvark', 'folder', name='utils',
            children=component('aardvark', 'file', name='text.py',
                               children='def slugify(value): ...'),
        )
    ),
)
files = (
    src
    + component('aardvark', 'file', name='package.json',
                children='{ "name": "demo" }')
    + component('aardvark', 'file', name='README.md', comment='start here')
)
component('aardvark', 'tree', label='Project files', children=files)
```
{% endAccordionSection %}
{% endAccordion %}

## Links, comments, and highlights

An `href` turns a name into a link (a bodyless file with `href` is a plain link); a
`comment` adds a trailing note in muted monospace (auto-prefixed with `#`);
`highlighted` tints a row to draw the eye; and `openable=false` makes a folder static
(always open, no chevron).

**Preview**

{% tree %}
{% folder name="docs" defaultOpen comment="published to the site" %}
{% file name="index.md" href="/" %}{% endFile %}
{% file name="config.yaml" highlighted %}
title: My Site
theme:
  accent: indigo
{% endFile %}
{% endFolder %}
{% folder name="dist" openable=false comment="build output" %}
{% file name="index.html" %}{% endFile %}
{% endFolder %}
{% endTree %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
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
{% folder name="dist" openable=false comment="build output" %}
{% file name="index.html" %}{% endFile %}
{% endFolder %}
{% endTree %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
docs = component(
    'aardvark', 'folder', name='docs', defaultOpen=True,
    comment='published to the site',
    children=(
        component('aardvark', 'file', name='index.md', href='/')
        + component('aardvark', 'file', name='config.yaml', highlighted=True,
                    children='title: My Site')
    ),
)
dist = component(
    'aardvark', 'folder', name='dist', openable=False, comment='build output',
    children=component('aardvark', 'file', name='index.html'),
)
component('aardvark', 'tree', children=docs + dist)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

A tree slots into any block — for example as one panel of a
`{% raw %}{% tabs %}{% endraw %}` set, paired with a prose tab that explains the
layout.

**Preview**

{% tabs defaultValue="layout" %}
{% tab label="Layout" %}
{% tree label="Site layout" %}
{% folder name="content" defaultOpen %}
{% file name="index.md" %}{% endFile %}
{% endFolder %}
{% file name="aardvark.config.yaml" comment="site config" %}{% endFile %}
{% endTree %}
{% endTab %}
{% tab label="Explanation" %}
`content/` holds your Markdown; `aardvark.config.yaml` configures the build.
{% endTab %}
{% endTabs %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% tabs defaultValue="layout" %}
{% tab label="Layout" %}
{% tree label="Site layout" %}
{% folder name="content" defaultOpen %}
{% file name="index.md" %}{% endFile %}
{% endFolder %}
{% file name="aardvark.config.yaml" comment="site config" %}{% endFile %}
{% endTree %}
{% endTab %}
{% tab label="Explanation" %}
`content/` holds your Markdown; `aardvark.config.yaml` configures the build.
{% endTab %}
{% endTabs %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
tree = component(
    'aardvark', 'tree', label='Site layout',
    children=(
        component('aardvark', 'folder', name='content', defaultOpen=True,
                  children=component('aardvark', 'file', name='index.md'))
        + component('aardvark', 'file', name='aardvark.config.yaml',
                    comment='site config')
    ),
)
tabs = (
    component('aardvark', 'tab', label='Layout', children=tree)
    + component('aardvark', 'tab', label='Explanation',
                children='`content/` holds your Markdown.')
)
component('aardvark', 'tabs', defaultValue='layout', children=tabs)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

A file's body is captured verbatim and shown as a fenced code block — the template
engine does not execute inside it, so ordinary source code (even code that looks like
template syntax) is safe as-is. A balanced
`{% raw %}{% file %} … {% endFile %}{% endraw %}` pair is fine too; only a lone,
unbalanced end-tag needs a `{% raw %}{% raw %}{% endraw %}` block to keep the engine
from closing the block early.

### `{% raw %}{% tree %}{% endraw %}`

| Attribute | Valid values | Description |
| --- | --- | --- |
| `label` | string | Accessible name for the tree (sets `aria-label`); use it when a page has more than one. |

### `{% raw %}{% folder %}{% endraw %}`

| Attribute | Valid values | Description |
| --- | --- | --- |
| `name` | string (required) | Folder label. |
| `defaultOpen` | bool flag | Start expanded instead of collapsed. |
| `openable` | bool (default `true`); `openable=false` | `false` → static folder: always open, no chevron, no toggle. |
| `href` | URL | Link the folder name (shown underlined). |
| `comment` | string | Trailing muted-monospace note, auto-prefixed with `#`. |
| `highlighted` | bool flag | Tint the row with the accent color. |

### `{% raw %}{% file %}{% endraw %}`

| Attribute | Valid values | Description |
| --- | --- | --- |
| `name` | string (required) | File name; sets the icon and the code language. |
| *(body)* | source code | Opens in a modal on click. An empty body is a plain leaf. |
| `lang` | a highlight language (e.g. `bash`, `python`) | Override the language guessed from the extension. |
| `href` | URL | Link a bodyless file (ignored when the file has a code body — that opens the modal). |
| `comment` | string | Trailing muted-monospace note, auto-prefixed with `#`. |
| `highlighted` | bool flag | Tint the row with the accent color. |

## CSS Selectors

The tree mounts inside an island wrapper carrying `data-aardvark-island="Tree"` and renders its own class names rather than Mantine's Styles API — target the container, each row, and the file/folder labels.

{% raw %}
```css
[data-aardvark-island="Tree"]  /* the island wrapper */
.aardvark-tree                 /* the tree container */
.aardvark-tree-row             /* a single file/folder row */
.aardvark-tree-label           /* a file or folder name */
.aardvark-tree-icon            /* the leading file/folder icon */
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — `id`, `data-*`, ARIA, analytics hooks — onto the
rendered tree root. (Style it through the CSS parts above; set per-row options like `href`,
`comment`, `highlighted`, or `lang` on each `{% raw %}{% file %}{% endraw %}` /
`{% raw %}{% folder %}{% endraw %}`.)

{% tree label="Project files" attr={'data-analytics': 'file-tree', 'aria-label': 'Project files'} %}
{% folder name="src" defaultOpen %}
{% file name="app.py" %}print("hello"){% endFile %}
{% endFolder %}
{% endTree %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% tree label="Project files" attr={'data-analytics': 'file-tree', 'aria-label': 'Project files'} %}
{% folder name="src" defaultOpen %}
{% file name="app.py" %}print("hello"){% endFile %}
{% endFolder %}
{% endTree %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
files = component('aardvark', 'folder', name='src', defaultOpen=True,
                  children=component('aardvark', 'file', name='app.py', children='print("hello")'))
print(component('aardvark', 'tree', label='Project files',
          attr={'data-analytics': 'file-tree', 'aria-label': 'Project files'}, children=files))
```
{% endAccordionSection %}
{% endAccordion %}
