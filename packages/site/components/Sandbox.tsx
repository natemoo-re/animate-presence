import { FC, useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';

export interface SandboxProps {
  html?: string;
  css?: string;
  js?: string;
}

const doc = ({ html, css, js }: SandboxProps) => `
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="/examples/example.css" />
        ${css && `<style data-sandbox>${css}</style>`}
        <script>
          parent = null;
          window.parent = null;
        </script>
        <script type="module" src="https://unpkg.com/animate-presence/dist/animate-presence/animate-presence.esm.js"></script>
        <script nomodule src="https://unpkg.com/animate-presence/dist/animate-presence/animate-presence.js"></script>
    </head>
    <body>
        <div id="frame-root">
            ${html}
        </div>
        ${js && `<script type="module" data-sandbox>${js}</script>`}
    </body>
</html>
`;

const sanitize = (js?: string) =>
  js?.replace(
    /^(import.*)animate-presence(.*$)/gim,
    (_, $1, $2) =>
      $1 +
      'https://unpkg.com/animate-presence/dist/animate-presence/index.esm.js' +
      $2
  );

const Sandbox: FC<SandboxProps> = ({ html: _html, css: _css, js: _js }) => {
  const frame = useRef<HTMLIFrameElement | null>(null);
  const [initialSrcDoc] = useState(
    doc({ html: _html, css: _css, js: sanitize(_js) })
  );
  const [html] = useDebounce(_html, 500);
  const [css] = useDebounce(_css, 500);
  const [js] = useDebounce(_js, 500);

  useEffect(() => {
    if (!frame.current) return;
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(([entry]) => {
        const target = entry.target as HTMLIFrameElement;
        const { width, height } = entry.contentRect;
        target.width = `${width}`;
        target.height = `${height}`;
      });
      ro.observe(frame.current);
    }
  }, [frame.current]);

  useEffect(() => {
    if (!frame.current || typeof css === 'undefined') return;
    if (!frame.current.contentDocument) return;

    let style = frame.current.contentDocument.querySelector(
      'style[data-sandbox]'
    ) as HTMLStyleElement;
    if (!style) {
      style = document.createElement('style');
      style.dataset.sandbox = '';
      style.innerHTML = css;
      frame.current.contentDocument.head.appendChild(style);
    } else {
      style.innerHTML = css;
    }
  }, [css]);

  useEffect(() => {
    if (!frame.current) return;
    if (!frame.current.contentDocument) return;
    if (typeof js === 'undefined') return;
    if (typeof html === 'undefined') return;

    let script = frame.current.contentDocument?.querySelector(
      'script[data-sandbox]'
    ) as HTMLScriptElement;
    if (!script) return;

    const root = frame.current.contentDocument!.querySelector('#frame-root');
    if (!root) return;

    if (
      root.innerHTML.trim() !== html.trim() ||
      script.innerHTML.trim() !== js.trim()
    ) {
      while (root.hasChildNodes()) {
        root.firstChild!.remove();
      }
      root.innerHTML = html;

      script.remove();
      script = document.createElement('script');
      script.type = 'module';
      script.dataset.sandbox = '';
      script.innerHTML = js;
      frame.current.contentDocument!.body.appendChild(script);
    }
  }, [js, html]);

  return (
    <>
      <iframe
        ref={frame}
        frameBorder={0}
        srcDoc={initialSrcDoc}
        allowFullScreen
        allowTransparency
        sandbox="allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; microphone; midi; payment; vr"
      />
      <style jsx>{`
        iframe {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </>
  );
};

export default Sandbox;
