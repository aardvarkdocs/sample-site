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
navigation in the sample site. It doubles as a worked example of how aardvark
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

See [Navigation menus](/authoring/navigation/) for the full mechanism.

Walk down the tree — **Deep nesting → Level 2 → Level 3 → Level 4 → Level 5**.
Open [Level 2](/deep-nesting/level-2/) to start the descent.
