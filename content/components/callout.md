---
title: "Callout"
description: "Callout — the built-in admonition box, shown across all four severities (success, info, caution, warning)."
---

# Callout

The built-in **`{% raw %}{% callout %}{% endraw %}`** tag renders a titled, colored
admonition with a severity color and a matching icon. `severity` is one of `success`
(green), `info` (primary), `caution` (yellow), or `warning` (red). `title` is optional
and the block body is the message. Close it with `{% raw %}{% endCallout %}{% endraw %}`.

## Severities

The syntax — `severity` plus an optional `title`:

{% raw %}
```aardvark
{% callout title="All systems go" severity="success" %}
Your changes were saved successfully.
{% endCallout %}
```
{% endraw %}

Set `severity` to `success`, `info`, `caution`, or `warning` — one titled example of each:

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

## Without a title

`title` is optional — omit it for a plain icon + message:

{% callout severity="info" %}
The icon and color still convey the severity when there's no title.
{% endCallout %}

## The block body

Everything between the open and close tags becomes the message:

{% callout title="This is a destructive action" severity="warning" %}
Be careful when proceeding here.
{% endCallout %}
