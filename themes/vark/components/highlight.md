---
name: highlight
description: Highlight matching substrings in a run of text — the Mantine Highlight
  element. Give the substring(s) to highlight in `highlight` (one phrase, or several
  comma-separated) and the full text as the block body or a `text` param; every match
  is wrapped in a tinted `<mark>`. Set `color` for the highlight tint and the usual
  Text typography props (`size`, `fw`, `c`, `ta`, …). The body is plain text — for a
  single fixed phrase, {% mark %} is simpler. Close with {% endHighlight %}.
params:
  text: string
  highlight: list
  color: string
  size: string
  fw: string
  c: string
  ta: string
  tt: string
  td: string
  fs: string
  id: string
body: python
---
```python
# Mantine's Highlight scans its text children for the `highlight` term(s) and wraps each
# match in a <mark>. `highlight` is a list param (so `highlight='one, two'` → two terms);
# a single term is fine too (a one-element list). The remaining props are the Text styling
# surface Highlight inherits; unset props are omitted so Mantine's defaults apply.
#
# The text is the block body or the `text=` param — it must be a plain *string* (Mantine
# searches it char-by-char), so it is NOT rendered as Markdown. The collector embeds an island's
# `children` as raw HTML (it is NOT JSON-encoded), so the inline `text=` string is html.escape()'d
# here — the same stored-XSS guard badge/chip/kbd/pill apply. The block body is already-rendered
# template output and left intact; for Highlight we want the literal characters, so strip any
# wrapping whitespace.
_h = {
    'size': size, 'fw': fw, 'c': c, 'ta': ta, 'tt': tt, 'td': td, 'fs': fs, 'id': id,
}
_props = {k: v for k, v in _h.items() if v not in (None, '', False)}
# `highlight` (list of terms) is required for the component to do anything; pass a single
# string when there's one term, the list when there are several (both are valid Mantine).
_terms = [t for t in (highlight or []) if t]
if len(_terms) == 1:
    _props['highlight'] = _terms[0]
elif _terms:
    _props['highlight'] = _terms
else:
    _props['highlight'] = ''  # nothing to match → renders the plain text
if color: _props['color'] = color
import html as _html  # not `_h` — that name holds the Text-prop dict above
_text = children if children else _html.escape(text or '')
print(component('Highlight', children=_text.strip(), attr=attr, **_props))
```
