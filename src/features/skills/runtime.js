import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { buildViewUrl } from '../../core/view-context.js';
import { createGameResultService } from '../../services/game-result-service.js';
import { createMathSession } from './math/math-domain.js';
import { DEFAULT_SKILL_DURATION_SECONDS, SKILL_DURATIONS_SECONDS, getSkillDefinition, listSkillsByCategory } from './skills-registry.js';

function formatDuration(seconds) {
  return `${Math.round(seconds / 60)} min`;
}

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

  function stopTimer() {
    if (timerId != null) window.clearInterval(timerId);
    timerId = null;
  }

  async function finishSkill() {
    if (finished || !session) return;
    finished = true;
    stopTimer();

    if (student) {
      try {
        await resultService.saveResult({ gameKey: skillId, student, score: session.score });
        highScore = await resultService.getHighScore({ gameKey: skillId, student });
      } catch (error) {
        console.error('Skill result persistence error:', error);
      }
    }
    renderResult();
  }

  function renderMenu() {
    content.replaceChildren();
    const intro = documentRef.createElement('p');
    intro.className = 'skills-intro';
    intro.textContent = 'Kies een vaardigheid. Je kunt deze altijd opnieuw doen.';
    content.appendChild(intro);

    const section = documentRef.createElement('section');
    section.className = 'skills-section';
    const heading = documentRef.createElement('h2');
    heading.textContent = 'Rekenen';
    section.appendChild(heading);

    const grid = documentRef.createElement('div');
    grid.className = 'skills-grid';
    listSkillsByCategory('math').forEach(skill => {
      const card = documentRef.createElement('button');
      card.type = 'button';
      card.className = 'skill-card';
      card.innerHTML = `<strong>${skill.title}</strong><span>${skill.description}</span><em>Start →</em>`;
      card.addEventListener('click', () => openSkill(skill.id));
      grid.appendChild(card);
    });
    section.appendChild(grid);
    content.appendChild(section);
  }

  function renderActivity() {
    content.replaceChildren();
    const skill = getSkillDefinition(skillId);
    if (!skill) return renderMenu();

    const shell = documentRef.createElement('section');
    shell.className = 'skill-activity';

    const controls = documentRef.createElement('div');
    controls.className = 'skill-controls';
    const durationLabel = documentRef.createElement('label');
    durationLabel.textContent = 'Tijd';
    const durationSelect = documentRef.createElement('select');
    SKILL_DURATIONS_SECONDS.forEach(seconds => {
      const option = documentRef.createElement('option');
      option.value = String(seconds);
      option.textContent = formatDuration(seconds);
      option.selected = seconds === Number(durationSeconds);
      durationSelect.appendChild(option);
    });
    durationSelect.addEventListener('change', () => openSkill(skill.id, Number(durationSelect.value)));
    durationLabel.appendChild(durationSelect);
    controls.appendChild(durationLabel);
    shell.appendChild(controls);

    const stats = documentRef.createElement('div');
    stats.className = 'skill-stats';
    const time = documentRef.createElement('strong');
    const score = documentRef.createElement('strong');
    time.className = 'skill-time';
    score.className = 'skill-score';
    stats.append(time, score);
    shell.appendChild(stats);

    const question = documentRef.createElement('div');
    question.className = 'skill-question';
    const form = documentRef.createElement('form');
    const input = documentRef.createElement('input');
    input.type = 'number';
    input.inputMode = 'numeric';
    input.autocomplete = 'off';
    input.className = 'skill-answer';
    input.setAttribute('aria-label', 'Antwoord');
    const submit = documentRef.createElement('button');
    submit.type = 'submit';
    submit.textContent = 'OK';
    form.append(input, submit);
    question.appendChild(form);
    shell.appendChild(question);

    const best = documentRef.createElement('p');
    best.className = 'skill-best';
    best.textContent = highScore == null ? 'Beste score: —' : `Beste score: ${highScore}`;
    shell.appendChild(best);

    function update() {
      const elapsed = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
      const remaining = Math.max(0, session.durationSeconds - elapsed);
      time.textContent = `⏱ ${remaining}s`;
      score.textContent = `⭐ ${session.score}`;
      if (remaining <= 0) finishSkill();
    }

    const startedAt = Date.now();
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (finished) return;
      session.answer(input.value);
      input.value = '';
      session.nextQuestion();
      renderQuestion();
      update();
      input.focus();
    });

    function renderQuestion() {
      question.firstChild?.remove();
      const prompt = documentRef.createElement('div');
      prompt.className = 'skill-prompt';
      prompt.textContent = session.question.text;
      question.prepend(prompt);
    }

    renderQuestion();
    update();
    timerId = window.setInterval(update, 250);
    input.focus();
    content.appendChild(shell);
  }

  function renderResult() {
    content.replaceChildren();
    const skill = getSkillDefinition(skillId);
    const result = documentRef.createElement('section');
    result.className = 'skill-result';
    result.innerHTML = `<h2>Klaar!</h2><p class="skill-result-score">${session.score}</p><p>goede antwoorden</p>`;
    if (highScore != null) {
      const best = documentRef.createElement('p');
      best.textContent = `Beste score: ${highScore}`;
      result.appendChild(best);
    }
    const retry = documentRef.createElement('button');
    retry.type = 'button';
    retry.textContent = 'Opnieuw';
    retry.addEventListener('click', () => openSkill(skill.id, session.durationSeconds));
    const back = documentRef.createElement('button');
    back.type = 'button';
    back.textContent = 'Terug naar Skills';
    back.addEventListener('click', goSkills);
    result.append(retry, back);
    content.appendChild(result);
  }

  async function mount() {
    const skill = getSkillDefinition(skillId);
    const title = skill ? skill.title : 'Skills';
    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Skills',
      backAction: goSkills,
      greeting: `Hoi ${student}! 🐶`,
      title,
      icon: '⚡',
      subtitle: skill ? 'Los zoveel mogelijk sommen goed op voordat de tijd om is.' : 'Zelfstandig oefenen, altijd beschikbaar.',
      navigation: createPacoNavigation({ app, active: 'skills', student, viewMode: context?.mode, navigate }),
      content
    });

    if (!skill) {
      renderMenu();
      return;
    }

    highScore = student ? await resultService.getHighScore({ gameKey: skill.id, student }).catch(() => null) : null;
    session = createMathSession({ durationSeconds: Number(durationSeconds), operation: skill.operation });
    renderActivity();
  }

  return Object.freeze({ mount, content });
}
