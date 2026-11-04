---
name: appshell
description: A page-level layout shell that positions a header, navbar, aside, and footer
  around a main content area — the primitive Mantine uses for app chrome. Each region is
  opt-in (set `header`/`navbar`/`aside`/`footer` text to add it) and sized with
  `headerHeight`/`footerHeight` (px) and `navbarWidth`/`asideWidth` (px). The block body is
  the main content. Set `padding` (Mantine size token or CSS value) for the gap around Main,
  and `layout` (`default` or `alt`). It renders inside a self-contained, bounded frame so it
  never escapes to cover the page chrome; size that frame with `height` (px, default 380).
params:
  # Region content (opt-in — a region is only rendered when its text is set)
  header: string
  navbar: string
  aside: string
  footer: string
  # Region sizes (px)
  headerHeight: int
  navbarWidth: int
  asideWidth: int
  footerHeight: int
  # Shell options
  padding: string
  layout: string
  withBorder: { type: bool, default: true }
  # Height (px) of the self-contained frame the shell renders inside (default 380); the shell is
  # bounded to this box so it can't escape and cover the page.
  height: int
body: python
---
```python
# Renders the AppShell island (AppShell.jsx), which owns the region assembly: AppShell is a
# compound, page-level layout whose header/navbar/aside/footer sub-regions and their
# { height, width, breakpoint } size objects can't ride the flat component('AppShell') JSON
# props channel. The block body is the <AppShell.Main> content. Region text params arrive as
# strings; the island only renders a region (and reserves its size) when the text is set.
# Unset props are omitted so Mantine's AppShell defaults apply.
_props = {}
if header: _props['header'] = header
if navbar: _props['navbar'] = navbar
if aside: _props['aside'] = aside
if footer: _props['footer'] = footer
if headerHeight is not None: _props['headerHeight'] = headerHeight
if navbarWidth is not None: _props['navbarWidth'] = navbarWidth
if asideWidth is not None: _props['asideWidth'] = asideWidth
if footerHeight is not None: _props['footerHeight'] = footerHeight
if padding: _props['padding'] = padding
if layout: _props['layout'] = layout
if not withBorder: _props['withBorder'] = False
if height is not None: _props['height'] = height
print(snippet('AppShell', children="\n\n" + (children or '') + "\n\n", attr=attr, **_props))
```
