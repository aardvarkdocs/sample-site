---
title: "Timeline"
description: "The built-in timeline tag — a vertical run of bullets joined by a connecting line, each with a title and body. Usage, options, and a live example with icon bullets."
---

# Timeline

A built-in tag for a vertical timeline — a run of bullets joined by a connecting line, each carrying a
title and a short body. Pass the events as a JSON array in `items`; each object takes a `title`, its
`content`, and optionally a `bullet` (a [Tabler](https://tabler.io/icons) icon name, an emoji, or
short text), plus a per-item `color` and `lineVariant`. Set `active` to mark how many items are
completed.

Use it as `{% raw %}{% timeline items='[…]' %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'timeline', …)`.

## A basic timeline

Three events with Tabler-icon bullets; `active=1` highlights the first two as completed.

{% timeline active=1 items='[
  {"title": "Cloned", "content": "Repository created and pushed.", "bullet": "git-branch"},
  {"title": "Built", "content": "First successful vark build.", "bullet": "package"},
  {"title": "Deployed", "content": "Live on the CDN.", "bullet": "rocket"}
]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% timeline active=1 items='[
  {"title": "Cloned", "content": "Repository created and pushed.", "bullet": "git-branch"},
  {"title": "Built", "content": "First successful vark build.", "bullet": "package"},
  {"title": "Deployed", "content": "Live on the CDN.", "bullet": "rocket"}
]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'timeline', active=1, items='''[
  {"title": "Cloned", "content": "Repository created and pushed.", "bullet": "git-branch"},
  {"title": "Built", "content": "First successful vark build.", "bullet": "package"},
  {"title": "Deployed", "content": "Live on the CDN.", "bullet": "rocket"}
]''')
```
{% endAccordionSection %}
{% endAccordion %}

A bullet that looks like a bare Tabler icon name renders that glyph; an emoji, number, or short text
renders as-is; omit it for Mantine's default dot.

## Highlighting progress with a dashed segment

`active=0` marks the first item completed. A per-item `lineVariant` of `dashed` shows the next
segment as in-progress, and `color='teal'` accents the active bullets and line.

{% timeline active=0 color='teal' items='[
  {"title": "Shipped", "content": "Done.", "bullet": "check"},
  {"title": "In review", "content": "Almost there.", "bullet": "clock", "lineVariant": "dashed"},
  {"title": "Planned", "content": "Not started.", "bullet": "circle"}
]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% timeline active=0 color='teal' items='[
  {"title": "Shipped", "content": "Done.", "bullet": "check"},
  {"title": "In review", "content": "Almost there.", "bullet": "clock", "lineVariant": "dashed"},
  {"title": "Planned", "content": "Not started.", "bullet": "circle"}
]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'timeline', active=0, color='teal', items='''[
  {"title": "Shipped", "content": "Done.", "bullet": "check"},
  {"title": "In review", "content": "Almost there.", "bullet": "clock", "lineVariant": "dashed"},
  {"title": "Planned", "content": "Not started.", "bullet": "circle"}
]''')
```
{% endAccordionSection %}
{% endAccordion %}

## Sizing, alignment, and reverse highlighting

`bulletSize` and `lineWidth` are in px; `radius` rounds the bullets; `align='right'` runs the line
down the right; and `reverseActive` highlights from the bottom up.

{% timeline active=1 align='right' bulletSize=28 lineWidth=3 radius='sm' reverseActive color='grape' items='[
  {"title": "Now", "content": "Latest release.", "bullet": "🚀"},
  {"title": "Last month", "content": "Previous release.", "bullet": "📦"},
  {"title": "Earlier", "content": "First release.", "bullet": "🌱"}
]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% timeline active=1 align='right' bulletSize=28 lineWidth=3 radius='sm' reverseActive color='grape' items='[
  {"title": "Now", "content": "Latest release.", "bullet": "🚀"},
  {"title": "Last month", "content": "Previous release.", "bullet": "📦"},
  {"title": "Earlier", "content": "First release.", "bullet": "🌱"}
]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'timeline', active=1, align='right', bulletSize=28, lineWidth=3,
          radius='sm', reverseActive=True, color='grape', items='''[
  {"title": "Now", "content": "Latest release.", "bullet": "🚀"},
  {"title": "Last month", "content": "Previous release.", "bullet": "📦"},
  {"title": "Earlier", "content": "First release.", "bullet": "🌱"}
]''')
```
{% endAccordionSection %}
{% endAccordion %}

## Per-item color and autoContrast

Each item can override the accent `color`; `autoContrast` picks a readable icon color against the
bullet fill.

{% timeline active=2 autoContrast items='[
  {"title": "Triage", "content": "Issue opened.", "bullet": "flag", "color": "blue"},
  {"title": "Fix", "content": "Patch merged.", "bullet": "git-merge", "color": "green"},
  {"title": "Release", "content": "Shipped to users.", "bullet": "rocket", "color": "grape"}
]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% timeline active=2 autoContrast items='[
  {"title": "Triage", "content": "Issue opened.", "bullet": "flag", "color": "blue"},
  {"title": "Fix", "content": "Patch merged.", "bullet": "git-merge", "color": "green"},
  {"title": "Release", "content": "Shipped to users.", "bullet": "rocket", "color": "grape"}
]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'timeline', active=2, autoContrast=True, items='''[
  {"title": "Triage", "content": "Issue opened.", "bullet": "flag", "color": "blue"},
  {"title": "Fix", "content": "Patch merged.", "bullet": "git-merge", "color": "green"},
  {"title": "Release", "content": "Shipped to users.", "bullet": "rocket", "color": "grape"}
]''')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

A timeline drops into any other component's body — here inside a
[card](/components/data-display/card/), built in Python from a list so each event can come from data.

{% card title="Release history" subtitle="The last three milestones." icon="history" %}
{% timeline active=2 items='[
  {"title": "v0.1.0", "content": "First public build.", "bullet": "tag"},
  {"title": "v0.1.5", "content": "Search and themes.", "bullet": "tag"},
  {"title": "v0.2.0", "content": "Built-in components.", "bullet": "tag"}
]' %}
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card title="Release history" subtitle="The last three milestones." icon="history" %}
{% timeline active=2 items='[
  {"title": "v0.1.0", "content": "First public build.", "bullet": "tag"},
  {"title": "v0.1.5", "content": "Search and themes.", "bullet": "tag"},
  {"title": "v0.2.0", "content": "Built-in components.", "bullet": "tag"}
]' %}
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
import json
releases = [
    {'title': 'v0.1.0', 'content': 'First public build.', 'bullet': 'tag'},
    {'title': 'v0.1.5', 'content': 'Search and themes.', 'bullet': 'tag'},
    {'title': 'v0.2.0', 'content': 'Built-in components.', 'bullet': 'tag'},
]
tl = component('aardvark', 'timeline', active=2, items=json.dumps(releases))
component('aardvark', 'card', title='Release history', subtitle='The last three milestones.',
          icon='history', children=tl)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `items` | JSON array of event objects | The events: each `{title, content, bullet?, color?, lineVariant?}` (see per-item fields below). |
| `active` | int | Index of the last highlighted (completed) item; earlier ones highlight too. |
| `bulletSize` | int (px) | Diameter of the bullet circles. |
| `lineWidth` | int (px) | Thickness of the connecting line. |
| `radius` | a Mantine size token (`xs`–`xl`) or a px value | Bullet corner radius. |
| `color` | a Mantine color name or hex | Accent color for active bullets and the line. |
| `align` | `left` (default) or `right` | Which side the line runs. |
| `reverseActive` | bool (default `false`) | Highlight from the bottom up instead of the top down. |
| `autoContrast` | bool (default `false`) | Auto-pick a readable icon color against the bullet fill. |

### Per-item fields (objects in `items`)

| Field | Valid values | Description |
| --- | --- | --- |
| `title` | string | The item's heading. |
| `content` | string | The item's body text. |
| `bullet` | a Tabler icon name, emoji, number, or short label | Shown in the bullet circle. Omit for Mantine's default dot. |
| `color` | a Mantine color name or hex | Override the accent color for just this item. |
| `lineVariant` | `solid` (default), `dashed`, `dotted` | The line below this item. |
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="Timeline"]` — or through the Mantine Styles API classes (`.mantine-Timeline-root` and its inner parts):

{% raw %}
```css
/* Every rendered Timeline carries this island marker */
[data-aardvark-island="Timeline"] { }

/* Mantine Styles API class on the root element */
.mantine-Timeline-root { }
.mantine-Timeline-item { }
.mantine-Timeline-itemBullet { }
.mantine-Timeline-itemBody { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% timeline active=1 items='[
  {"title": "Cloned", "content": "Repository created and pushed.", "bullet": "git-branch"},
  {"title": "Built", "content": "First successful vark build.", "bullet": "package"}
]' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% timeline active=1 items='[
  {"title": "Cloned", "content": "Repository created and pushed.", "bullet": "git-branch"},
  {"title": "Built", "content": "First successful vark build.", "bullet": "package"}
]' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'timeline', active=1, items='''[
  {"title": "Cloned", "content": "Repository created and pushed.", "bullet": "git-branch"},
  {"title": "Built", "content": "First successful vark build.", "bullet": "package"}
]''', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
