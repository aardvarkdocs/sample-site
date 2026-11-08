/* @aardvark-island {"urlProps": ["href"]} */
import { forwardRef, useState } from 'react';
import { Box, Collapse } from '@mantine/core';
import { IconChevronRight, IconFolder, IconFolderOpen } from '@tabler/icons-react';
import { TreeRowLabel } from './_treeHelpers';
import { sanitizeHref } from '@aardvark/islands/safe-href';

// A folder row of {% tree %} (the {% folder %} block). The display name arrives
// as the `label` prop (the block maps the authored name= to label, because `name` is the
// island collector's positional argument). Holds its nested folder/file islands as
// `children` and owns its own open/closed state. The shared row label (TreeRowLabel, identical
// in TreeFile) comes from _treeHelpers; sanitizeHref from @aardvark/islands/safe-href.

const TreeFolder = forwardRef(function TreeFolder(
  { label = '', defaultOpen = false, openable = true, href, comment, highlighted = false, children },
  ref,
) {
  // openable=false → a static folder: always shown, no chevron, no toggle. The Python layer
  // already coerces a quoted openable="false" to a real bool; we also guard the string form
  // here so the island stays correct no matter how the prop arrives.
  const toggleable = openable !== false && openable !== 'false';
  const [open, setOpen] = useState(toggleable ? Boolean(defaultOpen) : true);

  const FolderIcon = open ? IconFolderOpen : IconFolder;
  const safeHref = sanitizeHref(href);
  const toggle = () => {
    if (toggleable) setOpen((o) => !o);
  };

  return (
    <Box ref={ref} className="aardvark-tree-item" data-highlighted={highlighted ? '' : undefined}>
      {/* The row IS the treeitem: role + aria-expanded ride on the focusable element
          (WAI-ARIA tree pattern), so a screen reader announces the expanded state when
          this row is focused. The outer Box is just a layout/grouping container. */}
      <div
        className="aardvark-tree-row"
        data-folder=""
        data-interactive={toggleable ? '' : undefined}
        role="treeitem"
        aria-expanded={toggleable ? open : undefined}
        tabIndex={-1}
        onClick={toggle}
      >
        {toggleable ? (
          <IconChevronRight
            size={16}
            className="aardvark-tree-chevron"
            data-open={open ? '' : undefined}
            aria-hidden="true"
          />
        ) : (
          <span className="aardvark-tree-spacer" aria-hidden="true" />
        )}
        <FolderIcon size={16} className="aardvark-tree-icon" aria-hidden="true" />
        <TreeRowLabel href={safeHref} label={label} comment={comment} />
      </div>
      <Collapse in={toggleable ? open : true}>
        <div className="aardvark-tree-group" role="group">
          {children}
        </div>
      </Collapse>
    </Box>
  );
});

export default TreeFolder;
