---
title: "Steps"
description: "Numbered Markdown lists render automatically as a Steps timeline — numbered badges joined by a vertical line, each beside its step's content. No special syntax."
---

# Steps

Write an ordinary **numbered list** in Markdown and aardvark renders it as a
**Steps** block: a vertical run of numbered badges joined by a connecting line,
each badge beside that step's content, built from Mantine's `Timeline`. There's
**no tag to learn** — a plain `1. … 2. … 3.` list is all it takes. Each step's
body is full **Markdown**: paragraphs, code, images, even nested lists.

## Usage

Just write the list:

```markdown
1. **Install** — pull in the toolchain with `npm install`.
2. **Configure** — add an `aardvark.config.yaml` and point `content` at your Markdown.
3. **Build** — run `vark build`, then serve the `build/` directory.
```

renders, live:

1. **Install** — pull in the toolchain with `npm install`.
2. **Configure** — add an `aardvark.config.yaml` and point `content` at your Markdown.
3. **Build** — run `vark build`, then serve the `build/` directory.

Lead each step with a **bold** phrase to give it a title, or just write prose —
both read well beside the number.

## Multi-block steps

A step can hold any block content — extra paragraphs, a code block, an image.
Leave a blank line between items (a "loose" list) and give each step as much room
as it needs:

````markdown
1. Create the config.

   ```yaml
   site:
     name: My Docs
   ```

2. Add your first page at `content/index.md`.

3. Build and serve.
````

1. Create the config.

   ```yaml
   site:
     name: My Docs
   ```

2. Add your first page at `content/index.md`.

3. Build and serve.

## Numbering

The list's own numbering is kept, so a list that starts at `3` shows `3, 4, 5`:

```markdown
3. Third
4. Fourth
5. Fifth
```

3. Third
4. Fourth
5. Fifth

## Nested numbered lists

{% callout title="Careful with nested numbered lists" severity="caution" %}
Only a **top-level** numbered list becomes Steps. A numbered list **nested inside a
step** isn't rendered as a second timeline — it stays a plain ordered list, which can
look awkward tucked inside the steps. If a page genuinely needs numbered **sub-steps**,
turn Steps off (`steps: false` in `aardvark.config.yaml`, below) and author the whole
list as ordinary Markdown.
{% endCallout %}

With Steps on, a nested numbered list flattens into the step body rather than forming
its own timeline:

1. A top-level step — rendered as a Step.
   1. A nested numbered list stays a plain ordered list…
   2. …sitting inside the step body, which can look out of place.
2. Back at the top level.

Bullet lists are never Steps, at any level.

## Turning it off

Auto-Steps is on by default. To render numbered lists as plain ordered lists
site-wide, set `steps: false` in `aardvark.config.yaml`:

```yaml
# Render numbered lists as plain <ol> instead of Steps.
steps: false
```
