---
name: codeGroup
description: A code group — several fenced code blocks shown as language or file tabs, each with
  its own copy button and syntax highlighting. The body is a run of ordinary fenced code blocks,
  taken verbatim; a fence's language (and an optional title) labels its tab. `defaultValue` picks
  the tab that starts open, and any other tabs setting passes through.
body: python
close: required
children: raw
passthrough: true
---
```python
# Renders the CodeGroup island (CodeGroup.jsx). The body is captured verbatim (`children: raw`) —
# it is source code, not Markdown to render — and each fence in it becomes one tab: its language,
# an optional title label, the raw code, and build-time highlighted markup (codeHtml), the same
# channel a file in a tree uses. The tabs come from the fences themselves, so authors write plain
# fenced code blocks (no extra tags) and get a tabbed, per-tab-copyable group.
#
# A fence's language + optional title="…" drive the tab label, read with the same fence-info
# grammar as a normal fenced block, and the body is highlighted with the same highlighter fences use
# (gated on theme.syntax.enabled). The raw `code` always rides along for the Copy action. The
# island renders inline inside .aardvark-content, so the site's code-block colors apply with no
# extra CSS. av.parse_fence_blocks is the one fence grammar, shared with the request/response
# example panels, so the tags agree on exactly what a fence is.
import aardvark.components as av

# Boolean Mantine <Tabs> props an author might set — normalized by coerce_flag_attrs.
_CODEGROUP_FLAG_ATTRS = ("keepMounted", "activateTabWithKeyboard", "allowTabDeactivation", "loop", "inverted")

# Strip an optional whole-body raw wrapper first, like the other raw-children tags, so it doesn't
# leave stray wrapper tags around the fences.
tabs = av.parse_fence_blocks(
    globals(),
    av.strip_raw_wrapper(children),
    tag_label="{% codeGroup %}",
    unit="tab",
    blank_whitespace_only=True,
)
if not tabs:
    # No fenced blocks in the body: a code group with nothing to tab. Warn (like the map's pin and
    # the tree's folder authoring-mistake warnings) and render nothing rather than an empty tab
    # strip.
    av.warn("Aardvark: {% codeGroup %} has no fenced code blocks — nothing to show; skipping it")
else:
    props = av.safe_attrs(attrs)
    # These ride straight through to Mantine <Tabs> as ...rest, so coerce the quoted forms too.
    av.coerce_flag_attrs(props, _CODEGROUP_FLAG_ATTRS)
    props["tabs"] = tabs
    # Page-unique instance id → download filenames unique across the whole page (two code groups
    # don't collide on snippet-1.sh), not just within one group — see codeDownloadFilename.
    props["uid"] = av.uid(globals())
    print(component("CodeGroup", attr=attr, **props))
```
