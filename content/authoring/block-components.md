---
description: Wrap Markdown in a tag pair so a component's body renders as full Markdown —
  how block tags pair, nest and take attributes, and how to build or replace one.
icon: fa-solid fa-cubes
menu: docs
title: Block components
weight: 22
---

# Block components

`component('Name', …)` drops a single component inline, and its `children` is a
plain string — Markdown inside it is **not** rendered. **Block components** solve
the other case: a compound built from several Mantine components, given its own
tag pair, wrapping a region of **Markdown that renders normally**.

The **accordion** is one:

{% raw %}
```aardvark
{% accordion %}
{% accordionSection title="Section One" %}
## Markdown content

**This builds great!**
{% endAccordionSection %}
{% endAccordion %}
```
{% endraw %}

renders, live:

{% accordion %}
{% accordionSection title="Section One" %}
## Markdown content

**This builds great!**
{% endAccordionSection %}
{% accordionSection title="Section Two" %}
## More Markdown content

- This bulleted list actually renders!
- See?
{% endAccordionSection %}
{% endAccordion %}

Each section's `title` is the clickable control, and everything between the tags
is its body — full Markdown (headings, lists, code, links), plus any
`component(...)` call or even a nested block.

## How it works

At build time the `{% raw %}{% %}{% endraw %}` engine expands the block into nested
Mantine islands (`Accordion` › `Accordion.Item` › `Accordion.Control` +
`Accordion.Panel`) and lets the page's single Markdown pass render each panel
body. In the browser the island mounts like any other component.

The body of a block is rendered **through the same engine and the same page
namespace** before the block sees it, so a variable you set earlier on the page is
visible inside, `component(...)` calls and `{% raw %}{% %}{% endraw %}` expressions
work, and blocks nest — a `{% raw %}{% tabs %}{% endraw %}` inside an accordion
section is fine. Same-named blocks pair up by depth, so an accordion inside an
accordion closes correctly.

Five blocks are the exception, because their bodies are **source, not Markdown**:
`{% raw %}{% file %}{% endraw %}`, `{% raw %}{% map %}{% endraw %}`,
`{% raw %}{% requestExample %}{% endraw %}`, `{% raw %}{% responseExample %}{% endraw %}`
and `{% raw %}{% codeGroup %}{% endraw %}` take their body **verbatim** — code, code
fences, or `pin` lines, left exactly as typed. Their attributes are parsed normally, but
nothing inside the body runs: a `component(...)` call or a `{% raw %}{% %}{% endraw %}`
expression written there is emitted as literal text rather than evaluated. Build the
value outside the block and pass it as an attribute instead.

## Attributes

An open tag takes attributes in the same shape as every other tag:

- `key="quoted"` or `key='quoted'` stays a string. A double-quoted value understands
  `\"` and `\\`; a single-quoted one is taken literally.
- A bare `key` is `true`; an unquoted `key=3`, `key=0.5`, `key=true` / `key=false` or
  `key=null` is read as that number, boolean, or `None`.
- `attr={...}` is special: a Python dict of raw HTML attributes forwarded to the block's
  outer element, exactly like [`attr` on a component](/authoring/components-and-snippets/#attaching-html-attributes-attr).

Every built-in block can also be called from Python — `component('aardvark', 'accordion',
children=…)` renders exactly what the tag does — so you can build one inside a
`for` loop; see [Templating & data](/authoring/templating/#whats-in-scope).

## Every block is a component

The accordion, tabs, cards, the callout and every other block under **Built-in
Components**, except the few [the template engine owns](#tags-the-template-engine-owns),
are components of the default `vark` theme: one `.md` definition per tag in
the theme's `components/` folder (see [Theme & customization](/theming/#files)), written
the same way as the [custom components](/authoring/custom-components/) you define
yourself. So you can add a block of your own, or replace a built-in one.

### Build your own

To build a block of your own, write a custom component whose closing tag is mandatory and
whose body pads its `children` with blank lines, so the page's Markdown pass renders them:

```aardvark
---
name: Aside                # the tag: {% raw %}{% Aside %}{% endraw %} … {% raw %}{% endAside %}{% endraw %}
close: required
---
{% raw %}{% component('Paper', withBorder=True, p='md', children="\n\n" + children + "\n\n") %}{% endraw %}
```

`close: required` makes a missing `{% raw %}{% endAside %}{% endraw %}` a build error
rather than an empty block. Two more front-matter keys shape a block's body:
`childScope: true` gives tabs or accordion sections among the children their own set
of values, as the built-in tabs do, and `children: raw` hands the body over verbatim,
as the built-in `codeGroup`, `requestExample`, `file` and `map` do. [How a tag is called](/authoring/custom-components/#how-a-tag-is-called)
lists every key.

### Replace a built-in

Define `components/<tag>.md` in your project with the built-in's `name:` and your
definition is used everywhere that tag appears, including
`component('aardvark', '<tag>', …)` calls.
[Replace a built-in](/authoring/custom-components/#replace-a-built-in) gives the order
that decides between your project's definition and your theme's layers.

## Tags the template engine owns

A few names belong to the template engine itself, so no component can take them or
replace them:

- `{% raw %}{% raw %}{% endraw %}` / `endraw`, which shows template syntax as written.
- [Include](/components/extras/include/) (`include`), which renders another file in place.
- [Visibility](/components/extras/visibility/) (`visibility` / `endVisibility`) — show or hide a block depending on whether a human is reading the HTML page or an AI agent is reading its Markdown twin.
- [Target](/components/extras/target/) (`target` / `endTarget`) — names a region of a page so Content Reach reports on it as its own section; it renders no chrome of its own.

A definition that takes one of these names fails the build with a clear error. Every
other tag — [Icon](/components/data-display/icon/),
[Changelog](/components/extras/changelog/), [Taxonomy](/components/extras/taxonomy/) and
[OpenAPI](/components/extras/openapi/) included — is a component you can replace.

## Good to know

- **A block with `close: required` must be closed.** An open tag with no matching close
  fails the build (`Unclosed {% raw %}{% accordion %}{% endraw %}`); the engine's own
  paired tags behave the same way. A component without `close: required` may instead be
  self-closing. A stray close tag with no open is dropped silently.
- **A tag named after a component is that component.** `{% raw %}{% card %}{% endraw %}`
  is always the card, not a Python expression that happens to start with the word
  `card` — unless the name is followed by `(`, `.` or `[`, which makes it Python using
  a variable of that name.
- **`{% raw %}{% raw %}{% endraw %}` is respected when pairing tags.** A close tag shown
  inside a raw region — the way this page shows `{% raw %}{% endAccordion %}{% endraw %}` in
  its code sample — doesn't terminate the surrounding block.
