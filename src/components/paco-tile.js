/**
 * Canonical PacoGO content tile.
 *
 * The tile owns visual structure and interaction affordances. Features own
 * the domain data, navigation and persistence callbacks passed into it.
 */

export function createPacoTile({
  documentRef = document,
  title = '',
  description = '',
  icon = '',
  meta = '',
  actionLabel = '',
  onActivate = null,
  draggable = false,
  dragId = '',
  className = '',
  actions = []
} = {}) {
  const tile = documentRef.createElement('article');
  tile.className = `paco-tile paco-tile--standard ${className}`.trim();
  if (draggable) {
    tile.classList.add('paco-tile--draggable');
    tile.draggable = true;
  }
  if (dragId !== '') tile.dataset.pacoTileId = String(dragId);

  const body = documentRef.createElement('div');
  body.className = 'paco-tile-body';

  if (icon) {
    const iconElement = documentRef.createElement('div');
    iconElement.className = 'paco-tile-icon';
    iconElement.textContent = icon;
    iconElement.setAttribute('aria-hidden', 'true');
    body.appendChild(iconElement);
  }

  const text = documentRef.createElement('div');
  text.className = 'paco-tile-text';

  const heading = documentRef.createElement('h2');
  heading.className = 'paco-tile-title';
  heading.textContent = title;
  text.appendChild(heading);

  if (description) {
    const descriptionElement = documentRef.createElement('p');
    descriptionElement.className = 'paco-tile-description';
    descriptionElement.textContent = description;
    text.appendChild(descriptionElement);
  }

  if (meta) {
    const metaElement = documentRef.createElement('span');
    metaElement.className = 'paco-tile-meta';
    metaElement.textContent = meta;
    text.appendChild(metaElement);
  }

  body.appendChild(text);

  if (typeof onActivate === 'function') {
    const mainAction = documentRef.createElement('button');
    mainAction.type = 'button';
    mainAction.className = 'paco-tile-main-action';
    mainAction.setAttribute('aria-label', actionLabel || title || 'Openen');
    mainAction.addEventListener('click', onActivate);
    body.appendChild(mainAction);
  }

  tile.appendChild(body);

  if (actionLabel && typeof onActivate === 'function') {
    const action = documentRef.createElement('button');
    action.type = 'button';
    action.className = 'paco-tile-action';
    action.textContent = actionLabel;
    action.addEventListener('click', event => {
      event.stopPropagation();
      onActivate(event);
    });
    tile.appendChild(action);
  }

  if (Array.isArray(actions) && actions.length) {
    const actionBar = documentRef.createElement('div');
    actionBar.className = 'paco-tile-actions';
    actions.forEach(({ label, onClick, danger = false }) => {
      if (typeof onClick !== 'function') return;
      const button = documentRef.createElement('button');
      button.type = 'button';
      button.className = danger ? 'paco-tile-small-action danger' : 'paco-tile-small-action';
      button.textContent = label || 'Actie';
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        onClick(event);
      });
      actionBar.appendChild(button);
    });
    if (actionBar.children.length) tile.appendChild(actionBar);
  }

  if (draggable) {
    const handle = documentRef.createElement('button');
    handle.type = 'button';
    handle.className = 'paco-tile-drag-handle';
    handle.setAttribute('aria-label', 'Tegel verslepen');
    handle.title = 'Verslepen';
    handle.textContent = '⋮⋮';
    handle.addEventListener('mousedown', event => event.stopPropagation());
    handle.addEventListener('click', event => event.preventDefault());
    tile.appendChild(handle);
  }

  return tile;
}

export function createPacoTileGrid({ documentRef = document, className = '' } = {}) {
  const grid = documentRef.createElement('div');
  grid.className = `paco-tile-grid ${className}`.trim();
  return grid;
}
