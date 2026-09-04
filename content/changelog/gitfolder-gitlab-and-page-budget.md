---
title: The repo browser reads GitLab, and keeps a page-weight budget
date: 2026-08-30
version: "0.4.0"
taxonomy:
  - name: changes
    tags: [components, build]
nav: false
noindex: true
---

# The repo browser reads GitLab, and keeps a page-weight budget

{% raw %}`{% gitfolder %}`{% endraw %} and `github=` code fences now read public **GitLab**
projects. Name one with a full `https://gitlab.com/…` URL — a project URL for the widget, a
`/-/blob/<ref>/<path>` or `/-/raw/<ref>/<path>` file URL for a fence — and everything works as
it does for GitHub: one anonymous archive download, no API call, no token, the same cache.
Nested groups are supported. A bare `owner/repo` shorthand still means GitHub, since it
carries no host; set `provider: gitlab` in the `github:` config block to point the shorthand
forms at gitlab.com instead. Only gitlab.com is supported — a self-managed host would be an
arbitrary page-supplied download host, which the build's allowlist refuses by design.

The widget also has a page-weight budget now, so one embed can't grow without limit. It
embeds its files' source, highlighting and rendered previews until it reaches
`gitfolder.maxEmbedBytes` (default **2 MiB**), counted the way the page really carries them —
encoding and escaping inflate ordinary source about half again. Files are embedded in path
order until one doesn't fit; that file and every text preview after it are **listed rather
than embedded**. Each keeps its row in the tree, its size, its source link and its place in
the Download ZIP, and the widget says the preview was skipped for page weight rather than
claiming the file is too large. Images ride as served files, outside the budget, and keep
displaying. The build names what it did not embed and points at both remedies: scope the
widget with `folder=`, or raise the budget. Raising it re-downloads nothing — the budget is
applied when the page renders, so the next build picks it up.

See [gitfolder](/components/extras/gitfolder/).
