---
menu: components
title: Overlays
icon: app-window
weight: 80
description: "Built-in tags for layered UI — modals, drawers, dialogs and other panels, plus floating tooltips / popovers / menus anchored to a target, and the transition primitive that animates them."
---

# Overlays

UI that layers over the page. The **panels** — modal, drawer, dialog — ship with a built-in
trigger button and open/close wiring, so they work on a static page out of the box (click the
trigger, then close via the button, the overlay, or Escape). The **floating** overlays anchor a
transient surface to a target using Mantine's floating engine (placement, arrows, offsets,
flip-on-collision). Each is a single **built-in** tag that forwards the full Mantine prop surface.

## Panels

- [Modal](/components/overlays/modal/) — a centered dialog over a dimming overlay, with a trigger button.
- [Drawer](/components/overlays/drawer/) — a panel that slides in from any edge, with a trigger button.
- [Dialog](/components/overlays/dialog/) — a small corner-anchored panel (no backdrop), with a trigger button.
- [Affix](/components/overlays/affix/) — pins content to a fixed spot in the viewport as the page scrolls.
- [Overlay](/components/overlays/overlay/) — a dimming or gradient veil over a box, for spotlighting or disabled states.
- [LoadingOverlay](/components/overlays/loadingoverlay/) — a spinner veil over an area that's loading.
- [FloatingWindow](/components/overlays/floatingwindow/) — a draggable titled panel you can grab and move.
- [Spotlight](/components/overlays/spotlight/) — a Cmd+K command palette of searchable actions, opened from JavaScript.

## Managers

- [Modals manager](/components/overlays/modals/) — `@mantine/modals`, the imperative modal manager you open from JavaScript (`modals.openConfirmModal`), shown as a live demo.

## Floating

- [Tooltip](/components/overlays/tooltip/) — a small floating label shown on hover or focus of a target.
- [Popover](/components/overlays/popover/) — a click-toggled floating panel whose body is full Markdown.
- [HoverCard](/components/overlays/hovercard/) — a richer Tooltip that opens on hover, with a Markdown body and delays.
- [Menu](/components/overlays/menu/) — a dropdown of actions and links, with section labels and dividers.
- [FloatingIndicator](/components/overlays/floatingindicator/) — the low-level sliding-highlight primitive behind SegmentedControl, Tabs, and Stepper.

## Motion

- [Transition](/components/overlays/transition/) — fade / slide / scale content in and out as it mounts.
