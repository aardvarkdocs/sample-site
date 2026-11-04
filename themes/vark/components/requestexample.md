---
name: requestExample
aliases: [responseExample]
description: A request or response example panel for API docs — a titled panel of one or more
  fenced code blocks, each syntax-highlighted with its own copy and download buttons, and a tab
  strip when there is more than one. requestExample defaults its heading to "Request",
  responseExample to "Response"; `title` overrides it. The body is taken verbatim.
body: python
close: required
children: raw
passthrough: true
---
````python
# Renders the ExamplePanel island (ExamplePanel.jsx): the side-by-side request/response panels for
# API docs (Mintlify "Examples"), typically pinned in a page's right-hand column. Both tags share
# this one definition and one island, told apart by a `kind` prop that only drives the default
# title, icon and accent color; the body parsing and highlighting are identical.
#
# Like a file in a tree, the body is captured verbatim (`children: raw`): it is source code and
# payloads to DISPLAY as fenced blocks, not Markdown to render or a template to execute. The fences
# are parsed out with av.parse_fence_blocks and each block is highlighted at build time, its
# token-span markup riding as the block's `codeHtml` so it colors exactly like a hand-authored
# fence. The raw `code` always rides along for the island's Copy/Download actions and as the
# fallback when highlighting is off or no lexer matches.
import aardvark.components as av

# The tag the author wrote picks the panel's role.
kind = {"requestExample": "request", "responseExample": "response"}[av.tag_name(globals())]

blocks = av.parse_fence_blocks(
    globals(),
    av.strip_raw_wrapper(children),
    tag_label="{% requestExample %}/{% responseExample %}",
    unit="block",
    dedent=True,
)
if not blocks:
    # A panel with no fenced blocks would render an empty, titled box — almost always an authoring
    # mistake (forgot the ``` fences, or used indentation instead). Surface it as a build warning
    # rather than shipping a blank panel, but still emit the island so an explicit title/description
    # is honored (the map/card "degrade, don't fail" stance).
    av.warn(
        f"Aardvark: {{% {kind}Example %}} has no fenced code blocks — wrap each example in a "
        "``` fence (```json … ```); rendering an empty panel"
    )
# `title` is an author override for the heading; `blocks`/`kind` are derived, never taken from
# author attrs (dropping them stops a stray `blocks=`/`kind=` attr from overriding the parsed body
# or flipping the panel's role). `title` is dropped from the spread and re-added below only when
# non-blank, so a whitespace-only title="   " falls back to the kind's default heading instead of
# forwarding a truthy-but-blank string the island can't fall back from (ExamplePanel:
# `heading = title || meta.defaultTitle`).
props = av.safe_attrs(attrs, "blocks", "kind", "title")
props["kind"] = kind
props["blocks"] = blocks
title = str(attrs.get("title", "")).strip()
if title:
    props["title"] = title
# A page-unique instance id so an untitled block's download filename is unique across the WHOLE
# page (two same-language request panels don't both save as snippet.json), not just within one
# panel — see the shared codeDownloadFilename helper. Overrides any stray author `uid`.
props["uid"] = av.uid(globals())
print(component("ExamplePanel", attr=attr, **props))
````
