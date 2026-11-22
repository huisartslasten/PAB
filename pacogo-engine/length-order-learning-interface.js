// Reusable, domain-neutral visual interaction for ordering measured objects.
// Task data supplies object lengths; this layer owns the shared visual and interaction.
export function createLengthOrderLearningInterface({ mount, task, onCheck, documentRef = document } = {}) {
  if (!mount || !task || !Array.isArray(task.lengths) || !Array.isArray(task.initialOrder) || typeof onCheck !== 'function') throw new TypeError('Length-order interface requires mount, task and onCheck.');
  if (task.lengths.length !== task.initialOrder.length || new Set(task.initialOrder).size !== task.lengths.length || task.initialOrder.some(index => !Number.isInteger(index) || index < 0 || index >= task.lengths.length)) throw new TypeError('Length-order task has an invalid initial order.');
  if (task.lengths.some(length => !Number.isFinite(length) || length < 76)) throw new TypeError('Pencil lengths must be at least 76 visual units.');
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

  function pencilArtwork(length, index) {
    const bodyEnd = length - 25;
    const ferruleEnd = length - 17;
    const gradientId = 'pencil-gold-' + index;
    const woodId = 'pencil-wood-' + index;
    const eraserId = 'pencil-eraser-' + index;
    return `
      <svg class="pacogo-length-order__pencil-art" viewBox="0 0 ${length} 64" role="img" aria-hidden="true" focusable="false" preserveAspectRatio="none">
        <defs>
          <linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#fff5a9"/><stop offset=".18" stop-color="#ffe36a"/>
            <stop offset=".48" stop-color="#f7c52f"/><stop offset=".82" stop-color="#e9a914"/>
            <stop offset="1" stop-color="#bd7d0b"/>
          </linearGradient>
          <linearGradient id="${woodId}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#ffe3b1"/><stop offset=".55" stop-color="#d9a064"/><stop offset="1" stop-color="#a96b37"/>
          </linearGradient>
          <linearGradient id="${eraserId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#ffd1d9"/><stop offset=".45" stop-color="#f39aaa"/><stop offset="1" stop-color="#cf637d"/>
          </linearGradient>
        </defs>
        <ellipse cx="${length / 2}" cy="54" rx="${Math.max(20, length / 2 - 3)}" ry="4.2" fill="#263d5a" opacity=".13"/>
        <path d="M3 32 L23 19 L23 45 Z" fill="url(#${woodId})" stroke="#a66c3b" stroke-width="1"/>
        <path d="M3 32 L14 28.8 L14 35.2 Z" fill="#29282a"/>
        <path d="M7 31 L21 21 M7 33 L21 43" stroke="#f8d5a0" stroke-width="1.1" opacity=".85"/>
        <path d="M23 19 L${bodyEnd - 5} 19 L${bodyEnd} 23 L${bodyEnd} 41 L${bodyEnd - 5} 45 L23 45 Z" fill="url(#${gradientId})" stroke="#b77d0e" stroke-width="1.1"/>
        <path d="M24 21 L${bodyEnd - 7} 21 L${bodyEnd - 2} 24 L34 24 Z" fill="#fff9d1" opacity=".88"/>
        <path d="M25 42 L${bodyEnd - 5} 42 L${bodyEnd - 1} 40 L${bodyEnd - 1} 41 L${bodyEnd - 5} 44 L25 44 Z" fill="#9d680c" opacity=".3"/>
        <path d="M${bodyEnd - 1} 19 L${ferruleEnd} 21 L${ferruleEnd} 43 L${bodyEnd - 1} 45 Z" fill="#b9c2cb" stroke="#7d8996" stroke-width="1"/>
        <path d="M${bodyEnd + 2} 21 L${bodyEnd + 2} 43 M${bodyEnd + 6} 21.5 L${bodyEnd + 6} 42.5" stroke="#f9fcff" stroke-width="1.5" opacity=".95"/>
        <path d="M${ferruleEnd} 21 Q${length - 2} 17 ${length - 2} 25 L${length - 2} 39 Q${length - 2} 47 ${ferruleEnd} 43 Z" fill="url(#${eraserId})" stroke="#c85f78" stroke-width="1.1"/>
        <path d="M${ferruleEnd + 2} 24 Q${length - 5} 20 ${length - 4} 25" fill="none" stroke="#fff0f2" stroke-width="2" stroke-linecap="round" opacity=".9"/>
      </svg>`;
  }

  function render() {
    row.replaceChildren();
    order.forEach(index => {
      const length = task.lengths[index];
      const pencil = documentRef.createElement('button');
      pencil.type = 'button';
      pencil.className = 'pacogo-length-order__pencil';
      pencil.draggable = !locked;
      pencil.dataset.pencilId = String(index);
      pencil.setAttribute('aria-label', 'Geel potlood, verplaats met slepen');
      pencil.style.setProperty('--pencil-length', length + 'px');
      pencil.innerHTML = pencilArtwork(length, index);
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
