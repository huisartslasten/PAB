import { createPacoDropdown, mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { createPacoTile, createPacoTileGrid } from '../../components/paco-tile.js';
import { buildViewUrl } from '../../core/view-context.js';
import { createGameResultService } from '../../services/game-result-service.js';
import { appendContentManagementActions, createContentManagementActions } from '../management/content-management-actions.js';
import { listStudents } from '../students/students.js';
import { createMathSession } from './math/math-domain.js';
import { DEFAULT_SKILL_DURATION_SECONDS, SKILL_DURATIONS_SECONDS } from './skills-registry.js';

function formatDuration(seconds) { return `${Math.round(seconds / 60)} min`; }

export function createSkillsRuntime({ app, templateMount, context, skillId = '', durationSeconds = DEFAULT_SKILL_DURATION_SECONDS, documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Skills runtime requires an app.');
  if (!templateMount) throw new TypeError('Skills runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Skills runtime requires a navigation owner.');

  const student = context?.student || '';
  const content = documentRef.createElement('div');
  const resultService = createGameResultService(app.db);
  const managementEventTarget = documentRef.defaultView || globalThis;
  let timerId = null; let session = null; let finished = false; let highScore = null; let assignments = []; let skills = [];
  let managementVisible = app.managementCapabilities?.isPageActive('skills') === true;
  let sessionReady = false;

  const goSkills = () => navigate(buildViewUrl('skills.html', { student, mode: context?.mode }));
  const openSkill = (id, duration = DEFAULT_SKILL_DURATION_SECONDS) => { const target = buildViewUrl('skills.html', { student, mode: context?.mode }); target.searchParams.set('skill', id); target.searchParams.set('duration', String(duration)); return navigate(target); };
  function stopTimer() { if (timerId != null) window.clearInterval(timerId); timerId = null; }
  function isEnabled(skill) { return assignments.some(item => item.skillId === skill.id && item.enabled); }
  function enabledMixedProfiles(skill) { const enabled = new Set(assignments.filter(item => item.enabled).map(item => item.skillId)); return (skill.definition?.profileIds || []).map(id => skills.find(item => item.id === id)).filter(Boolean).filter(item => enabled.has(item.id)); }
  async function finishSkill() { if (finished || !session) return; finished = true; stopTimer(); if (student) { try { await resultService.saveResult({ gameKey: `math-skill-${skillId}`, student, score: session.score }); highScore = await resultService.getHighScore({ gameKey: `math-skill-${skillId}`, student }); } catch (error) { console.error('Skill result persistence error:', error); } } renderResult(); }

  function renderMenu() {
    content.replaceChildren();
    const card = documentRef.createElement('section');
    card.className = 'paco-template-card';
    const heading = documentRef.createElement('h2');
    heading.textContent = 'Rekenen';
    const grid = createPacoTileGrid({ documentRef, className: 'skills-tile-grid' });
    skills.filter(item => item.enabled && isEnabled(item)).forEach(skill => {
      grid.appendChild(createPacoTile({
        documentRef,
        title: skill.title,
        description: skill.description,
        icon: '⚡',
        actionLabel: 'Start →',
        onActivate: () => openSkill(skill.id)
      }));
    });
    if (!grid.children.length) {
      const message = documentRef.createElement('p');
      message.textContent = 'Er zijn nog geen Skills voor deze leerling beschikbaar.';
      card.append(heading, message);
    } else {
      card.append(heading, grid);
    }
    content.appendChild(card);
  }

  function renderActivity() {
    content.replaceChildren();
    const skill = skills.find(item => item.id === skillId);
    if (!skill) return renderMenu();
    const card = documentRef.createElement('section'); card.className = 'paco-template-card';
    const controls = documentRef.createElement('div');
    const durationLabel = documentRef.createElement('label'); durationLabel.textContent = 'Tijd';
    const dropdown = createPacoDropdown({ options: SKILL_DURATIONS_SECONDS.map(seconds => ({ value: String(seconds), label: formatDuration(seconds) })), value: String(durationSeconds), onChange: value => openSkill(skill.id, Number(value)) });
    durationLabel.appendChild(dropdown.element); controls.appendChild(durationLabel); card.appendChild(controls);
    const stats = documentRef.createElement('p'); const time = documentRef.createElement('strong'); const score = documentRef.createElement('strong'); stats.append('Tijd: ', time, ' · Score: ', score); card.appendChild(stats);
    const question = documentRef.createElement('div'); const prompt = documentRef.createElement('h2'); question.appendChild(prompt);
    const form = documentRef.createElement('form'); const input = documentRef.createElement('input'); input.type = 'number'; input.inputMode = 'numeric'; input.autocomplete = 'off'; input.className = 'paco-template-input-lg'; input.setAttribute('aria-label', 'Antwoord');
    const submit = documentRef.createElement('button'); submit.type = 'submit'; submit.className = 'success'; submit.textContent = 'OK'; form.append(input, submit); question.appendChild(form); card.appendChild(question);
    const best = documentRef.createElement('p'); best.className = 'small'; best.textContent = highScore == null ? 'Beste score: —' : `Beste score: ${highScore}`; card.appendChild(best);
    const startedAt = Date.now();
    function update() { const elapsed = Math.max(0, Math.floor((Date.now() - startedAt) / 1000)); const remaining = Math.max(0, session.durationSeconds - elapsed); time.textContent = `${remaining}s`; score.textContent = String(session.score); if (remaining <= 0) void finishSkill(); }
    function renderQuestion() { prompt.textContent = session.question.text; }
    form.addEventListener('submit', event => { event.preventDefault(); if (finished) return; const result = session.answer(input.value); if (result.answered) session.nextQuestion(); input.value = ''; renderQuestion(); update(); input.focus(); });
    renderQuestion(); update(); timerId = window.setInterval(update, 250); input.focus(); content.appendChild(card);
  }

  function renderResult() {
    content.replaceChildren();
    const skill = skills.find(item => item.id === skillId);
    const card = documentRef.createElement('section'); card.className = 'paco-template-card';
    const heading = documentRef.createElement('h2'); heading.textContent = 'Klaar!'; const score = documentRef.createElement('h2'); score.textContent = String(session.score); const label = documentRef.createElement('p'); label.textContent = 'goede antwoorden'; card.append(heading, score, label);
    if (highScore != null) { const best = documentRef.createElement('p'); best.textContent = `Beste score: ${highScore}`; card.appendChild(best); }
    const retry = documentRef.createElement('button'); retry.type = 'button'; retry.className = 'success'; retry.textContent = 'Opnieuw'; retry.addEventListener('click', () => openSkill(skill.id, session.durationSeconds));
    const back = documentRef.createElement('button'); back.type = 'button'; back.className = 'secondary'; back.textContent = 'Terug naar Skills'; back.addEventListener('click', goSkills); card.append(retry, back); content.appendChild(card);
  }

  function renderSkillManagementCard(skill) {
    const card = documentRef.createElement('article');
    card.className = 'skill-management-card paco-template-card';
    const body = documentRef.createElement('div');
    body.className = 'skill-management-card-body';
    const heading = documentRef.createElement('h3'); heading.textContent = skill.title;
    const description = documentRef.createElement('p'); description.textContent = skill.description || 'Geen beschrijving.';
    const status = documentRef.createElement('span'); status.className = `skill-management-status${skill.enabled ? '' : ' is-disabled'}`; status.textContent = skill.enabled ? 'Actief' : 'Uitgeschakeld';
    body.append(heading, description, status);
    const actions = createContentManagementActions({
      app,
      entityType: 'skill',
      item: skill,
      student,
      navigate,
      onChanged: refreshManagement
    });
    appendContentManagementActions({ documentRef, container: card, actions });
    card.insertBefore(body, card.lastElementChild);
    return card;
  }

  async function renderManagementAssignment() {
    if (!student) return null;
    const assignmentsForStudent = await app.skillConfiguration.listForStudent(student);
    const enabledIds = new Set(assignmentsForStudent.filter(item => item.enabled).map(item => item.skillId));
    const section = documentRef.createElement('section'); section.className = 'paco-template-card skill-config-assignment';
    const heading = documentRef.createElement('h2'); heading.textContent = `Beschikbaar voor ${student}`;
    const subtitle = documentRef.createElement('p'); subtitle.textContent = 'Kies welke actieve Skills deze leerling kan oefenen.'; section.append(heading, subtitle);
    const choices = documentRef.createElement('div'); choices.className = 'skill-config-choices';
    skills.filter(skill => !skill.archivedAt && !skill.trashedAt).forEach(skill => {
      const wrapper = documentRef.createElement('label'); wrapper.className = 'skill-config-choice';
      const input = documentRef.createElement('input'); input.type = 'checkbox'; input.checked = enabledIds.has(skill.id); input.dataset.skillId = skill.id;
      const text = documentRef.createElement('span'); text.textContent = `${skill.category || 'Overig'} · ${skill.title}`;
      wrapper.append(input, text); choices.appendChild(wrapper);
    });
    section.appendChild(choices);
    const actions = documentRef.createElement('div'); actions.className = 'skill-config-actions';
    const save = documentRef.createElement('button'); save.type = 'button'; save.className = 'success'; save.textContent = 'Skills opslaan';
    const status = documentRef.createElement('span'); status.className = 'skill-config-status'; actions.append(save, status); section.appendChild(actions);
    save.addEventListener('click', async () => {
      save.disabled = true; status.textContent = 'Opslaan…';
      try {
        const nextAssignments = [...choices.querySelectorAll('[data-skill-id]')].map(input => ({ skillId: input.dataset.skillId, enabled: input.checked }));
        const saved = await app.skillConfiguration.saveForStudent(student, nextAssignments);
        status.textContent = `${saved.filter(item => item.enabled).length} Skills actief voor ${student}.`;
      } catch (error) { console.error('Skill configuration save error:', error); status.textContent = error?.message || 'Opslaan mislukt.'; }
      finally { save.disabled = false; }
    });
    return section;
  }

  async function refreshManagement() {
    skills = await app.skillDefinitions.list({ category: '' });
    renderManagement();
  }

  async function renderManagement() {
    content.replaceChildren();
    if (!app.auth.isMainAdministrator) {
      const section = documentRef.createElement('section'); section.className = 'paco-template-card';
      const title = documentRef.createElement('h2'); title.textContent = 'Geen toegang';
      const message = documentRef.createElement('p'); message.textContent = 'Alleen de hoofdbeheerder kan Skills beheren.';
      section.append(title, message); content.appendChild(section); return;
    }

    const catalog = documentRef.createElement('section'); catalog.className = 'paco-template-card skill-management-catalog';
    const toolbar = documentRef.createElement('div'); toolbar.className = 'skill-management-toolbar';
    const title = documentRef.createElement('div'); const heading = documentRef.createElement('h2'); heading.textContent = 'Skills'; const subtitle = documentRef.createElement('p'); subtitle.textContent = 'Beheer Skills met dezelfde centrale beheeracties als lessen en leerstof.'; title.append(heading, subtitle);
    const create = documentRef.createElement('button'); create.type = 'button'; create.className = 'success'; create.textContent = '➕ Skill maken'; create.addEventListener('click', () => {
      const capability = app.managementCapabilities.getAvailableForPage({ page: 'skills', student }).find(item => item.id === 'skill.create');
      if (capability?.target) navigate(capability.target, { managementCapability: capability.id });
    });
    toolbar.append(title, create); catalog.appendChild(toolbar);

    const groups = new Map();
    skills.filter(skill => !skill.archivedAt && !skill.trashedAt).forEach(skill => { const category = skill.category || 'other'; if (!groups.has(category)) groups.set(category, []); groups.get(category).push(skill); });
    if (!groups.size) { const empty = documentRef.createElement('div'); empty.className = 'management-state'; empty.textContent = 'Er zijn nog geen actieve Skills.'; catalog.appendChild(empty); }
    else groups.forEach((items, category) => {
      const group = documentRef.createElement('section'); group.className = 'skill-management-group'; const groupTitle = documentRef.createElement('h3'); groupTitle.textContent = category || 'Overig';
      const grid = documentRef.createElement('div'); grid.className = 'skill-management-grid'; items.forEach(skill => grid.appendChild(renderSkillManagementCard(skill))); group.append(groupTitle, grid); catalog.appendChild(group);
    });
    content.appendChild(catalog);
    const assignment = await renderManagementAssignment();
    if (assignment) content.appendChild(assignment);
  }

  async function renderStudentExperience() {
    stopTimer();
    session = null;
    finished = false;
    highScore = null;
    if (!student) {
      skills = await app.skillDefinitions.list({ category: 'math' });
      renderMenu();
      return;
    }
    skills = await app.skillDefinitions.list({ category: 'math' });
    assignments = await app.skillConfiguration.listForStudent(student);
    const selected = skills.find(item => item.id === skillId);
    if (!selected || !isEnabled(selected)) { renderMenu(); return; }
    highScore = await resultService.getHighScore({ gameKey: `math-skill-${selected.id}`, student }).catch(() => null);
    if (selected.definition?.kind === 'mixed') {
      const mixedProfiles = enabledMixedProfiles(selected);
      if (!mixedProfiles.length) { content.textContent = 'Voor Gemengd zijn nog geen rekenprofielen geselecteerd.'; return; }
      session = createMathSession({ durationSeconds: Number(durationSeconds), mixedProfiles });
    } else {
      session = createMathSession({ durationSeconds: Number(durationSeconds), profile: selected });
    }
    renderActivity();
  }

  async function refreshCurrentView() {
    if (!sessionReady) return;
    if (managementVisible) {
      stopTimer();
      session = null;
      finished = false;
      await refreshManagement();
      return;
    }
    await renderStudentExperience();
  }

  const onManagementVisibilityChange = event => {
    if (event?.detail?.page !== 'skills') return;
    managementVisible = Boolean(event.detail.active);
    void refreshCurrentView().catch(error => {
      console.error('Skills management visibility error:', error);
      content.textContent = 'De Skills konden niet worden geladen.';
    });
  };

  async function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
      greeting: `Hoi ${student}! 🐶`,
      title: 'Skills',
      icon: '⚡',
      subtitle: 'Zelfstandig oefenen, altijd beschikbaar.',
      navigation: createPacoNavigation({ app, active: 'skills', student, viewMode: context?.mode, includeManagement: true, navigate }),
      content
    });

    managementEventTarget.addEventListener?.('paco:management-visibility-change', onManagementVisibilityChange);

    try {
      await app.initializeSession();
      sessionReady = true;
      await refreshCurrentView();
    } catch (error) {
      console.error('Skills page load error:', error);
      content.textContent = 'De Skills konden niet worden geladen.';
    }
  }

  function destroy() {
    managementEventTarget.removeEventListener?.('paco:management-visibility-change', onManagementVisibilityChange);
    stopTimer();
  }

  return Object.freeze({ mount, destroy, content });
}