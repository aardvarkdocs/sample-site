---
title: "Form"
description: "The ContactForm snippet — a live form built on the useForm hook: controlled inputs via getInputProps, per-field validation, and an onSubmit handler that surfaces the collected values."
---

# Form

`useForm` is the hook for managing form state: it holds the field values, tracks which fields
have been touched or changed, runs validation, and produces the props each input needs. You
connect a field to the form by spreading `getInputProps('name')` onto an input — that wires up
its value, `onChange`, `onBlur`, current error, and the key the hook uses to address the field.

Submitting goes through `onSubmit(handler)`: it runs every validation rule first, shows the
error messages on any field that fails, and only calls your handler — with the collected values
— once the whole form is valid. That gives you controlled inputs, inline validation, and a
clean submit path without hand-wiring `useState` for every field.

Because `useForm` is a hook with no component of its own, this page ships a worked example as
the `{% raw %}{% ContactForm %}{% endraw %}` snippet: three fields (name, email, message), one
plain validation rule each, and a result area that prints the values when the form passes.

## Live example

Submit with empty or invalid fields to see the inline errors; fill everything in and the
collected values appear below the buttons.

{% ContactForm %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% ContactForm %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: snippet" %}
```jsx
import { forwardRef, useState } from 'react';
import { useForm } from '@mantine/form';
import { Button, Code, Group, Stack, Text, TextInput, Textarea } from '@mantine/core';

const ContactForm = forwardRef(function ContactForm(props, ref) {
  const [submitted, setSubmitted] = useState(null);

  const form = useForm({
    initialValues: { name: '', email: '', message: '' },
    validate: {
      name: (value) => (value.trim().length < 2 ? 'Name must be at least 2 characters' : null),
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Enter a valid email address'),
      message: (value) =>
        value.trim().length < 10 ? 'Message must be at least 10 characters' : null,
    },
  });

  const handleSubmit = (values) => {
    setSubmitted(values);
  };

  return (
    <form ref={ref} onSubmit={form.onSubmit(handleSubmit)} {...props}>
      <Stack gap="sm">
        <TextInput
          label="Name"
          placeholder="Ada Lovelace"
          withAsterisk
          key={form.key('name')}
          {...form.getInputProps('name')}
        />
        <TextInput
          label="Email"
          placeholder="you@example.com"
          withAsterisk
          key={form.key('email')}
          {...form.getInputProps('email')}
        />
        <Textarea
          label="Message"
          placeholder="What's on your mind?"
          autosize
          minRows={2}
          withAsterisk
          key={form.key('message')}
          {...form.getInputProps('message')}
        />
        <Group justify="flex-start">
          <Button type="submit">Send</Button>
          <Button
            type="button"
            variant="default"
            onClick={() => {
              form.reset();
              setSubmitted(null);
            }}
          >
            Reset
          </Button>
        </Group>
        {submitted && (
          <div>
            <Text fw={600} mb="xs" size="sm">
              Submitted values
            </Text>
            <Code block>{JSON.stringify(submitted, null, 2)}</Code>
          </div>
        )}
      </Stack>
    </form>
  );
});

export default ContactForm;
```
{% endAccordionSection %}
{% endAccordion %}

## What the demo shows

| Concept | How it appears in the demo |
| --- | --- |
| Field binding | Each input spreads `getInputProps('name')`, so its value and error come from the form. |
| Validation | One plain rule per field (length / email pattern); a rule returns a string to flag an error or `null` to pass. |
| Submit handling | `onSubmit(handler)` validates first, then prints the collected values into the result area. |
| Reset | The Reset button calls `form.reset()` to restore the initial values and clear errors. |
| Inline errors | A failed rule renders its message under the field via the input's error slot. |

## When validation runs

The rules fire on submit, not as you type: pressing **Send** validates every field and shows
the messages for the ones that fail. From then on a field's error clears as soon as its value
changes, so a corrected field stops complaining before you submit again. `useForm` can also
validate on each change or on blur — that is a hook option, set where the form is defined
rather than on the tag.

## Attributes

The fields, the rules, and the submit handler all live in the snippet, so the tag itself takes
no configuration:

| Attribute | Valid values | Description |
| --- | --- | --- |
| `attr` | dict (`attr={…}`) | Raw HTML attributes — event handlers, `data-*`, ARIA — applied to the rendered `<form>` element. |

Any other attribute you write on the tag is handed to the snippet as a prop and spread onto
that same `<form>`, so `{% raw %}{% ContactForm id='contact' %}{% endraw %}` renders
`<form id="contact">`.

## CSS Selectors

The snippet renders a single `<form>` element carrying the island marker, with Mantine inputs
inside it. Target the form itself through the island attribute, and the input parts through the
Styles API class names Mantine emits for `TextInput` / `Textarea`:

{% raw %}
```css
/* the outer <form> the snippet renders */
[data-aardvark-island="ContactForm"] {
  max-width: 32rem;
}

/* the text field control inside each input */
[data-aardvark-island="ContactForm"] .mantine-TextInput-input {
  font-variant-numeric: tabular-nums;
}

/* the validation message shown under a failing field */
[data-aardvark-island="ContactForm"] .mantine-InputWrapper-error {
  font-style: italic;
}
```
{% endraw %}

## Injecting Attributes

The `attr` prop forwards raw HTML attributes onto the form's root DOM node — the snippet
forwards its `ref`, so anything you pass lands on the outer `<form>` element. Use it for event
handlers, `data-*` hooks, or ARIA attributes the snippet doesn't expose directly. Here it is
wired to `onchange`, so changing any field logs that field's current value to the console and
alerts it:

{% ContactForm attr={'onchange': '''
const field = event.target.closest('input, textarea, select');
const value = field ? field.value : '';
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% ContactForm attr={'onchange': '''
const field = event.target.closest('input, textarea, select');
const value = field ? field.value : '';
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('ContactForm', attr={'onchange': '''
const field = event.target.closest('input, textarea, select');
const value = field ? field.value : '';
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
