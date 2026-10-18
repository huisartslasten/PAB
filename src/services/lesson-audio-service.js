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

    const { data, error } = await db.functions.invoke('speak-word-v1', {
      body: { text: String(text), language: String(language || 'nl') },
      responseType: 'blob'
    });
    if (error) {
      onStatus?.('⚠️ AI-stem kon niet worden gemaakt.');
      throw error;
    }
    if (!data || typeof AudioCtor !== 'function' || !URLRef?.createObjectURL) {
      throw new Error('AI-stem leverde geen afspeelbaar audiobestand op.');
    }

    objectUrl = URLRef.createObjectURL(data);
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

    try {
      await audio.play();
      onStatus?.('AI-stem speelt.');
    } catch (error) {
      onStatus?.('🔊 Klik op Nog een keer om de stem af te spelen.');
      throw error;
    }
  }

  return Object.freeze({ speak, stop });
}
