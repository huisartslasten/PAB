import { getPacoGame } from './game-catalog.js';

function requireDb(db) {
  if (!db || typeof db.rpc !== 'function') throw new Error('A Supabase client with RPC access is required.');
}

function normalizeStudent(student) {
  const value = String(student ?? '').trim();
  if (!value) throw new Error('A student is required.');
  return value;
}

function mapRecord(record) {
  return Object.freeze({
    gameKey: String(record?.game_key || ''),
    unlocked: record?.unlocked === true,
    cycle: Number(record?.cycle) || 1,
    requiredTests: Number(record?.required_tests) || 10,
    minimumScore: Number(record?.minimum_score) || 9,
    creditedTests: Number(record?.credited_tests) || 0
  });
}

export function createGameAccessService(db) {
  requireDb(db);

  async function getAccess(student) {
    const normalizedStudent = normalizeStudent(student);
    const { data, error } = await db.rpc('get_game_access', { p_student: normalizedStudent });
    if (error) throw error;
    return Object.freeze((Array.isArray(data) ? data : []).map(mapRecord));
  }

  async function claimUnlock({ student, gameKey }) {
    const normalizedStudent = normalizeStudent(student);
    const game = getPacoGame(gameKey);
    if (!game || game.id === 'double-or-nothing') throw new Error('This game cannot be unlocked through progression.');

    const { data, error } = await db.rpc('claim_game_unlock', {
      p_student: normalizedStudent,
      p_game_key: game.id
    });
    if (error) throw error;
    return Object.freeze((Array.isArray(data) ? data : []).map(mapRecord));
  }

  async function setGameAccess({ student, gameKey, unlocked }) {
    const normalizedStudent = normalizeStudent(student);
    const game = getPacoGame(gameKey);
    if (!game) throw new Error('Unknown game.');

    const { data, error } = await db.rpc('admin_set_game_access', {
      p_student: normalizedStudent,
      p_game_key: game.id,
      p_unlocked: unlocked === true
    });
    if (error) throw error;
    return Object.freeze((Array.isArray(data) ? data : []).map(mapRecord));
  }

  async function setSettings({ student, requiredTests, minimumScore }) {
    const normalizedStudent = normalizeStudent(student);
    const { data, error } = await db.rpc('admin_set_game_access_settings', {
      p_student: normalizedStudent,
      p_required_tests: Number(requiredTests),
      p_minimum_score: Number(minimumScore)
    });
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : null;
    return Object.freeze({
      requiredTests: Number(row?.required_tests) || Number(requiredTests),
      minimumScore: Number(row?.minimum_score) ?? Number(minimumScore)
    });
  }

  return Object.freeze({ getAccess, claimUnlock, setGameAccess, setSettings });
}
