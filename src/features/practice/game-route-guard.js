import { buildViewUrl } from '../../core/view-context.js';
import { getPacoGame } from '../../services/game-catalog.js';

export async function guardGameRoute({ app, gameKey, context, lessonId = '', navigate } = {}) {
  const game = getPacoGame(gameKey);
  if (!game) throw new Error(`Unknown game route: ${gameKey}`);
  if (game.id === 'double-or-nothing') return true;

  // A game page without a lesson is a valid canonical shell state, but it is
  // not a playable context. The page runtime itself stops before loading play data.
  if (!lessonId) return true;

  const student = context?.student || '';
  if (!student) return false;

  const access = await app.gameAccess.getAccess(student);
  const state = access.find(item => item.gameKey === game.id);
  if (state?.unlocked === true) return true;

  const target = buildViewUrl('games.html', { student, mode: context?.mode });
  target.searchParams.set('lesson_id', lessonId);
  if (typeof navigate === 'function') await navigate(target);
  return false;
}
