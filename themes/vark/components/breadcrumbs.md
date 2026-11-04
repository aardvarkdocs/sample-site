---
name: breadcrumbs
description: A breadcrumb trail (Mantine's Breadcrumbs). Pass the crumbs in `items` —
  either a JSON array of `{label, href}` objects, or a compact comma-separated list of
  `Label | /href` pairs (drop the `| href` on a crumb to render it as plain text, which
  the last/current crumb usually is). Set `separator` (defaults to `/`) and
  `separatorMargin`.
params:
  items: { type: string, required: true }
  separator: string
  separatorMargin: string
body: python
---
```python
# Renders the Breadcrumbs island, which builds a real Mantine <Anchor> per
# linked crumb in JSX so the hrefs survive the client re-render (plain child <a>s
# would lose their attributes — see Breadcrumbs.jsx / SiteBreadcrumbs.jsx).
#
# `items` accepts two author-friendly shapes, both parsed here to a [{label, href?}]
# list:
#   JSON      items='[{"label":"Home","href":"/"},{"label":"Docs"}]'
#   delimited items='Home | /, Docs | /docs/, Page'   (last crumb has no href -> text)
import json as _json
import aardvark.components as av

# Reject unsafe link targets at build time, matching anchor/button/navlink — the island's
# sanitizeHref strips them at render time (defense in depth), but a build-time error tells the
# author instead of silently dropping the crumb's link. Applied to every parsed href below (both
# the JSON `{label, href}` and the compact 'Label | /href' forms). The shared
# av.is_unsafe_href covers dangerous schemes + protocol-relative URLs.
def _safe_href(_h):
    _h = str(_h).strip()
    if av.is_unsafe_href(_h):
        # Plain ValueError (the engine wraps it into TemplateError), matching the scheme guard in
        # anchor/button/navlink/actionicon/unstyledbutton. av.ComponentError is kept for the
        # JSON-parse error below, where the component-scoped subtype carries the actionable
        # "fix your items=" message.
        raise ValueError(f"breadcrumbs: unsafe href {_h!r} — use a relative path or an http(s):// link")
    return _h

_raw = (items or '').strip()
_parsed = []
if _raw.startswith('['):
    # JSON array of {label, href?} objects.
    try:
        _crumbs = _json.loads(_raw)
    except (ValueError, TypeError) as _e:
        raise av.ComponentError(
            "breadcrumbs: the `items` param starts with '[' but is not valid JSON. Pass a "
            "JSON array of label/href objects, or the compact comma-separated "
            "'Label | /href' form instead. (" + str(_e) + ")"
        ) from None
    for _it in _crumbs:
        if isinstance(_it, dict):
            _label = str(_it.get('label', '')).strip()
            _href = _it.get('href')
            _entry = {'label': _label}
            if _href:
                _entry['href'] = _safe_href(_href)
            _parsed.append(_entry)
        else:
            _parsed.append({'label': str(_it).strip()})
else:
    # Comma-separated "Label | /href" pairs; the "| href" part is optional.
    for _pair in _raw.split(','):
        _pair = _pair.strip()
        if not _pair:
            continue
        if '|' in _pair:
            _label, _href = _pair.split('|', 1)
            _entry = {'label': _label.strip()}
            _href = _href.strip()
            if _href:
                _entry['href'] = _safe_href(_href)
            _parsed.append(_entry)
        else:
            _parsed.append({'label': _pair})

_props = {'items': _parsed}
if separator:
    _props['separator'] = separator
if separatorMargin:
    _props['separatorMargin'] = separatorMargin
print(snippet('Breadcrumbs', attr=attr, **_props))
```
