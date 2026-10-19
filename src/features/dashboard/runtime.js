import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { buildViewUrl } from '../../core/view-context.js';
import { getDashboardSubjects, getDashboardProgress, getDashboardSubjectIcon, getDashboardAgendaItems } from './view-model.js';
import { listStudents } from '../students/students.js';

export function createDashboardRuntime({
  app,
  templateMount,
  chooserMount,
  context,
  documentRef = document,
  navigate = target => { window.location.href = target.toString(); }
} = {}) {
  if (!app) throw new TypeError('Dashboard runtime requires an app.');
  if (!templateMount || !chooserMount) throw new TypeError('Dashboard runtime requires both mounts.');

  const selectedStudent = context?.student || '';
  const content = documentRef.createElement('div');
  content.className = 'dashboard-page';

  const goChooser = () => navigate(new URL('dashboard.html', window.location.href));
  const goLessons = () => navigate(buildViewUrl('lessons.html', {
    student: selectedStudent,
    mode: context.mode
  }));

  function renderStartPage() {
    templateMount.replaceChildren();
    chooserMount.replaceChildren();

    const page = documentRef.createElement('main');
    page.className = 'dashboard-chooser-page';

    const hero = documentRef.createElement('header');
    hero.className = 'dashboard-chooser-hero';
    const heroImage = documentRef.createElement('img');
    heroImage.src = 'pacogo-aruba-hero.png';
    heroImage.alt = 'PacoGO Aruba';
    const management = documentRef.createElement('a');
    management.className = 'dashboard-management-link';
    management.href = 'management.html';
    management.textContent = 'Beheer';
    hero.append(heroImage, management);

    const chooser = documentRef.createElement('section');
    chooser.className = 'dashboard-chooser-content';
    const title = documentRef.createElement('h1');
    title.className = 'dashboard-chooser-title';
    title.textContent = 'Wie gaat er leren?';
    chooser.appendChild(title);

    const grid = documentRef.createElement('div');
    grid.className = 'dashboard-chooser-students';
    listStudents().forEach(student => {
      const link = documentRef.createElement('a');
      link.className = 'dashboard-chooser-student';
      link.href = buildViewUrl('dashboard.html', { student, mode: 'student' }).toString();
      link.setAttribute('aria-label', `Dashboard van ${student}`);

      const name = documentRef.createElement('span');
      name.className = 'dashboard-chooser-student-name';
      name.textContent = student;
      const label = documentRef.createElement('span');
      label.className = 'dashboard-chooser-student-label';
      label.textContent = 'Mijn lessen';
      const go = documentRef.createElement('span');
      go.className = 'dashboard-chooser-go';
      go.textContent = 'GO! →';
      link.append(name, label, go);
      grid.appendChild(link);
    });

    chooser.appendChild(grid);
    page.append(hero, chooser);
    chooserMount.appendChild(page);
  }

  function formatAgendaDate(value) {
    const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
    if (Number.isNaN(date.getTime())) return String(value || '');
    return new Intl.DateTimeFormat('nl-NL', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    }).format(date);
  }

  function agendaItemTarget(item) {
    if (!item.lessonId) return '';
    const target = buildViewUrl('lesson-choice.html', {
      student: selectedStudent,
      mode: context.mode
    });
    target.searchParams.set('lesson_id', String(item.lessonId));
    return target;
  }

  function renderAgenda(agendaItems) {
    const card = documentRef.createElement('article');
    card.className = 'dashboard-card';
    const heading = documentRef.createElement('h2');
    heading.textContent = 'Binnenkort';
    card.appendChild(heading);

    if (!agendaItems.length) {
      const empty = documentRef.createElement('div');
      empty.className = 'dashboard-state';
      empty.style.marginTop = '15px';
      empty.textContent = 'Geen aankomende agenda-items.';
      card.appendChild(empty);
      return card;
    }

    const list = documentRef.createElement('div');
    list.className = 'dashboard-agenda';
    agendaItems.forEach(item => {
      const target = agendaItemTarget(item);
      const row = documentRef.createElement(target ? 'button' : 'div');
      if (target) row.type = 'button';
      row.className = `dashboard-agenda-item${target ? ' is-link' : ''}`;
      const icon = documentRef.createElement('div');
      icon.className = 'agenda-icon';
      icon.textContent = item.icon;
      const body = documentRef.createElement('div');
      const date = documentRef.createElement('div');
      date.className = 'agenda-date';
      date.textContent = formatAgendaDate(item.date);
      const title = documentRef.createElement('div');
      title.className = 'agenda-title';
      title.textContent = item.title;
      body.append(date, title);
      if (item.meta) {
        const meta = documentRef.createElement('div');
        meta.className = 'agenda-meta';
        meta.textContent = item.meta;
        body.appendChild(meta);
      }
      row.append(icon, body);
      if (target) row.addEventListener('click', () => navigate(target));
      list.appendChild(row);
    });
    card.appendChild(list);
    return card;
  }

  function render(records) {
    content.replaceChildren();
    const lessons = app.mapLessons(records);
    const subjects = getDashboardSubjects(lessons, selectedStudent);
    const progressStats = getDashboardProgress(lessons, selectedStudent, app.mastery);
    const agendaItems = getDashboardAgendaItems(app.agenda, 4);

    const main = documentRef.createElement('section');
    main.className = 'dashboard-main';

    const welcome = documentRef.createElement('article');
    welcome.className = 'dashboard-card dashboard-welcome';
    const welcomeHeading = documentRef.createElement('h2');
    welcomeHeading.textContent = 'Wat wil je leren?';
    const welcomeText = documentRef.createElement('p');
    welcomeText.textContent = 'Kies hieronder een vak om direct naar je lessen te gaan.';
    welcome.append(welcomeHeading, welcomeText);
    main.appendChild(welcome);

    main.appendChild(renderAgenda(agendaItems));

    const subjectsCard = documentRef.createElement('article');
    subjectsCard.className = 'dashboard-card';
    const heading = documentRef.createElement('h2');
    heading.textContent = 'Mijn vakken';
    subjectsCard.appendChild(heading);
    const subjectGrid = documentRef.createElement('div');
    subjectGrid.className = 'subject-grid';
    subjectGrid.style.marginTop = '15px';

    subjects.forEach(subject => {
      const card = documentRef.createElement('button');
      card.type = 'button';
      card.className = 'paco-subject-card';
      const icon = documentRef.createElement('div');
      icon.className = 'subject-icon';
      icon.textContent = getDashboardSubjectIcon(subject.label);
      const title = documentRef.createElement('h3');
      title.textContent = subject.label;
      const count = subject.lessons.length;
      const meta = documentRef.createElement('p');
      meta.textContent = `${count} ${count === 1 ? 'les' : 'lessen'} · Bekijk →`;
      card.append(icon, title, meta);
      card.addEventListener('click', () => {
        const target = buildViewUrl('lessons.html', {
          student: selectedStudent,
          mode: context.mode
        });
        target.searchParams.set('subject', subject.label);
        navigate(target);
      });
      subjectGrid.appendChild(card);
    });

    if (!subjectGrid.children.length) {
      const empty = documentRef.createElement('div');
      empty.className = 'dashboard-state';
      empty.style.marginTop = '15px';
      empty.textContent = `Nog geen actieve lessen voor ${selectedStudent}.`;
      subjectsCard.appendChild(empty);
    } else {
      subjectsCard.appendChild(subjectGrid);
    }
    main.appendChild(subjectsCard);

    const subjectSummary = documentRef.createElement('article');
    subjectSummary.className = 'dashboard-card';
    const subjectCountHeading = documentRef.createElement('h3');
    subjectCountHeading.textContent = `${progressStats.subjects} ${progressStats.subjects === 1 ? 'vak' : 'vakken'}`;
    const subjectCountText = documentRef.createElement('p');
    subjectCountText.style.cssText = 'margin:7px 0 0;color:#667894';
    subjectCountText.textContent = `Actieve vakken voor ${selectedStudent}.`;
    const lessonButton = documentRef.createElement('button');
    lessonButton.type = 'button';
    lessonButton.className = 'secondary';
    lessonButton.style.marginTop = '14px';
    lessonButton.textContent = '📚 Naar mijn lessen';
    lessonButton.addEventListener('click', goLessons);
    subjectSummary.append(subjectCountHeading, subjectCountText, lessonButton);
    main.appendChild(subjectSummary);

    content.appendChild(main);
  }

  async function mount() {
    if (!selectedStudent) {
      renderStartPage();
      return;
    }

    chooserMount.replaceChildren();
    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Start',
      backAction: goChooser,
      greeting: `Hoi ${selectedStudent}! 🐶`,
      title: 'Dashboard',
      icon: '🏠',
      subtitle: 'Bekijk je lessen en zie hoe je ervoor staat.',
      navigation: createPacoNavigation({
        app,
        active: 'dashboard',
        student: selectedStudent,
        viewMode: context.mode,
        hideActive: true
      }),
      content
    });

    const state = documentRef.createElement('div');
    state.className = 'dashboard-state';
    state.textContent = 'Dashboard laden…';
    content.appendChild(state);

    try {
      await app.loadLessons();
      render(app.state.lessons);
    } catch (error) {
      console.error('Dashboard page load error:', error);
      state.textContent = 'Het dashboard kon niet worden geladen.';
    }
  }

  return Object.freeze({ mount, render, renderStartPage, content });
}
