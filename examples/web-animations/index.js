import { createPresenceHandler } from 'https://unpkg.com/animate-presence/dist/animate-presence/index.esm.js';

let count = 0;
const container = document.querySelector('animate-presence');
const add = document.getElementById('add');
const remove = document.getElementById('remove');

const onEnter = createPresenceHandler(async (el, { i }) => {
  return el.animate(
    [
      { opacity: 0, transform: 'translateY(100%) scale(1.05)' },
      { opacity: 1, transform: 'translateY(0) scale(1)' },
    ],
    {
      duration: 200,
      delay: i * 20,
      fill: 'both',
      easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    }
  );
});

const onExit = createPresenceHandler(async (el, { i }) => {
  return el.animate(
    [
      { opacity: 1, transform: 'translateX(0)' },
      { opacity: 0, transform: 'translateX(128px)' },
    ],
    {
      duration: 200,
      delay: i * 30,
      fill: 'both',
      easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    }
  );
});

container.addEventListener('animatePresenceEnter', onEnter);
container.addEventListener('animatePresenceExit', onExit);

add.addEventListener('click', () => {
  const nodes = Array.from({ length: randBetween(2, 4) }, (_, i) => {
    const div = document.createElement('div');
    div.classList.add('item');
    div.textContent = `Item ${count + 1}`;
    div.dataset.index = count;
    count++;
    return div;
  }).forEach(node => container.appendChild(node));
});

remove.addEventListener('click', () => {
  const nodes = Array.from({ length: randBetween(2, 4) }, (_, i) => {
    const child = document.querySelector(`[data-index="${count - 1}"]`);
    if (child) count--;
    return child;
  })
    .filter(Boolean)
    .reverse()
    .forEach(node => node.remove());
});

const randBetween = (min, max) => Math.floor(Math.random() * max) + min;
