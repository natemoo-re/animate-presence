let count = 0;
const container = document.querySelector('animate-presence');
const add = document.getElementById('add');
const remove = document.getElementById('remove');

add.addEventListener('click', () => {
  const nodes = Array.from({ length: randBetween(2, 4) }, (_, i) => {
    const div = document.createElement('div');
    div.classList.add('item');
    div.dataset.index = count;

    const ap = document.createElement('animate-presence');
    Array.from({ length: randBetween(1, 10) }, (_, j) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      ap.appendChild(dot);
    });
    div.appendChild(ap);

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
