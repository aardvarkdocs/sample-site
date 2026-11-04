---
markdownHook: alert
description: A GitHub alert (a blockquote opening with `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`,
  `[!WARNING]` or `[!CAUTION]`), as a Callout titled with its kind. `kind` is the marker, in
  capitals.
params:
  kind: string
islands: [Callout]
body: python
---
```python
# Each kind as a Callout severity and title. Callout.jsx owns each severity's color and icon. The
# names look swapped because Callout's are color-semantic: GitHub's WARNING is amber, which is
# Callout's `caution` (yellow), and its CAUTION is red, which is `warning`. NOTE and IMPORTANT share
# the `info` color but keep distinct titles, the labels GitHub shows.
ALERTS = {
    "NOTE": ("info", "Note"),
    "TIP": ("success", "Tip"),
    "IMPORTANT": ("info", "Important"),
    "WARNING": ("caution", "Warning"),
    "CAUTION": ("warning", "Caution"),
}
severity, title = ALERTS[kind]
print(open_island("Callout", severity=severity, title=title) + children + "</div>")
```
