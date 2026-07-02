import { forwardRef } from 'react';
import { Button } from '@mantine/core';
import { Spotlight, spotlight } from '@mantine/spotlight';
import './SpotlightDemo.css';

// A Cmd+K-style command palette that you open from JavaScript. <Spotlight> itself
// renders no visible chrome — it mounts a portal overlay that appears only once
// spotlight.open() (or its registered hotkey) fires. So the one thing a component
// library can't hand you from Markdown is the *imperative* open call wired to a
// trigger; this self-contained snippet owns that wiring.
//
// The actions array is the searchable command list: each entry is { id, label,
// description, onClick }. The default filter matches the query against label,
// description and keywords. Triggering an action runs its onClick and closes the
// palette.
//
// forwardRef so an `attr={…}` from Markdown reaches the trigger <Button>'s DOM node
// (the same raw-attribute channel buttons use for onclick). spotlight.open() only
// touches the store on the client, so it is safe to call from the Button's onClick;
// during the build-time prerender nothing is opened and <Spotlight> renders an empty
// portal placeholder, with the real overlay wired up on hydration.
const SpotlightDemo = forwardRef(function SpotlightDemo(props, ref) {
  const actions = [
    {
      id: 'home',
      label: 'Home',
      description: 'Go to the home page',
      onClick: () => console.log('Spotlight: Home'),
    },
    {
      id: 'docs',
      label: 'Documentation',
      description: 'Open the documentation',
      onClick: () => console.log('Spotlight: Documentation'),
    },
    {
      id: 'search',
      label: 'Search the site',
      description: 'Full-text search across every page',
      keywords: ['find', 'lookup'],
      onClick: () => console.log('Spotlight: Search'),
    },
  ];

  return (
    <>
      <Spotlight
        actions={actions}
        nothingFound="Nothing found…"
        highlightQuery
        searchProps={{ placeholder: 'Search actions…' }}
      />
      <Button {...props} ref={ref} onClick={spotlight.open}>
        Open command palette
      </Button>
    </>
  );
});

export default SpotlightDemo;
