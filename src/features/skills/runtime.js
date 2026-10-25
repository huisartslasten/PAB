import { createPacoDropdown, mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { buildViewUrl } from '../../core/view-context.js';
import { createGameResultService } from '../../services/game-result-service.js';
import { createMathSession } from './math/math-domain.js';
import { DEFAULT_SKILL_DURATION_SECONDS, SKILL_DURATIONS_SECONDS, getSkillDefinition, listSkillsByCategory } from './skills-registry.js';

function formatDuration(seconds) { return `${Math.round(seconds / 60)} min`; }

export function createSkillsRuntime({ app, templateMount, context, skillId = '', durationSeconds = DEFAULT_SKILL_DURATION_SECONDS, documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Skills runtime requires an app.');
  if (!templateMount) throw new TypeError('Skills runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Skills runtime requires a navigation owner.');

  const student = context?.student || '';
  const content = documentRef.createElement('div');
  const resultService = createGameResultService(app.db);
  let timerId = null;
  let session = null;
  let finished = false;
  let highScore = null;

  const goSkills = () => navigate(buildViewUrl('skills.html', { student, mode: context?.mode }));
  const openSkill = (id, duration = DEFAULT_SKILL_DURATION_SECONDS) => {
    const target = buildViewUrl('skills.html', { student, mode: context?.mode });
    target.searchParams.set('skill', id);
    target.searchParams.set('duration', String(duration));
    return navigate(target);
  };

  function stopTimer() { if (timerId != null) window.clearInterval(timerId); timerId = null; }

  async function finishSkill() {
    if (finished || !session) return;
    finished = true;
    stopTimer();
    if (student) {
      try {
        await resultService.saveResult({ gameKey: getSkillDefinition(skillId).gameKey, student, score: session.score });
        highScore = await resultService.getHighScore({ gameKey: getSkillDefinition(skillId).gameKey, student });
      } catch (error) { console.error('Skill result persistence error:', error); }
    }
    renderResult();
  }

  function renderMenu() {
    content.replaceChildren();
    const card = documentRef.createElement('section');
    card.className = 'paco-template-card';
    const heading = documentRef.createElement('h2');
    heading.textContent = 'Rekenen';
    card.appendChild(heading);

    listSkillsByCategory('math').forEach(skill => {
      const button = documentRef.createElement('button');
      button.type = 'button';
      button.className = 'paco-subject-card';
      const title = documentRef.createElement('h3');
      title.textContent = skill.title;
      const description = documentRef.createElement('p');
      description.textContent = skill.description;
      const action = documentRef.createElement('strong');
      action.textContent = 'Start →';
      button.append(title, description, action);
      button.addEventListener('click', () => openSkill(skill.id));
      card.appendChild(button);
    });
    content.appendChild(card);
  }

  function renderActivity() {
    content.replaceChildren();
    const skill = getSkillDefinition(skillId);
    if (!skill) return renderMenu();

    const card = documentRef.createElement('section');
    card.className = 'paco-template-card';

    const controls = documentRef.createElement('div');
    const durationLabel = documentRef.createElement('label');
    durationLabel.textContent = 'Tijd';
    const dropdown = createPacoDropdown({
      options: SKILL_DURATIONS_SECONDS.map(seconds => ({ value: String(seconds), label: formatDuration(seconds) })),
      value: String(durationSeconds),
      onChange: value => openSkill(skill.id, Number(value))
    });
    durationLabel.appendChild(dropdown.element);
    controls.appendChild(durationLabel);
    card.appendChild(controls);

    const stats = documentRef.createElement('p');
    const time = documentRef.createElement('strong');
    const score = documentRef.createElement('strong');
    stats.append('Tijd: ', time, ' · Score: ', score);
    card.appendChild(stats);

    const question = documentRef.createElement('div');
    const prompt = documentRef.createElement('h2');
    question.appendChild(prompt);

    const form = documentRef.createElement('form');
    const input = documentRef.createElement('input');
    input.type = 'number';
    input.inputMode = 'numeric';
    input.autocomplete = 'off';
    input.className = 'paco-template-input-lg';
    input.setAttribute('aria-label', 'Antwoord');
    const submit = documentRef.createElement('button');
    submit.type = 'submit';
    submit.className = 'success';
    submit.textContent = 'OK';
    form.append(input, submit);
    question.appendChild(form);
    card.appendChild(question);

    const best = documentRef.createElement('p');
    best.className = 'small';
    best.textContent = highScore == null ? 'Beste score: —' : `Beste score: ${highScore}`;
    card.appendChild(best);

    const startedAt = Date.now();
    function update() {
      const elapsed = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
      const remaining = Math.max(0, session.durationSeconds - elapsed);
      time.textContent = `${remaining}s`;
      score.textContent = String(session.score);
      if (remaining <= 0) void finishSkill();
    }
    function renderQuestion() { prompt.textContent = session.question.text; }

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (finished) return;
      const result = session.answer(input.value);
      if (result.answered) session.nextQuestion();
      input.value = '';
      renderQuestion();
      update();
      input.focus();
    });

    renderQuestion();
    update();
    timerId = window.setInterval(update, 250);
    input.focus();
    content.appendChild(card);
  }

  function renderResult() {
    content.replaceChildren();
    const skill = getSkillDefinition(skillId);
    const card = documentRef.createElement('section');
    card.className = 'paco-template-card';
    const heading = documentRef.createElement('h2');
    heading.textContent = 'Klaar!';
    const score = documentRef.createElement('h2');
    score.textContent = String(session.score);
    const label = documentRef.createElement('p');
    label.textContent = 'goede antwoorden';
    card.append(heading, score, label);
    if (highScore != null) {
      const best = documentRef.createElement('p');
      best.textContent = `Beste score: ${highScore}`;
      card.appendChild(best);
    }
    const retry = documentRef.createElement('button');
    retry.type = 'button';
    retry.className = 'success';
    retry.textContent = 'Opnieuw';
    retry.addEventListener('click', () => openSkill(skill.id, session.durationSeconds));
    const back = documentRef.createElement('button');
    back.type = 'button';
    back.className = 'secondary';
    back.textContent = 'Terug naar Skills';
    back.addEventListener('click', goSkills);
    card.append(retry, back);
    content.appendChild(card);
  }

  async function mount() {
    const skill = getSkillDefinition(skillId);
    mountPacoPageTemplate({ mount: templateMount, backLabel: '← Skills', backAction: goSkills, greeting: `Hoi ${student}! 🐶`, title: skill ? skill.title : 'Skills', icon: '⚡', subtitle: skill ? 'Los zoveel mogelijk sommen goed op voordat de tijd om is.' : 'Zelfstandig oefenen, altijd beschikbaar.', navigation: createPacoNavigation({ app, active: 'skills', student, viewMode: context?.mode, navigate }), content });
    if (!skill) { renderMenu(); return; }
    highScore = student ? await resultService.getHighScore({ gameKey: skill.gameKey, student }).catch(() => null) : null;
    session = skill.profileIds
      ? createMathSession({ durationSeconds: Number(durationSeconds), mixedProfileIds: skill.profileIds })
      : createMathSession({ durationSeconds: Number(durationSeconds), profileId: skill.profileId });
    renderActivity();
  }

  return Object.freeze({ mount, content });
}
