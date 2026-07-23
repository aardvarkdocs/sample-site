import { forwardRef, useState } from 'react';
import { Badge, Button, FocusTrap, Group, Paper, Stack, Text, TextInput } from '@mantine/core';

// FocusTrap has no visual output and active traps intentionally take over keyboard
// focus. The docs need a self-contained runtime demo so readers can opt into the
// trap, see focus move into it, and release it without leaving the page keyboard-stuck.
const FocusTrapDemo = forwardRef(function FocusTrapDemo(props, ref) {
  const [active, setActive] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('Trap is off. Activate it, then press Tab.');

  return (
    <Paper withBorder radius="md" p="md" {...props} ref={ref}>
      <Stack gap="sm">
        <Group justify="space-between" align="center" gap="sm">
          <Badge color={active ? 'green' : 'gray'} variant="light">
            {active ? 'Trap active' : 'Trap off'}
          </Badge>
          <Button size="xs" variant={active ? 'light' : 'filled'} onClick={() => setActive((v) => !v)}>
            {active ? 'Release trap' : 'Activate trap'}
          </Button>
        </Group>

        <FocusTrap active={active}>
          <div
            style={{
              border: '1px solid var(--mantine-color-default-border)',
              borderRadius: 'var(--mantine-radius-sm)',
              padding: 'var(--mantine-spacing-sm)',
            }}
            onFocusCapture={(event) => {
              const label =
                event.target.getAttribute('aria-label') ||
                event.target.getAttribute('placeholder') ||
                event.target.textContent ||
                event.target.tagName;
              setStatus(`Focus is inside the trap: ${label}`);
            }}
          >
            <Stack gap="sm">
              <TextInput
                data-autofocus
                label="Email"
                placeholder="ada@example.com"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
              />
              <Group gap="xs">
                <Button size="xs" onClick={() => setStatus(`Saved ${email || 'an empty value'}`)}>
                  Save
                </Button>
                <Button size="xs" variant="default" onClick={() => setActive(false)}>
                  Release trap
                </Button>
              </Group>
            </Stack>
          </div>
        </FocusTrap>

        <Button
          size="xs"
          variant="subtle"
          onFocus={() => setStatus('Focus reached the outside control.')}
          onClick={() => setStatus('Outside control clicked.')}
        >
          Outside control
        </Button>
        <Text size="sm" c="dimmed" aria-live="polite">
          {status}
        </Text>
      </Stack>
    </Paper>
  );
});

export default FocusTrapDemo;
