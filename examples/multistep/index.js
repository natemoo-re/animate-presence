import { createPresenceHandler } from 'https://unpkg.com/animate-presence/dist/animate-presence/index.esm.js';

let count = 0;
const container = document.querySelector('animate-presence');
const add = document.getElementById('add');
const remove = document.getElementById('remove');

const onEnter = createPresenceHandler(async (el, { i }) => {
  await el.animate(
    [
      { opacity: 0, transform: 'translateY(100%) scale(1.05)' },
      { opacity: 1, transform: 'translateY(0) scale(1)' },
    ],
    {
      duration: 300,
      delay: i * 100,
      fill: 'both',
      easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    }
  ).finished;
});

const onExit = createPresenceHandler(async (el, { i }) => {
  const dir = i % 2 === 0 ? -1 : 1;
  await el.animate(
    [{ transform: 'translateY(0)' }, { transform: 'translateY(50%)' }],
    {
      duration: 300,
      delay: i * 50,
      fill: 'both',
      easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    }
  ).finished;
  await el.animate(
    [
      { opacity: 1, transform: `translate(0, 50%)` },
      { opacity: 0, transform: `translate(${16 * dir}px, 50%)` },
    ],
    {
      duration: 300,
      fill: 'both',
      easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    }
  ).finished;
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
  const nodes = Array.from({ length: 3 }, (_, i) => {
    const child = document.querySelector(`[data-index="${count - 1}"]`);
    if (child) count--;
    return child;
  })
    .filter(Boolean)
    .reverse()
    .forEach(node => node.remove());
});

const randBetween = (min, max) => Math.floor(Math.random() * max) + min;
