---
name: slide
description: One slide inside a carousel. Place it in a {% carousel %} body; the block body is
  the slide content (rendered as Markdown). Close with {% endSlide %}.
body: python
---
```python
# The slide tag renders Mantine's CarouselSlide from @mantine/carousel (the `carousel` component
# library) — the child of the Carousel compound tree. It is meant to nest inside a carousel block;
# the block body is the slide content, wrapped in blank lines so the single Markdown pass renders
# it as Markdown (the same convention as accordionSection / paper), rather than swallowing it as
# raw HTML. No props of its own beyond the raw-attribute channel.
print(component('carousel', 'CarouselSlide', children="\n\n" + (children or '') + "\n\n", attr=attr))
```
