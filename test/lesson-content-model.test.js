import { buildDictationContent, getDictationPrompt, normalizeLessonContent } from '../src/features/lessons/lesson-content-model.js';
import { getPracticeCapabilities, getLessonExperienceMatrix } from '../src/features/lessons/learning-experience-registry.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const sentence = buildDictationContent({
  contentKind: 'sentences',
  doelwoord: 'vrienden',
  zin: 'Gisteren speelde ik buiten met mijn vrienden.'
});

assert(sentence?.content_kind === 'sentences', 'sentence content kind');
assert(getDictationPrompt(sentence) === sentence.zin, 'sentence dictation prompt');
assert(normalizeLessonContent(sentence)?.doelwoord === 'vrienden', 'target word preserved');

const word = buildDictationContent({ contentKind: 'words', doelwoord: 'vrienden' });
assert(getDictationPrompt(word) === 'vrienden', 'word dictation prompt');

const sentenceModes = getPracticeCapabilities({ lessonType: 'dictation', contentKind: 'sentences' });
assert(sentenceModes.some(mode => mode.id === 'memory'), 'sentence memory capability');
assert(!sentenceModes.some(mode => mode.id === 'games'), 'unsupported sentence games capability');
assert(getLessonExperienceMatrix().some(entry => entry.contentKind === 'sentences'), 'experience matrix sentence entry');
