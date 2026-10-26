import test from 'node:test';
import assert from 'node:assert/strict';
import { createPacoRouter } from '../src/core/router.js';

function createFakeDocument() {
  const links = [];
  const head = {
    appendChild(link) {
      links.push(link);
      link.sheet = {};
      link.dispatchEvent({ type: 'load' });
    },
    querySelectorAll(selector) {
      if (selector === 'link[rel="stylesheet"]') return [...links];
      return [];
    }
  };

  return {
    baseURI: 'http://localhost:8000/',
    head,
    createElement() {
      const listeners = new Map();
      return {
        dataset: {},
        sheet: null,
        addEventListener(type, listener) {
          listeners.set(type, listener);
        },
        dispatchEvent(event) {
          listeners.get(event.type)?.(event);
        },
        getAttribute(name) {
          return name === 'href' ? this.href : null;
        },
        remove() {
          const index = links.indexOf(this);
          if (index >= 0) links.splice(index, 1);
        }
      };
    }
  };
}

function createWindow(documentRef) {
  const listeners = new Map();
  return {
    document: documentRef,
    location: { href: 'http://localhost:8000/lessons.html' },
    history: {
      pushState() {},
      replaceState() {}
    },
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    removeEventListener(type) {
      listeners.delete(type);
    }
  };
}

test('router loads the shared tile stylesheet and target route stylesheet before mounting', async () => {
  const documentRef = createFakeDocument();
  const windowRef = createWindow(documentRef);
  const events = [];
  const routes = {};

  const lessonChoice = ({ navigate }) => ({
    mount() {
      events.push('mount');
      assert.equal(documentRef.head.querySelectorAll('link[rel="stylesheet"]').length, 2);
    }
  });
  Object.defineProperty(lessonChoice, 'styles', {
    value: Object.freeze(['src/features/lessons/lesson-choice.css'])
  });
  routes['lesson-choice.html'] = lessonChoice;

  const router = createPacoRouter({ windowRef, routes, documentRef });
  events.push('before');
  await router.navigate('/lesson-choice.html');
  events.push('after');

  assert.deepEqual(events, ['before', 'mount', 'after']);
  assert.deepEqual(router.getRouteStyles('/lesson-choice.html'), ['src/components/paco-tile.css', 'src/features/lessons/lesson-choice.css']);
});

test('router removes route styles while keeping the shared tile stylesheet active', async () => {
  const documentRef = createFakeDocument();
  const windowRef = createWindow(documentRef);
  const routes = {};

  const first = () => ({ mount() {} });
  Object.defineProperty(first, 'styles', { value: Object.freeze(['src/features/lessons/lesson-choice.css']) });
  routes['lesson-choice.html'] = first;

  const second = () => ({ mount() {} });
  Object.defineProperty(second, 'styles', { value: Object.freeze(['src/features/lessons/questions.css']) });
  routes['questions.html'] = second;

  const router = createPacoRouter({ windowRef, routes, documentRef });
  await router.navigate('/lesson-choice.html');
  await router.navigate('/questions.html');

  const hrefs = documentRef.head
    .querySelectorAll('link[rel="stylesheet"]')
    .map(link => link.getAttribute('href'));

  assert.deepEqual(hrefs, ['src/components/paco-tile.css', 'src/features/lessons/questions.css']);
});