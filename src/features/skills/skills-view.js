import { escapeHtml } from '../../core/html.js';

export function createSkillsView({ documentRef = document } = {}) {
  function card(skill, onSelect) {
    const button = documentRef.createElement('button');
    button.type = 'button';
    button.className = 'skill-card';
    button.innerHTML = `<strong>${escapeHtml(skill.title)}</strong><span>${escapeHtml(skill.description)}</span>`;
    button.addEventListener('click', () => onSelect(skill));
    return button;
  }

  function menu(skills, onSelect) {
    const root = documentRef.createElement('section');
    root.className = 'skills-menu';
    root.innerHTML = '<div class="skills-section-heading"><span>REKENEN</span><small>Kies een vaardigheid</small></div>';
    const grid = documentRef.createElement('div');
    grid.className = 'skills-grid';
    skills.forEach(skill => grid.appendChild(card(skill, onSelect)));
    root.appendChild(grid);
    return root;
  }

  function play(state, { onAnswer, onFinish } = {}) {
    const root = documentRef.createElement('section');
    root.className = 'skill-play';
    root.innerHTML = `
      <div class="skill-play-top"><span>${escapeHtml(state.skill.title)}</span><strong>${state.remainingSeconds}s</strong></div>
      <div class="skill-score">Score: <strong>${state.score}</strong></div>
      <div class="skill-question">${escapeHtml(state.question?.text || '')} = ?</div>
      <form class="skill-answer-form">
        <input class="skill-answer" inputmode="numeric" autocomplete="off" aria-label="Antwoord" />
        <button type="submit">Antwoord</button>
      </form>
      <button type="button" class="skill-finish">Stoppen</button>`;
    const form = root.querySelector('.skill-answer-form');
    const input = root.querySelector('.skill-answer');
    form.addEventListener('submit', event => { event.preventDefault(); onAnswer(input.value); });
    root.querySelector('.skill-finish').addEventListener('click', onFinish);
    queueMicrotask(() => input.focus());
    return root;
  }

  function result(state, { onRestart, onBack } = {}) {
    const root = documentRef.createElement('section');
    root.className = 'skill-result';
    root.innerHTML = `<h2>Tijd!</h2><div class="skill-final-score">${state.score}</div><p>Goed: ${state.correct} · Beantwoord: ${state.answered}</p>`;
    const actions = documentRef.createElement('div');
    actions.className = 'skill-actions';
    const restart = documentRef.createElement('button'); restart.type = 'button'; restart.textContent = 'Opnieuw'; restart.addEventListener('click', onRestart);
    const back = documentRef.createElement('button'); back.type = 'button'; back.textContent = 'Terug naar Skills'; back.addEventListener('click', onBack);
    actions.append(restart, back); root.appendChild(actions);
    return root;
  }

  return Object.freeze({ menu, play, result });
}
