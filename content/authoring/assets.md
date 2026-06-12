---
description: Add your own stylesheets, scripts, and static files — they're copied
  into the build automatically.
icon: fa-solid fa-paintbrush
menu: docs
title: Custom CSS & JS
weight: 23
---

# Custom CSS & JS

## Root stylesheets and scripts

Any `.css` or `.js` file in your project root is copied into the build and
linked automatically — stylesheets in `<head>`, scripts (deferred) before
`</body>`:

```bash
my-docs/
  custom.css     ->  linked on every page
  analytics.js   ->  loaded on every page
```

No configuration needed. The scaffold includes a `custom.css` you can edit.

## Static files

Anything under `static/` or `public/` is copied verbatim into the build root,
preserving paths:

```bash
my-docs/
  static/
    img/logo.svg   ->  /img/logo.svg
    fonts/...      ->  /fonts/...
```

Reference them with absolute paths (`/img/logo.svg`).

## Theme assets

The theme's own CSS/JS live in `templates/` and are emitted under `/_aardvark/`
(e.g. `/_aardvark/theme.css`). See [Theme & customization](/theming/) to change
them.
