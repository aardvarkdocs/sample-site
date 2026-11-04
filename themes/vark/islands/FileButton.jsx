import { forwardRef, useState } from 'react';
import { FileButton as MantineFileButton, Button, Text, Group } from '@mantine/core';
import './ActionIcon.css';

// The island behind the built-in {% filebutton %} tag (filebutton.md).
// Mantine's FileButton is a RENDER-PROP component — children is a `(props) => node` function that
// receives an onClick to open the native file picker — which can't be authored from a build-time
// Markdown macro. This island supplies a default render: a Button that opens the picker, plus the
// chosen file name shown beside it. `label` is the button text; `accept` / `multiple` constrain the
// picker. It's a client-only demo (no upload target) — see the doc page's note.
//
// forwardRef so `attr={...}` reaches the rendered root DOM node.
const FileButton = forwardRef(function FileButton(
  { label = 'Upload', accept, multiple = false, variant, color, size, radius, ...rest },
  ref,
) {
  const [file, setFile] = useState(null);
  const names = multiple
    ? (file || []).map((f) => f.name).join(', ')
    : file
      ? file.name
      : '';
  return (
    <Group gap="sm">
      <MantineFileButton onChange={setFile} accept={accept || undefined} multiple={multiple}>
        {(props) => (
          <Button ref={ref} variant={variant} color={color} size={size} radius={radius} {...props} {...rest}>
            {label}
          </Button>
        )}
      </MantineFileButton>
      {names ? (
        <Text size="sm" c="dimmed">
          {names}
        </Text>
      ) : null}
    </Group>
  );
});

export default FileButton;
