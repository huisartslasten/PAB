import test from 'node:test';
import assert from 'node:assert/strict';
import { CONTENT_TYPES, createAiContentService } from './ai-content-service.js';

test('AI content service sends normalized learning-content requests to the shared function', async () => {
  let captured = null;
  const supabase = {
    functions: {
      async invoke(name, options) {
        captured = { name, options };
        return { data: { target: { type: 'word', text: 'groei' } }, error: null };
      }
    }
  };

  const service = createAiContentService({ supabase });
  const result = await service.generateLearningContent({
    learner: { id: 'zephon', name: 'Zephon', level: 'beginner' },
    lesson: {
      id: 42,
      title: 'Planten',
      subject: 'Biologie',
      questions: [{ question: 'Wat heeft een plant nodig?', answer: 'Water en licht' }]
    },
    constraints: { remainingQuestionCount: 1, targetForms: ['word', 'unsupported'] }
  });

  assert.equal(result.text, 'groei');
  assert.equal(captured.name, 'ai-content-v1');
  assert.equal(captured.options.body.contentType, CONTENT_TYPES.PRACTICE_TARGET);
  assert.deepEqual(captured.options.body.lesson.questions, [{ question: 'Wat heeft een plant nodig?', answer: 'Water en licht' }]);
  assert.deepEqual(captured.options.body.constraints.targetForms, ['word']);
});

test('AI content service rejects invalid target responses', async () => {
  const supabase = {
    functions: {
      async invoke() {
        return { data: { target: { type: 'image', text: 'boom' } }, error: null };
      }
    }
  };

  await assert.rejects(
    () => createAiContentService({ supabase }).generateLearningContent({}),
    /unsupported target type/
  );
});
