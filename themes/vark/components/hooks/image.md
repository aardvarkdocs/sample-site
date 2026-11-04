---
markdownHook: image
description: An image alone in its paragraph, as a ZoomImage that opens full size when clicked.
  `src` is the image URL as the page wrote it, which the build resolves in ZoomImage's `src`;
  `title`, `loading` and `decoding` are unset when the image has none.
params:
  src: string
  alt: string
  title: string
  loading: string
  decoding: string
islands: [ZoomImage]
body: python
---
```python
props = {"src": src, "alt": alt}
# A hover tooltip from the Markdown title, or from the alt text when there is no title: the text a
# browser would show for `title`, styled. Omitted when both are empty (a decorative image). A visible
# caption is the {% image %} tag's; a Markdown image never renders one.
tooltip = (title or "").strip() or alt
if tooltip:
    props["tooltip"] = tooltip
# The loading hints (decoding="async"; loading="lazy" on every image but the page's first), passed
# through to the <img>.
if loading is not None:
    props["loading"] = loading
if decoding is not None:
    props["decoding"] = decoding
print(component("ZoomImage", **props))
```
