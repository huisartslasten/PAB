import { createPacoDropdown, mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { createPacoTile, createPacoTileGrid } from '../../components/paco-tile.js';
import { buildViewUrl } from '../../core/view-context.js';
import { createGameResultService } from '../../services/game-result-service.js';
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
  let timerId = null; let session = null; let finished = false; let highScore = null; let assignments = []; let skills = [];
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
  function renderActivity() { content.replaceChildren(); const skill = skills.find(item => item.id === skillId); if (!skill) return renderMenu(); const card = documentRef.createElement('section'); card.className = 'paco-template-card'; const controls = documentRef.createElement('div'); const durationLabel = documentRef.createElement('label'); durationLabel.textContent = 'Tijd'; const dropdown = createPacoDropdown({ options: SKILL_DURATIONS_SECONDS.map(seconds => ({ value: String(seconds), label: formatDuration(seconds) })), value: String(durationSeconds), onChange: value => openSkill(skill.id, Number(value)) }); durationLabel.appendChild(dropdown.element); controls.appendChild(durationLabel); card.appendChild(controls); const stats = documentRef.createElement('p'); const time = documentRef.createElement('strong'); const score = documentRef.createElement('strong'); stats.append('Tijd: ', time, ' · Score: ', score); card.appendChild(stats); const question = documentRef.createElement('div'); const prompt = documentRef.createElement('h2'); question.appendChild(prompt); const form = documentRef.createElement('form'); const input = documentRef.createElement('input'); input.type = 'number'; input.inputMode = 'numeric'; input.autocomplete = 'off'; input.className = 'paco-template-input-lg'; input.setAttribute('aria-label', 'Antwoord'); const submit = documentRef.createElement('button'); submit.type = 'submit'; submit.className = 'success'; submit.textContent = 'OK'; form.append(input, submit); question.appendChild(form); card.appendChild(question); const best = documentRef.createElement('p'); best.className = 'small'; best.textContent = highScore == null ? 'Beste score: —' : `Beste score: ${highScore}`; card.appendChild(best); const startedAt = Date.now(); function update() { const elapsed = Math.max(0, Math.floor((Date.now() - startedAt) / 1000)); const remaining = Math.max(0, session.durationSeconds - elapsed); time.textContent = `${remaining}s`; score.textContent = String(session.score); if (remaining <= 0) void finishSkill(); } function renderQuestion() { prompt.textContent = session.question.text; } form.addEventListener('submit', event => { event.preventDefault(); if (finished) return; const result = session.answer(input.value); if (result.answered) session.nextQuestion(); input.value = ''; renderQuestion(); update(); input.focus(); }); renderQuestion(); update(); timerId = window.setInterval(update, 250); input.focus(); content.appendChild(card); }
  function renderResult() { content.replaceChildren(); const skill = skills.find(item => item.id === skillId); const card = documentRef.createElement('section'); card.className = 'paco-template-card'; const heading = documentRef.createElement('h2'); heading.textContent = 'Klaar!'; const score = documentRef.createElement('h2'); score.textContent = String(session.score); const label = documentRef.createElement('p'); label.textContent = 'goede antwoorden'; card.append(heading, score, label); if (highScore != null) { const best = documentRef.createElement('p'); best.textContent = `Beste score: ${highScore}`; card.appendChild(best); } const retry = documentRef.createElement('button'); retry.type = 'button'; retry.className = 'success'; retry.textContent = 'Opnieuw'; retry.addEventListener('click', () => openSkill(skill.id, session.durationSeconds)); const back = documentRef.createElement('button'); back.type = 'button'; back.className = 'secondary'; back.textContent = 'Terug naar Skills'; back.addEventListener('click', goSkills); card.append(retry, back); content.appendChild(card); }
  async function mount() { const skill = skills.find(item => item.id === skillId); mountPacoPageTemplate({ mount: templateMount, backLabel: '← Skills', backAction: goSkills, greeting: `Hoi ${student}! 🐶`, title: skill ? skill.title : 'Skills', icon: '⚡', subtitle: skill ? 'Los zoveel mogelijk sommen goed op voordat de tijd om is.' : 'Zelfstandig oefenen, altijd beschikbaar.', navigation: createPacoNavigation({ app, active: 'skills', student, viewMode: context?.mode, navigate }), content }); if (!student) { try { skills = await app.skillDefinitions.list({ category: 'math' }); renderMenu(); } catch (error) { content.textContent = 'De Skills konden niet worden geladen.'; } return; } try { skills = await app.skillDefinitions.list({ category: 'math' }); assignments = await app.skillConfiguration.listForStudent(student); } catch (error) { console.error('Skill configuration load error:', error); content.textContent = 'De Skills konden niet worden geladen.'; return; } const selected = skills.find(item => item.id === skillId); if (!selected || !isEnabled(selected)) { renderMenu(); return; } highScore = await resultService.getHighScore({ gameKey: `math-skill-${selected.id}`, student }).catch(() => null); if (selected.definition?.kind === 'mixed') { const mixedProfiles = enabledMixedProfiles(selected); if (!mixedProfiles.length) { content.textContent = 'Voor Gemengd zijn nog geen rekenprofielen geselecteerd.'; return; } session = createMathSession({ durationSeconds: Number(durationSeconds), mixedProfiles }); } else { session = createMathSession({ durationSeconds: Number(durationSeconds), profile: selected }); } renderActivity(); }
  return Object.freeze({ mount, content });
}
