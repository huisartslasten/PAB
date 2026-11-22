import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonAudioService } from '../src/services/lesson-audio-service.js';

test('lesson audio sends Dutch text to the central speech function and plays returned mp3 audio', async () => {
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
  assert.deepEqual(statuses, ['🔄 OpenAI-stem maken...', 'OpenAI-stem speelt.']);
});

test('lesson audio reports a rejected speech request and never starts a browser voice', async () => {
  const statuses = [];
  let browserSpeechStarted = false;
  const db = {
    functions: {
      invoke: async () => { throw new Error('OpenAI unavailable'); }
    }
  };
  const service = createLessonAudioService(db, {
    speechSynthesisRef: { speak: () => { browserSpeechStarted = true; } },
    UtteranceCtor: function SpeechSynthesisUtterance() { browserSpeechStarted = true; }
  });

  await assert.rejects(
    service.speak('Zet de potloden van klein naar groot.', {
      language: 'nl',
      onStatus: status => statuses.push(status)
    }),
    /OpenAI unavailable/
  );

  assert.equal(browserSpeechStarted, false);
  assert.deepEqual(statuses, [
    '🔄 OpenAI-stem maken...',
    '⚠️ OpenAI-stem kon niet worden gemaakt.'
  ]);
});

test('lesson audio reports an OpenAI function error without falling back to device speech', async () => {
  const statuses = [];
  const db = {
    functions: {
      invoke: async () => ({ data: null, error: new Error('OpenAI returned 401') })
    }
  };
  const service = createLessonAudioService(db);

  await assert.rejects(
    service.speak('Vergelijk de lengtes.', { onStatus: status => statuses.push(status) }),
    /OpenAI returned 401/
  );
  assert.equal(statuses.at(-1), '⚠️ OpenAI-stem kon niet worden gemaakt.');
});

test('lesson audio keeps blocked OpenAI playback available for a user retry', async () => {
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
    '🔄 OpenAI-stem maken...',
    '🔊 Klik op Nog een keer om de stem af te spelen.',
    'OpenAI-stem speelt.'
  ]);
});

test('lesson audio reports unexpected OpenAI audio playback errors', async () => {
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
  assert.equal(statuses.at(-1), '⚠️ OpenAI-stem kon niet worden afgespeeld.');
});
