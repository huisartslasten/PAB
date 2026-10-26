/**
 * Canonical drag-and-drop behavior for PacoGO tile grids.
 *
 * This module only manages interaction and visual ordering. The feature that
 * owns the data decides what to persist through onOrderChange.
 */

export function attachPacoTileSorting(container, {
  selector = '.paco-tile[data-paco-tile-id][draggable="true"]',
  onOrderChange = null,
  onError = null
} = {}) {
  if (!container) throw new TypeError('attachPacoTileSorting requires a container.');

  const tiles = () => [...container.querySelectorAll(selector)];
  const grid = container.querySelector('.paco-tile-grid') || container;
  let dragged = null;
  let placeholder = null;

  const cleanup = () => {
    tiles().forEach(tile => tile.classList.remove('dragging'));
    placeholder?.remove();
    placeholder = null;
    grid.classList.remove('paco-tile-grid--sorting');
    dragged = null;
  };

  const ensurePlaceholder = () => {
    if (placeholder) return placeholder;
    placeholder = grid.ownerDocument.createElement('div');
    placeholder.className = 'paco-tile-placeholder';
    placeholder.setAttribute('aria-hidden', 'true');
    return placeholder;
  };

  const insertionTarget = (x, y) => {
    const candidates = tiles().filter(tile => tile !== dragged);
    if (!candidates.length) return { before: null };

    let nearest = null;
    let nearestDistance = Infinity;
    candidates.forEach(tile => {
      const rect = tile.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = ((x - centerX) ** 2) + ((y - centerY) ** 2);
      if (distance < nearestDistance) {
        nearest = tile;
        nearestDistance = distance;
      }
    });

    if (!nearest) return { before: null };
    const rect = nearest.getBoundingClientRect();
    const sameRow = Math.abs(y - (rect.top + rect.height / 2)) <= rect.height * 0.65;
    const before = sameRow ? x < rect.left + rect.width / 2 : y < rect.top + rect.height / 2;
    return { before: nearest, insertBefore: before };
  };

  const placePlaceholder = (x, y) => {
    if (!dragged) return;
    const target = insertionTarget(x, y);
    const holder = ensurePlaceholder();
    if (!target.before) {
      if (grid.lastElementChild !== holder) grid.appendChild(holder);
      return;
    }
    if (target.insertBefore) {
      if (holder.nextElementSibling !== target.before) grid.insertBefore(holder, target.before);
    } else if (target.before.nextElementSibling !== holder) {
      grid.insertBefore(holder, target.before.nextElementSibling);
    }
  };

  const finish = async event => {
    if (!dragged) return;
    event.preventDefault();
    const holder = placeholder;
    if (!holder) return cleanup();

    const orderedIds = [...grid.children]
      .filter(element => element !== holder && element.matches(selector))
      .map(element => element.dataset.pacoTileId)
      .filter(Boolean);

    holder.replaceWith(dragged);
    const reorderedIds = [...grid.children]
      .filter(element => element.matches(selector))
      .map(element => element.dataset.pacoTileId)
      .filter(Boolean);

    const changed = orderedIds.join('|') !== reorderedIds.join('|');
    cleanup();
    if (!changed || typeof onOrderChange !== 'function') return;

    try {
      await onOrderChange({ orderedIds: reorderedIds });
    } catch (error) {
      if (typeof onError === 'function') await onError(error);
    }
  };

  const onDragStart = event => {
    const tile = event.target.closest(selector);
    if (!tile || !container.contains(tile)) return;
    if (!event.target.closest('.paco-tile-drag-handle')) {
      event.preventDefault();
      return;
    }
    dragged = tile;
    tile.classList.add('dragging');
    grid.classList.add('paco-tile-grid--sorting');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', tile.dataset.pacoTileId || '');
  };

  const onDragOver = event => {
    if (!dragged) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    placePlaceholder(event.clientX, event.clientY);
  };

  const onDrop = event => { void finish(event); };
  const onDragEnd = () => { cleanup(); };

  container.addEventListener('dragstart', onDragStart);
  container.addEventListener('dragover', onDragOver);
  container.addEventListener('drop', onDrop);
  container.addEventListener('dragend', onDragEnd);

  return () => {
    container.removeEventListener('dragstart', onDragStart);
    container.removeEventListener('dragover', onDragOver);
    container.removeEventListener('drop', onDrop);
    container.removeEventListener('dragend', onDragEnd);
    cleanup();
  };
}
