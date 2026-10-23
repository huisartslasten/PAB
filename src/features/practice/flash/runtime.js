// Canonical domain runtime for the Flash practice game.
// Lesson items are the only question source. Presentation and persistence stay outside this module.

function normalizeItems(items) { return (Array.isArray(items) ? items : []).filter(item => item && typeof item === 'object'); }
function normalizeAnswer(value) { return String(value ?? '').trim(); }
function shuffle(values, random = Math.random) { const result = [...values]; for (let index = result.length - 1; index > 0; index -= 1) { const swapIndex = Math.floor(random() * (index + 1)); [result[index], result[swapIndex]] = [result[swapIndex], result[index]]; } return result; }
function buildOptions(items, itemIndex, random) {
  const correct = normalizeAnswer(items[itemIndex]?.answer); const distractors = []; const seen = new Set([correct]);
  for (const item of shuffle(items, random)) { const answer = normalizeAnswer(item.answer); if (!answer || seen.has(answer)) continue; seen.add(answer); distractors.push(answer); if (distractors.length === 3) break; }
  return shuffle([correct, ...distractors], random);
}
function buildQuestions(items, random) { return items.map((item, index) => Object.freeze({ question: normalizeAnswer(item.question), answer: normalizeAnswer(item.answer), options: Object.freeze(buildOptions(items, index, random)) })); }
export function createFlashRuntime({ items = [], random = Math.random } = {}) {
  if (typeof random !== 'function') throw new Error('A random function is required.');
  const lessonItems = normalizeItems(items); const questions = buildQuestions(lessonItems, random); let index = 0; let score = 0; let phase = questions.length ? 'question' : 'finished'; let lastResult = null;
  function snapshot() { return Object.freeze({ index, total: questions.length, score, maxScore: questions.length, phase, item: questions[index] || null, lastResult }); }
  function start() { index = 0; score = 0; phase = questions.length ? 'question' : 'finished'; lastResult = null; return snapshot(); }
  function submitAnswer(userAnswer) { if (phase !== 'question') throw new Error('Deze vraag kan nu niet worden beantwoord.'); const item = questions[index]; const givenAnswer = normalizeAnswer(userAnswer); const correct = givenAnswer === item.answer; const previousScore = score; const delta = correct ? 1 : 0; score += delta; lastResult = Object.freeze({ correct, expectedAnswer: item.answer, givenAnswer, previousScore, score, delta }); phase = index >= questions.length - 1 ? 'finished' : 'result'; return snapshot(); }
  function continueGame() { if (phase !== 'result') throw new Error('Er is geen volgende vraag beschikbaar.'); index += 1; phase = 'question'; lastResult = null; return snapshot(); }
  return Object.freeze({ start, submitAnswer, continueGame, snapshot });
}
export { buildOptions, buildQuestions, normalizeAnswer };
