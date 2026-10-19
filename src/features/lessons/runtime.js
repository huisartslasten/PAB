import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { confirmPacoAction } from '../../components/confirm-dialog.js';
import { applyViewContext, buildViewUrl } from '../../core/view-context.js';
import { attachLessonDragSorting } from './lesson-drag-sort.js';
import { getLessonSubjectGroups, getLessonSubjectIcon, getLessonSubvakGroups, normalizeLessonSubject } from './list-view-model.js';

export function createLessonsRuntime({ app, templateMount, context, selectedSubject = '', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Lessons runtime requires an app.');
  if (!templateMount) throw new TypeError('Lessons runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Lessons runtime requires a navigation owner.');

  const selectedStudent = context?.student || '';
  const content = documentRef.createElement('div');
  content.className = 'lessons-page paco-template-card';
  const state = documentRef.createElement('div');
  state.className = 'lessons-state';
  state.textContent = 'Lessen laden…';
  const actionState = documentRef.createElement('div');
  actionState.className = 'lessons-state';
  actionState.hidden = true;
  let currentRecords = [];

  const buildLessonsUrl = () => buildViewUrl('lessons.html', { student: selectedStudent, mode: context?.mode });
  const goHome = () => navigate(buildViewUrl('dashboard.html', { student: selectedStudent, mode: context?.mode }));
  const goLessons = () => navigate(buildLessonsUrl());

  function showActionNotice(message) { actionState.textContent = message; actionState.hidden = false; }

  function lessonTarget(lesson) {
    const target = buildViewUrl('lesson-choice.html', { student: selectedStudent, mode: context?.mode });
    target.searchParams.set('lesson_id', String(lesson.id));
    return target;
  }

  function editLesson(lesson) {
    const target = buildViewUrl('lesson-editor.html', { student: selectedStudent, mode: context?.mode });
    target.searchParams.set('lesson_id', String(lesson.id));
    navigate(target);
  }

  function editLearning(lesson) {
    const target = buildViewUrl('lesson-learning-editor.html', { student: selectedStudent, mode: 'management' });
    target.searchParams.set('lesson_id', String(lesson.id));
    navigate(target);
  }

  async function archiveLesson(lesson) {
    const confirmed = await confirmPacoAction({ title: 'Les archiveren?', message: `“${lesson.title}” wordt uit de actieve lessen van ${selectedStudent} gehaald en in het archief geplaatst.`, confirmLabel: 'Archiveren', cancelLabel: 'Annuleren' });
    if (!confirmed) return;
    try { await app.management.archiveLesson(lesson.id); showActionNotice(`“${lesson.title}” is gearchiveerd en uit de actieve lessen verwijderd.`); await render(app.state.lessons); }
    catch (error) { console.error('Lesson archive error:', error); showActionNotice(error?.message || 'De les kon niet worden gearchiveerd.'); }
  }

  async function moveLessonToTrash(lesson) {
    const confirmed = await confirmPacoAction({ title: 'Les naar prullenbak?', message: `“${lesson.title}” wordt uit de actieve lessen van ${selectedStudent} gehaald en naar de prullenbak verplaatst.`, confirmLabel: 'Naar prullenbak', cancelLabel: 'Annuleren' });
    if (!confirmed) return;
    try { await app.management.moveToTrash(lesson.id); showActionNotice(`“${lesson.title}” staat in de prullenbak en is uit de actieve lessen verwijderd.`); await render(app.state.lessons); }
    catch (error) { console.error('Lesson trash error:', error); showActionNotice(error?.message || 'De les kon niet naar de prullenbak worden verplaatst.'); }
  }

  function renderLessonCard(lesson) {
    const wrap = documentRef.createElement('div');
    wrap.className = 'paco-lesson-card lesson-card';
    wrap.draggable = true;
    wrap.dataset.lessonId = String(lesson.id);
    const card = documentRef.createElement('a');
    card.href = lessonTarget(lesson).toString();
    card.style.display = 'block'; card.style.color = 'inherit'; card.style.textDecoration = 'none';
    const heading = documentRef.createElement('h2'); heading.textContent = lesson.title || 'Naamloze les';
    const subvak = documentRef.createElement('p'); subvak.textContent = lesson.subvak || 'Les';
    card.append(heading, subvak); wrap.appendChild(card);
    const view = documentRef.createElement('button'); view.type = 'button'; view.className = 'lesson-view-button'; view.textContent = 'Bekijken';
    view.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); navigate(lessonTarget(lesson)); });
    wrap.appendChild(view);
    if (context?.isManagement) {
      const actions = documentRef.createElement('div'); actions.className = 'lesson-management-actions';
      const edit = documentRef.createElement('button'); edit.type = 'button'; edit.textContent = 'Bewerken'; edit.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); editLesson(lesson); });
      const learning = documentRef.createElement('button'); learning.type = 'button'; learning.textContent = 'Leerstof'; learning.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); editLearning(lesson); });
      const archive = documentRef.createElement('button'); archive.type = 'button'; archive.textContent = 'Archiveren'; archive.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); archiveLesson(lesson); });
      const trash = documentRef.createElement('button'); trash.type = 'button'; trash.className = 'danger'; trash.textContent = 'Verwijderen'; trash.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); moveLessonToTrash(lesson); });
      actions.append(edit, learning, archive, trash); wrap.appendChild(actions);
    }
    return wrap;
  }

  async function render(records) {
    currentRecords = records;
    const grouped = getLessonSubjectGroups(app.mapLessons(records), selectedStudent);
    content.replaceChildren(actionState);
    if (!selectedSubject) {
      const heading = documentRef.createElement('h2'); heading.className = 'section-title'; heading.textContent = 'Kies een vak';
      const grid = documentRef.createElement('div'); grid.className = 'subject-grid';
      grouped.forEach(subject => {
        const card = documentRef.createElement('button'); card.type = 'button'; card.className = 'paco-subject-card';
        card.innerHTML = `<div class="subject-icon">${getLessonSubjectIcon(subject.label)}</div><h2>${subject.label}</h2><p>${subject.lessons.length} ${subject.lessons.length === 1 ? 'les' : 'lessen'}</p>`;
        card.addEventListener('click', () => { const url = buildLessonsUrl(); url.searchParams.set('subject', subject.label); navigate(url); });
        grid.appendChild(card);
      });
      content.append(heading, grid);
      if (!grid.children.length) { const empty = documentRef.createElement('div'); empty.className = 'lessons-state'; empty.textContent = `Geen actieve lessen gevonden voor ${selectedStudent}.`; content.appendChild(empty); }
      return;
    }
    const key = normalizeLessonSubject(selectedSubject);
    const subject = grouped.find(candidate => candidate.key === key);
    const lessonsForSubject = subject?.lessons || [];
    const orderedLessons = await app.lessonOrder.getOrderedLessons(lessonsForSubject, selectedStudent, subject?.label || selectedSubject);
    const header = documentRef.createElement('div'); header.className = 'lessons-toolbar';
    const heading = documentRef.createElement('h2'); heading.className = 'section-title'; heading.textContent = subject?.label || selectedSubject;
    const back = documentRef.createElement('button'); back.type = 'button'; back.className = 'back-subjects'; back.textContent = '← Alle vakken'; back.addEventListener('click', goLessons);
    header.append(heading, back); content.append(header);
    const groups = getLessonSubvakGroups(orderedLessons);
    groups.forEach(group => {
      const section = documentRef.createElement('section'); section.className = 'subvak-section';
      const title = documentRef.createElement('h3'); title.className = `subvak-title${group.key === '__geen_subvak__' ? ' muted' : ''}`; title.textContent = `${group.key === '__geen_subvak__' ? '📚' : '📁'} ${group.label}`;
      const grid = documentRef.createElement('div'); grid.className = 'lesson-grid'; group.lessons.forEach(lesson => grid.appendChild(renderLessonCard(lesson)));
      section.append(title, grid); content.appendChild(section);
    });
    if (!groups.length) { const empty = documentRef.createElement('div'); empty.className = 'lessons-state'; empty.textContent = 'Geen actieve lessen gevonden in dit vak.'; content.appendChild(empty); return; }
    const lessonById = new Map(orderedLessons.map(lesson => [Number(lesson.id), lesson]));
    attachLessonDragSorting(content, {
      selector: '.lesson-card[data-lesson-id][draggable="true"]',
      onOrderChange: async ({ orderedIds }) => {
        const reorderedLessons = orderedIds.map(id => lessonById.get(id)).filter(Boolean);
        await (context?.isManagement ? app.management.saveLessonOrder(subject?.label || selectedSubject, reorderedLessons) : app.lessonOrder.writeOrder(selectedStudent, subject?.label || selectedSubject, reorderedLessons, { persistRemote: false }));
      },
      onError: async error => { console.error('Lessons reorder error:', error); await render(records); }
    });
  }

  async function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Dashboard',
      backAction: goHome,
      greeting: `Hoi ${selectedStudent}! 🐶`,
      title: 'Mijn lessen',
      icon: '📚',
      subtitle: context?.isManagement ? 'Beheerweergave — je kunt hier leerlinggebonden lessen beheren.' : 'Kies een vak en open daarna de les die je wilt doen.',
      navigation: createPacoNavigation({ app, active: 'lessons', student: selectedStudent, viewMode: context?.mode, includeManagement: true }),
      content
    });
    content.appendChild(state);
    try {
      if (!selectedStudent) throw new Error('Geen leerling geselecteerd.');
      await app.initializeSession();
      if (context?.isManagement) applyViewContext(context, { canManage: app.auth.isParent });
      else applyViewContext(context);
      const records = await app.loadLessons();
      state.remove();
      await render(records);
    } catch (error) {
      console.error('Lessons page load error:', error);
      state.textContent = error.message === 'Geen leerling geselecteerd.' ? 'Selecteer eerst een leerling vanuit Beheer.' : 'De lessen konden niet worden geladen.';
    }
  }

  return Object.freeze({ mount, render, content, getRecords: () => currentRecords, goHome, goLessons });
}
