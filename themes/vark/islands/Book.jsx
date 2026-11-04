import { forwardRef } from 'react';
import { Book as GfBook } from '@gfazioli/mantine-book';
import './Book.css';

// The island behind the built-in {% book %} tag
// (book.md). A Community Component wrapping @gfazioli/mantine-book — an
// iBooks-style book whose pages turn with a draggable page-curl.
//
// Pages come through the data-driven `pages` prop: an array of
// { front, back?, props? } where `front`/`back` are the page contents. They ride
// the JSON props channel as strings (the macro can't build React nodes at build
// time), and React renders a string child verbatim — so plain text pages are the
// graceful default. Everything else (width, height, withCover, variant,
// revealBackground, the Mantine style system, …) flows straight through via
// {...rest}, keeping the full Book API available.
//
// Client-only, by its Community Component marker: ../components/README.md (The React components).
const Book = forwardRef(function Book({ pages = [], ...rest }, ref) {
  return <GfBook ref={ref} pages={Array.isArray(pages) ? pages : []} {...rest} />;
});

export default Book;
