import fs from 'node:fs';

const path = 'index.html';
const source = fs.readFileSync(path, 'utf8');
const startMarker = '\nfunction startTest(type){';
const endMarker = '\n\n\nfunction startQuestions(){';
const start = source.indexOf(startMarker);
const end = source.indexOf(endMarker, start + startMarker.length);

if (start < 0 || end < 0) {
  throw new Error('V4.78 player block markers were not found. Refusing to modify index.html.');
}

const legacyBlock = source.slice(start, end);
for (const marker of ['function startTest(type){', 'function renderTest(){', 'async function submitTest(){', 'async function finishTest(){']) {
  if (!legacyBlock.includes(marker)) {
    throw new Error(`Expected legacy player marker missing: ${marker}`);
  }
}

const replacement = `
const professionalPlayerHost = Object.freeze({
  getLesson: () => currentLesson,
  getStudent: () => currentStudent,
  db,
  persistence: null,
  documentRef: document,
  hideAll,
  showLessonChoice: lesson => {
    if (lesson?.id != null) openLesson(lesson.id);
  },
  goBack,
  clearActivity: () => { activity = null; },
  escapeHtml,
  speakAiText,
  stopAiAudio,
  gradeAnswer: (...args) => gradeWithAI(...args),
  shuffle
});

const professionalPlayerReady = import('./src/features/lessons/player-runtime-bootstrap.js')
  .then(({ createProfessionalPlayerBridge }) => createProfessionalPlayerBridge(professionalPlayerHost));

window.pacoGOProfessionalPlayerReady = professionalPlayerReady;

async function startTest(type) {
  const bridge = await professionalPlayerReady;
  return bridge.startTest(type);
}

async function submitTest(options = {}) {
  const bridge = await professionalPlayerReady;
  return bridge.submitTest(options);
}

async function speakTest() {
  const bridge = await professionalPlayerReady;
  return bridge.speakTest();
}
`;

const updated = source.slice(0, start) + replacement + source.slice(end);
fs.writeFileSync(path, updated);
console.log('Professional player runtime integrated into index.html.');
