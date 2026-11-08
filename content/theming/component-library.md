---
description: What a theme's components and islands build on — how theme folders layer, the
  theme.yaml keys, the modules aardvark provides to islands, island metadata and the core
  interfaces.
icon: fa-solid fa-shapes
menu: docs
title: Theme component library
weight: 43
---

# Theme component library

A theme ships the components your pages use: the `{% raw %}{% tag %}{% endraw %}` definitions in
its `components/` folder, the React islands they mount in `islands/`, and the extra component
libraries its `theme.yaml` declares. The packaged `vark` theme is one such library. This page is
the contract a theme's library is written against, theme API `"1.0"`: how theme folders layer,
what `theme.yaml` holds, which aardvark modules an island may import, and what an island declares
so that aardvark can read its props. How to write a component itself is in
[Custom components](/authoring/custom-components/).

## Layers and `theme.yaml`

aardvark reads a theme as **layers**: the packaged theme of that name (only `vark` ships), then
your `themes/<name>/` on top of it. Part of a theme merges across the layers, and part doesn't:

- A theme's **`components/`** and **`islands/`** folders and its **`theme.yaml`** are merged
  across the layers. A file in your folder replaces the packaged file of the same name, and
  everything you don't override keeps coming from aardvark, new components included when you
  upgrade. Every `.md` file in `components/` is a component definition, as in your project's own
  `components/` (a `README.md`, `CONTRIBUTING.md` or `CHANGELOG.md` excepted).
- The **top-level templates and assets** (`default.html`, `theme.scss`, the scripts) are not
  merged: they come from the top theme folder alone, with `templates/` on top (see
  [Theme & customization](/theming/#where-the-theme-lives)). A file missing from that folder is
  not filled in from the packaged theme.

`vark new` sets up exactly this: it copies the top-level files, not the theme's `theme.yaml`.
A folder whose `theme.yaml` declares `themeApi` is a **complete** theme instead: it replaces the
packaged theme of the same name rather than layering over it (it still builds on the theme it
extends, below). Use that for a theme you maintain in full: a complete `vark` builds on no
other theme unless its `theme.yaml` says `extends:`, so none of the packaged built-in components
lie beneath it; it defines the ones its pages use in its own `components/`. Its components
follow the rules aardvark's own do: each needs a
[Python body](/authoring/custom-components/#python-bodies), and an unknown front-matter key
stops the build. An island under a name the packaged theme defines, or one with an
`@aardvark-island` comment, is treated as the packaged ones are, so a complete copy of `vark`
builds exactly as the packaged theme does; an island of its own with no comment is your
code, like a snippet (see [Island metadata](#island-metadata)). A folder without `themeApi` follows the rules of your
project's `components/`, and its islands are your own code, like
[snippets](/authoring/custom-snippets/): aardvark doesn't read their props for search, PDF or the
Markdown export.

### Building on another theme

A theme named anything other than `vark` builds on the packaged `vark`: its `components/`,
`islands/` and `theme.yaml` go on top of vark's, so they only need the files the theme changes.
Its top-level templates and assets don't layer; they come from its own folder whole.
`extends:` in its `theme.yaml` names another theme to build on, and `extends: null` builds on
nothing:

```yaml
# themes/brand/theme.yaml
extends: vark        # the packaged vark plus your themes/vark/; null for none
```

`extends` names a theme in your `themes/` folder or a packaged one, with both of its layers.
Without it, a theme builds on the packaged `vark` alone, so a `themes/vark/` folder left in the
project doesn't change a site whose theme is another. A value that isn't a plain theme name, a
theme that doesn't exist, a loop, or a chain of more than four `extends` links stops the chain
at that theme with a build warning. The theme then builds on the packaged `vark`, unless the
chain already reached `vark`, so a typo there doesn't break the build either.

### `theme.yaml` keys

| Key | What it does |
| --- | --- |
| `themeApi` | The theme API version the theme is written against, as a quoted `"MAJOR.MINOR"` string: `"1.0"` today. Declaring it makes the folder a complete theme. Keep the quotes: YAML reads an unquoted `1.10` as the number `1.1`. A theme that needs a newer theme API than your aardvark implements stops the build, naming both versions. |
| `extends` | The theme this one builds on (see above). |
| `componentLibraries` | Extra React component libraries, merged one key at a time over the layers below: an entry replaces the one with the same key, and `<key>: null` removes it. The packaged `vark` declares `charts` and `carousel`. See [Component libraries](/components/extras/component-libraries/). |
| `runtime` | The islands runtime the theme's islands render through: `module`, and optionally `css` and `noDomRef`. The packaged `vark` names `@aardvark/islands/mantine-runtime`. See [A theme's runtime](#a-themes-runtime). |
| `baseLibrary` | The React component library the theme's islands are built on: `key`, `package`, `vocabulary` and optionally `meta` (its components' [metadata](#island-metadata)), or `null` for none. The packaged `vark`'s is Mantine. |
| `nativeMap` | The island that gets the map runtime aardvark ships for `{% raw %}{% map %}{% endraw %}`, or `null`: one of the theme's own islands, by name. The packaged `vark`'s is `Map`. |

`runtime`, `baseLibrary` and `nativeMap` are each taken whole from the highest layer that
declares them. In a complete theme an unknown key, a malformed value or a file the theme names
but doesn't have stops the build; in a folder without `themeApi` it warns and is ignored, and
the layer below it stands. A `theme.yaml` that can't be read, as a file or as YAML, stops the
build in any folder, since aardvark can't tell whether it declares `themeApi`. So does the
`themes/` folder, a theme folder, or its `components/` or `islands/`, when it is a symlink to
nothing or a file. `theme.yaml` is build input: a built site never serves it.

## The theme's islands

A theme's `islands/` folder holds its React components. Each `.jsx` or `.tsx` file is one
island, named by its file: `Card.jsx` is the island the `{% raw %}{% card %}{% endraw %}`
component mounts, and what `component('Card')` names. A file whose name starts with `_` is a
helper the islands beside it import (`import { normalizeComment } from './_treeHelpers'`),
never an island itself, and an island's stylesheet sits beside it (`Card.jsx` imports
`./Card.css`). An island or helper in your folder replaces the packaged one of the same name
whatever its extension: your `ArticleCard.tsx` replaces `ArticleCard.jsx`, in the listings that
show article cards too, since vark's islands import one another without the extension
(`./ArticleCard`). Write your imports that way too. A `.js` or `.ts` file named like an island
is not one: the build skips the islands bundle, with a warning naming both files, until one is
renamed. Every island a site uses is bundled into one script and one stylesheet. Only the
files at the top of `islands/` are bundled (`.jsx`, `.tsx`, `.js`, `.ts`, `.css` and `.json`,
which an island imports as data, except a `package.json`, `tsconfig.json` or `jsconfig.json`,
which esbuild reads as settings), so keep helpers there too: an island that imports a file that
is not bundled (one in a subfolder, say), or a stylesheet whose `url(./…)` names an image, gets
a build warning naming the import, and the bundle fails. Two file names that differ only in letter
case would be one file on a case-insensitive disk, and two islands or helpers whose names do
(`Tabs.jsx`, `tabs.tsx`) are one import, so the build bundles the first (the lower layer's) and
warns about the other; the islands that are that file or import it render as their static
placeholders.

The listing islands (`KnowledgeBase`, `ArticleList` and `Changelog`) take the English defaults of
their headings, buttons and messages from `islands/_ui_strings.json`, and the build localizes
and translates those labels from the same file. A copy of it in your `islands/` replaces the
packaged one whole, so keep every label it has: the build stops before it starts, naming the
file and each label yours leaves out.

The site chrome is aardvark's own and belongs to no theme: the search box, the reader assistant,
page feedback, the survey, the 404 page's search suggestions, the breadcrumbs, the tag cloud,
the header buttons and the fallback navigation icon (`Search`, `AiAssistant`, `PageFeedback`,
`Survey`, `NotFoundSuggestions`, `SiteBreadcrumbs`, `TagCloud`, `TopButton` and `NavIcon`). A
theme island with one of those names is ignored, with a build warning.

### Modules aardvark provides to islands

An island imports its siblings in `islands/` (by `./`), npm packages the site installs, and the
modules below, which aardvark provides under the specifier `@aardvark/islands/<name>`. The site
chrome is built from them too, so a theme's islands behave like it. They are part of theme API
`"1.0"`, and they are the only aardvark modules an island may import. An import that climbs out
of `islands/` (`../`, in any `import`, `import()`, `require()` or stylesheet `@import`) reaches
aardvark's own files, which can change in any release, so the build warns about it.

```jsx
import { sanitizeHref } from '@aardvark/islands/safe-href';
```

#### `@aardvark/islands/safe-href`

`sanitizeHref(href)` returns `href` when it is an http(s) or relative URL and `undefined`
otherwise — a `javascript:`, `data:` or protocol-relative URL, even percent-encoded — so a link
built from an author's attribute can't run script. It reads no browser globals, so it also runs
in the build's prerender.

#### `@aardvark/islands/tabler-icons`

[Tabler](https://tabler.io/icons) icons, fetched once per name from the icon CDN the build
passes an island as `iconCdn`. `LazyTablerIcon({ name, iconCdn, style, className })` renders a
fixed-size box and fills it with the icon when it arrives. `classifyIcon(value)` sorts an icon
value into `svg`, `image`, `fa`, `emoji`, `tabler`, `unknown` or `none`;
`tablerIconUrl(iconCdn, name, style)` is the URL an icon is fetched from. `sanitizeSvg(svg)`
rebuilds an SVG an author wrote or the icon CDN served from an allowlist of SVG elements and
attributes, keeping only same-document references, and returns `null` for anything that isn't
one `<svg>`. It is meant for those two sources, not for SVG from untrusted input. `tablerGlyph(icon, iconCdn, className)` renders a Tabler
name only, `bulletNode(bullet, iconCdn, className)` a Tabler name or any other text as it is, and
`resolveCardIcon(icon, options)` any icon value inside a Mantine `ThemeIcon`.

#### `@aardvark/islands/code-actions`

The Copy and Download buttons of a code block: the default export, `CodeActions({ text,
filename })`, and `HighlightedPre({ code, codeHtml, lang, className, ariaLabel })`, the
`<pre><code>` they sit beside. They render the same markup the theme's `code-blocks.js` adds to
Markdown code: an `.aardvark-code-actions` group of `.aardvark-code-btn` buttons, each carrying
`data-aardvark-code-action="copy"` or `"download"`, and a copy announced through the page's
`#aardvark-live` region. A theme that draws its own code buttons keeps that attribute:
[Content Reach](/content-reach/) counts code copies by it.

#### `@aardvark/islands/highlight`

A small syntax highlighter for code an island renders itself. It emits the class names the
build's own highlighting uses, so the theme's syntax colors apply: `tokenizeCode(code, lang)`,
`highlightHtml(code, lang)`, `resolveHighlightLanguage(lang)` and `LANG_SYNTAX` (the languages it
knows), with `extForLang(lang)`, `codeDownloadFilename({ title, lang, index, uid })` and
`codeDownloadFilenames(specs)` for the file a Download button saves.

#### `@aardvark/islands/tag-cloud`

Tag filtering for listing islands, shared with the chrome's tag cloud so all of them read and
write the same `#tag=` address: `collectTags(entries)`, `filterByActiveTags(items, active)`,
`useTagFilter()`, `useSyncedTagFilter(tagSlugs)`, `tagsFromHash(hash, tagSlugs)`,
`samePath(a, b)`, `dispatchTaxonomyFilterChange(slugs)`, and the `TagBadge` and `TagCloudBox`
components. `TagCloudBox` has no text of its own: it shows the `title` and `clearLabel` its
caller passes, so each island keeps its own labels, and without them it has no heading or Clear
button.

### Islands runtimes

aardvark provides two more modules under `@aardvark/islands/<name>`, and they are not for an
island to import. They are *islands runtimes*: the build wraps each island's root in one, in
the prerender and in the browser. A theme names its own in `theme.yaml` (see
[A theme's runtime](#a-themes-runtime)); the packaged `vark` names `mantine-runtime`, and the
site chrome renders through `mantine-runtime` whatever the theme. An island that called `wrap`
itself would put a second provider inside the one it already has.

#### `@aardvark/islands/mantine-runtime`

The Mantine islands runtime: the site chrome's, and vark's. `wrap(element, ctx)` returns an
island's root inside Mantine's provider, with the site's Mantine theme and, in the browser, the
reader's light/dark choice. `ctx` says whether the build prerendered the island (`hydrate`) and whether
this is that prerender (`ssr`), and carries the `theme` and the reader's `colorScheme` store.
`createLibraryTheme(input)` makes that theme from the palettes and font stacks the build derives
from the theme's `$brand` colors and `theme.fonts`. `ssrHoist` is the CSS selector of the
provider's two global `<style>` blocks: the prerender keeps one of each in `<head>` rather than
one per island, so the browser renders neither when it hydrates.

#### `@aardvark/islands/identity-runtime`

The islands runtime that adds nothing: `wrap(element)` returns an island's root unchanged, with
no provider and no theme around it, for components that need neither. A theme whose
`theme.yaml` names no runtime, and builds on none that does, gets this one.

### A theme's runtime

A theme's islands can be built on any React component library, not only Mantine. The theme says
which in its `theme.yaml`:

```yaml
# themes/brand/theme.yaml — a complete theme built on another library
themeApi: "1.0"
extends: null
runtime:
  module: islands/_runtime.jsx      # or a runtime aardvark ships: "@aardvark/islands/<name>"
  css: [my-ui/styles.css]           # the library's global stylesheet, if it has one
  noDomRef: [Tabs]                  # components whose root is no DOM element
baseLibrary:
  key: myui                         # component('myui', 'Card'), or just component('Card')
  package: my-ui
  vocabulary: islands/my-ui.json    # the component names, as a JSON list
  meta: islands/my-ui-meta.json     # what aardvark reads of their props (optional)
```

- **`runtime.module`** is the islands runtime every island of the theme renders through: one of
  the runtimes above, or a module the theme ships. A theme's own runtime is a file at the top of
  its `islands/` whose name starts with `_` (so it is a helper, not an island); it is bundled with
  the islands, and an island that imports it by name without a suffix (`./_runtime`) shares its
  one copy, so it can read a context the runtime provides. A theme built on this one replaces it
  like any helper: its `islands/_runtime.tsx` takes the place of the `islands/_runtime.jsx` below
  and is the file the build checks and bundles, which is why the import carries no suffix. A
  module that re-exports `@aardvark/islands/mantine-runtime` is a runtime of its own, not the
  chrome's: it gets no prepared Mantine theme, so a theme that wants the site's names the core
  runtime itself. It exports:
  - `wrap(element, ctx)` (required: the build refuses a runtime without it) — returns the
    island's root inside whatever the library needs (its provider, its theme). `ctx.theme` is
    what `createLibraryTheme` returned; `ctx.ssr` is set
    in the build's prerender and `ctx.hydrate` when the browser hydrates a prerendered island;
    `ctx.colorScheme` is the reader's light/dark store (`attribute`, `storageKey`, `read()`,
    `createManager()`) in the browser, and `null` in the prerender. `wrap` runs once for an island
    root, and may run again each time the island around one nested on another runtime re-renders
    it; `createManager()` then returns the same manager each time, so a provider keeps its own.
  - `createLibraryTheme(input)` (optional) — makes that theme, once per page load. `input.brand`
    holds the theme's `$brand` colors from `theme.scss`, by name, and `input.fonts` the body and
    heading `font-family` values from `theme.fonts`.
  - `ssrHoist` (optional) — a CSS selector for the nodes `wrap` renders beside the root in the
    prerender, such as a global `<style>`: each page keeps one copy of each in `<head>`.

  The rules that keep a prerendered island from re-rendering on load: in the prerender, `wrap`
  may render nodes outside the island only where `ssrHoist` matches them; with `ctx.hydrate` it
  renders none (the page no longer has them there); it renders the same tree for the same
  element and theme in the prerender and in the browser; and it imports no CSS (list the
  library's stylesheets under `runtime.css`, which the browser bundle imports ahead of every
  island's own). A runtime that needs a package the site hasn't installed, for its module, a
  module it imports, or a `runtime.css` stylesheet, leaves every island that renders through it
  as its static placeholder, with a build warning naming the package; so does a `runtime.css`
  stylesheet the installed package doesn't provide (a version that moved it or stopped exporting
  it), with a build warning naming the stylesheet. Either way the site chrome keeps working. A
  runtime module your theme ships is your own code, like a snippet: an asset URL in
  the markup `wrap` renders (`/background.png`) gets its fingerprinted name on every island that
  renders through it, the base library's included.
- **`runtime.noDomRef`** names the components whose root is not a DOM element (a context
  provider), so an [`attr`](/authoring/components-and-snippets/#attaching-html-attributes-attr)
  can't be attached through a ref: aardvark writes it onto the island's rendered element instead,
  and warns when one is nested. vark's are `Accordion`, `MenuSub` and `NumberFormatter`.
- **`baseLibrary`** makes a library's components addressable by name, as vark's Mantine
  components are: `component('Card')` or `component('<key>', 'Card')`. The vocabulary lists the
  names, so a site renders without Node installed; a bundling build uses what the installed
  package actually exports instead (a newer package can add names the list lacks, an older one
  lack some the list has). The key is reserved, as `aardvark`, `snippet` and `mantine`
  always are: under a theme built on another library, `component('mantine', 'Button')` renders a
  comment and a build warning saying so, and a theme takes `mantine` as its own key only for the
  `@mantine/core` package. `meta` names the file declaring what aardvark reads of those
  components' props (see [Island metadata](#island-metadata)).
- **`nativeMap`** names the theme's own island that receives the map runtime aardvark ships for
  `{% raw %}{% map %}{% endraw %}`. That runtime is built on Mantine, so the island only works
  under a runtime that provides Mantine's; a theme on another library sets `nativeMap: null`
  and ships a map island of its own.

The [site chrome](#the-themes-islands) stays Mantine-based whatever the theme: it keeps rendering
through `@aardvark/islands/mantine-runtime`, beside the theme's runtime, in the same bundle and
prerender, and a page that shows it also loads Mantine's global stylesheet. That stylesheet loads
ahead of the theme's `runtime.css`, so where both style the same element (the page `body`, form
controls) the theme's library wins.

## Island metadata

aardvark reads some island props itself, outside the browser. On a site
[published under a subpath](/deployment/#publishing-under-a-subpath) it adds the subpath to the
props that hold site URLs, and it gives the asset URLs among them their
[fingerprinted names](/authoring/assets/#fingerprinted-output). The build's
[link check](/cli/#vark-link-check) validates the images and links in them. The Markdown export,
the site PDF and the search index convert the islands whose content is in their props rather than
their children. An island declares which props those are, in a comment at the top of its source:

```jsx
/* @aardvark-island {
  "urlProps": ["href", "image", "icon"],
  "imageProps": ["image"],
  "iconImageProps": ["icon"],
  "linkProps": ["href"],
  "implements": ["Card@1"]
} */
import { forwardRef } from 'react';
```

The comment holds one JSON object. Each key is optional and holds a list of strings:

| Key | What aardvark does with it |
| --- | --- |
| `urlProps` | The props whose values are URLs on the site. A root-relative value (`/guide/`) gets the site's subpath, and one that names a fingerprinted asset (`/img/cover.png`) gets its fingerprinted name. Any other value is left as it is: an external URL, a `#fragment`, a relative path, a Tabler icon name or an emoji. |
| `imageProps` | Images the link check validates, like an `<img src>`. A prop named `srcSet` holds a `srcset` list. |
| `iconImageProps` | Icon values the link check validates when they are an image path. A Tabler icon name or an emoji isn't checked. |
| `linkProps` | Links the link check validates, like an `<a href>`. |
| `implements` | The [core interfaces](#core-interfaces) the island implements. |
| `companions` | Optional islands bundled beside this one when a page uses it and every package the companion imports is installed. The island finds a companion at run time with `globalThis.__aardvarkComponent('Name')` and renders without it when it is absent, so a site that lacks the package still builds. `vark`'s `ApiReference` declares `JsonTree`, the collapsible viewer for its response examples. |

A prop is named by a path. `href` is a top-level prop, `brand.href` is the `href` key inside the
`brand` object, and `articles[].href` is the `href` of each member of the `articles` list. A path
that ends in `[]...`, like the `items[]...` of `vark`'s `NavLink`, applies all of the island's
paths again to each member of the list, for props that nest. Each member is read with the
island's own top-level paths, so a member whose children sit under a key the island has no
top-level path for (`nav.items[]...` with children under `items`) needs that key declared
recursively too (`items[]...`). A path under such a member, `items[].href` beside `items[]...`, is
refused with a warning: the recursion already applies `href` there, and a second path would give
the value the subpath twice. Declare a prop only when its value
is a URL: aardvark rewrites the values of the URL props an island declares, so declaring one that
holds data the island displays, such as a JSON viewer's `data` or a QR code's `value`, would
change that data.

The components a page mounts straight from the base library, such as Mantine's `Button` and
`Image` in `vark`, have no source in the theme to carry the comment. A theme declares their
metadata in a JSON file at the top of its `islands/` instead, which `baseLibrary.meta` in its
`theme.yaml` names (`vark`'s is `islands/base_meta.json`). It maps each component name to the
same keys:

```json
{
  "Button": {"urlProps": ["href"]},
  "Rating": {"implements": ["Rating@1"]}
}
```

An island in the theme with one of those names replaces its entry. Every theme folder that
declares `themeApi` may hold a file at that path, and its entries replace a lower folder's
entries for the same names, so a folder needs only the entries it changes. The metadata comes
from the theme's own layers alone: a theme that builds on nothing and declares a `baseLibrary` of
its own has what its files declare.

aardvark reads the metadata of the packaged theme, of a complete theme (one whose `theme.yaml`
declares `themeApi`) and of its own site chrome. A theme folder without `themeApi` is your own
code, like a [snippet](/authoring/custom-snippets/): aardvark reads neither its islands' comments
nor its base library metadata file, and doesn't read those islands' props for search, the PDF or
the Markdown export. A comment that isn't valid JSON, one placed below the file's first statement,
an unknown key, a value that isn't a list of strings, a path it can't read, an interface this
aardvark doesn't know or a metadata entry for a
component the base library doesn't have gets a build warning naming the file, and the part at
fault is ignored.

An island a complete theme adds with no comment has no declaration, so aardvark reads none of
its props. Under a name the packaged theme defines it is still the theme's island, as the packaged
one is, so a complete copy of vark builds as the packaged one does; under a name of its own it is
your own code, like a snippet, so an asset URL in its props still gets its fingerprinted name. A
comment that names nothing, `{}` or `{"urlProps": []}`, is a declaration all the same: the island
is the theme's under any name, and aardvark leaves the props it doesn't name as they are, an asset
path among them.

## Core interfaces

Some of aardvark's own output reads an island's props: each page's Markdown export and
`llms-full.txt`, the reader assistant's copy of each page, the site PDF and the search index.
Each of those conversions is keyed by a **core interface**, named `Name@Version`, and applies to
every island that lists the interface under `implements`. An island that implements none is
converted like any other island: the Markdown export and the search index keep its children, and
the PDF prints the first of its `title`, `label`, `summary` and `heading` props above them. A
theme doesn't have to implement every interface, and nothing warns when it doesn't; its islands
just get that plain conversion.

`vark` implements each interface in the component of the same name: its island, or for a
Mantine component such as `Badge` or `Image`, the entry in its `base_meta.json`.

| Interface | The props aardvark reads | Where |
| --- | --- | --- |
| `ApiField@1` | `name`, `type`, `required`, `deprecated`, `location` and `default`, as the line above the field's description (its children). | Markdown export, PDF |
| `ApiReference@1` | `spec`, an OpenAPI document: its descriptions and operations. | Assistant copy, PDF, search |
| `ArticleCard@1` | `title`, `href` and `description`. | PDF |
| `ArticleList@1` | `articles`, a list of `{title, href, description}`. | PDF |
| `Badge@1` | Its children, else `text` or `label`, and `color`. | PDF |
| `Card@1` | `title`, `icon` (with `filled`), `badge` or `badges`, then its children. | PDF |
| `Changelog@1` | `entries`, a list of dated groups (`date`, `dateDisplay`, `tags`) whose `changes` each hold a `title`, `version`, `url` and `descriptionHtml`. | Assistant copy, PDF, search |
| `CodeGroup@1` | `tabs`, a list of code blocks (`code`, `lang`, `title`). | Markdown export, PDF |
| `Divider@1` | Nothing: a rule. | PDF |
| `ExamplePanel@1` | `title`, `kind` and `blocks`, a list of code blocks. | Markdown export, PDF |
| `Icon@1` | `icon` (or `name`), and `filled`: a Tabler icon or an image. | PDF |
| `Image@1` | `src`, `alt`, and `size`, `width` or `w`. | PDF |
| `KnowledgeBase@1` | `featured` and `articles`, lists of `{title, href, excerpt}`, with the `topLabel` and `allLabel` headings. | PDF |
| `Map@1` | Nothing: a note to view the page online. | PDF |
| `Prompt@1` | `text`, the prompt, and its `title`. | Markdown export, PDF |
| `Rating@1` | `defaultValue` or `value`, out of 5. | PDF |
| `Stepper@1` | Its children, as a numbered list. | PDF |
| `StepperStep@1` | Its children, as one step. | PDF |
| `Text@1` | Its children, with `fw`, `fz` or `size`, `c` or `color`, `ta`, `tt`, `td`, `fs` and `span`. | PDF |
| `ZoomImage@1` | The same props as `Image@1`. | PDF |

In the table, the Markdown export is each page's `.md` and `llms-full.txt`. The reader
assistant's copy of a page includes it and adds the `ApiReference@1` and `Changelog@1`
conversions.
