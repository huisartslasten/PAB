import test from 'node:test';
import assert from 'node:assert/strict';
import { BEE_READING_IMAGES, BEE_READING_QUESTIONS, BEE_READING_TEXT } from '../src/features/lessons/reading-comprehension-runtime.js';
import { verticalLearningLinesRegistry } from '../src/features/curriculum/vertical-learning-lines-registry.js';

test('bee reading text has the approved revisions and four licensed photographs', () => {
  assert.equal(BEE_READING_TEXT.length, 7);
  assert.equal(BEE_READING_IMAGES.pollination.license, 'CC0 1.0');
  assert.equal(BEE_READING_IMAGES.colony.license, 'Publiek domein');
  assert.equal(BEE_READING_IMAGES.solitary.license, 'CC BY-SA 3.0');
  assert.equal(BEE_READING_IMAGES.beeHotel.license, 'CC BY-SA 4.0');
  const text = BEE_READING_TEXT.flatMap(section => [section.heading, ...section.paragraphs]).join(' ');
  assert.match(text, /stempel van de stamper/);
  assert.match(text, /veel verschillende soorten wilde bijen/);
  assert.match(text, /hebben insecten nodig voor een goede bestuiving of profiteren daarvan/);
  assert.equal(BEE_READING_TEXT.flatMap(section => section.images).length, 4);
});

test('bee reading questions have eight multiple-choice and two rubric-guided open questions', () => {
  assert.equal(BEE_READING_QUESTIONS.length, 10);
  assert.equal(BEE_READING_QUESTIONS.filter(question => question.type === 'multiple_choice').length, 8);
  assert.equal(BEE_READING_QUESTIONS.filter(question => question.type === 'open').length, 2);
  for (const question of BEE_READING_QUESTIONS) {
    assert.ok(question.prompt);
    assert.ok(question.evidence);
    if (question.type === 'multiple_choice') {
      assert.equal(question.options.length, 4);
      assert.ok(question.options.some(option => option.id === question.correctOptionId));
      assert.equal(question.distractorRationales.length, 3);
    } else {
      assert.equal(question.criteria.length, 3);
      assert.ok(question.sampleAnswer);
    }
  }
  assert.equal(BEE_READING_QUESTIONS[2].correctOptionId, 'B');
  assert.match(BEE_READING_QUESTIONS[2].evidence, /stempel/);
});

test('the reading exercises link only to relevant KD2A objectives without claiming coverage', () => {
  const exercise = verticalLearningLinesRegistry.getExercise('bees-reading-01');
  assert.deepEqual(exercise.route, { page: 'reading-comprehension-bees.html' });
  assert.equal(exercise.kind, 'non_formal_learning_activity');
  assert.deepEqual(verticalLearningLinesRegistry.getObjective('KD2A-0008').exercise_ids, ['bees-reading-01']);
  assert.deepEqual(verticalLearningLinesRegistry.getObjective('KD2A-0009').exercise_ids, ['bees-reading-01', 'moon-origin-reading-01']);
  for (const id of ['KD2A-0008', 'KD2A-0009']) {
    assert.equal(verticalLearningLinesRegistry.getObjective(id).coverage_status, 'unassessed');
  }
});
