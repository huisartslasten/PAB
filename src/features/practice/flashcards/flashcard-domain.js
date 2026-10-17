const DEFAULT_OPTIONS = Object.freeze({ reverse: false });

function normalizeCard(card) {
  const question = String(card?.question ?? '').trim();
  const answer = String(card?.answer ?? '').trim();
  if (!question || !answer) {
    throw new TypeError('A flashcard requires a question and an answer.');
  }
  const hint = String(card?.hint ?? '').trim();
  return Object.freeze({ question, answer, hint });
}

export function getFlashcardCards(items = []) {
  if (!Array.isArray(items)) return [];

  return items
    .map(item => ({
      question: item?.question,
      answer: item?.answer,
      hint: item?.hint
    }))
    .filter(card => String(card.question ?? '').trim() && String(card.answer ?? '').trim());
}

export function createFlashcardSession(cards, options = DEFAULT_OPTIONS) {
  if (!Array.isArray(cards) || cards.length === 0) {
    throw new TypeError('A flashcard session requires at least one card.');
  }

  const normalizedCards = cards.map(normalizeCard);
  const reverse = Boolean(options.reverse);

  return Object.freeze({
    cards: Object.freeze(normalizedCards),
    reverse,
    index: 0,
    revealed: false,
    hintRevealed: false
  });
}

export function getCurrentFlashcard(session) {
  if (!session || !Array.isArray(session.cards) || session.cards.length === 0) {
    return null;
  }

  const card = session.cards[session.index] ?? null;
  if (!card) return null;

  return Object.freeze({
    prompt: session.reverse ? card.answer : card.question,
    answer: session.reverse ? card.question : card.answer,
    hint: card.hint,
    hintRevealed: Boolean(session.hintRevealed),
    revealed: Boolean(session.revealed),
    index: session.index,
    total: session.cards.length
  });
}

export function revealFlashcard(session) {
  if (!session || session.revealed) return session;
  return Object.freeze({ ...session, revealed: true });
}

export function revealFlashcardHint(session) {
  if (!session || session.hintRevealed) return session;
  const card = session.cards?.[session.index];
  if (!card?.hint) return session;
  return Object.freeze({ ...session, hintRevealed: true });
}

export function nextFlashcard(session) {
  if (!session || !Array.isArray(session.cards) || session.cards.length === 0) return session;
  const nextIndex = session.index + 1;
  if (nextIndex >= session.cards.length) return session;
  return Object.freeze({ ...session, index: nextIndex, revealed: false, hintRevealed: false });
}
