---
title: The vark theme's component library is open source
date: 2026-11-08
taxonomy:
  - name: changes
    tags: [components, docs]
nav: false
noindex: true
---

# The vark theme's component library is open source

Each tag in the default `vark` theme's component library, such as
{% raw %}`{% button %}` or `{% tabs %}`{% endraw %}, is a Markdown definition in the theme. Those
definitions, and the React components written for them, are published under the MIT
License in
[`themes/vark/`](https://github.com/aardvarkdocs/sample-site/tree/main/themes/vark) of the public
sample-site repository; the Mantine and community packages they render keep their own licenses.
Read any definition there to see how a component is made, or start your own
[custom component](/authoring/custom-components/) from one.

The `vark` theme's library is built on [Mantine](https://mantine.dev), which is free and
MIT-licensed too. The library belongs to the theme rather than to aardvark, so another theme can
ship a completely different one, built on another React component library. A few tags, such as
{% raw %}`{% include %}` and `{% visibility %}`{% endraw %}, belong to aardvark itself rather than
to any theme — see [The theme's component library](/theming/#the-themes-component-library).

To suggest a fix or a new component, open an issue in the sample-site repository;
[Contributing components](https://github.com/aardvarkdocs/sample-site/blob/main/CONTRIBUTING.md#contributing-components)
explains where things go and what a change needs.

The aardvark CLI and build engine are distributed as prebuilt binaries and aren't part of the
open-source release.
