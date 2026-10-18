// Canonical persistence boundary for game results.
// Game runtimes own scoring rules; this service owns Supabase result storage
// and best-score reads shared by all games. Score direction is defined by the game catalog.

function requireDb(db) {
  if (!db || typeof db.from !== 'function') {
    throw new Error('A Supabase client is required.');
  }
}

function normalizeStudent(student) {
  const value = String(student ?? '').trim();
  if (!value) throw new Error('A student is required.');
  return value;
}

function normalizeLessonId(lessonId) {
  const value = Number(lessonId);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error('A valid lesson is required.');
  }
  return value;
}

function normalizeScore(score) {
  const value = Math.floor(Number(score));
  if (!Number.isFinite(value) || value < 0) {
    throw new Error('A valid non-negative score is required.');
  }
  return value;
}

export function createGameResultService(db) {
  requireDb(db);

  async function findGame(gameKey) {
    const key = String(gameKey ?? '').trim();
    if (!key) throw new Error('A game key is required.');

    const { data, error } = await db
      .from('games')
      .select('id, score_direction')
      .eq('key', key)
      .eq('active', true)
      .maybeSingle();

    if (error) throw error;
    if (!data?.id) throw new Error(`Game "${key}" is not available.`);
    return Object.freeze({
      id: data.id,
      scoreDirection: data.score_direction === 'low' ? 'low' : 'high'
    });
  }

  async function findGameId(gameKey) {
    const game = await findGame(gameKey);
    return game.id;
  }

  async function getHighScore({ gameKey, lessonId, student }) {
    const game = await findGame(gameKey);
    const normalizedLessonId = normalizeLessonId(lessonId);
    const normalizedStudent = normalizeStudent(student);
    const ascending = game.scoreDirection === 'low';

    const { data, error } = await db
      .from('game_results')
      .select('score')
      .eq('game_id', game.id)
      .eq('lesson_id', normalizedLessonId)
      .eq('student', normalizedStudent)
      .order('score', { ascending })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data?.score == null ? null : Math.max(0, Math.floor(Number(data.score) || 0));
  }

  async function saveResult({ gameKey, lessonId, student, score }) {
    const game = await findGame(gameKey);
    const normalizedLessonId = normalizeLessonId(lessonId);
    const normalizedStudent = normalizeStudent(student);
    const normalizedScore = normalizeScore(score);

    const { error } = await db
      .from('game_results')
      .insert({
        game_id: game.id,
        lesson_id: normalizedLessonId,
        student: normalizedStudent,
        score: normalizedScore
      });

    if (error) throw error;
    return normalizedScore;
  }

  return Object.freeze({
    findGameId,
    getHighScore,
    saveResult
  });
}
