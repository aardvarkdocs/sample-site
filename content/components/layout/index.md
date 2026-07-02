---
menu: components
title: Layout
icon: layout-grid
weight: 10
---

# Layout

Built-in tags for arranging content on the page — the Mantine layout primitives, each
exposed as a single tag with no setup. Reach for these to put things in a row or a column,
center them, cap a content width, or build a responsive grid.

| Tag | What it does |
| --- | --- |
| [Group](/components/layout/group/) | A flex **row** with consistent gaps. |
| [Stack](/components/layout/stack/) | A flex **column** with consistent gaps. |
| [Flex](/components/layout/flex/) | A flexbox container with the full CSS flex surface. |
| [Center](/components/layout/center/) | Centers content horizontally and vertically. |
| [Container](/components/layout/container/) | Caps content width with a comfortable gutter. |
| [Grid](/components/layout/grid/) | A flexible 12-column grid with spanning cells. |
| [SimpleGrid](/components/layout/simplegrid/) | A responsive grid of equal-width columns. |
| [AspectRatio](/components/layout/aspectratio/) | Keeps content at a fixed width-to-height ratio. |
| [Space](/components/layout/space/) | An empty spacer between elements. |
| [AppShell](/components/layout/appshell/) | A page-level shell (header / navbar / aside / footer). |
| [Splitter](/components/layout/splitter/) | Two panels side by side with a divider. |

Each tag forwards the matching Mantine props, so anything you can do with the underlying
component is reachable from the tag. For the full prop surface of any one, follow its link
to the Mantine docs at the top of each page.

## Surfaces & utilities

The base primitive, card-like surfaces, scroll containers, and a few low-level helpers:

| Tag | What it does |
| --- | --- |
| [Box](/components/layout/box/) | The base primitive every component is built on — padding, margin, background, color, sizing, or a raw style on any block. |
| [Paper](/components/layout/paper/) | A card-like surface with a shadow, rounded corners, padding, and an optional border. |
| [ScrollArea](/components/layout/scrollarea/) | A scrollable region with styled, auto-hiding overlay scrollbars. |
| [Scroller](/components/layout/scroller/) | A minimal native-scroll container (the browser's own scrollbars). |
| [Scroll Buttons](/components/layout/scrollbuttons/) | A horizontal scroller with prev/next chevron buttons for paging a wide row of content. |
| [Collapse](/components/layout/collapse/) | Animate content open and closed by height. |
| [Marquee](/components/layout/marquee/) | A continuously scrolling ticker for logos, announcements, or a tagline. |
| [Portal](/components/layout/portal/) | Render content into a different part of the DOM to escape overflow and stacking contexts. |
