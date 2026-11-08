# The vark component library

This folder holds the vark theme's built-in components. Each `.md` file defines one
`{% tag %}` that every site using the theme can call: `callout.md` defines `{% callout %}`,
`button.md` defines `{% button %}`, and so on. Files are named after the tag they define,
in lowercase. The files in `hooks/` are the exception: see [Markdown hooks](#markdown-hooks).

aardvark reads every `.md` file here as a definition, except this README (and a
`CONTRIBUTING.md` or `CHANGELOG.md`, if one is added, in any case but the all-lower-case
`changelog.md`, which defines `{% changelog %}`). Keep notes out of the folder: a file without a
`name:` (or, in `hooks/`, a `markdownHook:`) stops the build.

To change a component for one site only, you don't need this folder. A
`components/<name>.md` in that site's project with the same `name:` replaces the built-in
everywhere the tag is used; see
[Custom components](https://aardvarkdocs.com/authoring/custom-components/).

## What a definition contains

A definition is front matter plus one fenced block of Python:

````markdown
---
name: badge
description: A badge for labels, statuses, and counts.
params:
  text: string
  color: string
  circle: { type: bool, default: false }
body: python
---
```python
import html

props = {}
if color: props['color'] = color
if circle: props['circle'] = True
if attr: props['attr'] = attr
label = children if children else html.escape(text or '')
print(component('Badge', children=label, **props))
```
````

- **`name`** is the tag. **`description`** is a one-line summary of what the component
  does.
- **`params`** declares the attributes the tag accepts, each typed `string`, `int`,
  `float`, `bool`, `list` or `any`, with an optional `default:` or `required: true`. An
  attribute the tag doesn't declare stops the build, unless the definition sets
  `passthrough` (below).
- **`body: python`** is required here. The body is compiled once per build and run on each
  call. It receives each param by name, `children` (what the author wrote between the
  opening and closing tags) and `attr` (the HTML attributes the author attached with
  `attr={…}`), and prints the markup it renders: `component('Name', …)` for a React
  component, as in a page.
- More keys shape how a tag is called: `close`, `children`, `childScope`, `passthrough`,
  `positional` and `aliases`. They are described in
  [How a tag is called](https://aardvarkdocs.com/authoring/custom-components/#how-a-tag-is-called).
  `emits` names the React components a definition renders that a page doesn't show on its
  own, as `changelog.md`, `taxonomy.md`, `icon.md` and `openapi.md` do, so a layout that uses the
  tag still gets them.
  A key aardvark doesn't know stops the build in this folder, so a typo can't go unnoticed.

The conventions the definitions here follow:

- Pass only the props an author set, so the React component's own defaults apply; never
  pass a literal `"default"`.
- Forward `attr` to the component you render, so `attr={…}` works on the tag.
- Escape text that ends up as HTML (`html.escape`). Rendered `children` is HTML already.
- Report a problem the author can fix with a build warning (`av.warn(…)`), and never
  swallow an error to keep rendering.

## Markdown hooks

Some plain Markdown renders as a component too, such as a blockquote as a notification or a
numbered list as a Steps timeline. `hooks/` holds the definitions that decide how: each declares
`markdownHook:` instead of a `name:`, and is named after its hook, in lowercase. The hooks, the
values each is given and what a hook prints are described in
[Markdown hooks](https://aardvarkdocs.com/authoring/custom-components/#markdown-hooks).

## The Python API

A body imports only `aardvark.components` (as `av`) and a short list of standard-library
modules. The API covers build warnings, page-unique ids, safe props and links, code and
inline Markdown, maps, repositories, dates, and the changelog, taxonomy and OpenAPI
listings. Its reference is
[Component Python API](https://aardvarkdocs.com/authoring/component-api/).

## The React components

Many definitions render one of this theme's own React components, such as the `Callout` that
`callout.md` renders. Each is a `.jsx` file, with any `.css` it imports, in the theme's
`islands/` folder, beside this folder. The Mantine components a definition names, such as
`Badge` or `Button`, come from Mantine itself. An island declares in a comment at the top of its
source which of its props aardvark reads (site URLs, images and links) and which core
conversions apply to it, and `islands/base_meta.json` (named by `baseLibrary.meta` in
`theme.yaml`) does the same for the Mantine components; see
[Island metadata](https://aardvarkdocs.com/theming/component-library/#island-metadata).

Most islands that wrap a third-party Mantine extension, the Community Components, are
client-only. Each carries the marker `Community Component` in its header comment: the build
leaves any island whose source contains those words out of its prerender, and aardvark mounts it
in the browser instead. `ContextMenu`, `DataTable` and `Lightbox` wrap extensions too but leave
the marker out, because their server render (the menu's target, the table, the thumbnail grid)
is safe and is what a reader without JavaScript sees: the build prerenders them, and aardvark
hydrates them in place. The theme's `Map` wraps `mantine-map` without being a Community
Component, and is client-only by a rule of its own rather than the marker.

## Docs pages and tests

Every component needs a reference page in this repository, under
`content/components/<category>/`. The recipe and the writing style are in
[CONTRIBUTING.md](https://github.com/aardvarkdocs/sample-site/blob/main/CONTRIBUTING.md#docs-pages).

Changes to this folder aren't accepted by pull request yet: open an issue to suggest one
(see
[What can be changed](https://github.com/aardvarkdocs/sample-site/blob/main/CONTRIBUTING.md#what-can-be-changed)
in CONTRIBUTING.md). The aardvark maintainers write the tests for each component.

## License

See the [LICENSE](https://github.com/aardvarkdocs/sample-site/blob/main/LICENSE) file at
the root of this repository.
