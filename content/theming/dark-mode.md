---
description: The default theme ships a light/dark toggle that drives both the chrome
  and the Mantine islands from one attribute.
icon: fa-solid fa-moon
menu: docs
title: Light & dark mode
weight: 41
---

# Light & dark mode

The default theme includes a light/dark toggle (the sun/moon button in the
header). Try it — this page updates instantly.

## How it works

Mantine's styling is **attribute-driven**: components read their colors from
CSS variables keyed on `data-mantine-color-scheme` on `<html>`. So switching
themes is just flipping that attribute — no React re-render needed.

- **`themes/vark/color-scheme.js`** runs in `<head>` before paint. It reads the
  saved preference from `localStorage['aardvark-color-scheme']` (or the OS setting
  when unset) and sets the attribute, avoiding a flash. It also wires the
  `.aardvark-theme-toggle` button.
- **`themes/vark/theme.scss`** maps the chrome's colors onto Mantine's own
  variables (`--mantine-color-text`, `--mantine-color-default-border`, …), so
  the chrome and the islands always match — in both schemes.

Because the chrome reuses Mantine's variables, you rarely need scheme-specific
CSS. If you do, target the attribute:

```css
:root[data-mantine-color-scheme="dark"] .my-thing { /* dark-only */ }
```

The theme uses view transitions in two different places. Clicking the theme
toggle cross-fades the scheme change in the current document. Page navigation
cross-fades only when both the resolved page and the OS are light. Chromium can
capture an incoming page before `color-scheme.js` sets the attribute; in a dark
context that snapshot cannot contain every attribute-gated Mantine or project
style, so `color-scheme.js` discards the page transition and swaps immediately.
This prevents a partially light page from flashing before it settles dark.

The theme also carries an OS-dark fallback for its own variables while the
attribute is absent. That keeps an initial canvas sensible if JavaScript is
unavailable, but project styles should still use the attribute as their source
of truth; they do not need to duplicate dark declarations in a media query just
to support the default page transition.

## Default

With no saved preference the site follows the operating system, and updates live
if the OS theme changes. Once a visitor clicks the toggle, their choice is
remembered.
