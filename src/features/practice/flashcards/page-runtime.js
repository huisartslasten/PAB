import { mountPacoPageTemplate } from '../../../components/page-template.js';
import { createPacoNavigation } from '../../../components/page-navigation.js';
import { mountFlashcardPractice } from './flashcard-runtime.js';
import { buildViewUrl } from '../../../core/view-context.js';

export function createFlashcardsPageRuntime({ app, templateMount, context, lessonId = '', contentKind = '', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Flashcards page runtime requires an app.');
  if (!templateMount) throw new TypeError('Flashcards page runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Flashcards page runtime requires a navigation owner.');
  const student = context?.student || '';
  const content = documentRef.createElement('div');
  const goPractice = () => { const target = buildViewUrl('oefenen.html', { student, mode: context?.mode }); if (lessonId) target.searchParams.set('lesson_id', lessonId); return navigate(target); };
  async function mount() {
    mountPacoPageTemplate({ mount: templateMount, backLabel: '← Oefenen', backAction: goPractice, greeting: `Hoi ${student}! 🐶`, title: 'Flashcards', icon: '🃏', subtitle: 'Vraag → antwoord. Druk op Enter om verder te gaan.', navigation: createPacoNavigation({ app, active: 'practice', student, viewMode: context?.mode, navigate }), content });
    if (!lessonId || !student) { content.textContent = 'Geen leerling of les geselecteerd.'; return; }
    await mountFlashcardPractice({ mount: content, app, lessonId, student, contentKind });
  }
  return Object.freeze({ mount, content });
}
