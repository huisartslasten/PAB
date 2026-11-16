import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonAudioService } from '../src/services/lesson-audio-service.js';

test('lesson audio normalizes the function response to playable mp3 audio', async () => {
  const calls = [];
  const statuses = [];
  const audioInstances = [];
  const responseBlob = new Blob(['mp3-bytes'], { type: 'application/octet-stream' });
  let playableBlob = null;

  const db = {
    functions: {
      invoke: async (...args) => {
        calls.push(args);
        return { data: responseBlob, error: null };
      }
    }
  };
  const URLRef = {
    createObjectURL: value => {
      playableBlob = value;
      return 'blob:test';
    },
    revokeObjectURL: () => {}
  };
  const AudioCtor = function Audio(url) {
    this.url = url;
    this.preload = '';
    this.play = async () => {};
    this.pause = () => {};
    audioInstances.push(this);
  };

  const service = createLessonAudioService(db, { AudioCtor, URLRef });
  await service.speak('huis', {
    language: 'nl',
    onStatus: status => statuses.push(status)
  });

  assert.deepEqual(calls, [[
    'speak-word-v1',
    { body: { text: 'huis', language: 'nl' } }
  ]]);
  assert.equal(playableBlob.type, 'audio/mpeg');
  assert.equal(audioInstances[0].url, 'blob:test');
  assert.deepEqual(statuses, ['🔄 AI-stem maken...', 'AI-stem speelt.']);
});

test('lesson audio reports when the speech function invocation rejects', async () => {
  const statuses = [];
  const db = {
    functions: {
      invoke: async () => { throw new TypeError('Type error'); }
    }
  };

  const service = createLessonAudioService(db, {
    AudioCtor: function Audio() {},
    URLRef: { createObjectURL: () => 'blob:test', revokeObjectURL: () => {} }
  });

  await assert.rejects(
    service.speak('huis', { onStatus: status => statuses.push(status) }),
    /Type error/
  );
  assert.deepEqual(statuses, [
    '🔄 AI-stem maken...',
    '⚠️ AI-stem kon niet worden gemaakt.'
  ]);
});

test('lesson audio keeps blocked playback available for a user retry', async () => {
  const statuses = [];
  let playCount = 0;
  const db = {
    functions: {
      invoke: async () => ({ data: new Blob(['mp3-bytes'], { type: 'application/octet-stream' }), error: null })
    }
  };
  const URLRef = {
    createObjectURL: () => 'blob:test',
    revokeObjectURL: () => {}
  };
  const AudioCtor = function Audio() {
    this.play = async () => {
      playCount += 1;
      if (playCount === 1) {
        const error = new Error('autoplay blocked');
        error.name = 'NotAllowedError';
        throw error;
      }
    };
    this.pause = () => {};
  };

  const service = createLessonAudioService(db, { AudioCtor, URLRef });

  await service.speak('huis', { onStatus: status => statuses.push(status) });
  await service.speak('huis', { onStatus: status => statuses.push(status) });

  assert.equal(playCount, 2);
  assert.deepEqual(statuses, [
    '🔄 AI-stem maken...',
    '🔊 Klik op Nog een keer om de stem af te spelen.',
    'AI-stem speelt.'
  ]);
});

test('lesson audio reports unexpected browser playback errors', async () => {
  const statuses = [];
  const db = {
    functions: {
      invoke: async () => ({ data: new Blob(['mp3-bytes'], { type: 'application/octet-stream' }), error: null })
    }
  };
  const URLRef = {
    createObjectURL: () => 'blob:test',
    revokeObjectURL: () => {}
  };
  const AudioCtor = function Audio() {
    this.play = async () => { throw new Error('decode failed'); };
    this.pause = () => {};
  };

  const service = createLessonAudioService(db, { AudioCtor, URLRef });
  await assert.rejects(
    service.speak('huis', { onStatus: status => statuses.push(status) }),
    /decode failed/
  );
  assert.equal(statuses.at(-1), '⚠️ AI-stem kon niet worden afgespeeld.');
});
