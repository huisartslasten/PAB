/**
 * Canonical registry for management capabilities.
 *
 * Pages describe their current context; this module decides which management
 * capabilities and actions belong to that context. Domain persistence stays
 * owned by the existing management/domain services.
 */

function requireManagement(management) {
  if (!management) throw new TypeError('Management capabilities require the management service.');
}

function canManage(auth) {
  return auth?.isParent === true;
}

function buildTarget(path, { student = '', extra = {} } = {}) {
  const url = new URL(path, window.location.href);
  if (student) url.searchParams.set('viewStudent', student);
  else url.searchParams.delete('viewStudent');
  url.searchParams.delete('student');
  url.searchParams.delete('context');
  url.searchParams.delete('mode');
  Object.entries(extra).forEach(([key, value]) => {
    if (value === '' || value == null) url.searchParams.delete(key);
    else url.searchParams.set(key, String(value));
  });
  return url.toString();
}

const PAGE_CAPABILITIES = Object.freeze({
  lessons: Object.freeze(['lesson.create']),
  'lesson-editor': Object.freeze(['lesson.create']),
  skills: Object.freeze(['skill.create']),
  'skill-editor': Object.freeze(['skill.create']),
  'learning-material': Object.freeze(['learningTopic.create']),
  'learning-material-editor': Object.freeze(['learningTopic.create'])
});

const CAPABILITIES = Object.freeze({
  'lesson.create': Object.freeze({
    id: 'lesson.create',
    entityType: 'lesson',
    label: 'Les maken',
    target: ({ student }) => buildTarget('lesson-editor.html', { student })
  }),
  'skill.create': Object.freeze({
    id: 'skill.create',
    entityType: 'skill',
    label: 'Skill maken',
    target: ({ student }) => buildTarget('skill-create.html', { student })
  }),
  'learningTopic.create': Object.freeze({
    id: 'learningTopic.create',
    entityType: 'learningTopic',
    label: 'Leerstof maken',
    target: ({ student }) => buildTarget('learning-material-editor.html', { student })
  })
});

const ITEM_ACTIONS = Object.freeze({
  lesson: Object.freeze([
    Object.freeze({ id: 'lesson.edit', label: 'Bewerken', target: ({ item, student }) => buildTarget('lesson-editor.html', { student: student || item?.student, extra: { lesson_id: item?.id } }) }),
    Object.freeze({
      id: 'lesson.archive',
      label: 'Archiveren',
      execute: ({ management, item }) => management.archiveLesson(item.id),
      requiresConfirmation: true,
      confirmation: Object.freeze({
        title: 'Les archiveren?',
        message: item => `“${item.title}” wordt uit de actieve lessen gehaald en in het archief geplaatst.`,
        confirmLabel: 'Archiveren',
        cancelLabel: 'Annuleren'
      })
    }),
    Object.freeze({
      id: 'lesson.delete',
      label: 'Verwijderen',
      execute: ({ management, item }) => management.moveToTrash(item.id),
      requiresConfirmation: true,
      danger: true,
      confirmation: Object.freeze({
        title: 'Les naar prullenbak?',
        message: item => `“${item.title}” wordt uit de actieve lessen gehaald en naar de prullenbak verplaatst.`,
        confirmLabel: 'Naar prullenbak',
        cancelLabel: 'Annuleren'
      })
    })
  ]),
  learningTopic: Object.freeze([
    Object.freeze({ id: 'learningTopic.edit', label: 'Bewerken', target: ({ item, student }) => buildTarget('learning-material-editor.html', { student: student || item?.student, extra: { topic_id: item?.id } }) }),
    Object.freeze({
      id: 'learningTopic.archive',
      label: 'Archiveren',
      execute: ({ management, item }) => management.archiveLearningTopic(item.id),
      requiresConfirmation: true,
      confirmation: Object.freeze({
        title: 'Leerstof archiveren?',
        message: item => `“${item.subject}${item.subvak ? ` · ${item.subvak}` : ''}” wordt uit de actieve leerstof gehaald en in het archief geplaatst.`,
        confirmLabel: 'Archiveren',
        cancelLabel: 'Annuleren'
      })
    }),
    Object.freeze({
      id: 'learningTopic.delete',
      label: 'Verwijderen',
      execute: ({ management, item }) => management.moveLearningTopicToTrash(item.id),
      requiresConfirmation: true,
      danger: true,
      confirmation: Object.freeze({
        title: 'Leerstof naar prullenbak?',
        message: item => `“${item.subject}${item.subvak ? ` · ${item.subvak}` : ''}” wordt uit de actieve leerstof gehaald en naar de prullenbak verplaatst.`,
        confirmLabel: 'Naar prullenbak',
        cancelLabel: 'Annuleren'
      })
    })
  ]),
  skill: Object.freeze([
    Object.freeze({ id: 'skill.edit', label: 'Bewerken', target: ({ item, student }) => buildTarget('skill-editor.html', { student: student || item?.student, extra: { skill: item?.id } }) }),
    Object.freeze({
      id: 'skill.archive',
      label: 'Archiveren',
      execute: ({ management, item }) => management.archiveSkill(item.id),
      requiresConfirmation: true,
      confirmation: Object.freeze({
        title: 'Skill archiveren?',
        message: item => `“${item.title}” wordt uit de actieve Skills gehaald en in het archief geplaatst.`,
        confirmLabel: 'Archiveren',
        cancelLabel: 'Annuleren'
      })
    }),
    Object.freeze({
      id: 'skill.delete',
      label: 'Verwijderen',
      execute: ({ management, item }) => management.moveSkillToTrash(item.id),
      requiresConfirmation: true,
      danger: true,
      confirmation: Object.freeze({
        title: 'Skill naar prullenbak?',
        message: item => `“${item.title}” wordt uit de actieve Skills gehaald en naar de prullenbak verplaatst.`,
        confirmLabel: 'Naar prullenbak',
        cancelLabel: 'Annuleren'
      })
    })
  ])
});

export function createManagementCapabilities({ auth, management, eventTarget = window } = {}) {
  requireManagement(management);

  const activePages = new Set();

  function getAvailableForPage({ page = '', student = '' } = {}) {
    if (!canManage(auth)) return [];
    const ids = PAGE_CAPABILITIES[page] || [];
    return ids.map(id => CAPABILITIES[id]).filter(Boolean).map(capability => Object.freeze({
      ...capability,
      target: capability.target({ student })
    }));
  }

  function getActionsForItem({ entityType, item = null, student = '' } = {}) {
    if (!canManage(auth) || !item) return [];
    return (ITEM_ACTIONS[entityType] || []).map(action => Object.freeze({
      ...action,
      target: typeof action.target === 'function' ? action.target({ item, student }) : undefined,
      execute: typeof action.execute === 'function' ? () => action.execute({ management, item, student }) : undefined
    }));
  }

  function setPageActive(page, active) {
    if (!page) return false;
    if (active) activePages.add(page);
    else activePages.delete(page);
    eventTarget?.dispatchEvent?.(new CustomEvent('paco:management-visibility-change', {
      detail: { page, active: Boolean(active) }
    }));
    return Boolean(active);
  }

  function isPageActive(page) {
    return activePages.has(page);
  }

  return Object.freeze({
    getAvailableForPage,
    getActionsForItem,
    setPageActive,
    isPageActive,
    listPageCapabilityIds: page => Object.freeze([...(PAGE_CAPABILITIES[page] || [])]),
    listCapabilityIds: () => Object.freeze(Object.keys(CAPABILITIES))
  });
}
