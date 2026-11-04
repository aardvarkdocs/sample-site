---
name: changelog
description: A changelog read from a YAML data file — a timeline of dated entries with a clickable
  tag cloud to filter them, an RSS feed, and a table-of-contents anchor per change. `wide` sets the
  cloud beside the timeline on a wide page; `tags`, `limitDays` and `limitEntries` narrow it.
params:
  path: {type: string, required: true}
close: never
positional: {param: path, noun: data-file path, example: "{% changelog 'data/changelog.yaml' %}"}
passthrough: true
emits: [Changelog]
body: python
---
```python
import aardvark.components as av

# The listing's table-of-contents anchors and RSS feed are published by prepare_changelog, for
# the readers of any visibility block around this call; mount_directive mounts it for them.
prepared = av.prepare_changelog(globals(), path, attrs, attr=attr)
print(av.mount_directive(globals(), prepared))
```
