import { FC, useState } from 'react';
import { ControlledEditor } from '@monaco-editor/react';

export interface EditorProps {
  html?: string;
  css?: string;
  js?: string;
  onChange?: (tab: 'html' | 'css' | 'js', value: string) => void;
}

const options = {
  minimap: { enabled: false },
};

const Editor: FC<EditorProps> = ({
  html: _html,
  css: _css,
  js: _js,
  onChange,
}) => {
  const [values, setValues] = useState({ html: _html, css: _css, js: _js });
  const [tab, setTab] = useState<keyof typeof values>('html');

  const handleEditorChange = (ev: Event, value?: string) => {
    onChange?.(tab, value ?? '');
    setValues(v => ({ ...v, [tab]: value }));
  };

  return (
    <>
      <div className="host">
        <ul className="tabs">
          <li>
            <button onClick={() => setTab('html')}>HTML</button>
          </li>
          <li>
            <button onClick={() => setTab('css')}>CSS</button>
          </li>
          <li>
            <button onClick={() => setTab('js')}>JS</button>
          </li>
        </ul>
        <div className="editor">
          {tab === 'html' && (
            <ControlledEditor
              value={values.html ?? ''}
              options={options}
              onChange={handleEditorChange}
              language="html"
            />
          )}
          {tab === 'css' && (
            <ControlledEditor
              value={values.css ?? ''}
              options={options}
              onChange={handleEditorChange}
              language="css"
            />
          )}
          {tab === 'js' && (
            <ControlledEditor
              value={values.js ?? ''}
              options={options}
              onChange={handleEditorChange}
              language="javascript"
            />
          )}
        </div>
      </div>

      <style jsx>{`
        .host {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .tabs {
          display: flex;
          height: 48px;
          list-style: none;
        }

        button {
          height: 100%;
          padding: 8px;
          border: none;
          border-radius: 0;
          background: transparent;
        }

        button:focus {
          outline: 0;
        }

        .tabs > li + li {
          margin-left: 4px;
        }

        .editor {
          height: 100%;
        }

        .hidden {
          visibility: hidden;
        }
      `}</style>
    </>
  );
};

export default Editor;
