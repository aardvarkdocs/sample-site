import { forwardRef } from 'react';
import { Checkbox } from '@mantine/core';

// The island behind a GFM task-list item (`- [ ] …` / `- [x] …`): aardvark's Markdown
// renderer tags the <li> and wraps the item's body in this island.
// The rendered body becomes the checkbox label — a React node, so a link, `code`, or
// **bold** inside the item survives. Named TaskItem, not Checkbox: the bare `Checkbox`
// is the registered Mantine component, and a builtin would shadow it in the registry.
//
// The `defaultChecked` prop forwards straight to Mantine's `defaultChecked`, making the
// box uncontrolled: it seeds from the source marker, the reader can flip it, and nothing
// persists across a reload (there's no state store). The name mirrors React's on purpose —
// `checked` would imply a controlled input that needs an `onChange`, which this isn't — so
// no handler is needed and React raises no controlled-without-handler warning. forwardRef
// so `attr={…}` reaches the rendered root, matching the snippets/*.jsx and Callout convention.
const TaskItem = forwardRef(function TaskItem({ defaultChecked = false, children }, ref) {
  return <Checkbox ref={ref} defaultChecked={defaultChecked} label={children} />;
});

export default TaskItem;
