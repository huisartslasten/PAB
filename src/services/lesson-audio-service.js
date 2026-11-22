// Central lesson audio boundary for every learner-facing exercise.
// Pages request speech; provider selection and playback lifecycle stay here.

export function createLessonAudioService(db, {
  AudioCtor = globalThis.Audio,
  URLRef = globalThis.URL
} = {}) {
  if (!db?.functions?.invoke) throw new Error('A Supabase functions client is required.');

  let audio = null;
  let objectUrl = '';
  let pendingText = '';

  function stop() {
    if (audio) {
      try { audio.pause(); } catch {}
      audio.currentTime = 0;
      audio = null;
    }
    if (objectUrl) {
      URLRef?.revokeObjectURL?.(objectUrl);
      objectUrl = '';
    }
    pendingText = '';
  }

  function isAutoplayBlocked(error) {
    return error?.name === 'NotAllowedError';
  }

  async function speak(text, { language = 'nl', onStatus = null } = {}) {
    if (!text) return;
    const normalizedText = String(text);

    // Safari may reject the first play() because it happens after the async
    // speech request. Keep the generated audio alive so a user action can retry.
    if (audio && objectUrl && pendingText === normalizedText) {
      try {
        await audio.play();
        onStatus?.('AI-stem speelt.');
        return;
      } catch (error) {
        if (isAutoplayBlocked(error)) {
          onStatus?.('🔊 Klik op Nog een keer om de stem af te spelen.');
          return;
        }
        stop();
        onStatus?.('⚠️ AI-stem kon niet worden afgespeeld.');
        throw error;
      }
    }

    stop();
    onStatus?.('🔄 OpenAI-stem maken...');

    let result;
    try {
      result = await db.functions.invoke('speak-word-v1', {
        body: { text: normalizedText, language: String(language || 'nl') }
      });
    } catch (error) {
      onStatus?.('⚠️ OpenAI-stem kon niet worden gemaakt.');
      throw error;
    }

    const { data, error } = result;
    if (error) {
      onStatus?.('⚠️ OpenAI-stem kon niet worden gemaakt.');
      throw error;
    }
    if (!data || typeof AudioCtor !== 'function' || !URLRef?.createObjectURL || typeof Blob !== 'function') {
      const playbackError = new Error('OpenAI-stem leverde geen afspeelbaar audiobestand op.');
      onStatus?.('⚠️ OpenAI-stem kon niet worden afgespeeld.');
      throw playbackError;
    }

    try {
      const playableData = new Blob([data], { type: 'audio/mpeg' });
      objectUrl = URLRef.createObjectURL(playableData);
      const currentUrl = objectUrl;
      pendingText = normalizedText;
      audio = new AudioCtor(currentUrl);
      audio.preload = 'auto';
      audio.onended = () => {
        if (objectUrl === currentUrl) {
          URLRef.revokeObjectURL(currentUrl);
          objectUrl = '';
          audio = null;
          pendingText = '';
        }
      };

      await audio.play();
      onStatus?.('OpenAI-stem speelt.');
    } catch (error) {
      if (isAutoplayBlocked(error)) {
        onStatus?.('🔊 Klik op Nog een keer om de stem af te spelen.');
        return;
      }
      stop();
      onStatus?.('⚠️ OpenAI-stem kon niet worden afgespeeld.');
      throw error;
    }
  }

  return Object.freeze({ speak, stop });
}
