---
name: scroller
description: A low-level scroll primitive — a plain overflow container with the browser's
  native scrollbars (no styled overlay bars; that's `scrollarea`). Constrain it with `h`
  and/or `w`, set `axis` (y, x, both) to choose which way it scrolls, and `bg`/`p` for the
  surface. Reach for it when you want a minimal native-scroll region; use `scrollarea` for
  the styled, auto-hiding scrollbars. The block body is the (overflowing) content. Close with
  {% endScroller %}.
params:
  axis: { type: string, default: y }
  # Sizing — give it an `h` (and/or `w`) so the content can overflow and scroll
  h: string
  w: string
  miw: string
  mih: string
  maw: string
  mah: string
  # Surface
  bg: string
  p: string
  pt: string
  pb: string
  pl: string
  pr: string
  px: string
  py: string
  m: string
  mt: string
  mb: string
  ml: string
  mr: string
  mx: string
  my: string
body: python
---
```python
# A minimal native-scroll primitive: this deliberately forwards onto Box (the base primitive)
# rather than Mantine 9's own Scroller, keeping it a plain native-overflow region (use scrollarea
# for Mantine's styled, auto-hiding bars). The overflow AND the bounding size go through React's
# `style` as an OBJECT (camelCase) — a CSS *string* on the `style` prop isn't applied (React wants
# a property map), and a unitless `h` like "140" isn't a valid CSS length; both are why the box
# never actually scrolled. Surface/spacing props (bg / p / margins) still ride Mantine's own style
# props (they accept tokens). `axis` picks overflow-x / overflow-y / both; give the box an `h` so
# the content can overflow. The block body is the content, blank-line wrapped so the single
# Markdown pass renders it (the block-component convention). attr= forwards raw HTML attributes.
_OVERFLOW = {
    'y': {'overflowY': 'auto', 'overflowX': 'hidden'},
    'x': {'overflowX': 'auto', 'overflowY': 'hidden'},
    'both': {'overflow': 'auto'},
}
_axis = (axis or 'y').strip().lower()
_style = dict(_OVERFLOW.get(_axis, _OVERFLOW['y']))

def _length(v):
    # A bare number ("140") isn't a valid CSS length, so treat it as pixels; a value that
    # already carries a unit or is a percentage ("20rem", "100%") passes through unchanged.
    v = str(v).strip()
    return f'{v}px' if v.replace('.', '', 1).isdigit() else v

for _name, _css in (('h', 'height'), ('w', 'width'), ('miw', 'minWidth'),
                    ('mih', 'minHeight'), ('maw', 'maxWidth'), ('mah', 'maxHeight')):
    _v = {'h': h, 'w': w, 'miw': miw, 'mih': mih, 'maw': maw, 'mah': mah}[_name]
    if _v not in (None, ''):
        _style[_css] = _length(_v)

_box = {
    'bg': bg, 'p': p, 'pt': pt, 'pb': pb, 'pl': pl, 'pr': pr, 'px': px, 'py': py,
    'm': m, 'mt': mt, 'mb': mb, 'ml': ml, 'mr': mr, 'mx': mx, 'my': my,
}
_props = {k: v for k, v in _box.items() if v not in (None, '')}
_props['style'] = _style
_body = "\n\n" + (children or '') + "\n\n"
print(component('Box', children=_body, attr=attr, **_props))
```
