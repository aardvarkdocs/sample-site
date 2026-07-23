import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor } from '@mantine/tiptap';
import './RichTextEditor.css';

// A live, in-page rich-text editor: a formatting toolbar over an editable document area.
// The toolbar buttons reflect and toggle the selection's marks (bold/italic/underline),
// turn the current block into a bullet list, and attach/detach a link. Typing, selecting,
// and the keyboard shortcuts (Cmd/Ctrl+B, +I, +U) all drive the same document state.
//
// The editor is a runtime object — useEditor() builds a Tiptap instance with its own
// document model and command chain — which is exactly what a flat build-time component
// can't produce from Markdown attributes. So this is a snippet island: it owns the
// useEditor() call and hands the live instance to <RichTextEditor editor={...}>, while
// the markup stays declarative.
//
// `content` seeds the initial document; it accepts an HTML string (e.g.
// '<p>Hello <strong>world</strong></p>'), which Tiptap parses into its document model.
//
// SSR: the build prerenders islands with renderToStaticMarkup, which has no DOM. Tiptap's
// default eager render touches the document, so `immediatelyRender: false` defers the first
// render to the client. We also hold back the whole editor until mounted — until then the
// useEditor() instance is null, and <RichTextEditor editor={null}> would throw — rendering a
// stable placeholder of the same shape so the prerendered and hydrated trees match.
//
// `ref` is forwarded to the RichTextEditor root so `attr={...}` from Markdown lands on the
// editor's outermost DOM node (see DemoCard.jsx / Callout.jsx for the same forwarding).
function setForwardedRef(ref, node) {
  if (typeof ref === 'function') ref(node);
  else if (ref) ref.current = node;
}

function emitNativeChange(node, value) {
  if (!node) return;
  node.value = value || '';
  if (node.dataset) node.dataset.aardvarkValue = value || '';
  node.dispatchEvent(new Event('change', { bubbles: true }));
}

function scheduleNativeChange(node, value) {
  const emit = () => emitNativeChange(node, value);
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(emit);
  else setTimeout(emit, 0);
}

const RichTextEditorIsland = forwardRef(function RichTextEditorIsland({ content = '' }, ref) {
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef(null);
  const latestValueRef = useRef(content);
  const dirtyRef = useRef(false);
  const setRootRef = useCallback((node) => {
    rootRef.current = node;
    setForwardedRef(ref, node);
  }, [ref]);

  const commitChange = useCallback((value) => {
    latestValueRef.current = value;
    dirtyRef.current = false;
    scheduleNativeChange(rootRef.current, value);
  }, []);

  useEffect(() => setMounted(true), []);

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    immediatelyRender: false, // SSR-safe: no DOM access during the build prerender.
    onUpdate: ({ editor }) => {
      latestValueRef.current = editor.getHTML();
      dirtyRef.current = true;
    },
    onBlur: ({ editor }) => {
      const value = editor.getHTML();
      if (dirtyRef.current || value !== latestValueRef.current) commitChange(value);
    },
  });

  if (!mounted || !editor) {
    return (
      <div ref={setRootRef} className="mantine-RichTextEditor-root" data-rte-placeholder>
        <div className="mantine-RichTextEditor-toolbar" />
        <div className="mantine-RichTextEditor-content" />
      </div>
    );
  }

  return (
    <RichTextEditor editor={editor} ref={setRootRef}>
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.BulletList />
          <RichTextEditor.Link />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>
      <RichTextEditor.Content />
    </RichTextEditor>
  );
});

export default RichTextEditorIsland;
