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

Mantine v7 styling is **attribute-driven**: components read their colors from
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

One caveat when the dark rule changes a **background**: the default theme
cross-fades page navigations with a view transition, and the browser draws the
incoming page's first frame *before* `color-scheme.js` has set the attribute —
so an attribute-keyed rule doesn't apply to that frame, and dark-mode readers
see your light background flash for the length of the fade. Give such rules an
OS-scheme fallback too. Because those bare dark rules keep matching after the
attribute *is* set, add an explicit-light override alongside them, so a reader
who chose light mode on a dark OS gets their choice back the moment the
attribute lands (that reader's pre-attribute frame is never shown — the theme
skips the cross-fade whenever the chosen scheme differs from the OS):

```css
@media screen and (prefers-color-scheme: dark) {
  .my-thing { /* dark, for the pre-attribute first frame */ }
  :root[data-mantine-color-scheme="light"] .my-thing { /* light wins back */ }
}
```

(Keep the `screen` type if your site builds the whole-site PDF — the PDF
renderer applies bare feature queries but skips `screen` blocks, which keeps
the PDF on the light palette. This is the pattern for **page-local CSS**; the
theme's own chrome closes the same first-frame gap with different machinery —
an attribute-less fallback block in `theme.scss` plus the view-transition
skips in `color-scheme.js`. This site's homepage source is a worked example
of the page-local pattern.)

## Default

With no saved preference the site follows the operating system, and updates live
if the OS theme changes. Once a visitor clicks the toggle, their choice is
remembered.
