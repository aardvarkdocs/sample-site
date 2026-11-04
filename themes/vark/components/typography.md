---
name: typography
description: A prose-styling wrapper — the Mantine Typography component. Wrap a block
  of Markdown (or raw HTML) and it picks up Mantine's article styles — headings, paragraphs,
  lists, tables, blockquotes, code, and links all get consistent spacing and type. Reach for
  it around a chunk of generated or pasted HTML that would otherwise be unstyled. The block
  body is the content. Close with {% endTypography %}.
params: {}
body: python
---
```python
# Mantine's Typography component applies its article prose styles to whatever HTML it
# wraps — it takes no styling props of its own, just children. The block body is the prose:
# bracket it with blank lines so the single Markdown pass renders it as Markdown rather than
# swallowing it as raw HTML (same trick as aside.md), giving the provider real prose markup
# (headings, lists, tables, blockquotes, code) to style.
# (Mantine 9 renamed TypographyStylesProvider → Typography.)
print(component('Typography', children="\n\n" + (children or '') + "\n\n", attr=attr))
```
