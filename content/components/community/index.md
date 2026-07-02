---
menu: components
id: community
title: Community Components
icon: users
weight: 200
description: "Third-party Mantine extensions from the community — independently authored, permissively licensed widgets wrapped as built-in aardvark tags, each credited to its author."
---

# Community Components

Most built-in tags wrap a **Mantine core** component, and the [Aardvark Extras](/components/extras/)
are written in-house. **Community Components** are different: each one wraps a third-party
**Mantine extension** from the [Mantine extensions catalog](https://mantine.dev/x/extensions/) —
a widget written by a community member, not by the Mantine core team or by aardvark — and exposes
it as a single built-in `{% raw %}{% tag %}{% endraw %}` you drop straight into Markdown.

## Provenance & licensing

These components are **not ours**. Each is independently authored and maintained by its
original author, and we include it only on these terms:

- **Permissively licensed.** Every extension here is MIT-licensed (or similarly permissive). We
  include only extensions that are **free to use commercially** — if a project's license forbids
  commercial use, it doesn't ship as a community tag.
- **Credited to its author.** Each per-tag page names the original author and links to the source
  project, so credit (and the license terms) travel with the component.
- **Bundled from npm.** The underlying package is pulled straight from npm at the version we
  wrap; we don't fork or vendor a modified copy.

The catalog is kept current by an **automated monitor** — the `refresh-community-extensions`
workflow (and its companion skill) watches the upstream Mantine extensions list and opens a PR as
new commercially-usable, permissively-licensed extensions appear or existing ones move. As a
result the list below **fills in over time**: a name may be listed before its per-tag page has
landed, and links resolve as each extension's conversion PR merges.

## Components

Each tag below wraps one community extension. Follow a tag's page for the author credit, license,
the npm package it bundles, and live examples.

- [Clock](/components/community/clock/) — an analog or digital clock face.
- [LED](/components/community/led/) — a glowing status indicator light.
- [Spinner](/components/community/spinner/) — extra loading-spinner styles beyond the core loader.
- [Flip](/components/community/flip/) — a card that flips between a front and back face.
- [Reflection](/components/community/reflection/) — a mirrored reflection beneath its content.
- [Parallax](/components/community/parallax/) — content that shifts on scroll or pointer movement.
- [Marquee](/components/community/communitymarquee/) — a continuously scrolling ticker row.
- [TextAnimate](/components/community/textanimate/) — animated text reveals and transitions.
- [BorderAnimate](/components/community/borderanimate/) — an animated gradient border.
- [Compare](/components/community/compare/) — a before/after image slider.
- [Mask](/components/community/mask/) — masked/clipped content shapes.
- [Scene](/components/community/scene/) — a 3D scene container.
- [RingsProgress](/components/community/ringsprogress/) — nested concentric progress rings.
- [SelectStepper](/components/community/selectstepper/) — a stepper-style select control.
- [QRCode](/components/community/qrcode/) — a rendered QR code for any value.
- [Book](/components/community/book/) — a page-turning book viewer.
- [DepthSelect](/components/community/depthselect/) — a depth/layered select control.
- [LensSelect](/components/community/lensselect/) — a magnifying-lens selector.
- [JSONTree](/components/community/jsontree/) — a collapsible JSON tree viewer.
- [ListViewTable](/components/community/listviewtable/) — a list-style data table.
- [Picker](/components/community/picker/) — a wheel/scroll value picker.
- [Window](/components/community/window/) — a draggable, resizable window frame.
- [SplitPane](/components/community/splitpane/) — resizable split panels.
- [Onboarding](/components/community/onboarding/) — a guided product tour overlay.
- [Audio](/components/community/audio/) — a styled audio player.
- [Video](/components/community/video/) — a styled video player.
- [ContextMenu](/components/community/contextmenu/) — a right-click context menu.
- [Lightbox](/components/community/lightbox/) — a full-screen image lightbox.
- [DataTable](/components/community/datatable/) — a feature-rich sortable, paginated data table.
- [MantineReactTable](/components/community/mantine-react-table/) — the Mantine build of React Table.
- [Choropleth](/components/community/choropleth/) — a color-shaded geographic map.
- [BlockNote](/components/community/blocknote/) — a block-based rich-text editor.
