// Lesson audio boundary for the professional player.
// The service owns the Edge Function call and audio lifecycle; pages only request
// speech for the currently displayed lesson item.

export function createLessonAudioService(db, { AudioCtor = globalThis.Audio, URLRef = globalThis.URL } = {}) {
  if (!db?.functions?.invoke) throw new Error('A Supabase functions client is required.');

  let audio = null;
  let objectUrl = '';

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
  }

  async function speak(text, { language = 'nl', onStatus = null } = {}) {
    if (!text) return;
    stop();
    onStatus?.('🔄 AI-stem maken...');

    let result;
    try {
      result = await db.functions.invoke('speak-word-v1', {
        body: { text: String(text), language: String(language || 'nl') }
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
      audio = new AudioCtor(currentUrl);
      audio.preload = 'auto';
      audio.onended = () => {
        if (objectUrl === currentUrl) {
          URLRef.revokeObjectURL(currentUrl);
          objectUrl = '';
          audio = null;
        }
      };

      await audio.play();
      onStatus?.('AI-stem speelt.');
    } catch (error) {
      stop();
      onStatus?.('🔊 Klik op Nog een keer om de stem af te spelen.');
      throw error;
    }
  }

  return Object.freeze({ speak, stop });
}
