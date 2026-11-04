---
name: accordionSection
description: One section of an {% accordion %}. `title` is the clickable control and the
  Markdown body is the panel. `value` names the section (for the accordion's `defaultValue`);
  it defaults to a slug of the title. Close with {% endAccordionSection %}.
close: required
childScope: true
passthrough: true
body: python
---
```python
import aardvark.components as av

# The value is the explicit one, else a slug of the title, else a page-unique fallback, then made
# unique among the sections of the enclosing accordion (Mantine keys panels by value). Only
# `title` and `value` are read: no other attribute, and no attr={...}, reaches the section.
title = str(attrs.get('title', '')).strip()
value = str(attrs.get('value') or av.slugify(title)).strip() or f"section-{av.uid(globals())}"
value = av.dedupe_value(globals(), value)

# The body is bracketed with blank lines so the page's Markdown pass renders it.
control = component('AccordionControl', children=title)
panel = component('AccordionPanel', children='\n\n' + children.strip() + '\n\n')
print(component('AccordionItem', value=value, children=control + panel))
```
