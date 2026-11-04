---
markdownHook: taskItem
description: A task-list item (`- [ ]` or `- [x]`), as a checkbox labelled by the item. The
  list item itself stays; `checked` is set for `[x]`.
params:
  checked: bool
islands: [TaskItem]
body: python
---
```python
print(open_island("TaskItem", defaultChecked=checked) + children + "</div>")
```
