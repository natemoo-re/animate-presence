import { FC, useEffect, useState } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Sandbox from '../../components/Sandbox';
import { ControlledEditor } from '@monaco-editor/react';

import { promises as fs } from 'fs';
import { resolve } from 'path';
import dedent from 'dedent';
import Layout from '../../components/Layout';
import Logo from '../../components/Logo';

export interface ExampleProps {
  html?: string | null;
  css?: string | null;
  js?: string | null;
}

const options = {
  minimap: { enabled: false },
};

const Example: FC<ExampleProps> = ({ html, css, js }) => {
  const [values, setValues] = useState({ html, css, js });
  const [tab, setTab] = useState<keyof typeof values | 'preview'>('html');
  const [md, setMd] = useState(false);

  const handleEditorChange = (ev: Event, value?: string) => {
    setValues(v => ({ ...v, [tab]: value }));
  };

  useEffect(() => {
    const match = matchMedia('(min-width: 720px)');
    setMd(match.matches);
    function onChange({ matches }: MediaQueryListEvent) {
      setMd(matches);
    }
    match.addEventListener('change', onChange);

    return () => {
      match.removeEventListener('change', onChange);
    };
  }, []);

  useEffect(() => {
    if (md && tab === 'preview') setTab('html');
  }, [md, tab]);

  return (
    <Layout>
      <div className="grid">
        <div className="toolbar">
          <div className="flex">
            <Logo width={48} height={48} />
            <h1>Examples</h1>
          </div>
        </div>
        <ul className="tabs">
          <li>
            <button
              className={tab === 'html' ? 'active' : ''}
              tabIndex={tab === 'html' ? 0 : -1}
              onClick={() => setTab('html')}
            >
              HTML
            </button>
          </li>
          <li>
            <button
              className={tab === 'css' ? 'active' : ''}
              tabIndex={tab === 'css' ? 0 : -1}
              onClick={() => setTab('css')}
            >
              CSS
            </button>
          </li>
          <li>
            <button
              className={tab === 'js' ? 'active' : ''}
              tabIndex={tab === 'js' ? 0 : -1}
              onClick={() => setTab('js')}
            >
              JS
            </button>
          </li>
          {!md && (
            <li>
              <button
                className={tab === 'preview' ? 'active' : ''}
                tabIndex={tab === 'preview' ? 0 : -1}
                onClick={() => setTab('preview')}
              >
                Preview
              </button>
            </li>
          )}
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
        <div
          className={`sandbox ${
            !md && tab === 'preview' ? 'visible' : ''
          }`.trim()}
        >
          <Sandbox
            html={values.html ?? ''}
            css={values.css ?? ''}
            js={values.js ?? ''}
          />
        </div>
      </div>
      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 60px 40px minmax(0, 1fr);
          height: 100vh;
        }

        .toolbar {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          padding: 0 1em;
          padding-left: 1.2em;
        }

        .flex {
          display: flex;
          align-items: center;
        }

        h1 {
          font-size: 1rem;
          letter-spacing: 0.5px;
          margin-left: 0.5rem;
        }

        .tabs {
          grid-column: 1 / -1;
          grid-row: 2 / span 1;

          padding: 0 1em;
        }

        .editor {
          grid-row: 3 / -1;
          grid-column: 1 / -1;
        }

        .sandbox {
          visibility: hidden;
          grid-row: 3 / -1;
          grid-column: 1 / -1;
        }

        .visible {
          visibility: visible;
        }

        @media screen and (min-width: 720px) {
          .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .tabs {
            grid-row: 2 / span 1;
            grid-column: 1 / 2;
            border-right: 1px solid #eee;
          }

          .editor {
            grid-row: 3 / -1;
            grid-column: 1 / 2;
            border-right: 1px solid #eee;
          }

          .sandbox {
            visibility: visible;
            grid-row: 2 / -1;
            grid-column: 2 / 3;
            border-top: 1px solid #eee;
          }
        }

        .tabs {
          display: flex;
          height: 40px;
          list-style: none;
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
        }

        button {
          height: 100%;
          padding: 8px;
          border: none;
          border-radius: 0;
          background: transparent;

          border-top: 4px solid transparent;
          margin-top: -1px;
          padding-top: 4px;
          color: rgba(0, 0, 0, 0.54);
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }

        button:hover:not(.active),
        button:focus:not(.active) {
          border-top: 4px solid #eee;
          color: rgba(0, 0, 0, 0.87);
        }

        button:focus {
          outline: 0;
        }

        button:focus-visible {
          border: 1px solid #1b99ff !important;
          padding: 7px;
          padding-top: 6px;
        }

        .active,
        .active:focus-visible {
          border-top: 4px solid #1b99ff !important;
          color: rgba(0, 0, 0, 0.87);
          font-weight: 600;
          padding-top: 4px;
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
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<ExampleProps> = async req => {
  try {
    const example = req.params!.match[0];
    const path = resolve(`../../examples/${example}`);
    const names = await fs.readdir(path);
    const files = await Promise.all(
      names.map(async name => {
        let content: any = await fs.readFile(
          resolve(`../../examples/${example}/${name}`)
        );
        if (name.endsWith('html')) {
          content = dedent`${
            /<main>(.+)<\/main>/gis.exec(content.toString())![1]
          }`;
        } else {
          content = content.toString();
        }
        return { name, content } as { name: string; content: string };
      })
    );

    const html = files.find(({ name }) => name.endsWith('html'))?.content;
    const css = files.find(({ name }) => name.endsWith('css'))?.content;
    const js = files.find(({ name }) => name.endsWith('js'))?.content;

    return {
      props: {
        html: html ?? null,
        css: css ?? null,
        js: js ?? null,
      },
    };
  } catch (e) {
    return {
      props: {
        html: '',
      },
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const path = resolve(`../../examples`);
  const examples = await fs.readdir(path, { withFileTypes: true });

  const paths = examples
    .map(dirent =>
      dirent.isDirectory() && !['lib', 'shared'].includes(dirent.name)
        ? `/examples/${dirent.name}`
        : null
    )
    .filter(v => v) as string[];

  return {
    paths,
    fallback: false,
  };
};

export default Example;
