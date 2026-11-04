---
name: taxonomy
description: A listing of the pages that joined a taxonomy in their front matter — a changelog
  timeline (`type="changelog"`), a grid of article cards (`type="articles"`) or a knowledge base
  (`type="kb"`), with a tag cloud to filter it and, for dated listings, an RSS feed.
close: never
passthrough: true
emits: [Changelog, ArticleList, KnowledgeBase]
body: python
---
```python
import aardvark.components as av

# prepare_taxonomy picks the listing's island from `type` and publishes its table-of-contents
# anchors and RSS feed; mount_directive mounts it for the same readers.
prepared = av.prepare_taxonomy(globals(), attrs, attr=attr)
print(av.mount_directive(globals(), prepared))
```
