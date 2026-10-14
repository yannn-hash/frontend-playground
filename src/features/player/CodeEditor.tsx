import { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
const theme = EditorView.theme(
  {
    '&': { backgroundColor: '#131715', color: '#d5ded4', fontSize: '13px' },
    '.cm-content': { fontFamily: 'Consolas,monospace', padding: '16px 0', caretColor: '#cefa69' },
    '.cm-gutters': {
      backgroundColor: '#131715',
      color: '#69736b',
      border: 'none',
      paddingRight: '14px',
    },
    '.cm-activeLine,.cm-activeLineGutter': { backgroundColor: '#cefa6908' },
    '&.cm-focused': { outline: 'none' },
    '.cm-scroller': { overflow: 'auto' },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
      backgroundColor: '#cefa6930',
    },
    '.cm-line': { padding: '0 14px' },
    '.cm-tooltip': { backgroundColor: '#222925', borderColor: '#343d35' },
  },
  { dark: true },
);
export default function CodeEditor({
  value,
  onChange,
  language,
  readOnly,
}: {
  value: string;
  onChange: (value: string) => void;
  language: 'css' | 'javascript';
  readOnly: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const change = useRef(onChange);
  useEffect(() => {
    change.current = onChange;
  }, [onChange]);
  useEffect(() => {
    if (!host.current) return;
    const editor = new EditorView({
      parent: host.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          language === 'css' ? css() : javascript(),
          theme,
          EditorState.readOnly.of(readOnly),
          EditorView.editable.of(!readOnly),
          EditorView.contentAttributes.of({
            'aria-label': readOnly ? 'Kode CSS yang mengikuti kontrol' : 'Editor kode misi',
            'aria-description': 'Tekan Escape lalu Tab untuk berpindah keluar editor.',
          }),
          keymap.of([
            {
              key: 'Escape',
              run: () => {
                editor.contentDOM.blur();
                return true;
              },
            },
          ]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) change.current(update.state.doc.toString());
          }),
        ],
      }),
    });
    view.current = editor;
    return () => {
      editor.destroy();
      view.current = null;
    };
    // Editor is re-created only for language/access changes. External draft sync uses dispatch below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, readOnly]);
  useEffect(() => {
    const editor = view.current;
    if (editor && editor.state.doc.toString() !== value)
      editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: value } });
  }, [value]);
  return <div className="code-editor" ref={host} />;
}
