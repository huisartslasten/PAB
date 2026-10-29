import { getPacoGame } from './game-catalog.js';

function requireDb(db) {
  if (!db || typeof db.from !== 'function') throw new Error('A Supabase client is required.');
}

function normalizeStudent(student) {
  const value = String(student ?? '').trim();
  if (!value) throw new Error('A student is required.');
  return value;
}

function normalizeLessonId(lessonId) {
  if (lessonId == null || lessonId === '') return null;
  const value = Number(lessonId);
  if (!Number.isInteger(value) || value <= 0) throw new Error('A valid lesson is required when lesson scope is provided.');
  return value;
}

function normalizeScore(score) {
  const value = Math.floor(Number(score));
  if (!Number.isFinite(value) || value < 0) throw new Error('A valid non-negative score is required.');
  return value;
}

function requireGame(gameKey) {
  const game = getPacoGame(gameKey);
  if (!game || game.status !== 'active') throw new Error(`Game "${gameKey}" is not available.`);
  return game;
}

export function createGameResultService(db) {
  requireDb(db);

  async function findGameId(gameKey) {
    return requireGame(gameKey).id;
  }

  async function getHighScore({ gameKey, lessonId = null, student }) {
    const game = requireGame(gameKey);
    const normalizedLessonId = normalizeLessonId(lessonId);
    const normalizedStudent = normalizeStudent(student);
    const ascending = game.scoreDirection === 'low';

    let query = db.from('game_results').select('score').eq('game_key', game.id).eq('student', normalizedStudent).order('score', { ascending }).limit(1);
    query = normalizedLessonId == null ? query.is('lesson_id', null) : query.eq('lesson_id', normalizedLessonId);

    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    return data?.score == null ? null : Math.max(0, Math.floor(Number(data.score) || 0));
  }

  async function saveResult({ gameKey, lessonId = null, student, score }) {
    const game = requireGame(gameKey);
    const normalizedLessonId = normalizeLessonId(lessonId);
    const normalizedStudent = normalizeStudent(student);
    const normalizedScore = normalizeScore(score);

    const { error } = await db.from('game_results').insert({
      game_key: game.id,
      lesson_id: normalizedLessonId,
      student: normalizedStudent,
      score: normalizedScore
    });
    if (error) throw error;
    return normalizedScore;
  }

  return Object.freeze({ findGameId, getHighScore, saveResult });
}
