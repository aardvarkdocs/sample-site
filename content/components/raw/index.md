---
menu: components
title: Raw Components
---

# Raw Components

Every [Mantine](https://mantine.dev) component is available directly from Markdown — no wrapper, no custom API — through the `component()` function:

{% raw %}
```aardvark
{% component('Button', children='Get started', color='blue') %}
```
{% endraw %}

renders, live:

{% component('Button', children='Get started', color='blue') %}

`component('Name', **props)` records a mount point at build time and renders the real Mantine component as a browser island; the props you pass are the component's own Mantine props. A few representative examples follow — for the **full catalog and every prop**, see the [Mantine documentation](https://mantine.dev/). Anything documented there is callable here; the complete list of names registered on this site is at the end of this page.

## A few examples

{%
# The closing delimiter is assembled by concatenation so it never appears
# literally in this block (a literal would terminate the block early).
# demo() wraps each snippet so the card shows the full tag you'd write.
_OPEN = "{" + "%"
_CLOSE = "%" + "}"
def demo(name, code, live):
    tagged = _OPEN + " " + code + " " + _CLOSE
    page.print("### " + name + "\n\n")
    page.print("```aardvark\n" + tagged + "\n```\n\n")
    page.print(live + "\n\n")

demo('Badge',
     "component('Badge', color='primary', children='New')",
     component('Badge', color='primary', children='New'))
demo('Card',
     "component('Card', withBorder=True, padding='lg', radius='md', children=component('Text', fw=600, children='Card title') + component('Text', c='dimmed', size='sm', children='With a description.'))",
     component('Card', withBorder=True, padding='lg', radius='md', children=component('Text', fw=600, children='Card title') + component('Text', c='dimmed', size='sm', children='With a description.')))
demo('TextInput',
     "component('TextInput', label='Name', placeholder='Ada')",
     component('TextInput', label='Name', placeholder='Ada'))
demo('Select',
     "component('Select', label='Framework', data=['React', 'Vue', 'Svelte'], defaultValue='React')",
     component('Select', label='Framework', data=['React', 'Vue', 'Svelte'], defaultValue='React'))
demo('Switch',
     "component('Switch', label='Wi-Fi', defaultChecked=True)",
     component('Switch', label='Wi-Fi', defaultChecked=True))
demo('Tabs',
     "component('Tabs', defaultValue='one', children=component('TabsList', children=component('TabsTab', value='one', children='One') + component('TabsTab', value='two', children='Two')) + component('TabsPanel', value='one', pt='sm', children='Panel one') + component('TabsPanel', value='two', pt='sm', children='Panel two'))",
     component('Tabs', defaultValue='one', children=component('TabsList', children=component('TabsTab', value='one', children='One') + component('TabsTab', value='two', children='Two')) + component('TabsPanel', value='one', pt='sm', children='Panel one') + component('TabsPanel', value='two', pt='sm', children='Panel two')))
demo('Alert',
     "component('Alert', color='primary', title='Heads up', children='Something happened.')",
     component('Alert', color='primary', title='Heads up', children='Something happened.'))
demo('Tooltip',
     "component('Tooltip', label='Tooltip text', opened=True, withinPortal=False, children=component('Button', children='Target'))",
     component('Tooltip', label='Tooltip text', opened=True, withinPortal=False, children=component('Button', children='Target')))
demo('Kbd',
     "component('Kbd', children='Ctrl')",
     component('Kbd', children='Ctrl'))
%}

Each example above is a direct passthrough to the Mantine component of the same name. The same call shape — {% raw %}`{% component('Name', **props) %}`{% endraw %} — works for any other component in [Mantine's docs](https://mantine.dev/); the props are theirs, not ours.

## Building blocks for your own components

These raw components are also your building blocks: import any of them inside your own [custom components](/authoring/custom-components/) (snippets in `snippets/`) and compose them — freely mixed with plain HTML — into higher-level components with exactly the API you want. Then call those the same way, {% raw %}`{% component('YourComponent', …) %}`{% endraw %}.

## All available components

This list is generated at build time from the actual component registry, so it always reflects exactly what's callable via {% raw %}`{% component('Name') %}`{% endraw %} on this site.

{%
total = len(components)
page.print('There are **' + str(total) + '** registered components — all of `@mantine/core`, plus this project\'s `snippets/` and the built-in `ApiReference`.\n\n')

utility = {
    'DEFAULT_THEME','DirectionContext','DirectionProvider','MantineContext',
    'MantineProvider','MantineThemeContext','MantineThemeProvider',
    'HeadlessMantineProvider','ColorSchemeScript','InlineStyles',
    'MANTINE_TRANSITIONS','FLEX_STYLE_PROPS_DATA','FOCUS_CLASS_NAMES',
    'STYlE_PROPS_DATA','Portal','OptionalPortal','RemoveScroll','FocusTrap',
    'FocusTrapInitialFocus','VisuallyHidden','NativeScrollArea','OptionsDropdown',
    'FloatingArrow','FloatingIndicator','Transition','CheckIcon','CloseIcon',
    'RadioIcon','AccordionChevron','ComboboxChevron',
}
interactive = {
    'Combobox','CopyButton','FileButton','FileInput','ColorPicker','Collapse',
    'Tree','TableOfContents','PillsInputField','ChipGroup','SwitchGroup',
    'CheckboxGroup','RadioCard','CheckboxCard','AngleSlider','AlphaSlider',
    'HueSlider',
}
parents = ('Accordion','ActionIcon','AppShell','Avatar','ButtonGroup','Card',
    'Checkbox','Chip','Combobox','Drawer','Grid','HoverCard','InputWrapper','InputBase',
    'Input','List','Menu','ModalBase','Modal','Pagination','PillsInput','Pill',
    'Popover','Progress','Radio','Stepper','Switch','Table','Tabs','Timeline','Tooltip')

def kind(n):
    if n in utility:
        return 'provider / utility'
    if n in interactive:
        return 'interactive (use in a snippet)'
    for p in parents:
        if n != p and n.startswith(p):
            return 'part of `' + p + '`'
    return 'component'

page.print('| Component | Notes |\n| --- | --- |\n')
for n in components:
    page.print('| `' + n + '` | ' + kind(n) + ' |\n')
%}
