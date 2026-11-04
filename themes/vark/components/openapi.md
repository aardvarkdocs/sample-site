---
name: openapi
description: An OpenAPI reference rendered inline — one operation when `verb` and `endpoint` are
  both set, else the whole spec — with parameter and response tables, request samples, a Try it
  form, and each operation added to the page's left-hand navigation.
params:
  spec: {type: string, required: true}
close: never
positional: {param: spec, noun: spec path, example: "{% openapi 'openapi/petstore.json' %}"}
passthrough: true
emits: [ApiReference]
body: python
---
```python
import aardvark.components as av

# The reference renders no HTML attributes, so an attr={…} would silently do nothing: say so.
if attr is not None:
    av.warn(
        f"Aardvark: {{% openapi %}} ignores attr= — an API reference takes no HTML attributes; "
        f"style it through its CSS parts instead (in {av.call_source(globals())})"
    )
# prepare_openapi adds the operations to the page's navigation and the site's API catalog;
# mount_directive mounts the reference for the same readers.
prepared = av.prepare_openapi(globals(), spec, attrs)
print(av.mount_directive(globals(), prepared))
```
