// Canonical domain runtime for the Memory lesson game.
// Lesson data loading and presentation are intentionally kept outside this module.

const DEFAULT_MAX_PAIRS_PER_ROUND = 6;

function normalizeItems(items) {
  return (Array.isArray(items) ? items : []).filter(item => item && typeof item === 'object');
}

function normalizeMatchKey(value) {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('nl-NL');
}

function shuffle(values, random) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

function createCards(items, random = Math.random) {
  const cards = [];

  normalizeItems(items).forEach((item, pairIndex) => {
    const matchKey = normalizeMatchKey(item.answer);
    cards.push({
      id: `${pairIndex}:question`,
      pairId: pairIndex,
      type: 'question',
      value: item.question,
      matchKey
    });
    cards.push({
      id: `${pairIndex}:answer`,
      pairId: pairIndex,
      type: 'answer',
      value: item.answer,
      matchKey
    });
  });

  return shuffle(cards, random);
}

export function createMemoryRuntime({
  items = [],
  random = Math.random,
  maxPairsPerRound = DEFAULT_MAX_PAIRS_PER_ROUND
} = {}) {
  const lessonItems = normalizeItems(items);
  const roundSize = Math.max(1, Math.floor(Number(maxPairsPerRound) || DEFAULT_MAX_PAIRS_PER_ROUND));
  let roundPlan = [];
  let roundIndex = 0;
  let cards = [];
  let firstCardId = null;
  let secondCardId = null;
  let matchedPairIds = new Set();
  let phase = 'ready';
  let turnCount = 0;

  function currentRoundItems() {
    const start = roundIndex * roundSize;
    return roundPlan.slice(start, start + roundSize);
  }

  function totalRounds() {
    return Math.ceil(roundPlan.length / roundSize);
  }

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
      totalPairs: lessonItems.length,
      roundPairs: currentRoundItems().length,
      roundNumber: roundPlan.length ? roundIndex + 1 : 0,
      totalRounds: totalRounds(),
      minimumTurns: lessonItems.length
    });
  }

  function beginCurrentRound() {
    const itemsForRound = currentRoundItems();
    cards = createCards(itemsForRound, random);
    firstCardId = null;
    secondCardId = null;
    matchedPairIds = new Set();
    phase = cards.length ? 'playing' : 'finished';
  }

  function start() {
    roundPlan = shuffle(lessonItems, random);
    roundIndex = 0;
    turnCount = 0;
    beginCurrentRound();
    return snapshot();
  }

  function startNextRound() {
    if (phase !== 'round-finished') {
      throw new Error('Er is geen volgende ronde beschikbaar.');
    }
    roundIndex += 1;
    beginCurrentRound();
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

    const matched = firstCard.type !== secondCard.type && firstCard.matchKey === secondCard.matchKey;
    if (matched) {
      matchedPairIds.add(firstCard.pairId);
    }

    const complete = matchedPairIds.size === currentRoundItems().length;
    firstCardId = null;
    secondCardId = null;
    phase = complete
      ? (roundIndex + 1 < totalRounds() ? 'round-finished' : 'finished')
      : 'playing';

    return Object.freeze({ ...snapshot(), matched });
  }

  return Object.freeze({ start, startNextRound, selectCard, resolveTurn, snapshot });
}

export { DEFAULT_MAX_PAIRS_PER_ROUND, createCards };
