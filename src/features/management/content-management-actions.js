import { confirmPacoAction } from '../../components/confirm-dialog.js';

export function createContentManagementActions({ app, entityType, item, student = '', navigate, onChanged } = {}) {
  if (!app?.managementCapabilities) throw new TypeError('Content management actions require management capabilities.');
  if (!item) throw new TypeError('createContentManagementActions requires an item.');
  if (typeof navigate !== 'function') throw new TypeError('Content management actions require navigation.');

  const actions = app.managementCapabilities.getActionsForItem({ entityType, item, student });
  return Object.freeze(actions.map(action => Object.freeze({
    key: action.id,
    label: action.label,
    danger: action.danger === true,
    management: true,
    onClick: async () => {
      if (action.target) {
        navigate(action.target);
        return true;
      }
      if (typeof action.execute !== 'function') return false;

      if (action.requiresConfirmation) {
        const confirmation = action.confirmation || {};
        const confirmed = await confirmPacoAction({
          title: confirmation.title || 'Actie bevestigen?',
          message: typeof confirmation.message === 'function' ? confirmation.message(item) : (confirmation.message || 'Weet je het zeker?'),
          confirmLabel: confirmation.confirmLabel || 'Doorgaan',
          cancelLabel: confirmation.cancelLabel || 'Annuleren'
        });
        if (!confirmed) return false;
      }

      await action.execute();
      if (typeof onChanged === 'function') await onChanged();
      return true;
    }
  })));
}

export function appendContentManagementActions({ documentRef = document, container, actions = [] } = {}) {
  if (!container) throw new TypeError('appendContentManagementActions requires a container.');
  const actionBar = documentRef.createElement('div');
  actionBar.className = 'management-links';
  actions.forEach(action => {
    if (typeof action?.onClick !== 'function') return;
    const button = documentRef.createElement('button');
    button.type = 'button';
    button.className = action.danger ? 'management-link danger' : 'management-link';
    button.textContent = action.label || 'Actie';
    button.addEventListener('click', async event => {
      event.preventDefault();
      event.stopPropagation();
      button.disabled = true;
      try { await action.onClick(event); } finally { button.disabled = false; }
    });
    actionBar.appendChild(button);
  });
  if (actionBar.children.length) container.appendChild(actionBar);
  return actionBar;
}
