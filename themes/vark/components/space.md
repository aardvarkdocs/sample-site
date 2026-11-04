---
name: space
description: An empty spacer box — adds horizontal (`w`) or vertical (`h`) space between
  elements without a margin. Both take a Mantine size token (`xs`–`xl`) or any CSS value.
  No body. See https://mantine.dev/core/space/.
params:
  w: string
  h: string
body: python
---
```python
# Space is a tiny spacer Box — it takes only w / h (Mantine size token or CSS value) and
# has no children. Unset props are omitted so Mantine applies nothing for that axis.
_s = {'w': w, 'h': h}
_props = {k: v for k, v in _s.items() if v not in (None, '')}
print(component('Space', attr=attr, **_props))
```
