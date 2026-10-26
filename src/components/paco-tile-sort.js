/**
 * Canonical drag-and-drop behavior for Paco tile grids.
 *
 * This module only manages interaction and visual ordering. The feature that
 * owns the data decides what to persist through onOrderChange.
 */

export function attachPacoTileSorting(container, {
  selector = '.paco-tile[data-paco-tile-id][draggable="true"]',
  gridSelector = '.paco-tile-grid',
  dragHandleSelector = '.paco-tile-drag-handle',
  onOrderChange = null,
  onError = null
} = {}) {
  if (!container) throw new TypeError('attachPacoTileSorting requires a container.');

  const tiles = () => [...container.querySelectorAll(selector)];
  const grids = () => {
    const found = [...container.querySelectorAll(gridSelector)];
    return found.length ? found : [container];
  };
  let dragged = null;
  let placeholder = null;
  let activeGrid = null;
  let originalIds = [];

  const collectOrderedIds = () => tiles().map(tile => tile.dataset.pacoTileId).filter(Boolean);

  const cleanup = () => {
    tiles().forEach(tile => tile.classList.remove('dragging'));
    grids().forEach(grid => grid.classList.remove('paco-tile-grid--sorting'));
    placeholder?.remove();
    placeholder = null;
    activeGrid = null;
    dragged = null;
    originalIds = [];
  };

  const ensurePlaceholder = grid => {
    if (!placeholder) {
      placeholder = grid.ownerDocument.createElement('div');
      placeholder.className = 'paco-tile-placeholder';
      placeholder.setAttribute('aria-hidden', 'true');
    }
    return placeholder;
  };

  const resolveGrid = (x, y, eventTarget) => {
    const direct = eventTarget?.closest?.(gridSelector);
    if (direct && container.contains(direct)) return direct;
    return grids().find(grid => {
      const rect = grid.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }) || activeGrid || grids()[0];
  };

  const insertionTarget = (grid, x, y) => {
    const candidates = [...grid.querySelectorAll(selector)].filter(tile => tile !== dragged);
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

  const placePlaceholder = (x, y, eventTarget) => {
    if (!dragged) return;
    const grid = resolveGrid(x, y, eventTarget);
    activeGrid = grid;
    grids().forEach(item => item.classList.toggle('paco-tile-grid--sorting', item === grid));
    const target = insertionTarget(grid, x, y);
    const holder = ensurePlaceholder(grid);

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
    if (!placeholder) return cleanup();

    const sourceId = dragged.dataset.pacoTileId || '';
    const targetGrid = placeholder.parentElement;
    placeholder.replaceWith(dragged);
    const reorderedIds = collectOrderedIds();
    const changed = originalIds.join('|') !== reorderedIds.join('|');
    cleanup();
    if (!changed || typeof onOrderChange !== 'function') return;

    try {
      await onOrderChange({ orderedIds: reorderedIds, sourceId, targetGrid });
    } catch (error) {
      if (typeof onError === 'function') await onError(error);
    }
  };

  const onDragStart = event => {
    const tile = event.target.closest(selector);
    if (!tile || !container.contains(tile)) return;
    if (!event.target.closest(dragHandleSelector)) {
      event.preventDefault();
      return;
    }
    dragged = tile;
    originalIds = collectOrderedIds();
    tile.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', tile.dataset.pacoTileId || '');
  };

  const onDragOver = event => {
    if (!dragged) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    placePlaceholder(event.clientX, event.clientY, event.target);
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
