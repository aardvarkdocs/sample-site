---
name: textAnimate
description: Animated text — a Community Component wrapping @gfazioli/mantine-text-animate.
  Reveals (or loops) the text with an effect. Set `animate` (in, out, loop, static, none),
  `animation` (fade, blur, scale, slideUp, slideDown, slideLeft, slideRight, and their
  *Elastic* / blurUp / blurDown variants), and `by` (text, word, character, line) for the
  granularity. Tune timing with `duration` / `delay` (seconds), `segmentDelay` (between
  segments), and `loopDelay` (ms between loop cycles). Set `trigger='inView'` to start when
  it scrolls into view. The text is the block body or a `text` param. Close with
  {% endTextAnimate %}.
params:
  text: string
  animate: string
  animation: string
  by: string
  duration: float
  delay: float
  segmentDelay: float
  loopDelay: int
  trigger: string
body: python
---
```python
# Renders the TextAnimate island (TextAnimate.jsx), which wraps
# @gfazioli/mantine-text-animate's TextAnimate. Every prop passes straight through to the
# package (which validates the values); unset props are omitted so the package's own defaults
# apply. Numeric timing params are tested against None so an explicit 0 survives.
_props = {}
if animate: _props['animate'] = animate
if animation: _props['animation'] = animation
if by: _props['by'] = by
if duration is not None: _props['duration'] = duration
if delay is not None: _props['delay'] = delay
if segmentDelay is not None: _props['segmentDelay'] = segmentDelay
if loopDelay is not None: _props['loopDelay'] = loopDelay
if trigger: _props['trigger'] = trigger
# The animated text is the block body (preferred) or the plain `text=` shortcut. Both are
# plain text here — TextAnimate splits the string by character/word/line, so it needs a bare
# string, not nested markup. The block body is already-rendered template output (trusted) and
# is stripped of surrounding whitespace; the inline `text=` comes straight off the tag
# (untrusted), so — like badge/button — it's HTML-escaped. The collector embeds an island's
# children as raw HTML, so escaping the untrusted shortcut is the same stored-XSS guard.
import html as _h
_content = (children or '').strip() or _h.escape(text or '')
print(component('TextAnimate', children=_content, attr=attr, **_props))
```
