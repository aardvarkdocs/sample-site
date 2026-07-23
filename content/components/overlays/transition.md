---
title: "Transition"
description: "The built-in transition tag — an animation primitive that fades, slides, or scales content in and out as it mounts. How it works on a static page, options, and a live example."
---

# Transition

`transition` is an **animation primitive**: it fades, slides, or scales its content in and out
— keyed off a `mounted` flag. The animation runs when `mounted` *changes*, so it needs
something to flip it. Like the [modal](/components/overlays/modal/) and
[drawer](/components/overlays/drawer/), this tag ships with a **trigger button** that toggles
`mounted` for you, so the enter/leave animation plays on click — no custom React required.
`mounted` sets the *initial* state (default shown), `triggerLabel` sets the button's text, and
the full set of Mantine presets is reachable from Markdown. Close the block with
`{% raw %}{% endTransition %}{% endraw %}`.

Use it as `{% raw %}{% transition %}…{% endTransition %}{% endraw %}` in Markdown, or call it
from Python logic (loops, snippets) via `component('aardvark', 'transition', …)`.

## Demonstrations

The block body is the animated content; pick a `transition` preset and a `duration`, then click
the button to play it. `mounted=true` (the default) starts the content shown — click *Toggle* to
slide it out, and again to slide it back in.

**Preview** — click *Toggle* to play it:

{% transition transition='slide-up' duration=300 mounted=true %}
{% paper withBorder=true p='md' radius='md' %}This block is wrapped in a Transition with the `slide-up` preset. Click the button above to slide it out of view and back in.{% endPaper %}
{% endTransition %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% transition transition='slide-up' duration=300 mounted=true %}
Starts shown; click the trigger button to slide it out of view and back in.
{% endTransition %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'transition',
          transition='slide-up', duration=300, mounted=True,
          children='Starts shown; click the trigger button to animate it.')
```
{% endAccordionSection %}
{% endAccordion %}

### Presets

Any of Mantine's named presets work: `fade`, the `slide-*` family, `scale` / `scale-x` /
`scale-y`, the `skew-*` and `rotate-*` families, and `pop`. Here the same block with `scale`, a
longer `duration`, an explicit `timingFunction`, and a custom `triggerLabel` on the button.

**Preview** — click *Scale it* to play it:

{% transition transition='scale' duration=400 timingFunction='ease-in-out' triggerLabel='Scale it' %}
{% paper withBorder=true p='md' radius='md' %}The `scale` preset, played by the button above.{% endPaper %}
{% endTransition %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% transition transition='scale' duration=400 timingFunction='ease-in-out' %}
…content…
{% endTransition %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'transition',
          transition='scale', duration=400, timingFunction='ease-in-out',
          children='…content…')
```
{% endAccordionSection %}
{% endAccordion %}

### Starting hidden

`mounted=false` starts the content hidden — the trigger button reveals it (and hides it again).
Add `keepMounted=true` to keep the node in the DOM even while hidden, so its content stays
present for SSR and crawlers.

**Preview** — starts hidden; click *Reveal* to fade it in:

{% transition transition='fade' duration=300 mounted=false keepMounted=true triggerLabel='Reveal' %}
{% paper withBorder=true p='md' radius='md' %}Hidden until you click the button; kept in the DOM (so it's present for SSR and crawlers).{% endPaper %}
{% endTransition %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% transition transition='fade' mounted=false keepMounted=true triggerLabel='Reveal' %}
Hidden until you click the button; kept in the DOM for SSR and crawlers.
{% endTransition %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'transition',
          transition='fade', mounted=False, keepMounted=True, triggerLabel='Reveal',
          children='Hidden until you click the button; kept in the DOM for SSR and crawlers.')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Transition is most natural wrapping a surface like [Paper](/components/layout/paper/) so the whole
panel animates as a unit. The Preview at the top of this page already shows that pairing; here it
is with a `pop` preset.

**Preview** — click *Toggle* to play it:

{% transition transition='pop' duration=350 %}
{% paper withBorder=true p='md' radius='md' bg='var(--mantine-color-gray-light)' %}A Paper wrapped in a Transition with the `pop` preset.{% endPaper %}
{% endTransition %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% transition transition='pop' duration=350 %}
{% paper withBorder=true p='md' radius='md' %}A Paper wrapped in a Transition.{% endPaper %}
{% endTransition %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
panel = component('aardvark', 'paper', withBorder=True, p='md', radius='md',
                  children='A Paper wrapped in a Transition.')
component('aardvark', 'transition', transition='pop', duration=350, children=panel)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default. Bare flags (e.g. `keepMounted`) become `=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `transition` | `fade` (default) / `slide-up` / `slide-down` / `slide-left` / `slide-right` / `scale` / `scale-x` / `scale-y` / `skew-up` / `skew-down` / `rotate-left` / `rotate-right` / `pop` (and other Mantine presets) | The animation preset. |
| `duration` | An integer (ms, default `250`) | Animation length. |
| `mounted` | `true` (default) / `false` | The *initial* shown state; the trigger button toggles it. `mounted=false` starts hidden. |
| `triggerLabel` | Any string (default `Toggle`) | Text for the button that toggles the content. |
| `timingFunction` | A CSS easing value (e.g. `ease`, `ease-in-out`) | CSS easing for the animation. |
| `keepMounted` | `true` / `false` (default `false`) | Keep the node in the DOM even when hidden (so its content stays present for SSR / crawlers). |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="Transition"]`. The animated content is positioned with inline styles, so it carries no Mantine part class — target the island mount or the content you place inside.

{% raw %}
```css
/* Every rendered Transition carries this island marker */
[data-aardvark-island="Transition"] { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% transition transition='slide-up' duration=300 mounted=true attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Starts shown; click the trigger button to slide it out of view and back in.
{% endTransition %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% transition transition='slide-up' duration=300 mounted=true attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Starts shown; click the trigger button to slide it out of view and back in.
{% endTransition %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'transition',
          transition='slide-up', duration=300, mounted=True,
          children='Starts shown; click the trigger button to slide it out of view and back in.',
          attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
