import test from 'node:test';
import assert from 'node:assert/strict';
import { MOON_ORIGIN_READING_EXERCISE } from '../src/features/lessons/reading-comprehension-moon-origin.js';
import { verticalLearningLinesRegistry } from '../src/features/curriculum/vertical-learning-lines-registry.js';

test('moon origin reading exercise has a short, coherent group 8 text with four text-based questions', () => {
  assert.equal(MOON_ORIGIN_READING_EXERCISE.id, 'moon-origin-reading-01');
  assert.equal(MOON_ORIGIN_READING_EXERCISE.title, 'De ruimte – Hoe is de maan ontstaan?');
  assert.equal(MOON_ORIGIN_READING_EXERCISE.seriesLabel, 'DE RUIMTE');
  assert.equal(MOON_ORIGIN_READING_EXERCISE.durationLabel, 'KORT');
  assert.equal(MOON_ORIGIN_READING_EXERCISE.text.length, 4);
  assert.equal(MOON_ORIGIN_READING_EXERCISE.questions.length, 4);
  assert.ok(MOON_ORIGIN_READING_EXERCISE.text.every(section => section.paragraphs.length > 0 && Array.isArray(section.images) && section.sourceIds.length > 0));
  assert.ok(MOON_ORIGIN_READING_EXERCISE.questions.every(question => question.type === 'multiple_choice' && question.options.length === 4));
  for (const question of MOON_ORIGIN_READING_EXERCISE.questions) {
    assert.ok(question.evidence);
    assert.ok(question.explanation);
    assert.equal(question.options.filter(option => option.id === question.correctOptionId).length, 1);
    assert.equal(question.distractorRationales.length, 3);
  }
  assert.deepEqual(MOON_ORIGIN_READING_EXERCISE.questions.map(question => question.correctOptionId), ['A', 'B', 'A', 'C']);
  const allText = MOON_ORIGIN_READING_EXERCISE.text.flatMap(section => [section.heading, ...section.paragraphs]).join(' ');
  assert.match(allText, /4,5 miljard jaar/);
  assert.match(allText, /Theia/);
  assert.match(allText, /magma/);
  assert.match(allText, /Apollo-missies/);
  assert.match(allText, /niet dat ieder detail al vaststaat/);
});

test('moon origin reading exercise provides traceable inline sources', () => {
  assert.equal(MOON_ORIGIN_READING_EXERCISE.sources.length, 4);
  assert.ok(MOON_ORIGIN_READING_EXERCISE.sources.every(source => source.url.startsWith('https://')));
  const sourceIds = new Set(MOON_ORIGIN_READING_EXERCISE.sources.map(source => source.id));
  assert.ok(MOON_ORIGIN_READING_EXERCISE.text.every(section => section.sourceIds.every(id => sourceIds.has(id))));
  assert.ok(MOON_ORIGIN_READING_EXERCISE.text[0].sourceIds.includes('canup-asphaug'));
  assert.ok(MOON_ORIGIN_READING_EXERCISE.text[2].sourceIds.includes('apollo-samples'));
  assert.ok(MOON_ORIGIN_READING_EXERCISE.text[3].sourceIds.includes('nielsen-isotopes'));
});

test('moon origin exercise is registered centrally without claiming verified curriculum coverage', () => {
  const exercise = verticalLearningLinesRegistry.getExercise('moon-origin-reading-01');
  assert.deepEqual(exercise.route, { page: 'reading-comprehension-moon-origin.html' });
  assert.equal(exercise.kind, 'non_formal_learning_activity');
  assert.deepEqual(verticalLearningLinesRegistry.getObjective('KD2A-0008').exercise_ids, []);
  assert.deepEqual(verticalLearningLinesRegistry.getObjective('KD2A-0009').exercise_ids, ['bees-reading-01', 'moon-origin-reading-01', 'space-water-origin-reading-01']);
  assert.equal(verticalLearningLinesRegistry.getObjective('KD2A-0008').coverage_status, 'unassessed');
  assert.equal(verticalLearningLinesRegistry.getObjective('KD2A-0009').coverage_status, 'unassessed');
});
