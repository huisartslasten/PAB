// Reusable, domain-neutral visual interaction for ordering measured objects.
// The curriculum/task layer supplies the objects; this layer owns presentation
// and interaction only. No labels or numeric positions are shown to learners.
export function createLengthOrderLearningInterface({ mount, task, onCheck, documentRef = document } = {}) {
  if (!mount || !task || !Array.isArray(task.lengths) || !Array.isArray(task.initialOrder) || typeof onCheck !== 'function') throw new TypeError('Length-order interface requires mount, task and onCheck.');
  if (task.lengths.length !== task.initialOrder.length || new Set(task.initialOrder).size !== task.lengths.length || task.initialOrder.some(index => !Number.isInteger(index) || index < 0 || index >= task.lengths.length)) throw new TypeError('Length-order task has an invalid initial order.');
  let order = [...task.initialOrder];
  let draggedIndex = null;
  let locked = false;
  const root = documentRef.createElement('section');
  root.className = 'pacogo-length-order';
  const instruction = documentRef.createElement('p');
  instruction.className = 'pacogo-length-order__instruction';
  instruction.textContent = task.prompt;
  const help = documentRef.createElement('p');
  help.className = 'pacogo-length-order__help';
  help.textContent = 'Sleep de potloden naar de juiste plek. Het kortste potlood komt links.';
  const row = documentRef.createElement('div');
  row.className = 'pacogo-length-order__row';
  row.setAttribute('aria-label', 'Potloden die je kunt verplaatsen');
  const actions = documentRef.createElement('div');
  actions.className = 'pacogo-length-order__actions';
  const check = documentRef.createElement('button');
  check.type = 'button';
  check.className = 'pacogo-length-order__primary';
  check.textContent = 'Controleren';
  const status = documentRef.createElement('p');
  status.className = 'pacogo-length-order__status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  function render() {
    row.replaceChildren();
    order.forEach(index => {
      const pencil = documentRef.createElement('button');
      pencil.type = 'button';
      pencil.className = 'pacogo-length-order__pencil';
      pencil.draggable = !locked;
      pencil.dataset.pencilId = String(index);
      pencil.setAttribute('aria-label', 'Geel potlood, verplaats met slepen');
      pencil.style.setProperty('--pencil-length', task.lengths[index] + 'px');
      pencil.innerHTML = `
        <svg class="pacogo-length-order__pencil-art" viewBox="0 0 360 64" role="img" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="pencil-lacquer" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#fff08a"/>
              <stop offset=".22" stop-color="#ffdc45"/>
              <stop offset=".72" stop-color="#f3bd25"/>
              <stop offset="1" stop-color="#d99a12"/>
            </linearGradient>
            <linearGradient id="pencil-wood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#f7d39a"/>
              <stop offset="1" stop-color="#c98743"/>
            </linearGradient>
            <linearGradient id="pencil-eraser" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#ffc0ca"/>
              <stop offset="1" stop-color="#df7188"/>
            </linearGradient>
          </defs>
          <ellipse cx="186" cy="53" rx="160" ry="5" fill="#19345a" opacity=".10"/>
          <path d="M8 32 L37 12 L37 52 Z" fill="url(#pencil-wood)" stroke="#a96e37" stroke-width="1.4"/>
          <path d="M8 32 L20 28 L20 36 Z" fill="#302b2a"/>
          <path d="M37 12 L318 12 L337 20 L337 44 L318 52 L37 52 Z" fill="url(#pencil-lacquer)" stroke="#c58d12" stroke-width="1.5"/>
          <path d="M38 15 L316 15 L330 21 L48 21 Z" fill="#fff9c8" opacity=".72"/>
          <path d="M38 45 L318 45 L333 41 L318 52 L37 52 Z" fill="#b77a0d" opacity=".20"/>
          <path d="M318 12 L329 17 L329 47 L318 52 Z" fill="#c6cbd2" stroke="#929aa5" stroke-width="1.2"/>
          <path d="M323 15 L323 49 M328 17 L328 47" stroke="#f8fafc" stroke-width="2" opacity=".9"/>
          <path d="M329 17 Q340 12 350 19 L354 24 L354 40 L350 45 Q340 52 329 47 Z" fill="url(#pencil-eraser)" stroke="#c85d77" stroke-width="1.5"/>
          <path d="M337 20 Q345 17 350 22" fill="none" stroke="#ffe6eb" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>
        </svg>`;
      pencil.addEventListener('dragstart', event => {
        if (locked) { event.preventDefault(); return; }
        draggedIndex = index;
        event.dataTransfer?.setData('text/plain', String(index));
        if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
      });
      pencil.addEventListener('dragover', event => { if (!locked && draggedIndex !== null) event.preventDefault(); });
      pencil.addEventListener('drop', event => {
        event.preventDefault();
        const source = draggedIndex ?? Number(event.dataTransfer?.getData('text/plain'));
        const target = index;
        if (locked || !Number.isInteger(source) || source === target) return;
        const next = [...order];
        const from = next.indexOf(source), to = next.indexOf(target);
        if (from < 0 || to < 0) return;
        next.splice(to, 0, next.splice(from, 1)[0]);
        order = next;
        draggedIndex = null;
        status.textContent = 'Potlood verplaatst. Je kunt controleren.';
        render();
      });
      pencil.addEventListener('dragend', () => { draggedIndex = null; });
      pencil.addEventListener('keydown', event => {
        if (locked || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        const from = order.indexOf(index);
        const to = from + (event.key === 'ArrowLeft' ? -1 : 1);
        if (to < 0 || to >= order.length) return;
        const next = [...order];
        [next[from], next[to]] = [next[to], next[from]];
        order = next;
        render();
        row.querySelector('[data-pencil-id="' + index + '"]')?.focus();
      });
      row.appendChild(pencil);
    });
  }
  check.addEventListener('click', () => {
    if (locked) return;
    const result = onCheck([...order]);
    if (result?.correct) {
      locked = true;
      check.disabled = true;
      status.textContent = 'Goed gedaan! Je hebt de potloden van klein naar groot gelegd.';
      render();
    } else {
      status.textContent = 'Nog niet helemaal. Vergelijk de lengtes en probeer het opnieuw.';
    }
  });
  actions.appendChild(check);
  root.append(instruction, help, row, actions, status);
  mount.replaceChildren(root);
  render();
  return Object.freeze({ getOrder: () => [...order], getStatus: () => status.textContent, isLocked: () => locked });
}
