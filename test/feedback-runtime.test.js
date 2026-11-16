import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const feedbackPage = readFileSync(new URL('../feedback.html', import.meta.url), 'utf8');
const feedbackRuntime = readFileSync(new URL('../src/features/management/feedback-runtime.js', import.meta.url), 'utf8');
const routeRegistry = readFileSync(new URL('../src/app/routes.js', import.meta.url), 'utf8');
const managementRuntime = readFileSync(new URL('../src/features/management/runtime.js', import.meta.url), 'utf8');


test('feedback page delegates ownership to the canonical Paco runtime', () => {
  assert.match(feedbackPage, /startPacoRuntime/);
  assert.doesNotMatch(feedbackPage, /renderFeedback/);
  assert.doesNotMatch(feedbackPage, /createPacoNavigation/);
  assert.doesNotMatch(feedbackPage, /createPacoGOApp/);
});

test('feedback route uses the canonical management runtime and styles', () => {
  assert.match(routeRegistry, /import \{ createFeedbackRuntime \} from '\.\.\/features\/management\/feedback-runtime\.js';/);
  assert.match(routeRegistry, /routes\['feedback\.html'\] = defineRoute\(\(\{ url, navigate \}\) => createFeedbackRuntime/);
  assert.match(routeRegistry, /routes\['feedback\.html'\][\s\S]*?src\/features\/management\/management-support\.css/);
});

test('management dashboard does not duplicate feedback navigation', () => {
  assert.doesNotMatch(managementRuntime, /createAction\('💬 Feedback'/);
  assert.doesNotMatch(managementRuntime, /createAction\('💬 Feedback',[\s\S]*?documentNavigation/);
});

test('feedback runtime owns feedback presentation through the management domain', () => {
  assert.match(feedbackRuntime, /renderFeedback\(feedbackList, management\)/);
  assert.match(feedbackRuntime, /management = app\.management/);
  assert.match(feedbackRuntime, /active: 'feedback'/);
  assert.match(feedbackRuntime, /viewMode: 'management'/);
});
