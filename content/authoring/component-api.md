---
description: The Python API a component definition's body imports — build warnings, the call it
  is answering, page-unique ids, prop shaping, link and CSS safety, code and inline Markdown,
  maps, repositories, dates, and the changelog, taxonomy and OpenAPI listings.
icon: fa-solid fa-code
menu: docs
title: Component Python API
weight: 21.6
---

# Component Python API

A [component definition](/authoring/custom-components/)'s body is Python that runs at build
time. Besides the standard library, it can import one module from aardvark itself:
`aardvark.components`, the helpers the built-in components are written with. They cover what
a component commonly needs from the build — its warnings, its settings, page-unique ids, safe
props — and the three listings that also add to the page's table of contents, feeds and
navigation.

{% raw %}
````markdown
---
name: Notice
body: python
passthrough: true
params:
  title: string
---
```python
import aardvark.components as av

props = av.safe_attrs(attrs, "title")
av.coerce_flag_attrs(props, ("withBorder",))
av.drop_unsafe_css(props, ("color",), tag="Notice")
if title:
    props["title"] = title
else:
    av.warn("Notice: add a title so readers know what the notice is about")
print(component("Paper", children=children, attr=attr, **props))
```
````
{% endraw %}

A function whose first parameter is `ns` takes the body's own namespace — pass `globals()`.
That is how it reads the build (its configuration, the page's id counter, the call being
answered) without the body touching aardvark's internals. Pass `globals()` to these functions
and use it for nothing else. For the same reason no component param can be named `globals`.

A body should import only `aardvark.components`, under a name (`as av`), and these
standard-library modules: `json`, `html`, `re`, `math`, `itertools`, `functools`,
`collections`, `dataclasses`, `typing`, `string`, `textwrap`, `datetime`, `urllib.parse`,
`unicodedata` and `enum`. It reads the names on this page and never assigns to them: every
component in the build shares one `av`. aardvark's own components follow these rules; they keep
a definition readable as a component rather than as a program.

## Versions

Every name on this page is part of API version 1.0. A later minor version only adds names; a
change that removes or reshapes one bumps the major version.

### `av.API_VERSION`

The API version this aardvark provides, as a `(major, minor)` tuple — `(1, 0)`.

## The call and the build

### `av.ComponentError`

Raise it with a message that says what to fix. The build stops and reports your message as it
is, with no traceback around it. When the call sits inside another component or a Python block,
the build also says where that is.

### `av.warn(message)`

Report a problem the page can still render past: a malformed value you fell back from, an
attribute you ignored. The build counts it in its summary and `vark dev` shows it; nothing
fails.

### `av.tag_name(ns)`

The tag the author wrote to call the component. With `aliases:`, one definition answers several
tags, and this tells them apart.

### `av.call_source(ns)`

The file the call was written in: a page, a partial, or another component's body. Useful in a
message the author needs to act on.

### `av.supplied(ns)`

The names the author set at the call, as a set: every attribute written, and the param a
leading quoted value binds. Every declared param is bound in the body (to `None` when unset), so
this is how to tell `level=null` from no `level` at all.

### `av.syntax_enabled(ns)`

Whether the site highlights code (`theme.syntax.enabled`). `True` when the build has no
configuration.

### `av.tabler_icon_cdn(ns)`

The address an icon-bearing island fetches [Tabler](https://tabler.io/icons) glyphs from: the
site's `theme.iconCdn`, else the pinned default at `theme.iconVersion`. Pass it as the island's
`iconCdn` prop when it will show an icon named by the author.

## Page-scoped identity

### `av.uid(ns)`

The next number from the page's one counter, shared by every component, block and layout on the
page — for ids that must not collide, such as a download file name or a fallback `value`.

### `av.slugify(text)`

`text` as an anchor slug, by the same rules the page's heading ids use.

### `av.unique_slug(slug, seen)`

`slug`, or `slug-1`, `slug-2`, … — the first that isn't in the set `seen`, which it is added to.

### `av.dedupe_value(ns, value)`

`value` made unique among its sibling sections. A tab or accordion section usually takes its
`value` from its label, and two sections with like labels would share one. Inside the body of a
built-in block whose body is rendered — a tabs or accordion block, among others — or of a
component declared `childScope: true`, this appends `-1`, `-2`, … against the innermost one, so
each section keeps its own. Outside every such body it returns `value` unchanged.

### `av.dedupe_child_island_values(inner, island, *, container=None)`

The same de-duplication, applied after the fact to rendered children: every `island` among the
direct children in `inner` gets a unique `value`. `container` names a nested island of the
parent's own kind, whose children are de-duplicated separately.

## Props

### `av.attr_flag(value)`

A boolean attribute read the way the author means it. A bare flag, `true` and `1` are on; the
quoted values `"false"`, `"0"`, `"no"`, `"off"` and `""` are off.

### `av.coerce_flag_attrs(props, keys)`

Turn each of the named attributes in `props` that arrived as a quoted string into a real
boolean, in place, by the rule above.

### `av.safe_attrs(attrs, *drop)`

A copy of `attrs` without `children` and `attr` — which would collide with the component call's
own arguments — and without any name in `drop`.

### `av.as_float(value)`

`value` as a finite number, or `None` when it is absent, a bare flag, not a number, NaN,
infinite, or too large for a float.

### `av.as_int(value)`

`as_float(value)` rounded to the nearest whole number, or `None`.

### `av.css_color_is_safe(value)`

Whether an author's color can be written into an inline style without escaping it: no
unbalanced parenthesis, no `url(`, no `;`, no comma outside parentheses, and no line break
(`rgb(…)` and `hsl(…)` are fine).

### `av.drop_unsafe_css(props, keys, *, tag, noun="color")`

Remove each named prop whose value fails `css_color_is_safe`, warning once per value. `tag`
names your component in the warning; `noun` says what kind of value it was (`"length"` for a
width, say).

### `av.parse_gradient(attrs, *, tag)`

A `{from, to, deg}` gradient from a `gradient="from,to,deg"` shorthand or the separate
`gradientFrom`, `gradientTo` and `gradientDeg` attributes, or `None` when none is set. Colors
that fail `css_color_is_safe` are dropped with a warning naming `tag`.

### `av.merge_onclick(attr, attrs)`

The HTML-attribute dict to mount with: the tag's `attr` dict, with the tag's own `onclick`
attribute taking precedence. `None` when there is neither.

### `av.link_href(attrs)`

The link a tag renders: `href`, else `url`, or `None` when neither is set. `url` is an alias only
when `href` is absent, so an explicit `href=false` or `href=null` (a deliberate no-link) never falls
through to it.

### `av.is_unsafe_href(value)`

Whether a link target must be refused: a `javascript:`, `data:`, `vbscript:`, `file:` or `blob:`
URL, or a protocol-relative one (`//host`), including percent-encoded and control-character
disguises. An empty value is safe.

### `av.ARTICLE_CARD_VARIANTS`

A read-only mapping from each article-card variant name an author may write (`horizontal`,
`footer`, `withfooter`, `background`, `image`, `vertical`, `plain`, `grid`) to the variant the
card renders.

## Code and inline Markdown

### `av.render_inline_markdown(text, *, asset_url_resolver=None)`

`text` rendered as inline Markdown — bold, code, links — with no paragraph around it. Raw HTML in
the text is kept, so render only text the page's author wrote.

### `av.render_inline_fragment(ns, text)`

`render_inline_markdown` for text that will travel inside an island's props, where the page's
later passes never look: asset links are resolved to their fingerprinted files and root-relative
links get the site's base path here instead.

### `av.collapse_blank_lines(text)`

`text` with each run of blank lines, and the indentation after it, squeezed to one line break, and
no line break at either end. Use it on children made only of components, such as the folders and
files inside a tree: the page's Markdown pass keeps back-to-back components together as HTML, but
a blank line ends that, and an indented component after it would show as a code block. Children
that pad a Markdown body with blank lines on purpose, such as a tab's panel, need theirs.

### `av.highlight(code, lang)`

The syntax-highlighted HTML of `code` in `lang`, exactly as a fenced block renders it (without
the surrounding `<pre><code>`), or `""` when no highlighter knows the language.

### `av.lang_for(filename, explicit=None)`

The highlighting language for `filename`: `explicit` when it is a non-empty string, else one
recognized from the whole name (`Dockerfile`), else from its extension, else `None`.

### `av.strip_raw_wrapper(body)`

`body` without the one pair of raw tags wrapped around all of it, when there is exactly that; any
other body unchanged. A `children: raw` body needs such a wrapper only to show the component's own
closing tag literally.

### `av.normalize_code(body)`

A captured code body tidied for display: blank lines at either end dropped and the common
indentation removed. A body of only whitespace becomes `""`.

### `av.parse_fence_blocks(ns, body, *, tag_label, unit, dedent=False, blank_whitespace_only=False)`

Every fenced code block in `body`, in order, as a list of `{code, lang?, title?, codeHtml?}`
dicts: `lang` and `title` come from the fence's info string as on any fenced block, and
`codeHtml` is the highlighted code when the site highlights and the language is known. A fence
left unclosed is kept, with a warning naming `tag_label` and calling the result one `unit`.
`dedent` removes the opening fence's indentation from its lines; `blank_whitespace_only` empties
a block that holds only whitespace.

## Maps

### `av.map_enabled(ns)`

Whether the site's maps are on — `map: false` turns them off. `True` with no configuration.

### `av.map_settings(ns)`

The site's `map:` settings (`style`, `height`, …) as a read-only mapping; empty when there are
none.

### `av.parse_pin_tags(body)`

The attributes of every self-closing `{% raw %}{% pin … %}{% endraw %}` tag in a raw map body,
in order, each a dict read like any tag's attributes.

### `av.geocode(ns, address, *, kind)`

`address` as `(lat, lng)`, looked up once per build, or `None`. `kind` is `"pin"` or `"center"`
and picks the warning an unresolvable address gets. Where the build does no geocoding — during
`vark link-check`, for one — it returns `None` quietly.

### `av.coords_in_range(lat, lng)`

Whether a latitude and longitude are on Earth: latitude within ±90, longitude within ±180.

### `av.looks_like_number(token)`

Whether `token` is made only of digits, signs and dots, with at least one digit — an attempt at
a number, even one that doesn't parse (`2.3.4`). Tells a mistyped coordinate from an address
that starts with a house number.

### `av.map_fallback_html(pins)`

The static HTML a map shows before its script runs: each pin as a link to the location on
OpenStreetMap.

## Repositories

### `av.gitfolder_enabled(ns)`

Whether the site fetches repository folders — `gitfolder: false` turns it off. `True` with no
configuration.

### `av.repo_fetch_available(ns)`

Whether this render can fetch a repository folder. A build can; `vark link-check` renders pages
without fetching, so a component should render nothing there.

### `av.fetch_repo_folder(ns, github, folder, ref, cache)`

Fetch `folder` (`""` for the root) of the public repository `github` (`owner/repo`, or a GitHub
or GitLab URL) at `ref` (`None` for its default branch). The result carries `owner`, `repo`,
`ref`, `folder` (normalized — link from this, not the author's spelling), `files`, `zip_url`,
`default_path`, `license` and `license_known`. It is `None` when the fetch failed in a way the
build can live with (the network, a missing folder, a rate limit), which has already been
warned about. `cache` is the author's attribute: unset follows the site's `gitfolder.cache`.
Check `repo_fetch_available` first; calling this where it is `False` is an error.

### `av.repo_links(github, folder, ref)`

Where a folder lives on its host, for a fallback that links to it when the fetch failed: a
`RepoLinks`, or `None` when `github` isn't a repository.

### `av.RepoLinks`

A named tuple of `label` (`owner/repo` or `owner/repo/folder`), `url` (the folder's page on its
host, at `ref` when one is given) and `provider_display` (the host's name, such as `GitHub`).

## Dates

### `av.DateError`

Raised by `parse_date` for a value that isn't a date. A `ValueError`.

### `av.parse_date(value, label)`

A `YYYY-MM-DD` date or an ISO timestamp — as a string, or the date YAML front matter already
parsed — as `(when, has_time, instant)`: `when` is the local date and time to sort and display
on, `has_time` whether the author gave a time, and `instant` keeps any UTC offset the author
wrote, for a feed. `label` names the value in a `DateError`.

### `av.display_date(when, has_time)`

`when` for readers, the same in every locale: `May 20, 2026`, or `May 20, 2026, 2:30 PM` when
`has_time`.

## Listings

A changelog, a taxonomy listing and an API reference do more than mount an island: each adds
entries to the page's table of contents, a changelog publishes an RSS feed, and an API reference
adds its operations to the navigation and the site's API catalog. A component does this in two
steps. A `prepare_*` function does all of that and returns what to mount; `mount_directive`
mounts it. They are the same two steps the built-in listing tags take, so a component that
calls them renders exactly what the tag does.

{% raw %}
````markdown
---
name: releaseNotes
body: python
close: never
passthrough: true
positional: {param: path, noun: data-file path, example: "{% releaseNotes 'data/changes.yaml' %}"}
params:
  path: {type: string, required: true}
---
```python
import aardvark.components as av

prepared = av.prepare_changelog(globals(), path, attrs, attr=attr)
print(av.mount_directive(globals(), prepared))
```
````
{% endraw %}

When the call itself is wrong — a data file or spec that isn't there, an attribute value
the listing refuses, a listing placed where none can render — the `prepare_*` function raises
`av.ComponentError` with the tag's own message, naming the page.

A body that prepares a listing must mount it before it returns — the build fails otherwise,
since the listing's contents, feed and navigation would ship without it. It must also mount it
for the same readers it prepared it for: the table of contents and feed entries a `prepare_*`
function adds follow any visibility block around it, so prepare and mount inside the same one.

### `av.DirectiveMount`

A prepared listing: `directive` (`"changelog"`, `"taxonomy"` or `"openapi"`), the `island` it
mounts, its `props` (read-only, in order) and the tag's `attr` dict. Each one mounts once.

### `av.prepare_changelog(ns, path, attrs, *, attr=None)`

Prepare a changelog read from the YAML data file `path` (relative to the site root). `attrs`
are the changelog tag's attributes — `wide`, `tags`, `limitDays`, `limitEntries`,
`combineByDay`, `toc` and the label overrides — and `attr` its HTML-attribute dict.

### `av.prepare_taxonomy(ns, attrs, *, attr=None)`

Prepare a listing of the pages in a taxonomy: `attrs` are the taxonomy tag's attributes, from
`name` and `type` on.

### `av.prepare_openapi(ns, spec, attrs)`

Prepare an API reference for the OpenAPI document `spec` (relative to the site root) — one
operation when `attrs` gives both `verb` and `endpoint`.

### `av.mount_directive(ns, prepared, island=None, props=None)`

Mount a listing this body prepared and return its markup. `island` and `props` replace the
prepared ones — build a changed `props` from `dict(prepared.props)`. Under another `island`,
the listing's links still get the site's `basePath`. It fails when the listing was prepared
inside a different visibility block than the one it mounts in.

### `av.localized_labels(ns, attrs, defaults)`

The interface labels to pass an island: for each `{prop: English text}` in `defaults`, the
author's attribute when set, else the text in the page's language when the site translates it.
A label still in English is left out, so the island shows its own default.
