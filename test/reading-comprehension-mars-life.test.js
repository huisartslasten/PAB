import test from 'node:test';
import assert from 'node:assert/strict';
import { MARS_LIFE_READING_EXERCISE, MARS_LIFE_READING_IMAGES } from '../src/features/lessons/reading-comprehension-mars-life.js';
import { verticalLearningLinesRegistry } from '../src/features/curriculum/vertical-learning-lines-registry.js';

test('Mars life reading exercise has a short group 8 text and five text-based questions', () => {
  assert.equal(MARS_LIFE_READING_EXERCISE.id, 'exercise-0001');
  assert.equal(MARS_LIFE_READING_EXERCISE.title, 'De ruimte – Heeft Mars ooit leven gehad?');
  assert.equal(MARS_LIFE_READING_EXERCISE.seriesLabel, 'DE RUIMTE');
  assert.equal(MARS_LIFE_READING_EXERCISE.durationLabel, 'KORT');
  assert.equal(MARS_LIFE_READING_EXERCISE.text.length, 4);
  assert.equal(MARS_LIFE_READING_EXERCISE.questions.length, 5);
  assert.ok(MARS_LIFE_READING_EXERCISE.text.every(section => section.paragraphs.length > 0 && Array.isArray(section.images) && section.sourceIds.length > 0));
  assert.ok(MARS_LIFE_READING_EXERCISE.questions.every(question => question.type === 'multiple_choice' && question.options.length === 4));
  for (const question of MARS_LIFE_READING_EXERCISE.questions) {
    assert.ok(question.evidence);
    assert.ok(question.explanation);
    assert.equal(question.options.filter(option => option.id === question.correctOptionId).length, 1);
    assert.equal(question.distractorRationales.length, 3);
  }
  assert.deepEqual(MARS_LIFE_READING_EXERCISE.questions.map(question => question.correctOptionId), ['A', 'B', 'B', 'A', 'A']);
  const allText = MARS_LIFE_READING_EXERCISE.text.flatMap(section => [section.heading, ...section.paragraphs]).join(' ');
  assert.match(allText, /In 2024 ontdekte de ruimtewagen Perseverance een bijzondere steen/);
  assert.match(allText, /september 2025/);
  assert.match(allText, /bijzondere stoffen en patronen/);
  assert.doesNotMatch(allText, /biosignaturen/i);
  const allQuestionContent = MARS_LIFE_READING_EXERCISE.questions.map(question => [question.prompt, question.explanation, ...question.options.map(option => option.text), ...question.distractorRationales.map(item => item.reason)].join(' ')).join(' ');
  assert.doesNotMatch(allQuestionContent, /biosignaturen/i);
  assert.match(allText, /Dezelfde stoffen kunnen namelijk ook ontstaan zonder dat er levende wezens zijn/);
  assert.match(allText, /Diep onder de grond/);
  assert.match(allText, /Toch weten wetenschappers nog niet zeker of er ooit leven is geweest/);
});

test('Mars exercise provides traceable text sources and NASA image-use records', () => {
  assert.equal(MARS_LIFE_READING_EXERCISE.sources.length, 6);
  const sourceIds = new Set(MARS_LIFE_READING_EXERCISE.sources.map(source => source.id));
  assert.ok(MARS_LIFE_READING_EXERCISE.text.every(section => section.sourceIds.every(id => sourceIds.has(id))));
  assert.equal(Object.keys(MARS_LIFE_READING_IMAGES).length, 2);
  for (const image of Object.values(MARS_LIFE_READING_IMAGES)) {
    assert.ok(image.src.startsWith('https://'));
    assert.ok(image.sourceUrl.startsWith('https://'));
    assert.ok(image.license);
    assert.ok(image.licenseUrl.startsWith('https://'));
    assert.ok(image.author);
  }
});

test('Mars exercise is registered centrally and linked to the intended KD2A objective', () => {
  const exercise = verticalLearningLinesRegistry.getExercise('exercise-0001');
  assert.deepEqual(exercise.route, { page: 'reading-comprehension-mars-life.html' });
  assert.equal(exercise.kind, 'non_formal_learning_activity');
  assert.ok(verticalLearningLinesRegistry.getObjective('KD2A-0009').exercise_ids.includes('exercise-0001'));
  assert.deepEqual(verticalLearningLinesRegistry.getObjective('KD2A-0008').exercise_ids, []);
  assert.equal(verticalLearningLinesRegistry.getObjective('KD2A-0009').coverage_status, 'unassessed');
});
