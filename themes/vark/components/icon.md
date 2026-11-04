---
name: icon
description: An inline icon that sits inside a heading or a sentence — a Tabler or Font Awesome
  name, an image path or URL, an emoji, or inline SVG — in a Mantine ThemeIcon (variant, color,
  size, radius, gradient, autoContrast, spacing props), with an optional tooltip `label`.
  `filled` picks Tabler's filled glyph.
params:
  spec: {type: string, required: true}
close: never
positional: {param: spec, noun: icon spec, example: "{% icon 'rocket' %} or {% icon '/img/logo.svg' %}"}
passthrough: true
emits: [Icon]
body: python
---
```python
import aardvark.components as av

source = av.call_source(globals())
if not str(spec).strip():
    raise av.ComponentError(f"{{% icon %}} needs a non-empty icon spec (in {source})")
# A data:/javascript:/vbscript:/file:/blob: spec is never a valid icon, and the Icon component
# would only drop it at runtime (a silently missing icon), so fail the build with the fix instead.
if str(spec).strip().lower().startswith(("data:", "javascript:", "vbscript:", "file:", "blob:")):
    raise av.ComponentError(
        f"{{% icon %}} unsafe icon spec {spec!r} — use a Tabler/Font Awesome name, a relative "
        f"path, or an https:// URL (in {source})"
    )
try:
    mount = inline_component
except NameError:  # the page was rendered without island components
    mount = None
if mount is None:
    raise av.ComponentError(
        f"{{% icon %}} can only be used where island components are available (in {source})"
    )

# The old scale/margin/padding params are gone (replaced by `size` and the Mantine spacing
# props). A page still using one would build clean and render at the wrong size or position,
# so name the removed attribute and its replacement.
for old_key in ("scale", "margin", "padding"):
    if attrs.get(old_key) is not None:
        av.warn(
            f"Aardvark: {{% icon %}} `{old_key}=` was removed — use `size=` or the Mantine "
            f"spacing props (`mt`/`mx`/`p`/…) instead (in {source})"
        )

# A protocol-relative spec (`//host/x.svg`) isn't dangerous, but the Icon component drops it
# for mixed-content safety, so warn with the fix rather than leave a silently missing icon.
if str(spec).strip().startswith("//"):
    av.warn(
        f"Aardvark: {{% icon %}} protocol-relative URL {spec!r} won't render (it's dropped for "
        f"mixed-content safety) — use an explicit https:// URL or a relative path (in {source})"
    )

props = {"icon": spec}
# ThemeIcon props and the Mantine margin/padding style props (m/mt/mb/mx/p/… — a bare number is
# px, so `mt=-2` lifts an inline icon) pass straight through. Bools are skipped: a bare
# `size=false` arrives as False, which would defeat the component's "no size: bare glyph" check.
for key in (
    "variant", "size", "radius", "label",
    "m", "mx", "my", "mt", "mb", "ms", "me", "ml", "mr",
    "p", "px", "py", "pt", "pb", "ps", "pe", "pl", "pr",
):
    value = attrs.get(key)
    if value is not None and not isinstance(value, bool):
        props[key] = value
# `color` lands in the ThemeIcon's inline style, so a value that could break out of it is
# dropped with a warning (the same guard {% card %} applies to its colors).
color = attrs.get("color")
if isinstance(color, str) and color.strip():
    if av.css_color_is_safe(color):
        props["color"] = color
    else:
        av.warn(
            f"Aardvark: {{% icon %}} ignoring unsafe color {color!r} — it could break out of the "
            f"icon's inline style (use a Mantine color name, #hex, or a balanced rgb()/hsl())"
        )
elif color is not None and not isinstance(color, str):
    # A number, bare flag or list is never a color: dropped, and said so.
    av.warn(
        f"Aardvark: {{% icon %}} ignoring color={color!r} — a color is a string: a Mantine color "
        f"name, #hex, or rgb()/hsl() (in {source})"
    )
# Boolean flags: a quoted "false"/"0" reads as off, a bare 1 as on.
if av.attr_flag(attrs.get("filled")):
    props["filled"] = True
if av.attr_flag(attrs.get("autoContrast")):
    props["autoContrast"] = True
gradient = av.parse_gradient(attrs, tag="icon")  # gradientFrom/gradientTo/gradientDeg
if gradient is not None:
    props["gradient"] = gradient
# The Tabler CDN base the glyph is fetched from (theme.iconCdn / theme.iconVersion).
props["iconCdn"] = av.tabler_icon_cdn(globals())
# An inline island (a <span> wrapper), so the icon flows inside a heading or mid-sentence;
# attr={…} rides onto that wrapper.
print(mount("Icon", attr=attr, **props))
```
