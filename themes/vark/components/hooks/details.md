---
markdownHook: details
description: A raw <details>/<summary> block, as a one-item contained Accordion whose control
  is the summary. `defaultOpen` is set when the <details> tag carries `open`.
params:
  title: string
  defaultOpen: bool
islands: [Accordion, AccordionItem, AccordionControl, AccordionPanel]
body: python
---
```python
# A single disclosure is a one-item Accordion. Its item has no sibling to collide with, so its value
# is this fixed constant, which `defaultValue` names to start the item open.
ITEM = "section"

props = {"variant": "contained"}
if defaultOpen:
    props["defaultValue"] = ITEM
# The summary is a closed control; the body goes in the panel, inside the three open elements.
print(
    open_island("Accordion", **props)
    + open_island("AccordionItem", value=ITEM)
    + component("AccordionControl", children=title)
    + open_island("AccordionPanel")
    + children
    + "</div>" * 3
)
```
