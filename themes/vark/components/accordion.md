---
name: accordion
description: Collapsible sections with Markdown bodies, in Mantine's contained Accordion style.
  Put one or more {% accordionSection %} blocks in the body. Add `multiple` to let several
  sections stay open, and `defaultValue` (a section's value, or a comma-separated list with
  `multiple`) to open some at first; every other attribute passes through to the Accordion.
  Close with {% endAccordion %}.
close: required
childScope: true
passthrough: true
body: python
---
```python
import aardvark.components as av

# The children are already rendered: a run of AccordionItem islands from the nested
# accordionSection tags. Every attribute except a stray `children` passes through as an
# Accordion prop, in the order the author wrote it. The look is fixed to Mantine's `contained`
# variant, so there is no author-facing `variant`.
props = av.safe_attrs(attrs)
props['variant'] = 'contained'
# With `multiple`, Mantine types defaultValue as a list of values: split a "a" or "a,b" string
# into one, or multiple-open mode silently falls back to single-select.
if props.get('multiple') and isinstance(props.get('defaultValue'), str):
    props['defaultValue'] = [v.strip() for v in props['defaultValue'].split(',') if v.strip()]
# Sections built in a Python loop never entered this tag's value scope, so two with like titles
# could share a value; make the direct children's values unique here.
body = av.dedupe_child_island_values(children.strip(), 'AccordionItem', container='Accordion')
print(component('Accordion', children=body, attr=attr, **props))
```
