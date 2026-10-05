export function createLessonPlayerState(items = []) {
  const queue = Array.isArray(items) ? items : [];
  let index = 0;
  let mode = 'practice';
  let answer = '';
  let revealed = false;

  return {
    get index() { return index; },
    get mode() { return mode; },
    get answer() { return answer; },
    get revealed() { return revealed; },
    get currentItem() { return queue[index] || null; },
    get total() { return queue.length; },
    setMode(value) { mode = value === 'test' ? 'test' : 'practice'; },
    setAnswer(value) { answer = String(value ?? ''); },
    reveal() { revealed = true; },
    next() { if (index < queue.length) index += 1; answer = ''; revealed = false; return queue[index] || null; },
    reset() { index = 0; answer = ''; revealed = false; }
  };
}
