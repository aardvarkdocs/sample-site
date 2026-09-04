---
menu: components
title: Navigation
icon: menu-2
weight: 60
---

# Navigation

Ways to move around: links, trails, toggles, and on-page guides. Every one of these ships with
Aardvark, so there is nothing to install or wire up. Most are a single tag; Steps is not a tag at
all — an ordinary numbered list becomes one. Each tag takes the attributes its own page lists, and
an unrecognised one stops the build, so that table is the list to work from.

- [Anchor](/components/navigation/anchor/) — a styled text link with the text options you'd want on one (underline, color, weight, gradient).
- [Breadcrumbs](/components/navigation/breadcrumbs/) — a breadcrumb trail from a JSON or compact pipe-delimited list of crumbs.
- [Burger](/components/navigation/burger/) — a hamburger / cross menu toggle.
- [NavLink](/components/navigation/navlink/) — a navigation link with an icon, description, active state, and nested sub-links.
- [Pagination](/components/navigation/pagination/) — an interactive pager whose active page tracks clicks out of the box.
- [TableOfContents](/components/navigation/tableofcontents/) — an on-page contents list that scrapes the current page's headings and highlights the one in view.

These two are written as a tag pair wrapping their own content:

- [Tabs](/components/navigation/tabs/) — switch between panels of ordinary Markdown, with a sliding underline and a crossfade.
- [Tree](/components/navigation/tree/) — a nested file/folder explorer of named rows, with collapsible folders and per-file source in a modal.

And one needs no tag at all — it renders straight from plain Markdown:

- [Steps](/components/navigation/steps/) — a numbered Markdown list becomes a vertical Steps timeline.
