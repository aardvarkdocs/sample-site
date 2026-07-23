import { forwardRef, useState } from 'react';
import { useForm } from '@mantine/form';
import { Button, Code, Group, Stack, Text, TextInput, Textarea } from '@mantine/core';

// A live form built on the useForm hook. useForm owns the field values, the touched/dirty
// status, and the validation results; each input is wired to it with getInputProps('name'),
// which hands back the value, onChange, onBlur, error, and (in the default uncontrolled mode)
// the key the hook uses to address the field. Submitting runs the validate rules first and only
// calls the success handler when every field passes, so the result panel below shows the
// collected values exactly when the form is valid.
//
// Validation here is plain functions (one per field): they return a string to flag an error or
// a falsy value to pass. Mantine 9 no longer ships zodResolver, so schema validation would mean
// bringing your own resolver — plain rules keep this demo dependency-free.
//
// forwardRef so attr={...} from Markdown reaches the outer <form> DOM node (see DemoCard.jsx /
// the Injecting Attributes doc section).
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
    // Only reached when every validate rule passes; surface the collected values in-page rather
    // than an alert so the demo works in the SSR-prerendered build with no popups.
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
