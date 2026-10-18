// Canonical domain runtime for the Memory lesson game.
// Lesson data loading and presentation are intentionally kept outside this module.

function normalizeItems(items) {
  return (Array.isArray(items) ? items : []).filter(item => item && typeof item === 'object');
}

function createCards(items, random = Math.random) {
  const cards = [];

  normalizeItems(items).forEach((item, pairIndex) => {
    cards.push({
      id: `${pairIndex}:question`,
      pairId: pairIndex,
      type: 'question',
      value: item.question
    });
    cards.push({
      id: `${pairIndex}:answer`,
      pairId: pairIndex,
      type: 'answer',
      value: item.answer
    });
  });

  for (let index = cards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [cards[index], cards[randomIndex]] = [cards[randomIndex], cards[index]];
  }

  return cards;
}

export function createMemoryRuntime({ items = [], random = Math.random } = {}) {
  const lessonItems = normalizeItems(items);
  let cards = [];
  let firstCardId = null;
  let secondCardId = null;
  let matchedPairIds = new Set();
  let phase = 'ready';
  let turnCount = 0;

  function snapshot() {
    return Object.freeze({
      cards: cards.map(card => Object.freeze({ ...card })),
      firstCardId,
      secondCardId,
      matchedCardIds: new Set(
        cards.filter(card => matchedPairIds.has(card.pairId)).map(card => card.id)
      ),
      matchedPairIds: new Set(matchedPairIds),
      phase,
      turnCount,
      totalPairs: lessonItems.length
    });
  }

  function start() {
    cards = createCards(lessonItems, random);
    firstCardId = null;
    secondCardId = null;
    matchedPairIds = new Set();
    phase = cards.length ? 'playing' : 'finished';
    turnCount = 0;
    return snapshot();
  }

  function findCard(cardId) {
    return cards.find(card => card.id === cardId) || null;
  }

  function selectCard(cardId) {
    if (phase !== 'playing') throw new Error('Er kan nu geen kaart worden gekozen.');

    const card = findCard(cardId);
    if (!card) throw new Error('De gekozen kaart bestaat niet.');
    if (matchedPairIds.has(card.pairId)) throw new Error('Deze kaart is al gevonden.');
    if (card.id === firstCardId) throw new Error('Deze kaart is al gekozen.');
    if (secondCardId) throw new Error('Beide kaarten van deze beurt zijn al gekozen.');

    if (!firstCardId) {
      firstCardId = card.id;
      return snapshot();
    }

    secondCardId = card.id;
    turnCount += 1;
    phase = 'checking';
    return snapshot();
  }

  function resolveTurn() {
    if (phase !== 'checking') throw new Error('Er is geen beurt om te controleren.');

    const firstCard = findCard(firstCardId);
    const secondCard = findCard(secondCardId);
    if (!firstCard || !secondCard) throw new Error('De huidige beurt is ongeldig.');

    const matched = firstCard.pairId === secondCard.pairId;
    if (matched) {
      matchedPairIds.add(firstCard.pairId);
    }

    const complete = matchedPairIds.size === lessonItems.length;
    firstCardId = null;
    secondCardId = null;
    phase = complete ? 'finished' : 'playing';

    return Object.freeze({ ...snapshot(), matched });
  }

  return Object.freeze({ start, selectCard, resolveTurn, snapshot });
}

export { createCards };
