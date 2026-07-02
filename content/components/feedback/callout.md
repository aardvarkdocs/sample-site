---
title: "Callout"
description: "Callout — the built-in admonition box, shown across all four severities (success, info, caution, warning)."
---

# Callout

The built-in callout tag renders a titled, colored admonition with a severity
color and a matching icon. `severity` is one of `success` (green), `info`
(primary), `caution` (yellow), or `warning` (red); `title` is optional; and the
block body is the message. Close it with `{% raw %}{% endCallout %}{% endraw %}`.

Use it as `{% raw %}{% callout %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'callout', …)`.

## Demonstrations

### Severities

Set `severity` to `success`, `info`, `caution`, or `warning` — one titled example
of each:

{% callout title="All systems go" severity="success" %}
Your changes were saved successfully.
{% endCallout %}

{% callout title="Good to know" severity="info" %}
This setting only applies to new projects.
{% endCallout %}

{% callout title="Double-check this" severity="caution" %}
This will overwrite uncommitted local changes.
{% endCallout %}

{% callout title="This is a destructive action" severity="warning" %}
Deleting a project cannot be undone.
{% endCallout %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% callout title="All systems go" severity="success" %}
Your changes were saved successfully.
{% endCallout %}

{% callout title="Good to know" severity="info" %}
This setting only applies to new projects.
{% endCallout %}

{% callout title="Double-check this" severity="caution" %}
This will overwrite uncommitted local changes.
{% endCallout %}

{% callout title="This is a destructive action" severity="warning" %}
Deleting a project cannot be undone.
{% endCallout %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'callout', severity='success',
          title='All systems go',
          children='Your changes were saved successfully.')
component('aardvark', 'callout', severity='info',
          title='Good to know',
          children='This setting only applies to new projects.')
component('aardvark', 'callout', severity='caution',
          title='Double-check this',
          children='This will overwrite uncommitted local changes.')
component('aardvark', 'callout', severity='warning',
          title='This is a destructive action',
          children='Deleting a project cannot be undone.')
```
{% endAccordionSection %}
{% endAccordion %}

### Without a title

`title` is optional — omit it for a plain icon + message:

{% callout severity="info" %}
The icon and color still convey the severity when there's no title.
{% endCallout %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% callout severity="info" %}
The icon and color still convey the severity when there's no title.
{% endCallout %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'callout', severity='info',
          children='The icon and color still convey the severity when there\'s no title.')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

The block body is full Markdown, so a callout can wrap lists, links, inline code,
and other tags:

{% callout title="Before you deploy" severity="caution" %}
Check the following first:

- Your working tree is clean (`git status`).
- The `production` environment variables are set.
- You're on the right branch.
{% endCallout %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% callout title="Before you deploy" severity="caution" %}
Check the following first:

- Your working tree is clean (`git status`).
- The `production` environment variables are set.
- You're on the right branch.
{% endCallout %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'callout', severity='caution',
          title='Before you deploy',
          children=(
              'Check the following first:\n\n'
              '- Your working tree is clean (`git status`).\n'
              '- The `production` environment variables are set.\n'
              '- You\'re on the right branch.'))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `severity` | `success`, `info` (default), `caution`, `warning` | Severity color and matching icon. An unknown value falls back to `info`. |
| `title` | Any string | Optional bold heading shown above the message. Omit it for a plain icon + message. |
| *(body)* | Markdown | The message, written between `{% raw %}{% callout %}{% endraw %}` and `{% raw %}{% endCallout %}{% endraw %}` (`children=` from Python). |


## CSS Selectors

Each `callout` carries `data-aardvark-island="Callout"` on its wrapper, and the rendered Mantine Alert exposes its parts as `mantine-Alert-*` classes — target either to style it from your theme CSS.

{% raw %}
```css
[data-aardvark-island="Callout"] {
  /* style every callout on the page */
}

.mantine-Alert-root {
  /* the root part */
}

.mantine-Alert-title {
  /* the title part */
}

.mantine-Alert-message {
  /* the message part */
}

.mantine-Alert-icon {
  /* the icon part */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% callout title="All systems go" severity="success" attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Your changes were saved successfully.
{% endCallout %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% callout title="All systems go" severity="success" attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Your changes were saved successfully.
{% endCallout %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'callout', title='All systems go', severity='success',
          children='Your changes were saved successfully.', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
