---
title: "Semi-circle progress"
description: "The built-in semicircleprogress tag — a half-circle gauge with a center label, thickness, orientation, fill direction, and segment colors. Usage, options, and live examples."
---

# Semi-circle progress

A built-in tag for a half-circle (gauge) progress indicator. Set `value` (0–100)
and, optionally, a `label`, the gauge `size` and `thickness`, an `orientation`
(`up` or `down`), a `fillDirection`, the `labelPosition`, and the filled / empty
segment colors.

Use it as `{% raw %}{% semicircleprogress %}{% endraw %}` in Markdown, or call it
from Python logic (loops, snippets) via `component('aardvark', 'semicircleprogress', …)`.

## Demonstrations

### Value and label

The minimal form — a `value` and an optional `label`:

{% semicircleprogress value=65 label="65%" %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% semicircleprogress value=65 label="65%" %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'semicircleprogress', value=65, label='65%')
```
{% endAccordionSection %}
{% endAccordion %}

### Colors and thickness

`filledSegmentColor` colors the filled arc, `emptySegmentColor` the empty track,
and `thickness` sets the arc width in px:

{% semicircleprogress value=80 label="80%" filledSegmentColor="teal" emptySegmentColor="gray" thickness=16 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% semicircleprogress value=80 label="80%" filledSegmentColor="teal" emptySegmentColor="gray" thickness=16 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'semicircleprogress', value=80, label='80%',
          filledSegmentColor='teal', emptySegmentColor='gray', thickness=16)
```
{% endAccordionSection %}
{% endAccordion %}

### Orientation, fill direction, and label position

`orientation='down'` flips the gauge; `fillDirection='right-to-left'` fills the
other way; `labelPosition='center'` moves the label into the arc:

{% semicircleprogress value=45 label="45%" orientation="down" fillDirection="right-to-left" labelPosition="center" filledSegmentColor="grape" %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% semicircleprogress value=45 label="45%" orientation="down" fillDirection="right-to-left" labelPosition="center" filledSegmentColor="grape" %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'semicircleprogress', value=45, label='45%',
          orientation='down', fillDirection='right-to-left',
          labelPosition='center', filledSegmentColor='grape')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Caption a gauge with a `{% raw %}{% text %}{% endraw %}` heading, grouped in a
centered `{% raw %}{% stack %}{% endraw %}`:

{% stack align="center" gap="0" %}
{% text size="sm" fw="500" %}CPU load{% endText %}
{% semicircleprogress value=72 label="72%" size=160 filledSegmentColor="orange" %}
{% endStack %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% stack align="center" gap="0" %}
{% text size="sm" fw="500" %}CPU load{% endText %}
{% semicircleprogress value=72 label="72%" size=160 filledSegmentColor="orange" %}
{% endStack %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'text', size='sm', fw='500', children='CPU load')
component('aardvark', 'semicircleprogress', value=72, label='72%',
          size=160, filledSegmentColor='orange')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `value` | A number 0–100 | **Required.** Fill percentage. |
| `size` | A number of px | Diameter of the gauge. Defaults to 200. |
| `thickness` | A number of px | Arc thickness. Defaults to 12. |
| `orientation` | `up` (default), `down` | Which way the half-circle opens. |
| `fillDirection` | `left-to-right` (default), `right-to-left` | Direction the arc fills. |
| `label` | Any string | Text shown inside the gauge. |
| `labelPosition` | `bottom` (default), `center` | Where the label sits. |
| `filledSegmentColor` | Any theme color or a CSS color value | Color of the filled arc. |
| `emptySegmentColor` | Any theme color or a CSS color value | Color of the empty track. |


## CSS Selectors

Each `semicircleprogress` carries `data-aardvark-island="SemiCircleProgress"` on its wrapper, and Mantine exposes its parts as `mantine-SemiCircleProgress-*` classes — target either to style it from your theme CSS.

{% raw %}
```css
[data-aardvark-island="SemiCircleProgress"] {
  /* style every semicircleprogress on the page */
}

.mantine-SemiCircleProgress-root {
  /* the root part */
}

.mantine-SemiCircleProgress-filledSegment {
  /* the filledSegment part */
}

.mantine-SemiCircleProgress-emptySegment {
  /* the emptySegment part */
}

.mantine-SemiCircleProgress-label {
  /* the label part */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% semicircleprogress value=65 label="65%" attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% semicircleprogress value=65 label="65%" attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'semicircleprogress', value=65, label='65%', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
