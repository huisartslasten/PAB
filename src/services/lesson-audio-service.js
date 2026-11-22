// Lesson audio boundary for the professional player.
// The service owns the Edge Function call and audio lifecycle; pages only request
// speech for the currently displayed lesson item.

export function createLessonAudioService(db, {
  AudioCtor = globalThis.Audio,
  URLRef = globalThis.URL,
  speechSynthesisRef = globalThis.speechSynthesis,
  UtteranceCtor = globalThis.SpeechSynthesisUtterance
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
    try { speechSynthesisRef?.cancel?.(); } catch {}
  }

  function isAutoplayBlocked(error) {
    return error?.name === 'NotAllowedError';
  }

  function speakWithDeviceVoice(text, language, onStatus) {
    if (typeof UtteranceCtor !== 'function' || typeof speechSynthesisRef?.speak !== 'function') return false;

    try {
      const utterance = new UtteranceCtor(text);
      const requestedLanguage = String(language || 'nl');
      utterance.lang = requestedLanguage === 'nl' ? 'nl-NL' : requestedLanguage;
      utterance.onerror = () => onStatus?.('⚠️ Apparaatstem kon niet worden afgespeeld.');
      speechSynthesisRef.speak(utterance);
      onStatus?.('Apparaatstem wordt afgespeeld.');
      return true;
    } catch {
      return false;
    }
  }

  function useDeviceVoiceOrThrow(text, language, onStatus, error, statusMessage) {
    if (speakWithDeviceVoice(text, language, onStatus)) return;
    onStatus?.(statusMessage);
    throw error;
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
        useDeviceVoiceOrThrow(
          normalizedText, language, onStatus, error,
          '⚠️ AI-stem kon niet worden afgespeeld.'
        );
        return;
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
      useDeviceVoiceOrThrow(
        normalizedText, language, onStatus, error,
        '⚠️ AI-stem kon niet worden gemaakt.'
      );
      return;
    }

    const { data, error } = result;
    if (error) {
      useDeviceVoiceOrThrow(
        normalizedText, language, onStatus, error,
        '⚠️ AI-stem kon niet worden gemaakt.'
      );
      return;
    }
    if (!data || typeof AudioCtor !== 'function' || !URLRef?.createObjectURL || typeof Blob !== 'function') {
      const error = new Error('AI-stem leverde geen afspeelbaar audiobestand op.');
      useDeviceVoiceOrThrow(
        normalizedText, language, onStatus, error,
        '⚠️ AI-stem kon niet worden afgespeeld.'
      );
      return;
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
      useDeviceVoiceOrThrow(
        normalizedText, language, onStatus, error,
        '⚠️ AI-stem kon niet worden afgespeeld.'
      );
    }
  }

  return Object.freeze({ speak, stop });
}
