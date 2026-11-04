---
name: numberformatter
description: Formats a number for display — thousands separators, a fixed number of
  decimals, a currency-style `prefix`/`suffix`, and a custom `decimalSeparator`. Set
  `value` (the number) plus any of `prefix`, `suffix`, `thousandSeparator` (a bare flag
  uses `,`, or pass a custom separator string), `decimalScale` (max decimal places),
  `decimalSeparator`, and `fixedDecimalScale` (pad to `decimalScale` with zeros). Renders
  inline text, no children.
params:
  value: string
  prefix: string
  suffix: string
  thousandSeparator: string
  decimalScale: int
  decimalSeparator: string
  fixedDecimalScale: { type: bool, default: false }
body: python
---
```python
# Mirrors badge.md/rating.md: every prop is optional and unset ones are omitted so
# Mantine's NumberFormatter (a react-number-format wrapper) applies its own defaults.
# `value` rides as a string — react-number-format accepts a string or number and
# parses it — so "1234.5" and "1234.5px"-free numerics both work; numeric params
# (decimalScale) are tested against None so a deliberate 0 (no decimals) survives.
# `thousandSeparator` is bool|string, but the param is typed `string`, so EVERY boolean form
# reaches this body as text: a bare flag and the Python `thousandSeparator=True` both stringify
# to Python's repr "True"/"False", while an author writing Markdown may equally quote "true"/
# "false". Every one of those spellings is truthy, so a case-sensitive test would forward the
# word itself as the separator and render 1false000false000. Fold the flag spellings
# case-insensitively: "true" means Mantine's ',' default, and "false"/"none"/"null" mean omit the
# prop (no grouping) — Python's idiomatic thousandSeparator=None stringifies to "None" and would
# otherwise render 1None000. A real separator keeps its ORIGINAL value, so whitespace (' ')
# survives the check; no one groups digits with the literal word "none".
props = {}
if value is not None and value != '': props['value'] = value
if prefix: props['prefix'] = prefix
if suffix: props['suffix'] = suffix
_sep_flag = thousandSeparator.strip().lower() if isinstance(thousandSeparator, str) else thousandSeparator
if thousandSeparator and _sep_flag not in ('false', 'none', 'null'):
    props['thousandSeparator'] = ',' if _sep_flag == 'true' else thousandSeparator
if decimalScale is not None: props['decimalScale'] = decimalScale
if decimalSeparator: props['decimalSeparator'] = decimalSeparator
if fixedDecimalScale: props['fixedDecimalScale'] = True
# Inline island (a formatted number sits mid-sentence); attr forwards raw HTML attrs.
print(inline_component('NumberFormatter', attr=attr, **props))
```
