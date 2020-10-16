let count = 0;
const container = document.querySelector('animate-presence');
const add = document.getElementById('add');
const remove = document.getElementById('remove');

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
