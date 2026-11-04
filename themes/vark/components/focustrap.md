---
name: focustrap
description: A behavior primitive that traps keyboard focus inside its content while `active`,
  so Tab/Shift-Tab cycle within it instead of leaving — the focus management behind modals and
  drawers. It draws nothing itself; the block body is the region to trap focus within. Close
  with {% endFocustrap %}.
params:
  active: { type: bool, default: true }
body: python
---
```python
# A focus-management behavior primitive: Mantine's FocusTrap keeps Tab/Shift-Tab focus inside
# its single child element while `active`. It renders no markup of its own (it clones the
# child to attach handlers), so it has no visual output — the trap is only observable by
# tabbing. `active` defaults to true (matching Mantine); pass active=false to disable. The
# block body is the trapped region, wrapped in blank lines so the single Markdown pass renders
# it (the block-component convention). attr= forwards raw HTML attributes.
_body = "\n\n" + (children or '') + "\n\n"
print(component('FocusTrap', children=_body, attr=attr, active=active))
```
