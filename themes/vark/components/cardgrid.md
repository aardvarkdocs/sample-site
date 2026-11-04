---
name: cardGrid
description: A responsive grid for cards — wrap a set of card or articleCard tags to lay them out
  in columns. `cols` is the column count on a wide screen, stepping down on narrower ones;
  `colsBase`, `colsSm`, `colsMd`, `colsLg` and `colsXl` pin the count at one breakpoint (alone,
  they are the whole grid); `spacing` and `verticalSpacing` set the gaps. Close with
  {% endCardGrid %}.
close: required
childScope: true
passthrough: true
body: python
---
```python
# Renders the CardGrid island (CardGrid.jsx), a Mantine SimpleGrid. Cards render themselves, so
# the grid needs no per-cell wrapper: it just wraps the card islands.
import aardvark.components as av


def _coerce_cols(value):
    """A column count: coerced to int when it's a digit string (Mantine wants a number), else
    passed through verbatim."""
    cols = av.as_int(value)
    return cols if cols is not None else value


def _card_grid_cols(attrs):
    """The island's column props — {}, {cols}, or {cols, colsOverrides}.

    This only reports what the author wrote; the responsive ladder is defined once, in the
    island's _colsLadder.js, and no rung of it is re-derived here. So a bare `cols` rides as the
    plain count for the island to expand, per-breakpoint parts (colsBase/colsSm/…) travel beside
    it as `colsOverrides` for the island to lay over that ladder, and parts WITHOUT a count are the
    grid itself (colsBase=4 alone stays a fixed 4 at every width). Nothing set returns {}, leaving
    the island on its own default."""
    parts = {}
    for attr_key, mantine_key in (
        ("colsBase", "base"), ("colsSm", "sm"), ("colsMd", "md"),
        ("colsLg", "lg"), ("colsXl", "xl"),
    ):
        value = attrs.get(attr_key)
        if value is not None:
            parts[mantine_key] = _coerce_cols(value)
    bare = attrs.get("cols")
    if bare is None:
        return {"cols": parts} if parts else {}
    if parts:
        return {"cols": _coerce_cols(bare), "colsOverrides": parts}
    return {"cols": _coerce_cols(bare)}


# `colsOverrides` is dropped with the rest: it is the channel _card_grid_cols fills, not an author
# attribute, and letting one through would collide with the island's own prop.
props = av.safe_attrs(
    attrs, "cols", "colsBase", "colsSm", "colsMd", "colsLg", "colsXl", "colsOverrides"
)
props.update(_card_grid_cols(attrs))
# The body passes through unsqueezed. Each card emits <div…>, blank line, body, blank line, </div>:
# those blank lines end the Markdown pass's HTML block so the card's body renders as Markdown, and
# squeezing them here would leave it literal. Blank lines BETWEEN cards are harmless: two HTML
# blocks in a row produce no empty paragraph, so no stray grid cell appears.
print(component("CardGrid", children=children.strip(), attr=attr, **props))
```
