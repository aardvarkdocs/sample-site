---
title: "BlockNote"
description: "BlockNote — a block-based rich-text editor by TypeCellOS. A Community Component that aardvark does NOT bundle, because its source is MPL-2.0 copyleft. This page records the license verdict and links to the project."
menu: components
parent: community
weight: 130
---

# BlockNote

[BlockNote](https://www.blocknotejs.org/) is a **block-based rich-text editor** by
**TypeCellOS** — a Notion-style WYSIWYG editor built on ProseMirror, with a first-class
Mantine theme (`@blocknote/mantine`). It's a natural fit for a "Community Component" wrapper
on paper.

aardvark, however, does **not** ship BlockNote as a built-in `{% raw %}{% tag %}{% endraw %}`.
This page exists to record *why*, and to point you at the project so you can integrate it
yourself if its license works for your project.

{% callout severity="caution" title="Not bundled — license verdict" %}
BlockNote's source code is licensed under the **Mozilla Public License 2.0 (MPL-2.0)**, a
**copyleft** license. aardvark's policy for Community Components is to bundle only
permissively-licensed projects (MIT / Apache-2.0 / BSD / ISC) into its island bundle. Because
MPL-2.0 carries file-level copyleft obligations, BlockNote is **documented but not bundled**.
There is no `{% raw %}{% blocknote %}{% endraw %}` tag.
{% endCallout %}

## License

The verdict was confirmed against two independent sources on 2026-06-19:

| Source | Finding |
| --- | --- |
| [`registry.npmjs.org/@blocknote/core`](https://registry.npmjs.org/@blocknote/core) | `"license": "MPL-2.0"` (and likewise for `@blocknote/mantine`, `@blocknote/react`) |
| [`LICENSE.txt`](https://github.com/TypeCellOS/BlockNote/blob/main/LICENSE.txt) in the GitHub repo | *"Source code in this repository is covered by the Mozilla Public License Version 2.0 (MPL-2.0), except for the XL packages."* |

A few details that matter for the verdict:

- **The main packages are MPL-2.0.** `@blocknote/core`, `@blocknote/mantine`, and
  `@blocknote/react` — the packages a wrapper would use — are all **MPL-2.0**.
- **The `@blocknote/xl-*` packages are GPL-3.0** (with a separate commercial license offered).
  These are an even stronger copyleft and are likewise excluded.
- **MPL-2.0 is not anti-commercial.** It is OSI-approved and permits commercial use and
  redistribution. Its copyleft is *file-level*: only changes to the MPL-licensed source files
  themselves must be shared back. That makes it materially different from AGPL or
  "source-available" licenses.

aardvark's Community Component bundling bar is intentionally narrow — **permissive only** — so
that the island bundle (and anything built on top of it) stays free of file-level copyleft
obligations. MPL-2.0, while friendly, sits on the copyleft side of that line, so BlockNote is
not bundled. This is a packaging decision, **not** a statement that BlockNote is unsuitable —
it's an excellent editor.

## Using BlockNote in your own project

Nothing stops you from adopting BlockNote directly — MPL-2.0 is perfectly usable in a
commercial product. Install it into your own front-end build and follow the upstream
[Getting Started guide](https://www.blocknotejs.org/docs):

```bash
npm install @blocknote/core @blocknote/mantine @blocknote/react
```

The Mantine theme ships its own stylesheet, imported via the package's `style.css` export:

```js
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
```

A minimal Mantine-themed editor looks like this upstream:

```jsx
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

function Editor() {
  const editor = useCreateBlockNote();
  return <BlockNoteView editor={editor} />;
}
```

For a **read-only** view (the shape that would suit a static docs page), upstream exposes an
`editable={false}` prop on `BlockNoteView`. See the
[BlockNote docs](https://www.blocknotejs.org/docs) for the full API.

## Links

- Project site: <https://www.blocknotejs.org/>
- Documentation: <https://www.blocknotejs.org/docs>
- Source: <https://github.com/TypeCellOS/BlockNote>
- npm: [`@blocknote/core`](https://www.npmjs.com/package/@blocknote/core) ·
  [`@blocknote/mantine`](https://www.npmjs.com/package/@blocknote/mantine) ·
  [`@blocknote/react`](https://www.npmjs.com/package/@blocknote/react)
- License: [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)

---

*A **Community Component** entry — BlockNote by **TypeCellOS**, **MPL-2.0** licensed, npm
`@blocknote/*`. Documented but **not bundled** by aardvark because MPL-2.0 is a copyleft
license; aardvark bundles only permissively-licensed (MIT / Apache-2.0 / BSD / ISC)
components.*
