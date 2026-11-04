---
name: pininput
description: A one-time-code / PIN entry — a row of single-character boxes. Set `length`
  (number of boxes), `type` (`alphanumeric` or `number`), `mask` (obscure entered
  characters, like a password), plus `size`, `radius`, `gap`, `placeholder`, `disabled`,
  `error`, and `oneTimeCode` (browser OTP autofill, on by default).
params:
  length: int
  type: string
  size: string
  radius: string
  gap: string
  placeholder: string
  mask: { type: bool, default: false }
  disabled: { type: bool, default: false }
  error: { type: bool, default: false }
  oneTimeCode: { type: bool, default: true }
body: python
---
```python
# PinInput is NOT an Input wrapper — it has no label/description/withAsterisk; `error`
# here is a BOOLEAN (adds error styling + aria-invalid to every box), not a message.
# `type` is 'alphanumeric' (Mantine's default) or 'number'; `mask` obscures characters like
# a password; `length` is the box count (int, kept only when set). Unset (None/''/False)
# → omitted so Mantine's defaults apply. No children slot.
props = {}
_scalar = {'type': type, 'size': size, 'radius': radius, 'gap': gap,
           'placeholder': placeholder}
for k, v in _scalar.items():
    if v not in (None, ''):
        props[k] = v
if length is not None: props['length'] = length
if mask: props['mask'] = True
if disabled: props['disabled'] = True
if error: props['error'] = True
# oneTimeCode defaults to TRUE in Mantine (every box gets autocomplete='one-time-code'), so
# only emit it when the author turns it off — the same shape as segmentedcontrol's
# withItemsBorders. Emitting only the truthy case made oneTimeCode=false a silent no-op.
if not oneTimeCode: props['oneTimeCode'] = False
if attr: props['attr'] = attr
print(component('PinInput', **props))
```
