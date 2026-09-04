Target the rendered element through its island marker —
`[data-aardvark-island="{% page.get('title', '') %}"]` (or the more specific
`[data-aardvark-lib="charts"][data-aardvark-island="{% page.get('title', '') %}"]` when several
libraries share the page) — or through the Mantine Styles API classes
(`.mantine-{% page.get('title', '') %}-root` and its inner parts):
