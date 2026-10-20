import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { buildViewUrl } from '../../core/view-context.js';
import { renderFeedback } from './management-view.js';

export function createFeedbackRuntime({
  app,
  templateMount,
  context,
  documentRef = document,
  navigate
} = {}) {
  if (!app) throw new TypeError('Feedback runtime requires an app.');
  if (!templateMount) throw new TypeError('Feedback runtime requires a template mount.');
  if (!context) throw new TypeError('Feedback runtime requires a view context.');
  if (typeof navigate !== 'function') throw new TypeError('Feedback runtime requires a navigation owner.');

  const content = documentRef.createElement('div');
  content.className = 'management-page';

  const state = documentRef.createElement('div');
  state.className = 'management-state';
  state.textContent = 'Feedback laden…';
  content.appendChild(state);

  const feedbackSection = documentRef.createElement('section');
  feedbackSection.className = 'management-section';
  const feedbackList = documentRef.createElement('div');
  feedbackSection.appendChild(feedbackList);

  const management = app.management;

  async function refreshFeedback() {
    feedbackList.replaceChildren();
    await renderFeedback(feedbackList, management);
  }

  async function mount() {
    const session = await app.initializeSession();
    if (!session) {
      window.location.href = 'auth.html';
      return;
    }

    if (!app.auth.isParent) {
      mountPacoPageTemplate({
        mount: templateMount,
        backLabel: '← Beheer',
        backAction: () => navigate(buildViewUrl('management.html')),
        greeting: 'PacoGO beheer ⚙️',
        title: 'Feedback',
        icon: '💬',
        subtitle: 'Je hebt geen toegang tot Feedback.',
        navigation: createPacoNavigation({
          app,
          active: 'feedback',
          viewMode: 'management',
          navigate
        }),
        content
      });
      state.textContent = 'Je hebt geen toegang tot Feedback.';
      return;
    }

    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Beheer',
      backAction: () => navigate(buildViewUrl('management.html')),
      greeting: 'PacoGO beheer ⚙️',
      title: 'Feedback',
      icon: '💬',
      subtitle: 'Bekijk feedback die vanuit PacoGO is ingediend.',
      navigation: createPacoNavigation({
        app,
        active: 'feedback',
        viewMode: 'management',
        navigate
      }),
      content
    });

    try {
      await refreshFeedback();
      content.replaceChildren(feedbackSection);
    } catch (error) {
      console.error('Feedback page load error:', error);
      state.textContent = 'Feedback kon niet worden geladen.';
    }
  }

  return Object.freeze({ mount, content, render: refreshFeedback });
}
