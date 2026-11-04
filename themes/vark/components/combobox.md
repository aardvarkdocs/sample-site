---
name: combobox
description: A composition primitive — the low-level building block the whole select family
  is built on (Mantine Combobox). It needs a `store` from the useCombobox() hook, which a
  build-time tag can't supply, so this tag renders a small *working example* of the primitive
  (a button-trigger single-select) from `data` so you can see it in action. For a ready-made
  interactive field reach for {% raw %}{% select %}{% endraw %},
  {% raw %}{% multiselect %}{% endraw %}, {% raw %}{% autocomplete %}{% endraw %}, or
  {% raw %}{% tagsinput %}{% endraw %} instead. Give options via `data` (a comma-separated
  list, or `value::label` pairs); `placeholder` is the empty-state label.
params:
  data: list
  dataJson: string
  placeholder: string
body: python
---
```python
# Combobox is a low-level primitive: it needs a `store` from useCombobox() (a React hook),
# which a build-time macro cannot provide — so the tag renders the Combobox island
# (Combobox.jsx), a small self-contained working example built from
# the Combobox primitives. `data` becomes the option list (strings or value::label -> {value,
# label}); `dataJson` (full JSON array) wins over it. The doc page documents this clearly and
# points readers at the select / multiselect tags for the high-level versions.
import json as _json
import aardvark.components as av

def _opt(item):
    # Double-colon separator so a value containing a single ':' (URL, time, ns token) isn't split.
    if '::' in item:
        v, _, l = item.partition('::')
        return {'value': v.strip(), 'label': l.strip()}
    return item

if dataJson:
    try:
        _data = _json.loads(dataJson)
        if not isinstance(_data, list):
            # Valid JSON, but not an array of options — an author mistake that would
            # silently ship an empty dropdown, so warn rather than degrade quietly.
            av.warn("combobox: dataJson must be a JSON array of options — got a non-list value; falling back to no options")
            _data = []
    except (ValueError, TypeError):
        # A malformed dataJson shouldn't abort the build — degrade to no options, but warn
        # so a typo (e.g. a missing bracket) isn't a silent broken dropdown. Matches the
        # select / multiselect / autocomplete / tagsinput / treeselect posture.
        av.warn("combobox: dataJson is not valid JSON — falling back to no options; check the dataJson value")
        _data = []
elif data:
    _data = [_opt(i) for i in data]
else:
    _data = []

# Only forward placeholder when set: passing placeholder=None serializes as JSON null, and a JS
# destructuring default ('Pick a value' in the island) fires for undefined, NOT null — an omitted
# attribute would otherwise blank the empty-state label instead of using the island default.
_props = {}
if placeholder: _props['placeholder'] = placeholder
if attr: _props['attr'] = attr
print(snippet('Combobox', data=_data, **_props))
```
