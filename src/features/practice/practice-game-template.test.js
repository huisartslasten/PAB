import { createPracticeGameTemplate, PRACTICE_DIFFICULTIES, PRACTICE_PACO_THINKING_DELAY_MS, schedulePacoTurn } from './practice-game-template.js';

function createDocument() {
  return document;
}

describe('practice game template', () => {
  test('provides the canonical noob/goat difficulty selector', () => {
    const { element, dropdown } = createPracticeGameTemplate({ documentRef: createDocument() });

    expect(PRACTICE_DIFFICULTIES.map(option => option.value)).toEqual(['rookie', 'goat']);
    expect(PRACTICE_DIFFICULTIES.map(option => option.label)).toEqual(['NOOB', 'GOAT']);
    expect(element.querySelector('.practice-game-header')).not.toBeNull();
    expect(element.querySelector('.practice-game-stats')).not.toBeNull();
    expect(element.querySelector('.practice-game-area')).not.toBeNull();
    expect(element.querySelector('.practice-game-exercise')).not.toBeNull();
    expect(element.querySelector('.practice-game-feedback')).not.toBeNull();
    expect(dropdown.getValue()).toBe('rookie');
  });

  test('supports game-specific content without changing the shell', () => {
    const gameArea = document.createElement('div');
    gameArea.textContent = 'LEXO';
    const exercise = document.createElement('div');
    exercise.textContent = 'Lesvraag';

    const { element } = createPracticeGameTemplate({
      documentRef: document,
      gameArea,
      exercise
    });

    expect(element.querySelector('.practice-game-area').textContent).toContain('LEXO');
    expect(element.querySelector('.practice-game-exercise').textContent).toContain('Lesvraag');
  });

  test('owns the shared three-second Paco thinking delay', () => {
    let scheduledDelay = null;
    let callback = null;
    let clearedTimer = null;
    const windowRef = {
      setTimeout(handler, delay) {
        callback = handler;
        scheduledDelay = delay;
        return 42;
      },
      clearTimeout(timer) {
        clearedTimer = timer;
      }
    };

    let called = false;
    const cancel = schedulePacoTurn({ windowRef, onTurn: () => { called = true; } });
    expect(PRACTICE_PACO_THINKING_DELAY_MS).toBe(3000);
    expect(scheduledDelay).toBe(3000);
    expect(called).toBe(false);
    callback();
    expect(called).toBe(true);
    cancel();
    expect(clearedTimer).toBe(42);
  });
});
