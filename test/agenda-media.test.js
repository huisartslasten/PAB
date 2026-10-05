import test from 'node:test';
import assert from 'node:assert/strict';
import { agendaMediaKind, imageDimensionsForWidth } from '../src/features/agenda/media.js';

test('agenda media kind distinguishes image and video files', () => {
  assert.equal(agendaMediaKind({ type: 'image/jpeg' }), 'image');
  assert.equal(agendaMediaKind({ type: 'video/mp4' }), 'video');
  assert.equal(agendaMediaKind({ type: 'application/pdf' }), 'unknown');
});

test('imageDimensionsForWidth preserves aspect ratio and caps width', () => {
  assert.deepEqual(imageDimensionsForWidth(2000, 1000, 1280), {
    width: 1280,
    height: 640,
    scale: 0.64
  });
});

test('imageDimensionsForWidth does not enlarge small images', () => {
  assert.deepEqual(imageDimensionsForWidth(800, 600, 1280), {
    width: 800,
    height: 600,
    scale: 1
  });
});
