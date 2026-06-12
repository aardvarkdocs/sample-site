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

- **`templates/color-scheme.js`** runs in `<head>` before paint. It reads the
  saved preference from `localStorage['aardvark-color-scheme']` (or the OS setting
  when unset) and sets the attribute, avoiding a flash. It also wires the
  `.aardvark-theme-toggle` button.
- **`templates/theme.css`** maps the chrome's colors onto Mantine's own
  variables (`--mantine-color-text`, `--mantine-color-default-border`, …), so
  the chrome and the islands always match — in both schemes.

Because the chrome reuses Mantine's variables, you rarely need scheme-specific
CSS. If you do, target the attribute:

```css
:root[data-mantine-color-scheme="dark"] .my-thing { /* dark-only */ }
```

## Default

With no saved preference the site follows the operating system, and updates live
if the OS theme changes. Once a visitor clicks the toggle, their choice is
remembered.
