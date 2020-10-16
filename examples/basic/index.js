let count = 0;
const container = document.querySelector('animate-presence');
const add = document.getElementById('add');
const remove = document.getElementById('remove');

add.addEventListener('click', () => {
  const div = document.createElement('div');
  div.classList.add('item');
  div.textContent = `Item ${count + 1}`;
  div.dataset.index = count;
  container.append(div);
  count++;
});

remove.addEventListener('click', () => {
  const child = document.querySelector(`[data-index="${count - 1}"]`);
  child.remove();
  count--;
});
