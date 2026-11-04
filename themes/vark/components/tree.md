---
name: tree
description: A nested file/folder explorer with collapsible folders, indentation guides and
  language-aware icons. Put {% folder %} and {% file %} blocks in the body; a file with source
  code in its body opens that code in a modal. Other attributes pass through to the tree. Close
  with {% endTree %}.
close: required
childScope: true
passthrough: true
body: python
---
```python
import aardvark.components as av

# The children are already rendered: a run of TreeFolder and TreeFile islands. The blank lines
# and indentation between the author's folder and file tags would end the Markdown pass's HTML
# block and turn the rest of the tree into a code block, so they are squeezed out. (Tabs and
# accordions keep theirs: those bracket Markdown bodies on purpose. A tree's body is only
# islands; a file carries its code as a prop.)
body = av.collapse_blank_lines(children)
print(component('Tree', children=body, attr=attr, **av.safe_attrs(attrs)))
```
