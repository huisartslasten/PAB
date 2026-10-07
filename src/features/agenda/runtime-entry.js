import { createAgendaRuntime } from './runtime.js';
import { createAgendaCustomActions } from './custom-actions.js';
import { createAgendaImportRuntime } from './import-runtime.js';

const REQUIRED = ['storage', 'currentStudent', 'lessons', 'demoItems', 'db'];

function requireRuntimeHost(host) {
  if (!host || typeof host !== 'object') throw new Error('An agenda runtime host is required.');
  for (const key of REQUIRED) {
    if (!(key in host)) throw new Error(`The agenda runtime host is missing: ${key}.`);
  }
}

export function createAgendaRuntimeEntry(host = {}) {
  requireRuntimeHost(host);
  let runtime;
  const actions = createAgendaCustomActions({
    storage: host.storage,
    documentRef: host.documentRef,
    currentStudent: host.currentStudent,
    onChanged: () => runtime?.render()
  });
  const imports = createAgendaImportRuntime({
    storage: host.storage,
    documentRef: host.documentRef,
    db: host.db,
    currentStudent: host.currentStudent,
    setCurrentStudent: host.setCurrentStudent,
    lessonMatchHtml: host.onLessonMatch,
    now: host.now
  });
  runtime = createAgendaRuntime({ ...host, onEdit: actions.editAgendaItem, onDelete: actions.deleteAgendaItem });
  const read = runtime.readService;
  return Object.freeze({
    runtime,
    imports,
    showAgenda: () => runtime.show(),
    renderAgenda: () => runtime.render(),
    agendaMoveWeek: delta => runtime.moveWeek(delta),
    agendaGoToday: () => runtime.goToday(),
    agendaSetWeek: date => runtime.setWeek(date),
    agendaGetCurrentWeekStart: () => runtime.getCurrentWeekStart(),
    buildAgendaItemsForRender: student => read.buildAgendaItemsForRender(student),
    getCustomAgendaItems: student => read.getCustomAgendaItems(student),
    saveCustomAgendaItems: (items, student = host.currentStudent()) => read.customStorage.saveItems(items, student),
    editAgendaItem: actions.editAgendaItem,
    closeAgendaEditModal: actions.closeAgendaEditModal,
    saveAgendaEditModal: actions.saveAgendaEditModal,
    deleteAgendaItem: actions.deleteAgendaItem,
    showAgendaImport: imports.showImport,
    setAgendaImportMode: imports.setMode,
    handleAgendaMediaFile: imports.handleMediaFile,
    analyzeAgendaImage: imports.analyzeImage,
    analyzeAgendaVideo: imports.analyzeVideo,
    setManualAgendaRange: imports.setManualRange,
    addManualAgendaItem: imports.addManualItem,
    saveAgendaImportReview: imports.saveReview,
    clearAgendaImportReview: imports.clearReview,
    toggleAgendaReviewMeta: imports.toggleMeta,
    toggleAllAgendaReviewMeta: imports.toggleAllMeta,
    getTestCalendar: () => read.getTestCalendar(),
    saveTestCalendar: items => read.testCalendar.save(items),
    normalizeAgendaDate: read.normalizeAgendaDate
  });
}

export function installAgendaRuntimeEntry(host, target = globalThis) {
  requireRuntimeHost(host);
  if (!target || typeof target !== 'object') throw new Error('A runtime target is required.');
  const entry = createAgendaRuntimeEntry(host);
  target.pacoGOAgendaRuntime = entry;
  target.showAgenda = entry.showAgenda;
  target.renderAgenda = entry.renderAgenda;
  target.agendaMoveWeek = entry.agendaMoveWeek;
  target.agendaGoToday = entry.agendaGoToday;
  target.agendaSetWeek = entry.agendaSetWeek;
  target.agendaGetCurrentWeekStart = entry.agendaGetCurrentWeekStart;
  target.buildAgendaItemsForRender = entry.buildAgendaItemsForRender;
  target.getCustomAgendaItems = entry.getCustomAgendaItems;
  target.saveCustomAgendaItems = entry.saveCustomAgendaItems;
  target.editAgendaItem = entry.editAgendaItem;
  target.closeAgendaEditModal = entry.closeAgendaEditModal;
  target.saveAgendaEditModal = entry.saveAgendaEditModal;
  target.deleteAgendaItem = entry.deleteAgendaItem;
  target.showAgendaImport = entry.showAgendaImport;
  target.setAgendaImportMode = entry.setAgendaImportMode;
  target.handleAgendaMediaFile = entry.handleAgendaMediaFile;
  target.analyzeAgendaImage = entry.analyzeAgendaImage;
  target.analyzeAgendaVideo = entry.analyzeAgendaVideo;
  target.setManualAgendaRange = entry.setManualAgendaRange;
  target.addManualAgendaItem = entry.addManualAgendaItem;
  target.saveAgendaImportReview = entry.saveAgendaImportReview;
  target.clearAgendaImportReview = entry.clearAgendaImportReview;
  target.toggleAgendaReviewMeta = entry.toggleAgendaReviewMeta;
  target.toggleAllAgendaReviewMeta = entry.toggleAllAgendaReviewMeta;
  target.getTestCalendar = entry.getTestCalendar;
  target.saveTestCalendar = entry.saveTestCalendar;
  target.normalizeAgendaDate = entry.normalizeAgendaDate;
  return entry;
}
