const WORDS = [
  'aarde','actie','ademt','adres','afval','afwas','alarm','alias','ander','angst','appel','arena','arend','armen','audio','avond','award','badge','baken','balen','banjo','basis','bedje','beeld','beest','begin','beide','beren','beste','beton','beter','bever','bewijs','bezig','bocht','bodem','boete','bonus','boord','bomen','boven','brand','brein','broek','brood','broer','bruin','buurt','cavia','circa','clown','cobra','datum','deken','deugd','dicht','diner','disco','droom','druif','eerst','egel','eieren','eigen','einde','eland','engel','enter','extra','feest','fiets','flink','fluit','focus','foto','fruit','gebak','geest','geven','geitje','geluk','geluid','gilet','gloed','glans','groot','groep','haard','haast','halen','halve','hamer','haren','harde','hartje','haven','hazen','hekel','hemel','hekje','helder','hinde','hobby','hondje','hoofd','hoort','hotel','huizen','humor','ieder','idee','indruk','inzet','ijsje','jager','jasje','jeugd','joker','jonge','juist','kaart','kabel','kamer','kano','kans','kansje','katje','kegel','kenner','kerst','kersje','keten','keuze','klein','klomp','klokje','knoop','koekje','koken','komst','konijn','koren','kracht','kraan','krant','krans','kruis','kunst','lachen','ladder','lager','lampje','later','leest','lepel','lenen','leren','lezen','lever','licht','liefs','liefde','lijst','lijnt','limon','lopen','loper','loods','lucht','maart','macht','maken','mango','markt','massa','matig','maten','media','meter','metro','micro','model','molen','motor','mouwt','muren','muisje','muziek','nacht','naast','negen','nooit','nodig','noord','norma','nylon','onder','oogje','oogst','opera','ouder','paard','panda','panne','papier','peper','peren','piano','pizza','plaats','plant','plaat','plank','plein','ploeg','pluis','poort','praat','prima','prijs','proef','radio','regen','regel','reken','rente','rivier','robot','roest','ronde','rozen','ruimte','ruzie','samen','sapje','schat','schelp','schijn','school','schip','slapen','slimste','snoepje','snelst','sport','spoor','stoel','stofje','storm','straat','strik','stuur','taart','tafel','talen','tante','tapijt','teken','tegel','tempo','tenen','tennis','terug','thuis','tijger','tiger','touwt','trein','trend','trots','trui','trouw','typen','vader','vaker','varen','vaten','vecht','veilig','veer','veren','verft','verre','video','vloer','vlieg','vogel','volop','volgen','vuren','water','wapen','wazen','wereld','wezen','weten','wielt','wilde','wijzer','winkel','winnen','winter','wonen','woord','zacht','zadel','zagen','zalen','zandje','zebra','zomer','zonen','zoute','zwaar','zweet','zwerk','zucht'
];

const SECRET_SEED = [
  'aarde','actie','adres','afval','alarm','ander','angst','appel','avond','armen','audio','baken','balen','basis','beeld','beest','begin','beide','beren','beste','beton','beter','bever','bewijs','bezig','bocht','bodem','boete','bonus','boord','bomen','boven','brand','brein','broek','brood','broer','bruin','buurt','cavia','datum','deken','dicht','diner','droom','druif','eerst','eigen','einde','eland','engel','extra','feest','fiets','flink','fluit','fruit','geest','geven','geluk','gloed','glans','groot','groep','haard','haast','halen','hamer','haren','haven','hekel','hemel','hoofd','hoort','hotel','huizen','humor','ieder','inzet','ijsje','jager','jasje','jeugd','juist','kaart','kabel','kamer','kans','keuze','klein','klomp','klok','knoop','koken','koren','kracht','kraan','krant','krans','kruis','kunst','lachen','ladder','lager','lamp','later','lepel','lenen','leren','lezen','lever','licht','liefde','lijst','lopen','loper','loods','lucht','maart','macht','maken','mango','markt','massa','maten','media','meter','metro','model','molen','motor','muren','muziek','nacht','naast','negen','nooit','nodig','noord','onder','oogst','ouder','paard','panda','papier','peper','peren','piano','pizza','plaats','plant','plaat','plank','plein','ploeg','poort','praat','prima','prijs','proef','regen','regel','reken','rente','rivier','robot','roest','ronde','rozen','ruimte','ruzie','samen','schat','schip','slapen','sport','spoor','stoel','storm','straat','strik','stuur','taart','tafel','talen','tante','teken','tegel','tempo','tenen','tennis','terug','thuis','tijger','trein','trend','trots','trui','trouw','typen','vader','vaker','varen','vecht','veilig','veer','veren','verre','video','vloer','vlieg','vogel','volop','volgen','water','wapen','wereld','wezen','weten','wilde','wijzer','winkel','winnen','winter','wonen','woord','zacht','zadel','zagen','zalen','zebra','zomer','zonen','zwaar','zweet','zucht'
];

const normalizeList = values => Object.freeze(
  [...new Set(values.map(value => String(value).toLocaleLowerCase('nl-NL')))]
    .filter(word => [...word].length === 5 && /^[a-z]+$/.test(word))
);

const NORMALIZED_WORDS = normalizeList(WORDS);
const SECRET_WORDS = normalizeList(SECRET_SEED).filter(word => NORMALIZED_WORDS.includes(word));
const DICTIONARY = new Set(NORMALIZED_WORDS);
const SECRET_DICTIONARY = new Set(SECRET_WORDS);

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

export function getSecretWordDictionary() {
  return SECRET_WORDS.slice();
}

export function pickWord(random = Math.random, excludedWords = []) {
  const excluded = new Set((Array.isArray(excludedWords) ? excludedWords : [excludedWords]).map(normalizeWord));
  const candidates = SECRET_WORDS.filter(word => !excluded.has(word));
  const pool = candidates.length ? candidates : SECRET_WORDS;
  return pool[Math.floor(Math.max(0, Math.min(0.999999, Number(random()) || 0)) * pool.length)];
}
