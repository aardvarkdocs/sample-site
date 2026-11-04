---
markdownHook: step
description: One item of a numbered list the `steps` hook renders, as a StepperStep. `number`
  is the item's number, counting from the list's first.
params:
  number: int
islands: [StepperStep]
body: python
---
```python
print(open_island("StepperStep", number=number) + children + "</div>")
```
