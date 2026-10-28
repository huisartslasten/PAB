// Domain boundary for answer grading.
// The lesson test runtime asks this service to evaluate open answers; it does not
// know how the Supabase Edge Function is reached.

export function createAnswerGradingService(db) {
  if (!db?.functions?.invoke) throw new Error('A Supabase functions client is required.');

  async function gradeAnswer(question, correctAnswer, userAnswer) {
    const normalizedCorrectAnswer = String(correctAnswer ?? '').trim().toLocaleLowerCase('nl-NL');
    const normalizedUserAnswer = String(userAnswer ?? '').trim().toLocaleLowerCase('nl-NL');

    if (normalizedCorrectAnswer && normalizedCorrectAnswer === normalizedUserAnswer) {
      return { correct: true, feedback: '' };
    }

    const { data, error } = await db.functions.invoke('grade-answer-v2', {
      body: {
        question: String(question ?? ''),
        correctAnswer: String(correctAnswer ?? ''),
        userAnswer: String(userAnswer ?? '')
      }
    });

    if (error) throw error;
    if (!data) throw new Error('Geen antwoord van de AI.');

    return {
      correct: data.correct === true,
      feedback: data.feedback || ''
    };
  }

  return Object.freeze({ gradeAnswer });
}
