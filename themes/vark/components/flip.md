---
name: flip
description: A Community Component (wraps @gfazioli/mantine-flip, MIT) that flips between
  a front and a back face on click. The block body is the FRONT face; set `back` for the
  back face (plain text — it is HTML-escaped). Set `direction` (horizontal | vertical), `duration` (seconds),
  `easing` (any CSS timing function — ease-in-out is the default — or spring), `perspective`
  (a CSS LENGTH such as 1200px, never a bare number; it is forwarded verbatim), and
  `defaultFlipped`/`flipped` to control which face shows. Use `swipeable` for touch flips
  and `disabled` to freeze it. Close with {% endFlip %}.
params:
  back: string
  flipped: { type: bool, default: false }
  defaultFlipped: { type: bool, default: false }
  direction: string
  easing: string
  duration: float
  perspective: string
  disabled: { type: bool, default: false }
  lazyBack: { type: bool, default: false }
  swipeable: { type: bool, default: false }
  swipeThreshold: int
  w: string
  h: string
body: python
---
```python
# Renders the Flip island (Flip.jsx), which wraps @gfazioli/mantine-flip.
# Mantine's Flip needs exactly two children (front + back), both React nodes — so the
# block body becomes the FRONT face (children) and the `back` param the back face. Every
# other prop passes straight through to Flip (which validates the values); unset props are
# omitted so the package defaults apply. Numeric/bool params are typed (int/bool) so a bare
# flag like `swipeable` is a real True, never the "True" string trap.
props = {}
if flipped: props['flipped'] = True
if defaultFlipped: props['defaultFlipped'] = True
if direction: props['direction'] = direction
if easing: props['easing'] = easing
if duration is not None: props['duration'] = duration
if perspective: props['perspective'] = perspective
if disabled: props['disabled'] = True
if lazyBack: props['lazyBack'] = True
if swipeable: props['swipeable'] = True
if swipeThreshold is not None: props['swipeThreshold'] = swipeThreshold
# `w`/`h` accept a Mantine size token or a number; pass an all-digit value as an int so it
# becomes a pixel count (Mantine treats a bare number as px), else pass the token through.
if w: props['w'] = int(w) if str(w).isdigit() else w
if h: props['h'] = int(h) if str(h).isdigit() else h
# The `back` param is the back face. The island renders it as raw HTML, so — exactly like
# badge/blockquote `text=` — it's a stored-XSS surface for untrusted authors and is HTML-escaped
# here to plain text (NOT run through render_inline_markdown, which passes raw HTML through). For
# a rich back face (markup, other components), author it as the FRONT face and set
# `defaultFlipped=true` instead, or compose the back content via a snippet.
import html as _h
props['back'] = _h.escape(back) if back else ''
# The block body is the front face — bracket with blank lines so the single Markdown pass
# renders it (paragraphs, emphasis, links) rather than swallowing it as raw HTML.
_front = ("\n\n" + children + "\n\n") if (children or '').strip() else ''
print(component('Flip', children=_front, attr=attr, **props))
```
