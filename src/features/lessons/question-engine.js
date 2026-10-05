export function createQuestionSession(items = []) {
  const source = Array.isArray(items) ? [...items] : [];
  let index = 0;
  const results = [];

  function currentItem() { return source[index] || null; }

  function reveal(answer) {
    const item = currentItem();
    if (!item) return null;
    return {
      item,
      answer: String(answer ?? ''),
      expected: String(item.answer ?? '')
    };
  }

  function next(selfAssessment = null) {
    if (currentItem()) results.push({ item: currentItem(), selfAssessment });
    index += 1;
    return { done: index >= source.length, index, total: source.length };
  }

  return Object.freeze({
    get index() { return index; },
    get total() { return source.length; },
    get results() { return [...results]; },
    currentItem,
    reveal,
    next
  });
}
