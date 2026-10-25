import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { buildViewUrl } from '../../core/view-context.js';
import { getDashboardSubjects, getDashboardSubjectIcon, getDashboardAgendaItems } from './view-model.js';
import { listStudents } from '../students/students.js';
import { buildAvailableChallenges, listChallengeDefinitions } from '../challenges/challenge-registry.js';

export function createDashboardRuntime({ app, templateMount, chooserMount, context, documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Dashboard runtime requires an app.');
  if (!templateMount) throw new TypeError('Dashboard runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Dashboard runtime requires a navigation owner.');

  const selectedStudent = context?.student || '';
  if (!selectedStudent && !chooserMount) {
    throw new TypeError('Dashboard chooser requires a chooser mount.');
  }

  const content = documentRef.createElement('div');
  content.className = 'dashboard-page';

  function renderStartPage() {
    templateMount.replaceChildren(); chooserMount.replaceChildren();
    const page = documentRef.createElement('main'); page.className = 'dashboard-chooser-page';
    const hero = documentRef.createElement('header'); hero.className = 'dashboard-chooser-hero';
    const heroImage = documentRef.createElement('img'); heroImage.src = 'pacogo-aruba-hero.png'; heroImage.alt = 'PacoGO Aruba';
    const management = documentRef.createElement('a'); management.className = 'dashboard-management-link'; management.href = buildViewUrl('management.html').toString(); management.textContent = 'Beheer';
    management.addEventListener('click', event => { event.preventDefault(); navigate(buildViewUrl('management.html')); });
    hero.append(heroImage, management);
    const chooser = documentRef.createElement('section'); chooser.className = 'dashboard-chooser-content';
    const title = documentRef.createElement('h1'); title.className = 'dashboard-chooser-title'; title.textContent = 'Wie gaat er leren?'; chooser.appendChild(title);
    const grid = documentRef.createElement('div'); grid.className = 'dashboard-chooser-students';
    listStudents().forEach(student => {
      const target = buildViewUrl('dashboard.html', { student, mode: 'student' });
      const link = documentRef.createElement('a'); link.className = 'dashboard-chooser-student'; link.href = target.toString(); link.setAttribute('aria-label', `Dashboard van ${student}`);
      link.addEventListener('click', event => { event.preventDefault(); navigate(target); });
      const name = documentRef.createElement('span'); name.className = 'dashboard-chooser-student-name'; name.textContent = student;
      const label = documentRef.createElement('span'); label.className = 'dashboard-chooser-student-label'; label.textContent = 'Mijn lessen';
      const go = documentRef.createElement('span'); go.className = 'dashboard-chooser-go'; go.textContent = 'GO! →';
      link.append(name, label, go); grid.appendChild(link);
    });
    chooser.appendChild(grid); page.append(hero, chooser); chooserMount.appendChild(page);
  }

  function formatAgendaDate(value) {
    const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
    if (Number.isNaN(date.getTime())) return String(value || '');
    return new Intl.DateTimeFormat('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' }).format(date);
  }

  function agendaItemTarget(item) {
    if (!item.lessonId) return null;
    const target = buildViewUrl('lesson-choice.html', { student: selectedStudent, mode: context.mode });
    target.searchParams.set('lesson_id', String(item.lessonId));
    return target;
  }

  function renderAgenda(agendaItems) {
    const card = documentRef.createElement('article'); card.className = 'dashboard-card';
    const heading = documentRef.createElement('h2'); heading.textContent = 'Binnenkort'; card.appendChild(heading);
    if (!agendaItems.length) {
      const empty = documentRef.createElement('div'); empty.className = 'dashboard-state'; empty.style.marginTop = '15px'; empty.textContent = 'Geen aankomende agenda-items.'; card.appendChild(empty); return card;
    }
    const list = documentRef.createElement('div'); list.className = 'dashboard-agenda';
    agendaItems.forEach(item => {
      const target = agendaItemTarget(item); const row = documentRef.createElement(target ? 'button' : 'div');
      if (target) row.type = 'button'; row.className = `dashboard-agenda-item${target ? ' is-link' : ''}`;
      const icon = documentRef.createElement('div'); icon.className = 'agenda-icon'; icon.textContent = item.icon;
      const body = documentRef.createElement('div'); const date = documentRef.createElement('div'); date.className = 'agenda-date'; date.textContent = formatAgendaDate(item.date);
      const title = documentRef.createElement('div'); title.className = 'agenda-title'; title.textContent = item.title; body.append(date, title);
      if (item.meta) { const meta = documentRef.createElement('div'); meta.className = 'agenda-meta'; meta.textContent = item.meta; body.appendChild(meta); }
      row.append(icon, body); if (target) row.addEventListener('click', () => navigate(target)); list.appendChild(row);
    });
    card.appendChild(list); return card;
  }

  function renderChallenges(availableChallenges, lessonMap) {
    if (!availableChallenges.length) return null;
    const card = documentRef.createElement('article'); card.className = 'dashboard-card dashboard-challenges-card';
    const heading = documentRef.createElement('h2'); heading.textContent = '🏆 CHALLENGES'; card.appendChild(heading);
    const intro = documentRef.createElement('p'); intro.className = 'dashboard-challenges-intro'; intro.textContent = 'Speciale uitdagingen die je hebt vrijgespeeld met je leerresultaten.'; card.appendChild(intro);
    const grid = documentRef.createElement('div'); grid.className = 'dashboard-challenge-grid';
    availableChallenges.forEach(challenge => {
      const target = buildViewUrl(challenge.route, { student: selectedStudent, mode: context.mode });
      const item = documentRef.createElement('button'); item.type = 'button'; item.className = 'dashboard-challenge-card';
      const header = documentRef.createElement('div'); header.className = 'dashboard-challenge-header';
      const icon = documentRef.createElement('div'); icon.className = 'dashboard-challenge-icon'; icon.textContent = challenge.icon;
      const title = documentRef.createElement('h3'); title.textContent = challenge.title;
      header.append(icon, title);
      const unlocked = documentRef.createElement('div'); unlocked.className = 'dashboard-challenge-lessons';
      const unique = [];
      challenge.unlockedLessons.forEach(lesson => { const key = String(lesson.id); if (!unique.includes(key)) unique.push(key); });
      const names = unique.map(key => lessonMap.get(Number(key))).filter(Boolean).map(lesson => `${lesson.subject || 'Les'}${lesson.title ? ` — ${lesson.title}` : ''}`);
      unlocked.textContent = names.length > 1 ? `Vrijgespeeld: ${names.length} leergebieden` : `Vrijgespeeld: ${names[0] || 'jouw leerstof'}`;
      const description = documentRef.createElement('p'); description.textContent = challenge.description;
      const start = documentRef.createElement('span'); start.className = 'dashboard-challenge-start'; start.textContent = 'START MILLIONAIRE →';
      item.append(header, unlocked, description, start); item.addEventListener('click', () => navigate(target)); grid.appendChild(item);
    });
    card.appendChild(grid);
    return card;
  }

  function render(records, availableChallenges = []) {
    content.replaceChildren();
    const lessons = app.mapLessons(records);
    const lessonMap = new Map(lessons.map(lesson => [Number(lesson.id), lesson]));
    const subjects = getDashboardSubjects(lessons, selectedStudent);
    const agendaItems = getDashboardAgendaItems(app.agenda, 4);
    const main = documentRef.createElement('section'); main.className = 'dashboard-main';
    const subjectsCard = documentRef.createElement('article'); subjectsCard.className = 'dashboard-card';
    const heading = documentRef.createElement('h2'); heading.textContent = 'Mijn vakken'; subjectsCard.appendChild(heading);
    const subjectGrid = documentRef.createElement('div'); subjectGrid.className = 'subject-grid'; subjectGrid.style.marginTop = '15px';
    subjects.forEach(subject => {
      const card = documentRef.createElement('button'); card.type = 'button'; card.className = 'paco-subject-card';
      const icon = documentRef.createElement('div'); icon.className = 'subject-icon'; icon.textContent = getDashboardSubjectIcon(subject.label);
      const title = documentRef.createElement('h3'); title.textContent = subject.label;
      const count = subject.lessons.length; const meta = documentRef.createElement('p'); meta.textContent = `${count} ${count === 1 ? 'les' : 'lessen'} · Bekijk →`;
      card.append(icon, title, meta); card.addEventListener('click', () => { const target = buildViewUrl('lessons.html', { student: selectedStudent, mode: context.mode }); target.searchParams.set('subject', subject.label); navigate(target); }); subjectGrid.appendChild(card);
    });
    if (!subjectGrid.children.length) { const empty = documentRef.createElement('div'); empty.className = 'dashboard-state'; empty.style.marginTop = '15px'; empty.textContent = `Nog geen actieve lessen voor ${selectedStudent}.`; subjectsCard.appendChild(empty); }
    else subjectsCard.appendChild(subjectGrid);

    main.appendChild(renderAgenda(agendaItems));
    main.appendChild(subjectsCard);
    const challenges = renderChallenges(availableChallenges, lessonMap);
    if (challenges) main.appendChild(challenges);
    content.appendChild(main);
  }

  async function mount() {
    if (!selectedStudent) { renderStartPage(); return; }
    if (chooserMount) chooserMount.replaceChildren();
    mountPacoPageTemplate({ mount: templateMount, greeting: `Hoi ${selectedStudent}! 🐶`, title: 'Dashboard', icon: '🏠', subtitle: 'Bekijk je vakken en wat er binnenkort aankomt.', navigation: createPacoNavigation({ app, active: 'dashboard', student: selectedStudent, viewMode: context.mode, navigate }), content });
    const state = documentRef.createElement('div'); state.className = 'dashboard-state'; state.textContent = 'Dashboard laden…'; content.appendChild(state);
    try {
      const records = await app.loadLessons();
      const lessons = app.mapLessons(records).filter(lesson => !lesson.archived && !lesson.deleted);
      const unlockedChallenges = await Promise.all(listChallengeDefinitions().map(async challenge => {
        const unlockedLessonIds = await app.challengeUnlock.listUnlockedLessonIds(selectedStudent, challenge.id);
        return [challenge.id, lessons.filter(lesson => unlockedLessonIds.includes(Number(lesson.id)))];
      }));
      render(records, buildAvailableChallenges(new Map(unlockedChallenges)));
    }
    catch (error) { console.error('Dashboard page load error:', error); state.textContent = 'Het dashboard kon niet worden geladen.'; }
  }

  return Object.freeze({ mount, render, renderStartPage, content });
}
