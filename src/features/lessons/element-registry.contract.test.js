import { describe, expect, it } from 'vitest';
import {
  buildItemsForType,
  getLessonElementDefinition,
  listLessonElementDefinitions
} from './element-registry.js';

describe('lesson element registry ownership contract', () => {
  it('owns every supported lesson element type', () => {
    expect(listLessonElementDefinitions().map(definition => definition.type)).toEqual([
      'words',
      'custom',
      'questions',
      'dictation',
      'math',
      'spelling'
    ]);
  });

  it('resolves one canonical definition per type', () => {
    const definition = getLessonElementDefinition('questions');
    expect(definition?.type).toBe('questions');
    expect(typeof definition?.build).toBe('function');
    expect(getLessonElementDefinition('unknown')).toBeNull();
  });

  it('keeps type dispatch inside the registry', () => {
    expect(buildItemsForType('questions', [{ question: 'Wat is 2 + 2?', answer: '4' }])).toEqual([
      expect.objectContaining({
        question: 'Wat is 2 + 2?',
        answer: '4',
        sort_order: 0
      })
    ]);
  });
});
