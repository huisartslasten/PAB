export function createActivityCardGrid({ items = [], documentRef = document, onOpen = null, actionLabel = 'Openen →', gridClassName = 'activity-card-grid', cardClassName = 'activity-card' } = {}) {
  const grid = documentRef.createElement('div');
  grid.className = gridClassName;

  (Array.isArray(items) ? items : []).forEach(item => {
    const card = documentRef.createElement('button');
    card.type = 'button';
    const interactive = item.locked !== true || item.unlockable === true;
    card.className = ['card', cardClassName, item.locked ? 'is-locked' : '', item.unlockable ? 'is-unlockable' : ''].filter(Boolean).join(' ');
    card.disabled = !interactive;
    if (item.locked) card.setAttribute('aria-disabled', String(!interactive));

    const body = documentRef.createElement('div');
    const icon = documentRef.createElement('div');
    icon.className = 'activity-card-icon';
    icon.textContent = item.locked ? '🔒' : (item.icon || '');

    const title = documentRef.createElement('h2');
    title.textContent = item.title || item.label || '';

    const description = documentRef.createElement('p');
    description.textContent = item.description || '';

    body.append(icon, title, description);

    const action = documentRef.createElement('div');
    action.className = 'activity-card-action';
    action.textContent = item.actionLabel || actionLabel;

    card.append(body, action);
    if (interactive && typeof onOpen === 'function') card.addEventListener('click', () => onOpen(item));
    grid.appendChild(card);
  });

  return grid;
}
