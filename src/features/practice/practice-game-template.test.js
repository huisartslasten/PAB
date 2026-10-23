import { createPracticeGameTemplate, PRACTICE_DIFFICULTIES } from './practice-game-template.js';

function createDocument() {
  return document;
}

describe('practice game template', () => {
  test('provides the canonical rookie/goat difficulty selector', () => {
    const { element, dropdown } = createPracticeGameTemplate({ documentRef: createDocument() });

    expect(PRACTICE_DIFFICULTIES.map(option => option.value)).toEqual(['rookie', 'goat']);
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
});
