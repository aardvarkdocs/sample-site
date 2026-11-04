---
name: box
description: The base primitive — a plain element that forwards the Mantine style props. Use
  it to apply padding, margin, background (`bg`), text color (`c`), sizing, or a raw `style`
  without reaching for a styled component. Every other Mantine component is built on Box, so
  these same props work everywhere. The block body is the content. Close with {% endBox %}.
params:
  # Raw inline style (CSS string) and HTML id
  style: string
  id: string
  # Color shortcuts
  bg: string
  c: string
  opacity: string
  # Mantine spacing system (margin / padding — Mantine size tokens or any CSS value)
  m: string
  mt: string
  mb: string
  ml: string
  mr: string
  mx: string
  my: string
  p: string
  pt: string
  pb: string
  pl: string
  pr: string
  px: string
  py: string
  # Sizing
  w: string
  h: string
  miw: string
  mih: string
  maw: string
  mah: string
body: python
---
```python
# The generic primitive: it forwards Mantine's style props (the same surface every other
# component inherits) onto a plain element, no built-in styling of its own. Mirrors
# button.md / text.md — every prop passes straight through to Mantine's Box (which validates
# the values) and unset (None / '') props are omitted. The block body is the content,
# wrapped in blank lines so the single Markdown pass renders it as Markdown (the
# block-component convention). The `attr=` channel is left for raw HTML attributes.
#
# `style=` is a raw CSS declaration string ("color: red; padding: 1rem") — the shape an author
# expects to write. Mantine hands `style` straight to React, which wants a MAPPING: given a
# string, React spreads it character by character into per-index declarations and the whole rule
# is lost, so parse it into that mapping here. Split on TOP-LEVEL ';' only — one inside quotes,
# inside any kind of block, or inside a /* comment */ belongs to the value (background:
# url("data:image/svg+xml;base64,…"), or color: red /* note; keep */), and splitting there
# truncates the value and then warns about the remainder — then on the FIRST ':' (a value may
# contain one, as in a url), and camelCase the property, because React honors a hyphenated name
# only for a custom property (--brand-color) — those pass through untouched. A fragment that
# isn't "property: value" is an authoring typo; warn instead of dropping it in silence.
import aardvark.components as av
_style_obj = {}
if style:
    _decls, _buf, _quote, _depth, _esc = [], '', '', 0, False
    _i, _len = 0, len(style)
    while _i < _len:
        _ch = style[_i]
        if _esc:
            # A backslash escapes the next character ANYWHERE in a declaration, not only inside a
            # string. `font-family: Bob\'s Font` never opens a string, so the ';' after it is still
            # top level — but reading the escape only in the quoted branch opened one at that
            # apostrophe, and every later declaration was swallowed into the value with NO warning.
            # That is the one outcome this scanner exists to prevent (see the warn below): a silent
            # loss, not a visible complaint. Consuming the escaped character here also subsumes the
            # in-string case this branch used to handle on its own — an escaped delimiter can no
            # longer be mistaken for structure, whether it is a quote, a bracket, a ';' or a '/*'.
            _esc = False
            _buf += _ch
        elif _ch == '\\':
            _esc = True
            _buf += _ch
        elif _quote:
            _buf += _ch
            if _ch == _quote:
                _quote = ''
        elif _ch == '/' and _i + 1 < _len and style[_i + 1] == '*':
            # A comment is whitespace, and it may carry a ';' (color: red /* note; keep */) or an
            # unbalanced bracket. Skip the whole thing so neither can split the declaration and so
            # the comment never lands in the value; an unterminated one runs to the end of the
            # string, which is what CSS does with it too.
            _end = style.find('*/', _i + 2)
            _i = _len if _end < 0 else _end + 2
            _buf += ' '
            continue
        elif _ch in '"\'':
            _quote = _ch
            _buf += _ch
        elif _ch in '([{':
            # Every CSS block nests, not just parens: a custom property's value is an arbitrary
            # token stream and may hold a braced block whose ';' are its own (--x: {a: 1; b: 2}).
            _depth += 1
            _buf += _ch
        elif _ch in ')]}':
            _depth = max(0, _depth - 1)
            _buf += _ch
        elif _ch == ';' and _depth == 0:
            _decls.append(_buf)
            _buf = ''
        else:
            _buf += _ch
        _i += 1
    _decls.append(_buf)
    for _decl in _decls:
        _decl = _decl.strip()
        if not _decl:
            continue
        _name, _sep, _value = _decl.partition(':')
        _name, _value = _name.strip(), _value.strip()
        if not _sep or not _name or not _value:
            av.warn("box: ignoring style declaration " + repr(_decl) + " - expected 'property: value'")
            continue
        if _name.startswith('--'):
            _style_obj[_name] = _value
        else:
            # React's DOM style keys are camelCase, and every vendor prefix capitalises its first
            # letter (-webkit-line-clamp -> WebkitLineClamp) EXCEPT -ms-, which React alone keeps
            # lowercase (msOverflowStyle, not MsOverflowStyle) — a capital M is silently dropped.
            _ms = _name.lower().startswith('-ms-')
            # Filter on the STRIPPED fragment: a name that is nothing but hyphens and spaces
            # ('-', '- -') leaves no words at all, and indexing _words[0] there raised IndexError
            # and aborted the whole build — the one outcome this branch exists to avoid, since a
            # malformed declaration is an authoring typo that must warn and be skipped like any
            # other. (A real custom property took the '--' branch above long before this.)
            _words = [_w.strip() for _w in _name.lower().split('-') if _w.strip()]
            if not _words:
                av.warn("box: ignoring style declaration " + repr(_decl) + " - expected 'property: value'")
                continue
            _key = _words[0] + ''.join(_w.title() for _w in _words[1:])
            if _name.startswith('-'):
                _key = _key[:1].upper() + _key[1:]
            if _ms:
                _key = _key[:1].lower() + _key[1:]
            _style_obj[_key] = _value

_box = {
    'id': id, 'bg': bg, 'c': c, 'opacity': opacity,
    'm': m, 'mt': mt, 'mb': mb, 'ml': ml, 'mr': mr, 'mx': mx, 'my': my,
    'p': p, 'pt': pt, 'pb': pb, 'pl': pl, 'pr': pr, 'px': px, 'py': py,
    'w': w, 'h': h, 'miw': miw, 'mih': mih, 'maw': maw, 'mah': mah,
}
_props = {k: v for k, v in _box.items() if v not in (None, '')}
if _style_obj:
    _props['style'] = _style_obj
_body = "\n\n" + (children or '') + "\n\n"
print(component('Box', children=_body, attr=attr, **_props))
```
