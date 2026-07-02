---
title: "Steps"
description: "Numbered Markdown lists render automatically as a Steps timeline — numbered badges joined by a vertical line, each beside its step's content. No special syntax."
---

# Steps

Write an ordinary numbered list in Markdown and aardvark renders it as a Steps block:
a vertical run of numbered badges joined by a connecting line, each badge beside that
step's content, built from Mantine's `Timeline`. Each step's body is full Markdown —
paragraphs, code, images, even nested lists.

Steps is not a tag. There is nothing to write as `{% raw %}{% steps %}{% endraw %}`
and no `component('aardvark', 'steps', …)` call — a plain `1. … 2. … 3.` numbered
list is the entire authoring surface, and aardvark transforms it at build time. The
behavior is controlled site-wide by `steps: false` in `aardvark.config.yaml`.

## Default

Just write a numbered list. Lead each step with a bold phrase to give it a title, or
write plain prose — both read well beside the number.

**Preview**

1. **Install** — pull in the toolchain with `npm install`.
2. **Configure** — add an `aardvark.config.yaml` and point `content` at your Markdown.
3. **Build** — run `vark build`, then serve the `build/` directory.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
```markdown
1. **Install** — pull in the toolchain with `npm install`.
2. **Configure** — add an `aardvark.config.yaml` and point `content` at your Markdown.
3. **Build** — run `vark build`, then serve the `build/` directory.
```
{% endAccordionSection %}
{% endAccordion %}

## Multi-block steps

A step can hold any block content — extra paragraphs, a code block, an image. Leave a
blank line between items (a "loose" list) and give each step as much room as it needs.

**Preview**

1. Create the config.

   ```yaml
   site:
     name: My Docs
   ```

2. Add your first page at `content/index.md`.

3. Build and serve.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
````markdown
1. Create the config.

   ```yaml
   site:
     name: My Docs
   ```

2. Add your first page at `content/index.md`.

3. Build and serve.
````
{% endAccordionSection %}
{% endAccordion %}

## Numbering

The list's own numbering is kept, so a list that starts at `3` shows `3, 4, 5`.

**Preview**

3. Third
4. Fourth
5. Fifth

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
```markdown
3. Third
4. Fourth
5. Fifth
```
{% endAccordionSection %}
{% endAccordion %}

## Nested numbered lists

{% callout title="Careful with nested numbered lists" severity="caution" %}
Only a **top-level** numbered list becomes Steps. A numbered list **nested inside a
step** isn't rendered as a second timeline — it stays a plain ordered list, which can
look awkward tucked inside the steps. If a page genuinely needs numbered **sub-steps**,
turn Steps off (`steps: false` in `aardvark.config.yaml`, below) and author the whole
list as ordinary Markdown.
{% endCallout %}

With Steps on, a nested numbered list flattens into the step body rather than forming
its own timeline. Bullet lists are never Steps, at any level.

**Preview**

1. A top-level step — rendered as a Step.
   1. A nested numbered list stays a plain ordered list…
   2. …sitting inside the step body, which can look out of place.
2. Back at the top level.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
```markdown
1. A top-level step — rendered as a Step.
   1. A nested numbered list stays a plain ordered list…
   2. …sitting inside the step body, which can look out of place.
2. Back at the top level.
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Each step's body is full Markdown, so it can host any other tag — for example a
`{% raw %}{% callout %}{% endraw %}` inside one step. Keep the blank lines between
items so the step bodies render as block Markdown.

**Preview**

1. **Set up** the project directory.

2. **Edit** the config.

   {% callout severity="info" %}
   The config lives at `aardvark.config.yaml` in the project root.
   {% endCallout %}

3. **Build** with `vark build`.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
1. **Set up** the project directory.

2. **Edit** the config.

   {% callout severity="info" %}
   The config lives at `aardvark.config.yaml` in the project root.
   {% endCallout %}

3. **Build** with `vark build`.
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## Turning it off

Auto-Steps is on by default. To render numbered lists as plain ordered lists
site-wide, set `steps: false` in `aardvark.config.yaml`:

```yaml
# Render numbered lists as plain <ol> instead of Steps.
steps: false
```

## Attributes

Steps has no tag and therefore no per-instance attributes. Its only setting is the
site-wide config flag.

| Setting | Valid values | Description |
| --- | --- | --- |
| `steps` (in `aardvark.config.yaml`) | bool (default `true`) | `false` renders numbered lists as plain `<ol>` instead of a Steps timeline, site-wide. |

## CSS Selectors

A top-level numbered list becomes a client-mounted `Stepper` island (a Mantine `Timeline`); the Timeline root carries `data-aardvark-steps`, so you can target the island wrapper, that root, or Mantine's Timeline Styles API classes.

{% raw %}
```css
[data-aardvark-island="Stepper"] /* the island wrapper */
[data-aardvark-steps]            /* the Timeline root */
.mantine-Timeline-root           /* the timeline */
.mantine-Timeline-item           /* a single step */
.mantine-Timeline-itemBullet     /* the numbered badge */
.mantine-Timeline-itemBody       /* the step's content */
```
{% endraw %}

## Injecting Attributes

Steps has no tag — a plain numbered list is the whole authoring surface — so there's no `attr={…}` channel and no per-instance attributes. Style it through the CSS classes above, and toggle the whole feature with `steps:` in `aardvark.config.yaml`.
