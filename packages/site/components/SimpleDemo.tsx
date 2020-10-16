import dedent from 'dedent';
import { FC, useState, useRef } from 'react';

const SimpleDemo: FC = () => {
  const ap = useRef<HTMLAnimatePresenceElement | null>(null);
  const [items, setItems] = useState<number[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const add = () => setItems(v => (v.length <= 4 ? [...v, v.length] : v));
  const remove = () => setItems(v => v.slice(0, -1));

  return (
    <>
      <div className="host">
        <button onClick={remove}>Remove</button>
        <button onClick={add}>Add</button>

        <ol>
          <animate-presence ref={ap}>
            {items.map(i => (
              <li>{i + 1}</li>
            ))}
          </animate-presence>
        </ol>
      </div>

      <style jsx>{`
        .host {
          width: 298px;
          margin: 0 auto;
        }
        ol {
          display: flex;
          align-items: center;
        }
        li {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 4ch;
          width: 4ch;
          text-align: center;
          background: black;
          color: white;
          border-radius: 50%;
        }
        li + li {
          margin-left: 1ch;
        }
        li:nth-of-type(even) {
          --mod: -1;
        }
        [data-enter] {
          animation: enter 350ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        [data-exit] {
          animation: exit 350ms cubic-bezier(0.755, 0.05, 0.855, 0.06);
        }

        @keyframes enter {
          from {
            opacity: 0;
            transform: translateY(calc(2em * var(--mod, 1))) scale(0.5);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes exit {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(calc(-2em * var(--mod, 1))) scale(0.5);
          }
        }
      `}</style>
    </>
  );
};

export default SimpleDemo;
