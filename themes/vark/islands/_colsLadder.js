// The responsive-column ladder shared by the grid builtins — CardGrid ({% cardGrid %}) and
// ArticleList ({% taxonomy type="articles" %}). One `_`-prefixed sibling (so it is not
// author-addressable) holds it, because `cols=N` means the same thing wherever it is written and
// a second copy of these rungs is how one grid silently stops agreeing with its neighbour.
//
// A plain number is a DESKTOP count, not a fixed one: N columns at every width shrinks N cards
// into a phone's viewport (four plan cards on a 375px screen were ~80px each). Python emits the
// author's count untouched and lets this expand it.

export function colsLadder(cols) {
  if (typeof cols !== 'number' || !Number.isFinite(cols) || cols < 2) return cols;
  const count = Math.floor(cols);
  // `lg` keeps the desktop count exactly; only narrower widths step down.
  return count > 2 ? { base: 1, sm: 2, lg: count } : { base: 1, sm: 2 };
}

// The ladder's own N=3 rung, so the no-columns default and an explicit cols=3 cannot drift apart.
export const DEFAULT_COLS = colsLadder(3);

// Per-breakpoint pins that accompany a count are laid OVER the ladder, never replacing it, so
// pinning one rung keeps the others. Pins WITHOUT a count are a fixed grid: the {% cardGrid %}
// block sends those as `cols` itself and they pass straight through.
export function resolveCols(cols, overrides) {
  const ladder = cols == null ? DEFAULT_COLS : colsLadder(cols);
  // Only an object is a set of rungs. The {% cardGrid %} block never sends anything else, but
  // the low-level component('CardGrid', …) form forwards its kwargs raw, and spreading a string
  // here would splay it into character-indexed keys and hand SimpleGrid a malformed grid.
  if (!overrides || typeof overrides !== 'object' || Array.isArray(overrides)) return ladder;
  const rungs = typeof ladder === 'object' ? { ...ladder } : { base: ladder };
  // Under three columns the ladder omits `lg` as redundant, but a narrower pin then carries up to
  // desktop (Mantine reads the largest matching rung) — `cols=2 colsMd=3` would put 3 there, not
  // the author's 2. Make it explicit before overlaying; an explicit `colsLg` still wins below.
  if (typeof cols === 'number' && Number.isFinite(cols) && cols >= 1 && rungs.lg == null) {
    rungs.lg = Math.floor(cols);
  }
  return { ...rungs, ...overrides };
}
