---
menu: components
title: Inputs
icon: forms
weight: 20
description: "Built-in input tags — text / number / password / file / date fields and their wrappers, plus the controls (checkboxes, switches, sliders, radios, ratings, color pickers) — each a single Markdown tag, with the supported options listed on its own page."
---

# Inputs

Everything for collecting input, nearly all of it a single **built-in** tag — no setup, no
JavaScript to write. (Two entries are project snippets this site ships rather than built-in tags:
the rich-text editor and the form example. Their pages say what to copy.) The text-entry **fields** carry the options you reach for on a form — label, description,
error, size, radius, variant, required, disabled, plus each field's own — and the **controls**
mount as interactive islands you can toggle, drag, and pick right on the page. Each tag accepts
the attributes its own page lists and nothing else; an unrecognised one stops the build rather
than being ignored, so that table is the list to work from.

## Fields

- [TextInput](/components/inputs/textinput/) — a single-line text field.
- [Textarea](/components/inputs/textarea/) — a multi-line text field with autosize.
- [NumberInput](/components/inputs/numberinput/) — numeric entry with min/max/step, prefix/suffix, and controls.
- [PasswordInput](/components/inputs/passwordinput/) — a password field with a show/hide toggle.
- [JsonInput](/components/inputs/jsoninput/) — a textarea that validates and reformats JSON.
- [MaskInput](/components/inputs/maskinput/) — formatted entry against a fixed pattern (phone, date, card).
- [FileInput](/components/inputs/fileinput/) — a file picker with accept, multiple, and clearable.
- [Dropzone](/components/inputs/dropzone/) — a drag-and-drop file upload zone with a built-in drag-state overlay.
- [PinInput](/components/inputs/pininput/) — a row of single-character boxes for codes / PINs.
- [NativeSelect](/components/inputs/nativeselect/) — a native `<select>` from a delimited option list.
- [Fieldset](/components/inputs/fieldset/) — a bordered group of fields with a legend.
- [Input](/components/inputs/input/) — the bare input control, with no label or message wrapper.
- [Form](/components/inputs/form/) — the `useForm` hook tying fields together: validation, submit, and collected values.

## Dates and times

- [DateInput](/components/inputs/dateinput/) — a free-typing date field parsed against a display format.
- [DatePickerInput](/components/inputs/datepickerinput/) — a date field that opens a calendar to pick a day, a range, or several days.
- [DateTimePicker](/components/inputs/datetimepicker/) — a combined date-and-time field with a calendar plus a time picker.
- [TimeInput](/components/inputs/timeinput/) — a time field built on the browser's native time control.

## Toggles and choices

- [Checkbox](/components/inputs/checkbox/) — a single labeled checkbox.
- [Radio](/components/inputs/radio/) — a labeled radio button; share a `name` for a group.
- [Switch](/components/inputs/switch/) — a toggle switch with optional on/off track text.
- [Chip](/components/inputs/chip/) — a checkbox or radio styled as a pill.
- [SegmentedControl](/components/inputs/segmentedcontrol/) — a row of mutually exclusive options.
- [Rating](/components/inputs/rating/) — a star rating for feedback or scores.

## Rich text

- [RichTextEditor](/components/inputs/richtexteditor/) — a live in-page editor with a formatting toolbar (bold, italic, underline, lists, links), backed by Tiptap.

## Sliders

- [Slider](/components/inputs/slider/) — pick a number in a range, with marks.
- [RangeSlider](/components/inputs/rangeslider/) — pick a range with two thumbs.
- [AngleSlider](/components/inputs/angleslider/) — pick an angle on a dial (0–360°).
- [HueSlider](/components/inputs/hueslider/) — pick a hue along the spectrum.
- [AlphaSlider](/components/inputs/alphaslider/) — pick an alpha (opacity) for a color.

## Color pickers

- [ColorInput](/components/inputs/colorinput/) — a text input with a swatch and dropdown picker.
- [ColorPicker](/components/inputs/colorpicker/) — an inline saturation + hue (+ alpha) picker.

## Focus

- [FocusTrap](/components/inputs/focustrap/) — keep keyboard focus inside a region (the focus behavior behind modals).
