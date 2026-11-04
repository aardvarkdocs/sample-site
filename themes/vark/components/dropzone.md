---
name: dropzone
description: A drag-and-drop file upload zone — drop files onto it (or click to open the
  native picker), with a built-in drag-state overlay. Set `accept` (a comma-separated MIME
  list like `image/png,image/jpeg`, or a JSON array), `maxSize` (bytes), `multiple`, `loading`,
  `disabled`, and `h` / `minHeight`. The block body is the zone's resting content. Mounts as an
  interactive island. Close with {% endDropzone %}.
params:
  accept: string
  maxSize: int
  multiple: { type: bool, default: true }
  loading: { type: bool, default: false }
  disabled: { type: bool, default: false }
  radius: string
  h: string
  minHeight: string
  maw: string
  name: string
body: python
---
```python
# The dropzone tag renders the built-in Dropzone wrapper around @mantine/dropzone. The wrapper
# keeps a selected/rejected-file summary visible after picker/drop actions and emits a native
# change event for attr={onchange: ...}. `accept` is parsed here: a leading-'[' value is read as a
# JSON array of MIME types, otherwise a comma-separated string is split into an array (Mantine
# accepts a string[] of MIME types). A malformed JSON accept warns and falls back to splitting on
# commas. `multiple` defaults to true in Mantine, so it is passed whenever it is a real boolean
# (both True and False are meaningful — False must NOT be filtered away). Other unset
# (None/''/False) props are omitted so Mantine's defaults apply. The block body is the zone's
# resting content, wrapped in blank lines so it renders as Markdown.
import json as _json
import aardvark.components as av
def _accept(s):
    s = (s or '').strip()
    if not s:
        return None
    if s[:1] == '[':
        try:
            v = _json.loads(s)
            if isinstance(v, list):
                return v
            av.warn("dropzone: accept JSON must be an array of MIME types — splitting on commas")
        except (ValueError, TypeError):
            av.warn("dropzone: accept is not valid JSON — splitting on commas instead")
    return [t.strip() for t in s.split(',') if t.strip()]

_d = {
    'accept': _accept(accept),
    'loading': loading, 'disabled': disabled,
    'radius': radius, 'h': h, 'minHeight': minHeight, 'maw': maw, 'name': name,
}
props = {k: v for k, v in _d.items() if v not in (None, '', False)}
# maxSize is an int; pass it whenever set so a literal 0 survives (0 == False would be
# dropped by the falsy filter above, mirroring areachart's numeric-prop handling).
if maxSize is not None:
    props['maxSize'] = maxSize
# multiple is True by default in Mantine; pass it whenever it is a real bool so multiple=false sticks.
if isinstance(multiple, bool):
    props['multiple'] = multiple
_body = "\n\n" + (children or '') + "\n\n"
print(component('Dropzone', children=_body, attr=attr, **props))
```
