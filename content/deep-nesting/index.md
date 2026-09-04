---
description: A five-level-deep section of the Docs sidebar — a living example, and
  visual fixture, of how far navigation nesting goes.
heading: Examples
heading-icon: fa-solid fa-vials
icon: fa-solid fa-layer-group
id: deep-nesting
menu: docs
title: Deep nesting
weight: 95
---

# Deep nesting

This section nests **five levels deep** in the left sidebar — the deepest
navigation in the sample site. It doubles as a worked example of how Aardvark
assembles a sidebar tree and as a visual fixture for checking that deeply nested
navigation still renders and indents correctly.

There is no depth limit. Each level is an ordinary page that points at its parent
in front matter — children attach to a parent by its `id`, and every level below
inherits the `docs` menu through the chain:

```yaml
# this page (level 1) — the section root
id: deep-nesting
menu: docs

# a child page (level 2)
parent: deep-nesting
```

Each level here names its parent explicitly. Pages that set neither `menu` nor
`parent` attach themselves to the nearest enclosing section `index.md`, so a folder
of files nests without any per-file front matter — see
[Sections from folders](/authoring/navigation/#sections-from-folders). Leave `id`
out and a page gets one derived from its path; it's spelled out here only so the
children have a readable name to point at. See
[Navigation menus](/authoring/navigation/) for the full mechanism.

The breadcrumb trail at the top of each page grows with the depth: it leads with
the owning tab and section (*Docs / Examples*), then every ancestor down to the
page — on Level 5 it reads *Docs / Examples / Deep nesting / Level 2 / Level 3 /
Level 4 / Level 5*.

Walk down the tree — **Deep nesting → Level 2 → Level 3 → Level 4 → Level 5**.
Open [Level 2](/deep-nesting/level-2/) to start the descent.
