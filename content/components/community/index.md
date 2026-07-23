---
menu: components
id: community
title: Community Components
icon: users
weight: 200
description: "Third-party Mantine extensions: bundled tags that pass aardvark's licensing and compatibility gates, plus documented exclusions."
---

# Community Components

Most built-in tags wrap a **Mantine core** component, and the [Aardvark Extras](/components/extras/)
are written in-house. **Community Components** are different: each one wraps a third-party
**Mantine extension** from the [Mantine extensions catalog](https://mantine.dev/x/extensions/) —
a widget written by a community member, not by the Mantine core team or by aardvark. Extensions
listed under **Bundled components** expose a built-in `{% raw %}{% tag %}{% endraw %}` you can drop
straight into Markdown.

## Provenance & inclusion gates

These projects are **not ours**. Each is independently authored and maintained by its original
author, and we bundle one only on these terms:

- **Permissively licensed.** Every bundled extension is MIT-licensed (or similarly permissive).
  Commercial use alone is not enough; licenses outside the project's permissive allowlist do not
  ship as community tags.
- **Compatible as published.** The package's published peer and direct dependencies must support
  the Mantine and React majors used by aardvark. Overrides and substitute implementations do not
  count as compatibility.
- **Credited to its author.** Each per-tag page names the original author and links to the source
  project, so credit (and the license terms) travel with the component.
- **Bundled from npm.** The underlying package is pulled straight from npm at the version we
  wrap; we don't fork or vendor a modified copy.

The catalog is kept current by an **automated monitor** — the `refresh-community-extensions`
workflow (and its companion skill) watches the upstream Mantine extensions list and opens a PR as
new extensions pass both gates or existing ones move. Rejected projects remain recorded in the
source manifest so the monitor does not repeatedly propose them.

## Bundled components

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

## Not bundled

- [BlockNote](/components/community/blocknote/) — compatible with the current framework, but
  excluded by the permissive-license policy because it is MPL-2.0 licensed.
- **FormBuilder** — excluded because the exact 0.1.28 registry record and published package.json
  omit license metadata (npm's MIT field appears only in versions 0.1.6 through 0.1.11), the
  repository has no LICENSE, and a README-only MIT statement does not meet the license gate. The
  package also peers and directly depends on Mantine 8 rather than Mantine 9.
- **Mantine React Table** — excluded because its published stable/beta lines target older Mantine
  majors, not Mantine 9.
- **Mantine Choropleth** — excluded because its published peers require Mantine 8; an npm override
  is not compatibility evidence.
