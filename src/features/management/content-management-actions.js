import { confirmPacoAction } from '../../components/confirm-dialog.js';

const MANAGEMENT_ACTION_POLICIES = Object.freeze({
  lesson: Object.freeze({
    archiveTitle: 'Les archiveren?',
    archiveMessage: item => `“${item.title}” wordt uit de actieve lessen gehaald en in het archief geplaatst.`,
    deleteTitle: 'Les naar prullenbak?',
    deleteMessage: item => `“${item.title}” wordt uit de actieve lessen gehaald en naar de prullenbak verplaatst.`
  }),
  learningTopic: Object.freeze({
    archiveTitle: 'Leerstof archiveren?',
    archiveMessage: item => `“${item.subject}${item.subvak ? ` · ${item.subvak}` : ''}” wordt uit de actieve leerstof gehaald en in het archief geplaatst.`,
    deleteTitle: 'Leerstof naar prullenbak?',
    deleteMessage: item => `“${item.subject}${item.subvak ? ` · ${item.subvak}` : ''}” wordt uit de actieve leerstof gehaald en naar de prullenbak verplaatst.`
  }),
  skill: Object.freeze({
    archiveTitle: 'Skill archiveren?',
    archiveMessage: item => `“${item.title}” wordt uit de actieve Skills gehaald en in het archief geplaatst.`,
    deleteTitle: 'Skill naar prullenbak?',
    deleteMessage: item => `“${item.title}” wordt uit de actieve Skills gehaald en naar de prullenbak verplaatst.`
  })
});

function getPolicy(entityType) {
  const policy = MANAGEMENT_ACTION_POLICIES[entityType];
  if (!policy) throw new Error(`Onbekend beheertype: ${entityType}.`);
  return policy;
}

export function createContentManagementActions({ entityType, item, handlers = {} } = {}) {
  if (!item) throw new TypeError('createContentManagementActions requires an item.');
  const policy = getPolicy(entityType);
  if (typeof handlers.edit !== 'function') throw new TypeError(`Management ${entityType} actions require an edit handler.`);
  if (typeof handlers.archive !== 'function') throw new TypeError(`Management ${entityType} actions require an archive handler.`);
  if (typeof handlers.delete !== 'function') throw new TypeError(`Management ${entityType} actions require a delete handler.`);

  return Object.freeze([
    Object.freeze({ key: 'edit', label: 'Bewerken', danger: false, management: true, onClick: () => handlers.edit(item) }),
    Object.freeze({
      key: 'archive',
      label: 'Archiveren',
      danger: false,
      management: true,
      onClick: async () => {
        const confirmed = await confirmPacoAction({
          title: policy.archiveTitle,
          message: policy.archiveMessage(item),
          confirmLabel: 'Archiveren',
          cancelLabel: 'Annuleren'
        });
        if (!confirmed) return false;
        await handlers.archive(item);
        return true;
      }
    }),
    Object.freeze({
      key: 'delete',
      label: 'Verwijderen',
      danger: true,
      management: true,
      onClick: async () => {
        const confirmed = await confirmPacoAction({
          title: policy.deleteTitle,
          message: policy.deleteMessage(item),
          confirmLabel: 'Naar prullenbak',
          cancelLabel: 'Annuleren'
        });
        if (!confirmed) return false;
        await handlers.delete(item);
        return true;
      }
    })
  ]);
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

export { MANAGEMENT_ACTION_POLICIES };
