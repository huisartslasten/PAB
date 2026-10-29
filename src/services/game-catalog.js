// Canonical PacoGO game registry.
// Routes, labels, presentation metadata and score semantics live here.
// Supabase stores stable game keys for persistence; it does not define the game catalog.

export const PACOGO_GAMES = Object.freeze([
  Object.freeze({ id: 'double-or-nothing', label: 'Double or Nothing', path: 'double-or-nothing.html', icon: '🦴', description: 'Waag botjes, verdien ze erbij en probeer je record te verbreken.', status: 'active', scoreDirection: 'high' }),
  Object.freeze({ id: 'memory', label: 'Memory', path: 'memory.html', icon: '🧠', description: 'Vind de vraag en het bijbehorende antwoord bij elkaar.', status: 'active', scoreDirection: 'low' }),
  Object.freeze({ id: 'flash-question', label: 'Flash', path: 'flash-question.html', icon: '⚡', description: 'Kies snel het juiste antwoord en oefen alle vragen.', status: 'active', scoreDirection: 'high' }),
  Object.freeze({ id: 'tic-tac-toe', label: 'Tic-Tac-Toe', path: 'tic-tac-toe.html', icon: '⭕', description: 'Beantwoord de vragen en speel jezelf naar drie op een rij.', status: 'active', scoreDirection: 'high' }),
  Object.freeze({ id: 'drop4', label: 'DROP4', path: 'drop4.html', icon: '🔴', description: 'Beantwoord de vragen en probeer vier stenen op een rij te krijgen.', status: 'active', scoreDirection: 'low' }),
  Object.freeze({ id: 'connect-the-dots', label: 'Connect the Dots', path: 'connect-the-dots.html', icon: '🔵', description: 'Zet lijnen tussen stippen, sluit vakjes en pak de meeste vakjes.', status: 'active', scoreDirection: 'high' }),
  Object.freeze({ id: 'word-reveal', label: 'Letter Hunt', path: 'word-reveal.html', icon: '🐶', description: 'Beantwoord de lesvragen, kies zelf letters en onthul het geheime doel.', status: 'active', scoreDirection: 'low' }),
  Object.freeze({ id: 'word-chase', label: 'Word Chase', path: 'word-chase.html', icon: '🏃', description: 'Beantwoord de lesvragen en jaag op een geheim woord van vijf letters.', status: 'active', scoreDirection: 'low' }),
  Object.freeze({ id: 'lexo', label: 'LEXO', path: 'lexo.html', icon: '🔤', description: 'Beantwoord de lesvragen en maak zoveel mogelijk woorden met zestien letters.', status: 'active', scoreDirection: 'high' })
]);

export function getPacoGames() { return PACOGO_GAMES.map(game => ({ ...game })); }
export function getPacoGame(gameId) { const game = PACOGO_GAMES.find(candidate => candidate.id === gameId); return game ? { ...game } : null; }
export function getActivePacoGames() { return PACOGO_GAMES.filter(game => game.status === 'active').map(game => ({ ...game })); }
