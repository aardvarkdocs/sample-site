---
title: Landing page template
description: A page that opts into the theme's landing.html with a pagetype front-matter key.
icon: fa-solid fa-flag
menu: docs
weight: 42
pagetype: landing
---

# A different template, same theme

This page sets `pagetype: landing` in its front matter, so aardvark renders it with
`themes/vark/landing.html` instead of the usual `default.html`. Notice there's no sidebar
and no on-this-page rail — the landing layout drops them and centers the content.

Everything else is the same theme: the header, brand, colors, and footer all come from
the `vark` theme's shared chrome. A template is just another layout in the theme; a page
picks one with `pagetype:`, and anything without it gets `default.html`.

See [Theme & customization](/theming/) for how to add your own templates.
