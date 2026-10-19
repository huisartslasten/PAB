import test from 'node:test';
import assert from 'node:assert/strict';
import { createMemoryRuntime } from '../src/features/lessons/memory-runtime.js';

test('Memory matches duplicate answer values by their meaning, not by card identity', () => {
  const runtime = createMemoryRuntime({
    items: [
      { question: '6 + 2', answer: '8' },
      { question: '5 + 3', answer: '8' }
    ],
    random: () => 0,
    maxPairsPerRound: 6
  });

  const state = runtime.start();
  const firstQuestion = state.cards.find(card => card.type === 'question' && card.value === '6 + 2');
  const otherEight = state.cards.find(card => card.type === 'answer' && card.value === '8' && card.pairId !== firstQuestion.pairId);

  runtime.selectCard(firstQuestion.id);
  runtime.selectCard(otherEight.id);
  const result = runtime.resolveTurn();

  assert.equal(result.matched, true);
  assert.equal(result.phase, 'playing');
});

test('Memory splits large lessons into small rounds', () => {
  const items = Array.from({ length: 14 }, (_, index) => ({
    question: `Vraag ${index + 1}`,
    answer: `Antwoord ${index + 1}`
  }));
  const runtime = createMemoryRuntime({ items, random: () => 0, maxPairsPerRound: 6 });

  let state = runtime.start();
  assert.equal(state.roundNumber, 1);
  assert.equal(state.totalRounds, 3);
  assert.equal(state.cards.length, 12);
  assert.equal(state.roundPairs, 6);

  for (const pair of state.cards.filter(card => card.type === 'question')) {
    const answer = state.cards.find(card => card.type === 'answer' && card.pairId === pair.pairId);
    runtime.selectCard(pair.id);
    runtime.selectCard(answer.id);
    const result = runtime.resolveTurn();
    state = runtime.snapshot();
    assert.equal(result.matched, true);
    if (pair !== state.cards[state.cards.length - 1]) continue;
  }

  assert.equal(runtime.snapshot().phase, 'round-finished');
  state = runtime.startNextRound();
  assert.equal(state.roundNumber, 2);
  assert.equal(state.cards.length, 12);

  for (const pair of state.cards.filter(card => card.type === 'question')) {
    const answer = state.cards.find(card => card.type === 'answer' && card.pairId === pair.pairId);
    runtime.selectCard(pair.id);
    runtime.selectCard(answer.id);
    runtime.resolveTurn();
  }

  assert.equal(runtime.snapshot().phase, 'round-finished');
  state = runtime.startNextRound();
  assert.equal(state.roundNumber, 3);
  assert.equal(state.cards.length, 4);
});
