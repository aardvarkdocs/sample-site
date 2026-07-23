---
title: "Table"
description: "The built-in table tag — a Mantine Table with striping, borders, hover,
  captions, and a sticky header. Usage, options, and live examples."
---

# Table

`{% raw %}{% table %}{% endraw %}` is a **built-in** tag for data tables — the Mantine
Table element. A plain Markdown table still works; reach for this tag when you want
striping, borders, row hover, a caption, or a sticky header. Give the header cells in
`head` (pipe-separated) and the body in `rows` (rows separated by `;` or newlines, cells
by `|`, or a JSON array of arrays); each cell renders inline Markdown.

Use it as `{% raw %}{% table %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'table', …)`.

## Demonstrations

A basic table needs only `head` and `rows`:

{% table head='Name | Role | Status' rows='Ada | Engineer | Active ; Grace | Admiral | Active' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% table head='Name | Role | Status' rows='Ada | Engineer | Active ; Grace | Admiral | Active' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'table',
          head='Name | Role | Status',
          rows='Ada | Engineer | Active ; Grace | Admiral | Active')
```
{% endAccordionSection %}
{% endAccordion %}

### Striping and hover

`striped` shades alternate rows (pass `odd` or `even` to choose which) and
`highlightOnHover` lights up the row under the cursor:

{% table striped=true highlightOnHover=true head='Package | Version' rows='aardvark | 0.1.10 ; mantine | 9.x ; react | 19' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% table striped=true highlightOnHover=true head='Package | Version' rows='aardvark | 0.1.10 ; mantine | 9.x ; react | 19' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'table',
          striped=True, highlightOnHover=True,
          head='Package | Version',
          rows='aardvark | 0.1.10 ; mantine | 9.x ; react | 19')
```
{% endAccordionSection %}
{% endAccordion %}

### Borders

Toggle the outer border (`withTableBorder`), column dividers (`withColumnBorders`), and row
dividers (`withRowBorders`, on by default — set `false` to remove them):

{% table withTableBorder=true withColumnBorders=true head='Method | Path' rows='GET | /pets ; POST | /pets ; DELETE | /pets/{id}' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% table withTableBorder=true withColumnBorders=true head='Method | Path' rows='GET | /pets ; POST | /pets ; DELETE | /pets/{id}' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'table',
          withTableBorder=True, withColumnBorders=True,
          head='Method | Path',
          rows='GET | /pets ; POST | /pets ; DELETE | /pets/{id}')
```
{% endAccordionSection %}
{% endAccordion %}

### Caption and inline Markdown

Add a `caption` (set `captionSide` to `top` or `bottom`, the default). Cells render inline
Markdown, so `` `code` `` and `**bold**` format:

{% table caption='Build stats' captionSide='bottom' withTableBorder=true head='Stage | Time' rows='`render` | **2.4s** ; `bundle` | 0.3s' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% table caption='Build stats' captionSide='bottom' withTableBorder=true head='Stage | Time' rows='`render` | **2.4s** ; `bundle` | 0.3s' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'table',
          caption='Build stats', captionSide='bottom', withTableBorder=True,
          head='Stage | Time',
          rows='`render` | **2.4s** ; `bundle` | 0.3s')
```
{% endAccordionSection %}
{% endAccordion %}

### Spacing, width, and JSON rows

`horizontalSpacing` / `verticalSpacing` size the cell padding with Mantine tokens, and
`minWidth` sets the width below which the table scrolls horizontally. Pass `rows` as a JSON
array of arrays when a cell contains a literal `|` or `;`:

{% table horizontalSpacing='xl' verticalSpacing='md' minWidth='30rem' head='Key | Default' rows='[["timeout", "`30 ; per call`"], ["retries", "3"]]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% table horizontalSpacing='xl' verticalSpacing='md' minWidth='30rem' head='Key | Default' rows='[["timeout", "`30 ; per call`"], ["retries", "3"]]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'table',
          horizontalSpacing='xl', verticalSpacing='md', minWidth='30rem',
          head='Key | Default',
          rows='[["timeout", "`30 ; per call`"], ["retries", "3"]]')
```
{% endAccordionSection %}
{% endAccordion %}

### Sticky header

`stickyHeader` pins the header while the body scrolls; `maxHeight` caps the scroll window
(px, default 320) and `stickyHeaderOffset` pushes the pinned header down past a fixed navbar:

{% table stickyHeader=true maxHeight=140 striped=true head='Build | Result' rows='1.0.0 | pass ; 1.0.1 | pass ; 1.0.2 | fail ; 1.0.3 | pass ; 1.0.4 | pass ; 1.0.5 | pass' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% table stickyHeader=true maxHeight=140 striped=true head='Build | Result' rows='1.0.0 | pass ; 1.0.1 | pass ; 1.0.2 | fail ; 1.0.3 | pass ; 1.0.4 | pass ; 1.0.5 | pass' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'table',
          stickyHeader=True, maxHeight=140, striped=True,
          head='Build | Result',
          rows='1.0.0 | pass ; 1.0.1 | pass ; 1.0.2 | fail ; 1.0.3 | pass ; 1.0.4 | pass ; 1.0.5 | pass')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Build a table from a loop in Python, or pass [Text](/components/typography/text/) and
[Title](/components/typography/title/) inside a containing layout. Here the rows come from a
Python list, joined into the `;`/`|` shorthand:

{% title order=4 mb='sm' %}Release matrix{% endTitle %}
{% table withTableBorder=true striped=true head='Version | Channel' rows='0.1.8 | stable ; 0.1.9 | stable ; 0.1.10 | latest' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% title order=4 mb='sm' %}Release matrix{% endTitle %}
{% table withTableBorder=true striped=true head='Version | Channel' rows='0.1.8 | stable ; 0.1.9 | stable ; 0.1.10 | latest' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
releases = [('0.1.8', 'stable'), ('0.1.9', 'stable'), ('0.1.10', 'latest')]
rows = ' ; '.join(f'{v} | {c}' for v, c in releases)

component('aardvark', 'title', children='Release matrix', order=4, mb='sm')
component('aardvark', 'table',
          withTableBorder=True, striped=True,
          head='Version | Channel', rows=rows)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `head` | String, pipe-separated (`A \| B \| C`) | Header cells; each renders inline Markdown. Empty omits the `<thead>`. |
| `rows` | String, or JSON array of arrays | Body rows — rows split on `;` or newlines, cells on `\|`; or `[["a","b"],…]`. Each cell renders inline Markdown. |
| `caption` | String | A caption rendered above or below the table. |
| `captionSide` | `top`, `bottom` | Which side the caption sits on. Default `bottom`. |
| `striped` | `true`, `false`, `odd`, `even` | Shade alternate rows. A bare `striped` flag or `true` stripes odd rows; `odd` / `even` choose which. Default `false`. |
| `highlightOnHover` | `true`, `false` | Highlight the row under the cursor. Default `false`. |
| `withTableBorder` | `true`, `false` | Outer border around the whole table. Default `false`. |
| `withColumnBorders` | `true`, `false` | Vertical dividers between columns. Default `false`. |
| `withRowBorders` | `true`, `false` | Horizontal dividers between rows. Default `true`; set `false` to remove them. |
| `stickyHeader` | `true`, `false` | Pin the header while the table body scrolls. Default `false`. |
| `stickyHeaderOffset` | Integer (px) | Offset for the sticky header, e.g. to clear a fixed navbar. |
| `maxHeight` | Integer (px) | Cap the sticky-header scroll window height. Default 320. |
| `horizontalSpacing` | Mantine size token (`xs`–`xl`) or CSS value | Horizontal cell padding. |
| `verticalSpacing` | Mantine size token (`xs`–`xl`) or CSS value | Vertical cell padding. |
| `minWidth` | CSS width (`30rem`, `600px`) | Minimum width before the table scrolls horizontally. |

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="Table"]`, or through the Mantine Styles API classes. (Table uses element-named parts rather than a `-root`.) The relevant classes:

{% raw %}
```css
/* Every rendered Table carries this island marker */
[data-aardvark-island="Table"] { }

/* Mantine Styles API classes */
.mantine-Table-table { }
.mantine-Table-thead { }
.mantine-Table-tbody { }
.mantine-Table-tr { }
.mantine-Table-th { }
.mantine-Table-td { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% table head='Name | Role | Status' rows='Ada | Engineer | Active ; Grace | Admiral | Active' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% table head='Name | Role | Status' rows='Ada | Engineer | Active ; Grace | Admiral | Active' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'table',
          head='Name | Role | Status',
          rows='Ada | Engineer | Active ; Grace | Admiral | Active',
          attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
