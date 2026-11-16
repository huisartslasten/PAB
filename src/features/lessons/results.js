export function calculateLessonScore(correct, total) {
  if (!total) return 0;
  return Math.round((Number(correct) / Number(total)) * 10) / 10;
}

export function buildTestResult(answers = []) {
  const list = Array.isArray(answers) ? answers : [];
  const correct = list.filter(answer => answer?.correct).length;
  return { correct, total: list.length, score: calculateLessonScore(correct, list.length), answers: list };
}
