---
title: "LoadingOverlay"
description: "The built-in loadingoverlay tag — a spinner veil over an area that's
  loading. Usage, options, and live examples."
---

# LoadingOverlay

A **built-in** tag for a loading veil — a dimming layer with a centered spinner over
a box of content, for an area that's fetching or processing. The tag wraps the block
body in a positioned box and lays the veil over it, so it renders right here on the
page. Toggle the veil with `visible`, tune it with the `overlay*` props, and style
the spinner with the `loader*` props.

Use it as `{% raw %}{% loadingoverlay %}{% endraw %}` in Markdown, or call it from
Python logic (loops, snippets) via `component('aardvark', 'loadingoverlay', …)`.

## Demonstrations

The covered content is the block body; the veil is on by default (`visible=true`):

{% loadingoverlay %}
This content sits under the loading veil while it's `visible`.
{% endLoadingoverlay %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% loadingoverlay %}
This content sits under the loading veil while it's `visible`.
{% endLoadingoverlay %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'loadingoverlay',
    children='This content sits under the loading veil while it is visible.',
)
```
{% endAccordionSection %}
{% endAccordion %}

### A blurred veil with a custom spinner

`overlayBlur` frosts the content behind the veil; `loaderType`, `loaderColor`, and
`loaderSize` restyle the spinner:

{% loadingoverlay overlayBlur=2 overlayBackgroundOpacity=0.55 loaderType='bars' loaderColor='grape' loaderSize='lg' %}
The veil blurs the content behind it, with a grape "bars" spinner.
{% endLoadingoverlay %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% loadingoverlay overlayBlur=2 overlayBackgroundOpacity=0.55 loaderType='bars' loaderColor='grape' loaderSize='lg' %}
The veil blurs the content behind it, with a grape "bars" spinner.
{% endLoadingoverlay %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'loadingoverlay',
    overlayBlur=2,
    overlayBackgroundOpacity=0.55,
    loaderType='bars',
    loaderColor='grape',
    loaderSize='lg',
    children='The veil blurs the content behind it, with a grape bars spinner.',
)
```
{% endAccordionSection %}
{% endAccordion %}

### Content revealed (veil hidden)

Set `visible=false` to lift the veil and show the content underneath. Combined with
the `overlayRadius` and `zIndex` props, this is how you'd drive the overlay from
loading to ready in a real app:

{% loadingoverlay visible=false overlayRadius='md' %}
The veil is hidden, so this content reads normally.
{% endLoadingoverlay %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% loadingoverlay visible=false overlayRadius='md' %}
The veil is hidden, so this content reads normally.
{% endLoadingoverlay %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'loadingoverlay',
    visible=False,
    overlayRadius='md',
    children='The veil is hidden, so this content reads normally.',
)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

The body is ordinary Markdown, so the veil can sit over richer content — here a
[card](/components/data-display/card/) being "loaded":

{% loadingoverlay overlayBlur=1 loaderType='dots' %}
{% card shadow='sm' padding='lg' radius='md' withBorder=true %}
### Account summary

Numbers refresh while the veil is up.
{% endCard %}
{% endLoadingoverlay %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% loadingoverlay overlayBlur=1 loaderType='dots' %}
{% card shadow='sm' padding='lg' radius='md' withBorder=true %}
### Account summary

Numbers refresh while the veil is up.
{% endCard %}
{% endLoadingoverlay %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
body = component('aardvark', 'card', shadow='sm', padding='lg', radius='md', withBorder=True,
                 children='### Account summary\n\nNumbers refresh while the veil is up.')
component('aardvark', 'loadingoverlay', overlayBlur=1, loaderType='dots', children=body)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Values | Description |
| --- | --- | --- |
| `visible` | bool, default `true` | Show the veil + spinner. Set `false` to reveal the covered content. |
| `overlayBackgroundOpacity` | float `0`–`1` | Veil opacity. |
| `overlayBlur` | float (px) | Backdrop blur behind the veil. |
| `overlayRadius` | `xs`–`xl` or a number | Veil corner radius. |
| `loaderType` | `oval` (default), `bars`, `dots` | Spinner style. |
| `loaderSize` | `xs`–`xl` or a number | Spinner size. |
| `loaderColor` | any theme color | Spinner color. |
| `zIndex` | integer | Stacking order of the veil. |

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="LoadingOverlay"]`, or through the Mantine Styles API classes:

{% raw %}
```css
/* Every rendered LoadingOverlay carries this island marker */
[data-aardvark-island="LoadingOverlay"] { }

/* Mantine Styles API classes */
.mantine-LoadingOverlay-root { }
.mantine-LoadingOverlay-overlay { }
.mantine-LoadingOverlay-loader { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% loadingoverlay attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
This content sits under the loading veil while it's `visible`.
{% endLoadingoverlay %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% loadingoverlay attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
This content sits under the loading veil while it's `visible`.
{% endLoadingoverlay %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'loadingoverlay',
    children='This content sits under the loading veil while it is `visible`.',
    attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''},
)
```
{% endAccordionSection %}
{% endAccordion %}
