import test from 'node:test';
import assert from 'node:assert/strict';
import { SPACE_WATER_READING_EXERCISE, SPACE_WATER_READING_IMAGES } from '../src/features/lessons/reading-comprehension-space-water.js';
import { verticalLearningLinesRegistry } from '../src/features/curriculum/vertical-learning-lines-registry.js';

test('space water reading exercise has a short, coherent group 8 text with five text-based questions', () => {
  assert.equal(SPACE_WATER_READING_EXERCISE.title, 'De ruimte – Waar komt al het water op aarde vandaan?');
  assert.equal(SPACE_WATER_READING_EXERCISE.seriesLabel, 'DE RUIMTE');
  assert.equal(SPACE_WATER_READING_EXERCISE.durationLabel, 'KORT');
  assert.equal(SPACE_WATER_READING_EXERCISE.text.length, 5);
  assert.equal(SPACE_WATER_READING_EXERCISE.questions.length, 5);
  assert.ok(SPACE_WATER_READING_EXERCISE.text.every(section => section.paragraphs.length > 0));
  assert.ok(SPACE_WATER_READING_EXERCISE.questions.every(question => question.type === 'multiple_choice' && question.options.length === 4));
  for (const question of SPACE_WATER_READING_EXERCISE.questions) {
    assert.ok(question.evidence);
    assert.ok(question.explanation);
    assert.equal(question.options.filter(option => option.id === question.correctOptionId).length, 1);
    assert.equal(question.distractorRationales.length, 3);
  }
  assert.deepEqual(SPACE_WATER_READING_EXERCISE.questions.map(question => question.correctOptionId), ['B','C','B','D','C']);
  const allText = SPACE_WATER_READING_EXERCISE.text.flatMap(section => [section.heading, ...section.paragraphs]).join(' ');
  assert.match(allText, /4,6 miljard jaar/);
  assert.match(allText, /asteroïden/);
  assert.match(allText, /kometen/);
  assert.match(allText, /waterkringloop/);
  assert.match(allText, /Hoeveel water zij precies hebben geleverd, is nog niet duidelijk/);
});

test('space water reading exercise provides inline text sources and image-use records', () => {
  assert.equal(SPACE_WATER_READING_EXERCISE.sources.length, 6);
  assert.ok(SPACE_WATER_READING_EXERCISE.text.every(section => section.sourceIds.length > 0));
  assert.equal(Object.keys(SPACE_WATER_READING_IMAGES).length, 4);
  assert.ok(SPACE_WATER_READING_EXERCISE.text[1].sourceIds.includes('comets'));
  for (const image of Object.values(SPACE_WATER_READING_IMAGES)) {
    assert.ok(image.src.startsWith('https://'));
    assert.ok(image.sourceUrl.startsWith('https://'));
    assert.ok(image.license);
    assert.ok(image.licenseUrl.startsWith('https://'));
    assert.ok(image.author);
  }
  assert.equal(SPACE_WATER_READING_IMAGES.comet.license, 'CC BY-SA 3.0 IGO');
  assert.match(SPACE_WATER_READING_IMAGES.comet.caption, /ESA - European Space Agency/);
});

test('space water exercise is registered with a stable ID and central route without inventing curriculum coverage', () => {
  const exercise = verticalLearningLinesRegistry.getExercise('space-water-origin-reading-01');
  assert.deepEqual(exercise.route, { page: 'reading-comprehension-space-water.html' });
  assert.equal(exercise.kind, 'non_formal_learning_activity');
  assert.deepEqual(verticalLearningLinesRegistry.getObjective('KD2A-0008').exercise_ids, []);
  assert.deepEqual(verticalLearningLinesRegistry.getObjective('KD2A-0009').exercise_ids, ['bees-reading-01', 'moon-origin-reading-01', 'space-water-origin-reading-01']);
});
