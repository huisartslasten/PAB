import { describe, expect, it } from 'vitest';
import {
  getLearningMaterialElementDefinition,
  listLearningMaterialElementDefinitions,
  normalizeLearningMaterialElement,
  normalizeLearningMaterialElements
} from './element-registry.js';

describe('learning material element registry ownership contract', () => {
  it('owns the supported learning material element types', () => {
    expect(listLearningMaterialElementDefinitions().map(definition => definition.type)).toEqual([
      'text',
      'image'
    ]);
  });

  it('resolves one canonical definition per element type', () => {
    expect(typeof getLearningMaterialElementDefinition('text')?.create).toBe('function');
    expect(typeof getLearningMaterialElementDefinition('image')?.create).toBe('function');
    expect(getLearningMaterialElementDefinition('video')).toBeNull();
  });

  it('normalizes text elements without moving DOM rendering into the registry', () => {
    expect(normalizeLearningMaterialElement({
      id: 'text-1',
      type: 'text',
      html: '<strong>Hallo</strong>\u200b'
    })).toEqual({
      id: 'text-1',
      type: 'text',
      html: '<strong>Hallo</strong>'
    });
  });

  it('normalizes image size and placement through the shared image policy', () => {
    expect(normalizeLearningMaterialElement({
      id: 'image-1',
      type: 'image',
      media_id: 42,
      size: { width: 120 },
      placement: { x: 999, y: 50, wrap: 'none' }
    })).toEqual({
      id: 'image-1',
      type: 'image',
      media_id: 42,
      size: { width: 100, unit: 'percent' },
      placement: { mode: 'flow', x: 0, y: 50, wrap: 'none' }
    });
  });

  it('drops unsupported or invalid elements instead of creating a second fallback owner', () => {
    expect(normalizeLearningMaterialElements([
      { type: 'text', html: 'Goed' },
      { type: 'video', url: '/video.mp4' },
      { type: 'image', media_id: 0 }
    ])).toEqual([
      { id: null, type: 'text', html: 'Goed' }
    ]);
  });
});
