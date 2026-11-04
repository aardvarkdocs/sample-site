---
name: file
description: A file in a {% tree %}. `name` (required) is the label and picks the icon and the
  highlighting language (`lang` overrides it). A body of source code makes the file clickable,
  opening the code in a modal as a highlighted code block; an empty body is a plain row. `href`,
  `comment` and `highlighted` ride through. Close with {% endFile %}.
close: required
children: raw
passthrough: true
body: python
---
```python
import aardvark.components as av

# The body arrives verbatim: nothing in it runs, and it never reaches the Markdown pass. Code that
# contains the tree's own closing tags can be wrapped whole in a raw pair, which comes off here.
# A nameless file would render as a silent empty-label row, and the name also picks the icon and
# the language, so it fails the build.
name = str(attrs.get('name', '')).strip()
if not name:
    raise av.ComponentError(
        "{% file %} requires a `name` attribute (the file name; drives the icon + language)"
        f" (in {av.call_source(globals())})"
    )
code = av.normalize_code(av.strip_raw_wrapper(children))
# `name` would collide with the island-name argument of component(), so the display name rides
# as the `label` prop. `code`, `lang` and `codeHtml` come from the body below, never from the
# author's attributes: a stray `code=` must not make an empty file clickable, nor a `codeHtml=`
# put markup into the modal.
props = av.safe_attrs(attrs, 'name', 'lang', 'code', 'codeHtml')
props['label'] = name
# The file's own flags. Its island reads only `highlighted`; a `defaultOpen` or `openable` written
# on a file is made a boolean all the same.
av.coerce_flag_attrs(props, ('defaultOpen', 'openable', 'highlighted'))
if code:
    # The code rides the props unescaped: the island escapes it as it renders, as a fence does.
    props['code'] = code
    props.pop('href', None)  # a file with code opens the modal on click, so a link is moot
    lang = av.lang_for(name, attrs.get('lang'))
    if lang:
        props['lang'] = lang
        # The modal renders from a prop, outside the Markdown pass, and there is no highlighter
        # in the browser: highlight here, as a fenced block would be, when the site highlights
        # code. With no highlighting (or no lexer for the language) the island shows the plain
        # code. The raw code always rides along for the modal's copy and download.
        if av.syntax_enabled(globals()):
            code_html = av.highlight(code, lang)
            if code_html:
                props['codeHtml'] = code_html
print(component('TreeFile', attr=attr, **props))
```
