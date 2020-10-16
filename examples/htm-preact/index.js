import {
  html,
  useState,
  render,
} from 'https://unpkg.com/htm/preact/standalone.module.js';

function App() {
  const [items, setItems] = useState([]);

  const add = () => setItems(i => [...i, `Item ${i.length + 1}`]);
  const remove = () => setItems(i => i.slice(0, -1));

  return html`
    <div class="buttons">
      <button id="add" onClick=${add}>
        Add
      </button>
      <button id="remove" onClick=${remove}>
        Remove
      </button>
    </div>

    <animate-presence>
      ${items.map(
        item =>
          html`
            <div class="item">${item}</div>
          `
      )}
    </animate-presence>
  `;
}

render(
  html`
    <${App} />
  `,
  document.querySelector('#demo')
);
