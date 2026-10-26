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

function isMainAdministrator(auth) {
  return auth?.isMainAdministrator === true;
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
  management: Object.freeze([
    'lesson.manage', 'lesson.create',
    'learningTopic.manage', 'learningTopic.create',
    'agenda.manage', 'monthCalendar.manage',
    'skill.manage', 'skill.create', 'challenge.configure'
  ]),
  lessons: Object.freeze(['lesson.create', 'learningTopic.create']),
  'lesson-editor': Object.freeze(['lesson.create']),
  skills: Object.freeze(['skill.create']),
  'skill-editor': Object.freeze(['skill.create']),
  'learning-material': Object.freeze(['learningTopic.create']),
  'learning-material-editor': Object.freeze(['learningTopic.create'])
});

const CAPABILITIES = Object.freeze({
  'lesson.manage': Object.freeze({ id: 'lesson.manage', entityType: 'lesson', group: 'Lesbeheer', label: '📚 Les beheren', description: 'Bekijk en beheer de lessen van de actieve leerling.', requiresStudent: true, target: ({ student }) => buildTarget('lessons.html', { student }) }),
  'lesson.create': Object.freeze({ id: 'lesson.create', entityType: 'lesson', group: 'Lesbeheer', label: '➕ Les maken', description: 'Maak een nieuwe les voor de actieve leerling.', requiresStudent: true, target: ({ student }) => buildTarget('lesson-editor.html', { student }) }),
  'learningTopic.manage': Object.freeze({ id: 'learningTopic.manage', entityType: 'learningTopic', group: 'Leerstofbeheer', label: '🧠 Leerstof beheren', description: 'Bekijk de leerstof per vak en onderwerp.', requiresStudent: true, target: ({ student }) => buildTarget('lessons.html', { student }) }),
  'learningTopic.create': Object.freeze({ id: 'learningTopic.create', entityType: 'learningTopic', group: 'Leerstofbeheer', label: '➕ Leerstof maken', description: 'Open de centrale leerstofeditor.', requiresStudent: true, target: ({ student }) => buildTarget('learning-material-editor.html', { student }) }),
  'agenda.manage': Object.freeze({ id: 'agenda.manage', entityType: 'agenda', group: 'Agenda', label: '📅 Agenda', description: 'Bekijk en beheer de agenda van de actieve leerling.', requiresStudent: true, target: ({ student }) => buildTarget('agenda.html', { student }) }),
  'monthCalendar.manage': Object.freeze({ id: 'monthCalendar.manage', entityType: 'monthCalendar', group: 'Agenda', label: '🖨️ Maandkalender', description: 'Open de maandkalender van de actieve leerling.', requiresStudent: true, target: ({ student }) => buildTarget('month-calendar.html', { student }) }),
  'skill.manage': Object.freeze({ id: 'skill.manage', entityType: 'skill', group: 'Skillbeheer', label: '🧮 Skills beheren', description: 'Beheer Skills en bepaal per leerling welke Skills beschikbaar zijn.', requiresStudent: true, authorize: isMainAdministrator, target: ({ student }) => buildTarget('skills.html', { student }) }),
  'skill.create': Object.freeze({ id: 'skill.create', entityType: 'skill', group: 'Skillbeheer', label: '➕ Skill maken', description: 'Kies welk type Skill je wilt maken.', requiresStudent: false, authorize: isMainAdministrator, target: ({ student }) => buildTarget('skill-create.html', { student }) }),
  'challenge.configure': Object.freeze({ id: 'challenge.configure', entityType: 'challenge', group: 'Challengebeheer', label: '🎯 Challenge-instellingen', description: 'Beheer centraal de Challenge-configuratie.', requiresStudent: false, authorize: isMainAdministrator, target: () => buildTarget('challenge-settings.html') })
});

const ITEM_ACTIONS = Object.freeze({
  lesson: Object.freeze([
    Object.freeze({ id: 'lesson.edit', label: 'Bewerken', target: ({ item, student }) => buildTarget('lesson-editor.html', { student: student || item?.student, extra: { lesson_id: item?.id } }) }),
    Object.freeze({ id: 'lesson.archive', label: 'Archiveren', execute: ({ management, item }) => management.archiveLesson(item.id), requiresConfirmation: true, confirmation: Object.freeze({ title: 'Les archiveren?', message: item => `“${item.title}” wordt uit de actieve lessen gehaald en in het archief geplaatst.`, confirmLabel: 'Archiveren', cancelLabel: 'Annuleren' }) }),
    Object.freeze({ id: 'lesson.delete', label: 'Verwijderen', execute: ({ management, item }) => management.moveToTrash(item.id), requiresConfirmation: true, danger: true, confirmation: Object.freeze({ title: 'Les naar prullenbak?', message: item => `“${item.title}” wordt uit de actieve lessen gehaald en naar de prullenbak verplaatst.`, confirmLabel: 'Naar prullenbak', cancelLabel: 'Annuleren' }) })
  ]),
  learningTopic: Object.freeze([
    Object.freeze({ id: 'learningTopic.edit', label: 'Bewerken', target: ({ item, student }) => buildTarget('learning-material-editor.html', { student: student || item?.student, extra: { topic_id: item?.id } }) }),
    Object.freeze({ id: 'learningTopic.archive', label: 'Archiveren', execute: ({ management, item }) => management.archiveLearningTopic(item.id), requiresConfirmation: true, confirmation: Object.freeze({ title: 'Leerstof archiveren?', message: item => `“${item.subject}${item.subvak ? ` · ${item.subvak}` : ''}” wordt uit de actieve leerstof gehaald en in het archief geplaatst.`, confirmLabel: 'Archiveren', cancelLabel: 'Annuleren' }) }),
    Object.freeze({ id: 'learningTopic.delete', label: 'Verwijderen', execute: ({ management, item }) => management.moveLearningTopicToTrash(item.id), requiresConfirmation: true, danger: true, confirmation: Object.freeze({ title: 'Leerstof naar prullenbak?', message: item => `“${item.subject}${item.subvak ? ` · ${item.subvak}` : ''}” wordt uit de actieve leerstof gehaald en naar de prullenbak verplaatst.`, confirmLabel: 'Naar prullenbak', cancelLabel: 'Annuleren' }) })
  ]),
  skill: Object.freeze([
    Object.freeze({ id: 'skill.edit', label: 'Bewerken', target: ({ item, student }) => buildTarget('skill-editor.html', { student: student || item?.student, extra: { skill: item?.id } }) }),
    Object.freeze({ id: 'skill.archive', label: 'Archiveren', execute: ({ management, item }) => management.archiveSkill(item.id), requiresConfirmation: true, confirmation: Object.freeze({ title: 'Skill archiveren?', message: item => `“${item.title}” wordt uit de actieve Skills gehaald en in het archief geplaatst.`, confirmLabel: 'Archiveren', cancelLabel: 'Annuleren' }) }),
    Object.freeze({ id: 'skill.delete', label: 'Verwijderen', execute: ({ management, item }) => management.moveSkillToTrash(item.id), requiresConfirmation: true, danger: true, confirmation: Object.freeze({ title: 'Skill naar prullenbak?', message: item => `“${item.title}” wordt uit de actieve Skills gehaald en naar de prullenbak verplaatst.`, confirmLabel: 'Naar prullenbak', cancelLabel: 'Annuleren' }) })
  ])
});

export function createManagementCapabilities({ auth, management, eventTarget = globalThis } = {}) {
  requireManagement(management);
  const activePages = new Set();

  function isAuthorized(capability) {
    return canManage(auth) && (!capability.authorize || capability.authorize(auth));
  }

  function getAvailableForPage({ page = '', student = '' } = {}) {
    const ids = PAGE_CAPABILITIES[page] || [];
    return ids.map(id => CAPABILITIES[id]).filter(Boolean).filter(isAuthorized).filter(capability => !capability.requiresStudent || Boolean(student)).map(capability => Object.freeze({ ...capability, target: capability.target({ student }) }));
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
    if (active) activePages.add(page); else activePages.delete(page);
    eventTarget?.dispatchEvent?.(new CustomEvent('paco:management-visibility-change', { detail: { page, active: Boolean(active) } }));
    return Boolean(active);
  }

  return Object.freeze({
    getAvailableForPage,
    getActionsForItem,
    setPageActive,
    isPageActive: page => activePages.has(page),
    listPageCapabilityIds: page => Object.freeze([...(PAGE_CAPABILITIES[page] || [])]),
    listCapabilityIds: () => Object.freeze(Object.keys(CAPABILITIES))
  });
}
