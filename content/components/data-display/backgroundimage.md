---
title: "BackgroundImage"
description: "The built-in backgroundimage tag — a box that shows an image as its background with content overlaid on top. Usage, options, and live examples."
---

# BackgroundImage

A box that displays an image as its **background**, with your content laid over it. Point
`src` at the image, round the corners with `radius`, and put whatever you like in the block
body — it renders on top of the background. The Mantine spacing and sizing system is
forwarded, so you can pad and size the box without writing CSS.

Use it as `{% raw %}{% backgroundimage %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'backgroundimage', …)`. Close the tag with
{% raw %}`{% endBackgroundimage %}`{% endraw %} (lowercase `image`).

## Demonstrations

### Overlaid content

The block body is the overlaid content. Here a white heading sits over the image; `p='xl'`
pads it away from the edges and `mah='180'` caps the height.

{% backgroundimage src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' radius='md' p='xl' mah='180' %}
{% text fw='700' c='white' size='xl' %}Overlaid heading{% endText %}
{% endBackgroundimage %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% backgroundimage src='/cover.jpg' radius='md' p='xl' mah='180' %}
{% text fw='700' c='white' size='xl' %}Overlaid heading{% endText %}
{% endBackgroundimage %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'backgroundimage',
          src='/cover.jpg', radius='md', p='xl', mah='180',
          children=component('aardvark', 'text', fw='700', c='white', size='xl',
                             children='Overlaid heading'))
```
{% endAccordionSection %}
{% endAccordion %}

### Radius and sizing

`radius` rounds the corners (`xs`–`xl` or any CSS value); the spacing/sizing props (`w`, `h`,
`maw`, `mah`, `p`, `m`, …) set and pad the box. A fully round `radius` plus a fixed `w`/`h`
makes a circular cover.

{% backgroundimage src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' radius='100%' w='120' h='120' %}
{% endBackgroundimage %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% backgroundimage src='/cover.jpg' radius='100%' w='120' h='120' %}
{% endBackgroundimage %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'backgroundimage',
          src='/cover.jpg', radius='100%', w='120', h='120')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Overlay any built-in tag. Here a [`{% raw %}{% text %}{% endraw %}`](/components/typography/text/)
heading and a caption stack on the background:

{% backgroundimage src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' radius='md' p='xl' mah='200' %}
{% text fw='700' c='white' size='xl' %}Mountain retreat{% endText %}
{% text c='white' size='sm' %}A box with content overlaid on an image.{% endText %}
{% endBackgroundimage %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% backgroundimage src='/cover.jpg' radius='md' p='xl' mah='200' %}
{% text fw='700' c='white' size='xl' %}Mountain retreat{% endText %}
{% text c='white' size='sm' %}A box with content overlaid on an image.{% endText %}
{% endBackgroundimage %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
heading = component('aardvark', 'text', fw='700', c='white', size='xl',
                    children='Mountain retreat')
caption = component('aardvark', 'text', c='white', size='sm',
                    children='A box with content overlaid on an image.')
component('aardvark', 'backgroundimage',
          src='/cover.jpg', radius='md', p='xl', mah='200',
          children=heading + caption)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `src` | Image URL (**required**) | The background image. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl`, or any CSS value | Corner rounding. |
| `m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my` | Mantine size token (`xs`–`xl`) or any CSS value | Outer margin (all / top / bottom / left / right / horizontal / vertical). |
| `p`, `pt`, `pb`, `pl`, `pr`, `px`, `py` | Mantine size token (`xs`–`xl`) or any CSS value | Inner padding (all / top / bottom / left / right / horizontal / vertical). |
| `w`, `h` | any CSS value | Box width and height. |
| `miw`, `mih` | any CSS value | Minimum width and height. |
| `maw`, `mah` | any CSS value | Maximum width and height. |
| body | Markdown / components | The content overlaid on top of the background. |
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="BackgroundImage"]` — or through the Mantine Styles API classes (`.mantine-BackgroundImage-root` and its inner parts):

{% raw %}
```css
/* Every rendered BackgroundImage carries this island marker */
[data-aardvark-island="BackgroundImage"] { }

/* Mantine Styles API class on the root element */
.mantine-BackgroundImage-root { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% backgroundimage src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' radius='md' p='xl' mah='180' attr={'onclick': '''
const value = this.tagName;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% backgroundimage src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' radius='md' p='xl' mah='180' attr={'onclick': '''
const value = this.tagName;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'backgroundimage',
          src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
          radius='md', p='xl', mah='180', attr={'onclick': '''
const value = this.tagName;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
