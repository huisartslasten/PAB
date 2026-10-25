import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { buildViewUrl } from '../../core/view-context.js';
import { createGameResultService } from '../../services/game-result-service.js';
import { createMathRuntime } from './math/math-runtime.js';
import { listSkills, getSkillDefinition, SKILL_DURATIONS_SECONDS, DEFAULT_SKILL_DURATION_SECONDS } from './skills-registry.js';
import { createSkillsView } from './skills-view.js';
import './skills.css';

export function createSkillsRuntime({ app, templateMount, context, documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Skills runtime requires an app.');
  if (!templateMount) throw new TypeError('Skills runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Skills runtime requires navigation.');

  const student = context?.student || '';
  const content = documentRef.createElement('div');
  const view = createSkillsView({ documentRef });
  let timer = null;
  let selectedDuration = DEFAULT_SKILL_DURATION_SECONDS;

  const goDashboard = () => navigate(buildViewUrl('dashboard.html', { student, mode: context?.mode }));

  function renderMenu() {
    content.replaceChildren(view.menu(listSkills(), startSkill));
  }

  function durationPicker(skill) {
    const wrapper = documentRef.createElement('div');
    wrapper.className = 'skill-duration-picker';
    wrapper.innerHTML = '<span>Duur</span>';
    const select = documentRef.createElement('select');
    SKILL_DURATIONS_SECONDS.forEach(seconds => {
      const option = documentRef.createElement('option'); option.value = seconds; option.textContent = `${seconds / 60} minuut${seconds === 60 ? '' : 'en'}`; option.selected = seconds === selectedDuration; select.appendChild(option);
    });
    select.addEventListener('change', () => { selectedDuration = Number(select.value); });
    wrapper.appendChild(select);
    const start = documentRef.createElement('button'); start.type = 'button'; start.textContent = 'Start'; start.addEventListener('click', () => startSkill(skill)); wrapper.appendChild(start);
    return wrapper;
  }

  async function startSkill(skill) {
    if (!student) return;
    const definition = getSkillDefinition(skill.id);
    if (!definition) return;
    content.replaceChildren(durationPicker(definition));
    const startButton = content.querySelector('.skill-duration-picker button');
    startButton.focus();
    startButton.addEventListener('click', () => runSkill(definition), { once: true });
  }

  async function runSkill(skill) {
    if (timer) clearInterval(timer);
    const runtime = createMathRuntime({ skill, durationSeconds: selectedDuration });
    const resultService = createGameResultService(app.db);
    let saved = false;

    const render = () => {
      const state = runtime.snapshot();
      if (state.finished) {
        if (timer) clearInterval(timer);
        if (!saved) { saved = true; void resultService.saveResult({ gameKey: skill.gameKey, student, score: state.score }).catch(error => console.error('Skill result save error:', error)); }
        content.replaceChildren(view.result(state, { onRestart: () => runSkill(skill), onBack: renderMenu }));
        return;
      }
      content.replaceChildren(view.play(state, {
        onAnswer: value => { runtime.answer(value); render(); },
        onFinish: () => { runtime.finish(); render(); }
      }));
    };

    render();
    timer = setInterval(render, 250);
  }

  async function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Dashboard',
      backAction: goDashboard,
      greeting: student ? `Hoi ${student}! 🐶` : 'Skills',
      title: 'Skills',
      icon: '⚡',
      subtitle: 'Vaardigheden die je zelfstandig kunt blijven oefenen.',
      navigation: createPacoNavigation({ app, active: 'skills', student, viewMode: context?.mode, navigate }),
      content
    });
    if (!student) { content.textContent = 'Geen leerling geselecteerd.'; return; }
    renderMenu();
  }

  return Object.freeze({ mount, content });
}
