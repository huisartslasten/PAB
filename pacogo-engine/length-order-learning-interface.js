// Shared visual/interaction layer for ordering measured objects.
// The task supplies lengths; the central interface owns the visual asset and interaction.
export function createLengthOrderLearningInterface({ mount, task, onCheck, documentRef = document } = {}) {
  if (!mount || !task || !Array.isArray(task.lengths) || !Array.isArray(task.initialOrder) || typeof onCheck !== 'function') throw new TypeError('Length-order interface requires mount, task and onCheck.');
  if (task.lengths.length !== task.initialOrder.length || new Set(task.initialOrder).size !== task.lengths.length || task.initialOrder.some(index => !Number.isInteger(index) || index < 0 || index >= task.lengths.length)) throw new TypeError('Length-order task has an invalid initial order.');
  if (task.lengths.some(length => !Number.isFinite(length) || length <= 0)) throw new TypeError('Pencil lengths must be positive numbers.');
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
      pencil.style.setProperty('--pencil-body-width', Math.max(88, task.lengths[index] * 1.15) + 'px');
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
        if (locked || !Number.isInteger(source) || source === index) return;
        const next = [...order];
        const from = next.indexOf(source), to = next.indexOf(index);
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
