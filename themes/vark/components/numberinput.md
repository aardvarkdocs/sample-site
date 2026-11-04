---
name: numberinput
description: A numeric input with increment/decrement controls. The shared Input wrapper
  surface (label, description, placeholder, error, withAsterisk, required, disabled, size,
  radius, variant) plus the NumberInput specifics — `min`, `max`, `step`, `decimalScale`,
  `prefix`, `suffix`, `allowNegative`, `allowDecimal`, `thousandSeparator`, `clampBehavior`,
  and `hideControls`.
params:
  label: string
  description: string
  placeholder: string
  error: string
  defaultValue: float
  variant: string
  size: string
  radius: string
  required: { type: bool, default: false }
  withAsterisk: { type: bool, default: false }
  disabled: { type: bool, default: false }
  min: float
  max: float
  step: float
  decimalScale: int
  prefix: string
  suffix: string
  allowNegative: { type: bool, default: true }
  allowDecimal: { type: bool, default: true }
  hideControls: { type: bool, default: false }
  thousandSeparator: string
  clampBehavior: string
  leftSection: string
  rightSection: string
body: python
---
```python
# Mirrors textinput.md for the shared wrapper props and adds the NumberInput-only
# numeric controls. min/max/step/defaultValue are floats (kept when not None — 0 is a
# valid value, so the guard is `is not None`, not truthiness); decimalScale is an int.
# allowNegative/allowDecimal default True in Mantine, so they're forwarded ONLY when an
# author turns them off (False) — forwarding True would be a redundant no-op, forwarding
# the off state is the meaningful signal. No children slot.
props = {}
_text = {
    'label': label, 'description': description, 'placeholder': placeholder,
    'error': error, 'variant': variant, 'size': size, 'radius': radius,
    'prefix': prefix, 'suffix': suffix, 'thousandSeparator': thousandSeparator,
    'clampBehavior': clampBehavior, 'leftSection': leftSection, 'rightSection': rightSection,
}
for k, v in _text.items():
    if v not in (None, ''):
        props[k] = v
if required: props['required'] = True
if withAsterisk: props['withAsterisk'] = True
if disabled: props['disabled'] = True
if hideControls: props['hideControls'] = True
if not allowNegative: props['allowNegative'] = False
if not allowDecimal: props['allowDecimal'] = False
for k, v in {'min': min, 'max': max, 'step': step,
             'defaultValue': defaultValue, 'decimalScale': decimalScale}.items():
    if v is not None:
        props[k] = v
if attr: props['attr'] = attr
print(component('NumberInput', **props))
```
