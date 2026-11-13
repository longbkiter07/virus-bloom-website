'use strict';
(() => {
 const board = document.querySelector('#demo-board');
 if (!board) return;
 const button = document.querySelector('#complete-match');
 const status = document.querySelector('#demo-status');
 let pattern = 'box', cleared = false, timer = null;
 function selected(i) {
  return pattern === 'row' ? Math.floor(i / 9) === 4 : pattern === 'column' ? i % 9 === 4 : Math.floor(i / 9) >= 3 && Math.floor(i / 9) <= 5 && i % 9 >= 3 && i % 9 <= 5;
 }
 function reset(next = pattern) {
  clearTimeout(timer); pattern = next; cleared = false; button.disabled = false;
  board.replaceChildren(); board.classList.remove('cleared');
  let count = 0;
  for (let i = 0; i < 81; i++) {
   const cell = document.createElement('span'); cell.className = 'cell'; cell.setAttribute('aria-hidden', 'true');
   if (selected(i)) {
    cell.classList.add('active'); count++;
    if (count === 9) cell.classList.add('missing');
    else { if (count === 4) cell.classList.add('virus'); const pill = document.createElement('span'); pill.className = 'pill'; cell.append(pill); }
   }
   board.append(cell);
  }
  document.querySelectorAll('[data-pattern]').forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.pattern === pattern)));
  const description = pattern === 'box' ? 'marked 3 by 3 region' : pattern;
  board.setAttribute('aria-label', `Nine by nine board. Eight matching blue cells and one empty cell in the ${description}.`);
  status.textContent = 'Eight blue cells. One gap. Make the match.';
  button.textContent = 'Place the last medicine ✦';
 }
 document.querySelectorAll('[data-pattern]').forEach(tab => tab.addEventListener('click', () => reset(tab.dataset.pattern)));
 button.addEventListener('click', () => {
  if (cleared) return reset();
  const last = board.querySelector('.missing'); last.classList.remove('missing');last.classList.add('new');
  const pill = document.createElement('span');pill.className='pill';last.append(pill);
  button.disabled=true;status.textContent='Nine matching cells. That’s a clear!';
  timer=setTimeout(() => {
   board.classList.add('cleared');cleared=true;button.disabled=false;button.textContent='Try another match ↻';
   status.textContent='Match cleared. The virus is gone, and you have room to plan again.';
   board.setAttribute('aria-label','The matching nine-cell region is cleared. Its virus is removed.');
  }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 50 : 550);
 });
 reset();
})();
