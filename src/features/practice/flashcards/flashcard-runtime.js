import { createPacoGOApp } from '../../../app/bootstrap.js';
import {
  createFlashcardSession,
  getCurrentFlashcard,
  nextFlashcard,
  revealFlashcard
} from './flashcard-domain.js';

export async function mountFlashcardPractice({
  mount,
  lessonId,
  student = 'Zyon'
} = {}) {
  if (!(mount instanceof HTMLElement)) throw new TypeError('A flashcard mount is required.');

  const app = createPacoGOApp({ supabaseLib: window.supabase });
  const content = document.createElement('div');
  content.className = 'flashcard-practice-content';
  mount.replaceChildren(content);

  const loading = document.createElement('div');
  loading.className = 'flashcard-state';
  loading.textContent = 'Flashcards laden…';
  content.appendChild(loading);

  let lesson = null;
  try {
    const lessons = await app.lessons.listAll();
    lesson = lessons.find(candidate => String(candidate.id) === String(lessonId));
  } catch (error) {
    loading.textContent = 'De flashcards konden niet worden geladen.';
    console.error(error);
    return;
  }

  const cards = (lesson?.lesson_items || [])
    .map(item => ({ question: item.question, answer: item.answer }))
    .filter(item => String(item.question || '').trim() && String(item.answer || '').trim());

  if (!lesson || !cards.length) {
    loading.textContent = lesson
      ? 'Deze les bevat nog geen vraag-en-antwoordkaarten.'
      : 'Deze les kon niet worden gevonden.';
    return;
  }

  let reverse = false;
  let session = createFlashcardSession(cards);

  const controls = document.createElement('div');
  controls.className = 'flashcard-controls';

  const reverseButton = document.createElement('button');
  reverseButton.type = 'button';
  reverseButton.className = 'flashcard-reverse-button';
  reverseButton.textContent = '↔ Omgekeerd oefenen';
  controls.appendChild(reverseButton);

  const progress = document.createElement('div');
  progress.className = 'flashcard-progress';
  controls.appendChild(progress);

  const card = document.createElement('article');
  card.className = 'flashcard-card';
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', 'Flashcard. Druk op Enter om verder te gaan.');
  content.replaceChildren(controls, card);

  const prompt = document.createElement('div');
  prompt.className = 'flashcard-prompt';
  card.appendChild(prompt);

  const answer = document.createElement('div');
  answer.className = 'flashcard-answer';
  card.appendChild(answer);

  const hint = document.createElement('div');
  hint.className = 'flashcard-hint';
  card.appendChild(hint);

  function render() {
    const current = getCurrentFlashcard(session);
    prompt.textContent = current.prompt;
    answer.textContent = current.revealed ? current.answer : '';
    answer.hidden = !current.revealed;
    hint.textContent = current.revealed
      ? 'Druk op Enter voor de volgende kaart'
      : 'Druk op Enter om het antwoord te zien';
    progress.textContent = `${current.index + 1} / ${current.total}`;
    reverseButton.setAttribute('aria-pressed', String(reverse));
    reverseButton.textContent = reverse ? '↔ Normaal oefenen' : '↔ Omgekeerd oefenen';
  }

  function handleAdvance() {
    if (!session.revealed) {
      session = revealFlashcard(session);
      render();
      return;
    }

    const next = nextFlashcard(session);
    if (next === session) {
      hint.textContent = 'Klaar! Druk op terug om de les te verlaten.';
      return;
    }

    session = next;
    render();
  }

  reverseButton.addEventListener('click', () => {
    reverse = !reverse;
    session = createFlashcardSession(cards, { reverse });
    render();
    card.focus();
  });

  card.addEventListener('click', handleAdvance);
  card.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    handleAdvance();
  });

  render();
  card.focus();

  return { lesson, cards, student };
}
