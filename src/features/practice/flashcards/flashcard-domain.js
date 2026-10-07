const DEFAULT_OPTIONS = Object.freeze({ reverse: false });

function normalizeCard(card) {
  const question = String(card?.question ?? '').trim();
  const answer = String(card?.answer ?? '').trim();
  if (!question || !answer) {
    throw new TypeError('A flashcard requires a question and an answer.');
  }
  return Object.freeze({ question, answer });
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
    revealed: false
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
    revealed: Boolean(session.revealed),
    index: session.index,
    total: session.cards.length
  });
}

export function revealFlashcard(session) {
  if (!session || session.revealed) return session;
  return Object.freeze({ ...session, revealed: true });
}

export function nextFlashcard(session) {
  if (!session || !Array.isArray(session.cards) || session.cards.length === 0) return session;
  const nextIndex = session.index + 1;
  if (nextIndex >= session.cards.length) return session;
  return Object.freeze({ ...session, index: nextIndex, revealed: false });
}
