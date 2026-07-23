---
title: "QR code"
description: "The built-in qrcode tag — a customizable QR code from the Mantine community. Encode any value, set colors, dot and corner styles, a center logo, error correction, and live examples."
parent: community
weight: 30
---

# QR code

A built-in tag for a **customizable QR code**. Set `value` to the string you want to encode
(a URL, text, a vCard, …) and optionally style it: `color` and `background`, the `dotStyle`
and `cornerStyle`, a center `image` overlay, and the `errorCorrectionLevel`.

A **Community Component** — wraps [QrCode](https://gfazioli.github.io/mantine-qr-code/)
by **gfazioli**, **MIT** licensed, npm `@gfazioli/mantine-qr-code`.

## Demonstrations

### Basic QR code

The only required attribute is `value` — the data to encode.

{% raw %}
```aardvark
{% qrcode value='https://aardvark.example' %}
```
{% endraw %}

{% qrcode value='https://aardvark.example' %}

### Colors

`color` tints the data dots (Mantine theme colors work), and `background` sets the backdrop.

{% raw %}
```aardvark
{% qrcode value='https://aardvark.example' color='indigo' background='white' size='lg' %}
```
{% endraw %}

{% qrcode value='https://aardvark.example' color='indigo' background='white' size='lg' %}

### Dot and corner styles

`dotStyle` shapes the data modules and `cornerStyle` the finder patterns — each is `square`,
`rounded`, or `dots`.

{% raw %}
```aardvark
{% qrcode value='https://aardvark.example' dotStyle='rounded' cornerStyle='dots' color='grape' %}
```
{% endraw %}

{% qrcode value='https://aardvark.example' dotStyle='rounded' cornerStyle='dots' color='grape' %}

### Center logo and error correction

Drop an `image` in the middle. A higher `errorCorrectionLevel` (`L` → `H`) keeps the code
scannable even with a logo covering part of it.

{% raw %}
```aardvark
{% qrcode value='https://aardvark.example' image='/favicon.svg' imageRadius='8px' errorCorrectionLevel='H' size='lg' %}
```
{% endraw %}

{% qrcode value='https://aardvark.example' image='/favicon.svg' imageRadius='8px' errorCorrectionLevel='H' size='lg' %}

## With other components

Put a QR code in a [Card](/components/data-display/card/) to make a shareable "scan me" tile.

{% raw %}
```aardvark
{% card title="Scan to open the docs" %}
{% qrcode value='https://aardvark.example' color='dark' %}
{% endCard %}
```
{% endraw %}

{% card title="Scan to open the docs" %}
{% qrcode value='https://aardvark.example' color='dark' %}
{% endCard %}

## Attributes

Omit any attribute to take its default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `value` | **Required.** String | The data to encode (URL, text, …). |
| `size` | `xs` / `sm` / `md` / `lg` / `xl` | Overall size of the code. |
| `color` | A Mantine color name or CSS color | Color of the data dots. |
| `background` | A Mantine color name or CSS color | Background color. |
| `dotStyle` | `square` / `rounded` / `dots` | Shape of the data modules. |
| `cornerStyle` | `square` / `rounded` / `dots` | Shape of the corner finder patterns. |
| `image` | A URL or path | A logo/image overlaid at the center. |
| `imageRadius` | A CSS length (e.g. `8px`) | Border radius of the overlay image. |
| `errorCorrectionLevel` | `L` / `M` / `Q` / `H` | Error tolerance (7%–30%); higher survives more occlusion. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

## CSS Selector

The component renders inside an island wrapper carrying `data-aardvark-island="QrCode"`, with
the vendor's own class names on the SVG inside. Target the wrapper to size or center it:

```css
[data-aardvark-island="QrCode"] {
  display: inline-block;
  margin-inline: auto;
}
```

## Injecting Attributes

Use `attr={…}` to forward raw HTML attributes (ids, `data-*`, ARIA) straight onto the rendered
root — handy for testing hooks or scripting.

{% qrcode value='https://aardvark.example' attr={'data-testid': 'docs-qr', 'aria-label': 'QR code linking to the docs'} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% qrcode value='https://aardvark.example' attr={'data-testid': 'docs-qr', 'aria-label': 'QR code linking to the docs'} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'qrcode', value='https://aardvark.example', attr={'data-testid': 'docs-qr', 'aria-label': 'QR code linking to the docs'})
```
{% endAccordionSection %}
{% endAccordion %}
