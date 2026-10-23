const WORDS = [
  'aarde','avond','appel','armen','audio','baken','basis','beeld','beest','begin','beide','beren','besje','beste','beton','bomen','boven','brand','brein','broek','brood','buurt','cavia','circa','datum','deken','dicht','droom','druif','eerst','engel','fiets','flink','fluit','fruit','geest','geven','gloed','glans','groot','groep','haast','halen','haren','haven','hekel','hemel','hondje','hoofd','hoort','hotel','jager','jasje','jeugd','kaart','kamer','kansje','keren','keuze','koken','koren','kracht','kunst','laden','lager','lezen','licht','liefs','lucht','maart','maken','maten','media','meter','mezen','moeder','motor','muren','muziek','nacht','naast','negen','nooit','onder','oogst','ouder','paard','panda','papier','plein','plant','plaat','plank','plein','prima','radio','regen','reken','rente','robot','ronde','ruimte','samen','schat','school','stoel','storm','straat','stuur','taart','talen','tante','teken','tempo','tenen','tiger','touwt','trein','trots','tweede','vader','varen','vaten','verre','vloer','vogel','vuren','water','wereld','weten','wilde','windje','wonen','woord','zacht','zagen','zomer','zonen','zwaar','zweet','zwaar'
];

const NORMALIZED_WORDS = Object.freeze([...new Set(WORDS.map(word => word.toLocaleLowerCase('nl-NL')))]);
const DICTIONARY = new Set(NORMALIZED_WORDS);

export function normalizeWord(value) {
  return String(value ?? '').trim().toLocaleLowerCase('nl-NL');
}

export function isFiveLetterWord(value) {
  const word = normalizeWord(value);
  return [...word].length === 5 && DICTIONARY.has(word);
}

export function getWordDictionary() {
  return NORMALIZED_WORDS.slice();
}

export function pickWord(random = Math.random, exclude = '') {
  const excluded = normalizeWord(exclude);
  const candidates = NORMALIZED_WORDS.filter(word => word !== excluded);
  const pool = candidates.length ? candidates : NORMALIZED_WORDS;
  return pool[Math.floor(Math.max(0, Math.min(0.999999, Number(random()) || 0)) * pool.length)];
}
