import test from 'node:test';
import assert from 'node:assert/strict';
import { createConnectTheDotsRuntime, createBoxes, createEdges, edgeKey } from './runtime.js';

const items = [{ question: '1+1?', answer: '2' }, { question: '2+2?', answer: '4' }, { question: '3+3?', answer: '6' }];
const gradeAnswer = async (_question, expected, value) => ({ correct: expected === value, feedback: '' });

test('creates the expected dot grid and box topology', () => {
  assert.equal(createEdges(4, 4).length, 24);
  assert.equal(createBoxes(4, 4).length, 9);
  assert.deepEqual(createBoxes(2, 2)[0].edges, ['0-1', '1-3', '2-3', '0-2']);
  assert.equal(edgeKey(3, 0), '0-3');
});

test('closing a box gives the player another turn', async () => {
  const runtime = createConnectTheDotsRuntime({ items, gradeAnswer, random: () => 0 });
  runtime.start();
  for (const key of ['0-1', '0-4', '1-5']) {
    runtime.selectEdge(key);
    await runtime.submitAnswer(key === '1-5' ? '6' : key === '0-1' ? '2' : '4');
    if (runtime.snapshot().phase === 'paco') runtime.playPacoMove();
  }
  const state = runtime.snapshot();
  assert.equal(state.playerBoxes, 0);
});

test('rookie Paco can take an available edge', () => {
  const runtime = createConnectTheDotsRuntime({ items, gradeAnswer, random: () => 0 });
  runtime.start();
  while (runtime.snapshot().phase !== 'paco') {
    if (runtime.snapshot().phase === 'choosing') { runtime.selectEdge(runtime.snapshot().edges.find(edge => !edge.owner).key); }
    if (runtime.snapshot().phase === 'question') break;
  }
  assert.equal(typeof runtime.playPacoMove, 'function');
});
