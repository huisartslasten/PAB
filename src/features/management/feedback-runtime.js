import { createManagementShell } from './management-shell.js';
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
  const shell = createManagementShell({ app, templateMount, navigate, documentRef });

  async function refreshFeedback() {
    feedbackList.replaceChildren();
    await renderFeedback(feedbackList, management);
  }

  async function mount() {
    const shellState = await shell.mount({
      active: 'feedback',
      viewMode: 'management',
      title: 'Feedback',
      icon: '💬',
      subtitle: 'Bekijk feedback die vanuit PacoGO is ingediend.',
      content
    });

    if (!shellState?.authorized) {
      state.textContent = 'Je hebt geen toegang tot Feedback.';
      return;
    }

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
