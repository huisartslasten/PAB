// Lesson audio boundary for the professional player.
// The service owns the Edge Function call and audio lifecycle; pages only request
// speech for the currently displayed lesson item.

export function createLessonAudioService(db, { AudioCtor = globalThis.Audio, URLRef = globalThis.URL } = {}) {
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
    // speech request. Keep that already-created audio alive so the user action
    // behind "Nog een keer" can retry the same playback without rebuilding or
    // revoking the Blob URL underneath WebKit.
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
    onStatus?.('🔄 AI-stem maken...');

    let result;
    try {
      result = await db.functions.invoke('speak-word-v1', {
        body: { text: normalizedText, language: String(language || 'nl') }
      });
    } catch (error) {
      onStatus?.('⚠️ AI-stem kon niet worden gemaakt.');
      throw error;
    }

    const { data, error } = result;
    if (error) {
      onStatus?.('⚠️ AI-stem kon niet worden gemaakt.');
      throw error;
    }
    if (!data || typeof AudioCtor !== 'function' || !URLRef?.createObjectURL || typeof Blob !== 'function') {
      const error = new Error('AI-stem leverde geen afspeelbaar audiobestand op.');
      onStatus?.('⚠️ AI-stem kon niet worden afgespeeld.');
      throw error;
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
      onStatus?.('AI-stem speelt.');
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

  return Object.freeze({ speak, stop });
}
