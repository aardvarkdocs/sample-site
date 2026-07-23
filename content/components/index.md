---
menu: components
nav: false
title: Built-in Components
---

# Built-in Components

Aardvark ships a built-in `{% raw %}{% tag %}{% endraw %}` for **every Mantine core
component** — no setup, no JavaScript to write. They're grouped by category in the left nav,
mirroring Mantine's own groupings, so you can browse by what a component _does_. On top of the
Mantine set, aardvark adds a handful of **native** components built just for documentation sites,
plus a growing **Community Components** catalog: eligible third-party Mantine extensions are
wrapped as built-in tags, while notable policy exclusions are documented explicitly.

Pick a category to see every tag in it, with live examples and source:

{% cardGrid colsBase=1 colsSm=2 colsLg=3 %}

{% card variant="gradient" gradient="grape,violet,135" icon="sparkles" watermark=true title="Aardvark Extras" href="/components/extras/" cta="Browse" %}
Native components with no Mantine equivalent — banners, gitfolders, includes, maps, and changelogs.
{% endCard %}

{% card variant="gradient" gradient="indigo,blue,135" icon="layout-grid" watermark=true title="Layout" href="/components/layout/" cta="Browse" %}
Structure a page — containers, stacks, grids, spacing, surfaces, and scroll areas.
{% endCard %}

{% card variant="gradient" gradient="blue,cyan,135" icon="forms" watermark=true title="Inputs" href="/components/inputs/" cta="Browse" %}
Text fields and controls — inputs, selects, checkboxes, switches, sliders, and color pickers.
{% endCard %}

{% card variant="gradient" gradient="blue,teal,135" icon="select" watermark=true title="Combobox" href="/components/combobox/" cta="Browse" %}
Select, autocomplete, multi-select, and tag inputs built on Mantine's Combobox.
{% endCard %}

{% card variant="gradient" gradient="violet,grape,135" icon="click" watermark=true title="Buttons" href="/components/buttons/" cta="Browse" %}
Buttons and button-like controls for actions and links.
{% endCard %}

{% card variant="gradient" gradient="indigo,grape,135" icon="menu-2" watermark=true title="Navigation" href="/components/navigation/" cta="Browse" %}
Move through content — tabs, steps, breadcrumbs, pagination, and tree views.
{% endCard %}

{% card variant="gradient" gradient="red,orange,135" icon="bell" watermark=true title="Feedback" href="/components/feedback/" cta="Browse" %}
Tell the reader what happened — callouts, progress, loaders, and notifications.
{% endCard %}

{% card variant="gradient" gradient="blue,indigo,135" icon="app-window" watermark=true title="Overlays" href="/components/overlays/" cta="Browse" %}
Modals, drawers, dialogs, tooltips, popovers, and menus layered over the page.
{% endCard %}

{% card variant="gradient" gradient="teal,green,135" icon="table" watermark=true title="Data Display" href="/components/data-display/" cta="Browse" %}
Show content — cards, badges, images, tables, accordions, and timelines.
{% endCard %}

{% card variant="gradient" gradient="violet,pink,135" icon="typography" watermark=true title="Typography" href="/components/typography/" cta="Browse" %}
Style text — titles, code, highlights, lists, dividers, and tables.
{% endCard %}

{% card variant="gradient" gradient="cyan,grape,135" icon="users" watermark=true title="Community Components" href="/components/community/" cta="Browse" %}
Third-party Mantine extensions — bundled tags that pass the license and compatibility gates, plus documented exclusions.
{% endCard %}

{% endCardGrid %}

## Build your own

When the built-ins don't cover it, define your **own** component in your project — that's a [custom component](/authoring/custom-components/), and it's where the real flexibility is. Drop a React component in `snippets/` and call it from Markdown exactly like a built-in:

{% component('ProductCard', product='aardvark', tagline='Markdown in, static site out.', badge='v1.0', href='/docs/#quickstart') %}

`snippets/ProductCard.jsx` freely blends **plain HTML** (`<div>`, `<h3>`, `<p>`) with Mantine components (`Card`, `Group`, `Badge`, `Button`) — inside a snippet it's just React, so any blend of HTML and Mantine you choose works. See [Components & snippets](/authoring/components-and-snippets/) for the full authoring guide.

Need a whole **third-party React library** — Stripe Elements, a charting kit, an icon set? A theme can pull one in and address it through the same tag with a library-name first argument: `{% raw %}{% component('stripe', 'PaymentElement') %}{% endraw %}`. See [Component libraries](/components/extras/component-libraries/).
