---
title: "Select stepper"
description: "The built-in selectstepper tag — an option-cycling stepper from the Mantine community. Prev/next arrows step through a list of choices. Pass data as JSON, set a label, orientation, looping, and live examples."
parent: community
weight: 20
---

# Select stepper

A built-in tag for an **option-cycling stepper** — prev/next arrows that step through a list
of choices, showing one at a time. Pass `data` as a JSON array (either of plain strings or of
`{value, label}` objects) and optionally set a `label`, a starting `defaultValue`, the
`orientation`, and `loop` for infinite cycling.

A **Community Component** — wraps [SelectStepper](https://gfazioli.github.io/mantine-select-stepper/)
by **gfazioli**, **MIT** licensed, npm `@gfazioli/mantine-select-stepper`.

## Demonstrations

### Basic stepper

Pass `data` as a JSON array of strings. The stepper starts on the first option; the arrows
move through the list.

{% raw %}
```aardvark
{% selectstepper data='["React","Vue","Svelte","Angular"]' label='Framework' %}
```
{% endraw %}

{% selectstepper data='["React","Vue","Svelte","Angular"]' label='Framework' %}

### Object data with labels

Use `{value, label}` objects when the stored value differs from what's shown. Set
`defaultValue` to start on a specific entry.

{% raw %}
```aardvark
{% selectstepper data='[{"value":"sm","label":"Small"},{"value":"md","label":"Medium"},{"value":"lg","label":"Large"}]' label='Size' defaultValue='md' %}
```
{% endraw %}

{% selectstepper data='[{"value":"sm","label":"Small"},{"value":"md","label":"Medium"},{"value":"lg","label":"Large"}]' label='Size' defaultValue='md' %}

### Vertical orientation and looping

`orientation='vertical'` stacks the arrows top/bottom; `loop=true` wraps around past the ends.

{% raw %}
```aardvark
{% selectstepper data='["Mon","Tue","Wed","Thu","Fri"]' label='Day' orientation='vertical' loop=true %}
```
{% endraw %}

{% selectstepper data='["Mon","Tue","Wed","Thu","Fri"]' label='Day' orientation='vertical' loop=true %}

### Size and description

`size` scales the control; `description` adds helper text below the label.

{% raw %}
```aardvark
{% selectstepper data='["Low","Medium","High","Critical"]' label='Priority' description='Use arrows to cycle' size='lg' %}
```
{% endraw %}

{% selectstepper data='["Low","Medium","High","Critical"]' label='Priority' description='Use arrows to cycle' size='lg' %}

## With other components

Pair a stepper with a [Card](/components/data-display/card/) to build a self-contained picker.

{% raw %}
```aardvark
{% card title="Plan" %}
{% selectstepper data='["Free","Pro","Team","Enterprise"]' label='Tier' defaultValue='Pro' %}
{% endCard %}
```
{% endraw %}

{% card title="Plan" %}
{% selectstepper data='["Free","Pro","Team","Enterprise"]' label='Tier' defaultValue='Pro' %}
{% endCard %}

## Attributes

Omit any attribute to take its default. Bare flags (e.g. `loop`) become `=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `data` | **Required.** A JSON array of strings **or** `{value, label}` objects | The options to cycle through. |
| `defaultValue` | String | The value to start on (defaults to the first option). |
| `label` | String | Label text shown above the control. |
| `description` | String | Helper text shown below the label. |
| `orientation` | `horizontal` (default) / `vertical` | Direction of the prev/next arrows. |
| `size` | `xs` / `sm` / `md` / `lg` / `xl` | Overall control size. |
| `variant` | String | Visual style variant (passed through to the vendor component). |
| `loop` | `true` / `false` (default `false`) | Wrap around past the first/last option. |
| `animate` | `true` / `false` (default `false`) | Animate transitions between options. |
| `disabled` | `true` / `false` (default `false`) | Disable the whole control. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

## CSS Selector

The component renders inside an island wrapper carrying
`data-aardvark-island="SelectStepper"`, with the vendor's own class names on the control
inside. Target the wrapper to constrain or align it:

```css
[data-aardvark-island="SelectStepper"] {
  max-width: 16rem;
}
```

## Injecting Attributes

Use `attr={…}` to forward raw HTML attributes (ids, `data-*`, ARIA) straight onto the rendered
root — handy for testing hooks or scripting.

{% selectstepper data='["A","B","C"]' label='Step' attr={'data-testid': 'grade-stepper'} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% selectstepper data='["A","B","C"]' label='Step' attr={'data-testid': 'grade-stepper'} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'selectstepper', data='["A","B","C"]', label='Step', attr={'data-testid': 'grade-stepper'})
```
{% endAccordionSection %}
{% endAccordion %}
