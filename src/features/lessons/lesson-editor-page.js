const TYPE_LABELS = Object.freeze({
  words: '🎯 Woordtrainer',
  questions: '❓ Vragen',
  dictation: '✏️ Dictee',
  math: '🔢 Rekenen',
  spelling: '✍️ Spelling',
  custom: '🛠️ Eigen les'
});

const STUDENTS = Object.freeze(['Zyon', 'Zenith', 'Zephon', 'Testleerling']);
const text = value => String(value ?? '').trim();
const esc = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function normalizeParts(parts, fallback = '') {
  if (!Array.isArray(parts)) {
    const value = text(fallback);
    return value ? [{ text: value, role: 'answer' }] : [];
  }
  return parts.map(part => ({ text: text(part?.text), role: part?.role === 'extra' ? 'extra' : 'answer' })).filter(part => part.text);
}

function editorShell() {
  return `
    <div class="editor-page-banner"><img src="pacogo-aruba-hero.png" alt="Paco op Aruba"><div class="banner-label" data-editor-title>🐾 NIEUWE LES</div></div>
    <div class="card editor-main-card">
      <div class="editor-action-row"><button class="success" type="button" data-action="save">💾 Les opslaan</button></div>
      <div class="editor-student"><strong>Voor welke leerling?</strong><div class="editor-student-buttons">
        ${STUDENTS.map(student => `<label class="editor-student-choice"><input type="radio" name="lessonStudent" value="${esc(student)}"><span>${esc(student)}</span></label>`).join('')}
      </div></div>
      <div class="editor-top-grid">
        <div class="editor-top-left">
          <div class="field"><label for="lessonSubject">Vak</label><input id="lessonSubject" placeholder="Voer vak in bijvoorbeeld Nederlands"></div>
          <div class="field"><label for="lessonSubvak">Subvak <span class="small">(optioneel)</span></label><input id="lessonSubvak" placeholder="Bijvoorbeeld Themawoorden of Spelling"></div>
          <div class="field"><label for="lessonName">Naam van de les</label><input id="lessonName" placeholder="Bijvoorbeeld Week 4"></div>
        </div>
        <div class="editor-top-right">
          <div class="field"><label>Onderdeel</label><div class="lesson-type-select">
            <button type="button" id="lessonTypeButton" class="lesson-type-button" data-action="toggle-type"><span id="lessonTypeButtonText">🎯 Woordtrainer</span><span class="lesson-type-chevron">⌄</span></button>
            <div id="lessonTypeMenu" class="lesson-type-menu hidden">${Object.entries(TYPE_LABELS).map(([value, label]) => `<button type="button" data-type="${value}">${label}</button>`).join('')}</div>
            <select id="lessonType" class="lesson-type-native" tabindex="-1" aria-hidden="true">${Object.keys(TYPE_LABELS).map(value => `<option value="${value}">${value}</option>`).join('')}</select>
          </div></div>
          <div class="lesson-test-date-box"><label class="lesson-test-date-toggle"><input id="lessonTestDateEnabled" type="checkbox"> 📅 Toetsdatum instellen</label><div class="small" style="margin-top:5px">Optioneel. Alleen instellen als er al een toetsdatum bekend is.</div><input id="lessonTestDate" type="hidden"><div id="lessonTestDatePicker" class="date-picker lesson-test-date-picker hidden"></div></div>
          <div class="field"><label for="lessonExplanation">Uitleg <span class="small">(optioneel)</span></label><textarea id="lessonExplanation" placeholder="Leg hier de leerstof of regel uit. Dit wordt apart boven de oefeningen getoond."></textarea></div>
        </div>
      </div>
      <div id="lessonAiBox" class="card lesson-ai-box"><label class="lesson-test-date-toggle"><input id="lessonAiCheckAnswers" type="checkbox"> 🤖 AI moet het antwoord controleren</label><div class="small" style="margin-top:5px">Zet dit aan als je wilt dat AI bepaalt of het antwoord inhoudelijk goed is.</div><div id="lessonAiInstructionBox" class="lesson-ai-instruction"><div class="field" style="margin:0"><label for="lessonAiInstruction">Instructie voor de AI <span class="small">(optioneel)</span></label><textarea id="lessonAiInstruction" placeholder="Bijvoorbeeld: Een kleine spelfout is niet erg. Het antwoord hoeft niet 100% correct gespeld te zijn als de betekenis duidelijk goed is."></textarea></div></div></div>
      <div id="spellingLabelsEditor" class="card spelling-labels-box hidden"><h3>🏷️ Namen van de onderdelen</h3><div class="small">Deze teksten verschijnen bij het maken, oefenen en de toets.</div><div class="field"><label for="spellingLabelQuestion">Vraag / eerste regel</label><input id="spellingLabelQuestion" value="Werkwoord"></div><div class="field"><label for="spellingLabelPerfect">Tweede regel</label><input id="spellingLabelPerfect" value="Voltooid deelwoord"></div><div class="field"><label for="spellingLabelAdjective">Derde regel</label><input id="spellingLabelAdjective" value="Bijvoeglijk gebruikt voltooid deelwoord"></div></div>
      <div id="wordEditor"></div><div id="questionEditor" class="hidden"></div><div id="dictationEditor" class="hidden"></div><div id="mathEditor" class="hidden"></div><div id="spellingEditor" class="hidden"></div>
      <div class="row editor-bottom-actions"><button class="success" type="button" data-action="save">💾 Les opslaan</button></div>
      <div id="editorError" class="message error hidden"></div>
    </div>`;
}

function roleMarkup(role = 'answer') {
  const extra = role === 'extra';
  return `<select class="word-part-role" aria-hidden="true" tabindex="-1"><option value="answer" ${extra ? '' : 'selected'}>Wordt getoetst</option><option value="extra" ${extra ? 'selected' : ''}>Wordt niet getoetst</option></select><div class="word-part-role-select"><button type="button" class="word-part-role-button ${extra ? 'role-extra' : ''}" data-action="toggle-role"><span>${extra ? 'Wordt niet getoetst' : 'Wordt getoetst'}</span><span>⌄</span></button><div class="word-part-role-menu hidden"><button type="button" data-role="answer">Wordt getoetst</button><button type="button" class="role-extra-option" data-role="extra">Wordt niet getoetst</button></div></div>`;
}

function addQuestionPart(row, value = '') {
  const box = row.querySelector('.word-question-parts');
  if (!box) return;
  box.insertAdjacentHTML('beforeend', `<div class="word-part-row"><input class="word-q-part" value="${esc(value)}" placeholder="Vul hier de vraag in"><button type="button" class="word-part-remove" data-action="remove-part">✕</button></div>`);
}

function addAnswerPart(row, containerClass, inputClass, value = '', role = 'answer', placeholder = 'Vul hier het antwoord in') {
  const box = row.querySelector(`.${containerClass}`);
  if (!box) return;
  box.insertAdjacentHTML('beforeend', `<div class="word-part-row"><input class="${inputClass}" value="${esc(value)}" placeholder="${esc(placeholder)}">${roleMarkup(role)}<button type="button" class="word-part-remove" data-action="remove-part">✕</button></div>`);
}

function rowFrame(content, addLabel = '➕ Vraag toevoegen') {
  return `<div class="editor-row"><button class="remove-row" type="button" data-action="remove-row">✕</button>${content}<button type="button" class="question-insert-button" data-action="insert-row">${addLabel}</button></div>`;
}

function createWordRow({ questionParts = [''], answerParts = [{ text: '', role: 'answer' }], rules = null } = {}) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = rowFrame(`
    <div class="word-parts-section"><div class="word-parts-head"><label>Vraag</label></div><div class="word-question-parts"></div><button type="button" class="word-add-line word-add-line-bottom" data-action="add-question-part">➕ regel</button></div>
    <div class="word-parts-section"><div class="word-parts-head"><label>Antwoord</label></div><div class="word-answer-parts"></div><button type="button" class="word-add-line word-add-line-bottom" data-action="add-answer-part">➕ regel</button><div class="word-extra-note">Kies per regel of deze wordt beoordeeld als antwoord of alleen als extra informatie.</div></div>
    <div class="word-rules-box"><div class="word-rules-title">🎯 Beoordeling van het antwoord</div><div class="word-rules-grid"><div class="word-rule-field word-rule-required"><label>🔎 Verplichte woorden</label><input class="word-item-required-terms" type="text" placeholder="Bijvoorbeeld expert, computers (komma-gescheiden)"></div><div class="word-rule-field word-rule-min"><label>🔢 Minimum aantal<br>woorden</label><input class="word-item-min-words" type="number" min="0" max="100" value="0" placeholder="0 = geen minimum"></div></div></div>
    <div class="word-editor-bottom"><div class="word-editor-hint"><label>💡 Hint</label><textarea class="word-item-hint" placeholder="Bijvoorbeeld: Mijn vader is een ________ op het gebied van computers."></textarea></div></div>`);
  const row = wrapper.firstElementChild;
  questionParts.forEach(part => addQuestionPart(row, part));
  answerParts.forEach(part => addAnswerPart(row, 'word-answer-parts', 'word-a-part', part?.text || '', part?.role || 'answer'));
  if (rules) {
    row.querySelector('.word-item-hint').value = rules.hint || '';
    row.querySelector('.word-item-min-words').value = Number.isFinite(Number(rules.min_words)) ? Number(rules.min_words) : 0;
    row.querySelector('.word-item-required-terms').value = Array.isArray(rules.required_terms) ? rules.required_terms.join(', ') : (rules.required_terms || '');
  }
  return row;
}

function createUniversalRow({ answerClass, answerInputClass, answerPlaceholder = 'Vul hier het antwoord in', questionLabel = 'Vraag', questionParts = [''], answerParts = [{ text: '', role: 'answer' }] } = {}) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = rowFrame(`
    <div class="word-parts-section"><div class="word-parts-head"><label>${esc(questionLabel)}</label></div><div class="word-question-parts"></div><button type="button" class="word-add-line word-add-line-bottom" data-action="add-question-part">➕ regel</button></div>
    <div class="word-parts-section"><div class="word-parts-head"><label>Antwoord</label></div><div class="${answerClass}"></div><button type="button" class="word-add-line word-add-line-bottom" data-action="add-answer-part">➕ regel</button><div class="word-extra-note">Kies per regel of deze wordt beoordeeld als antwoord of alleen als extra informatie.</div>${answerClass === 'dictation-answer-parts' ? '<div class="dictation-spellcheck"></div>' : ''}</div>`);
  const row = wrapper.firstElementChild;
  row.dataset.answerClass = answerClass;
  row.dataset.answerInputClass = answerInputClass;
  row.dataset.answerPlaceholder = answerPlaceholder;
  questionParts.forEach(part => addQuestionPart(row, part));
  answerParts.forEach(part => addAnswerPart(row, answerClass, answerInputClass, part?.text || '', part?.role || 'answer', answerPlaceholder));
  return row;
}

function createDictationRow({ word = '' } = {}) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = rowFrame(`
    <div class="word-parts-section dictation-word-section">
      <div class="word-parts-head"><label>Dicteewoord</label></div>
      <div class="dictation-word-field"><input class="dictation-word-input" value="${esc(word)}" placeholder="Voer hier het woord in"></div>
      <div class="word-extra-note">Dit woord wordt precies zo uitgesproken en is de enige correcte spelling.</div>
    </div>`, '➕ Woord toevoegen');
  return wrapper.firstElementChild;
}

function createSpellingRow({ questionParts = [''], answerParts = [{ text: '', role: 'answer' }] } = {}) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = rowFrame(`
    <div class="word-parts-section"><div class="word-parts-head"><label class="spelling-label-question">Werkwoord</label></div><div class="word-question-parts"></div><button type="button" class="word-add-line word-add-line-bottom" data-action="add-question-part">➕ regel</button></div>
    <div class="word-parts-section"><div class="word-parts-head"><label>Antwoord</label></div><div class="spelling-answer-parts"></div><button type="button" class="word-add-line word-add-line-bottom" data-action="add-answer-part">➕ regel</button><div class="word-extra-note">Gebruik de regels voor de verschillende spellingvormen. Kies per regel of deze wordt getoetst.</div></div>`);
  const row = wrapper.firstElementChild;
  questionParts.forEach(part => addQuestionPart(row, part));
  answerParts.forEach(part => addAnswerPart(row, 'spelling-answer-parts', 'spelling-a-part', part?.text || '', part?.role || 'answer'));
  return row;
}

function addRow(root, type, data = {}) {
  const container = getRowsContainer(root, type);
  if (!container) return null;
  const row = type === 'words' || type === 'custom'
    ? createWordRow(data)
    : type === 'dictation'
      ? createDictationRow(data)
      : type === 'spelling'
        ? createSpellingRow(data)
        : createUniversalRow({
          answerClass: `${type}-answer-parts`,
          answerInputClass: `${type}-a-part`,
          answerPlaceholder: type === 'math' ? 'Vul het getal in' : 'Vul hier het antwoord in',
          questionLabel: type === 'math' ? 'Som' : 'Vraag',
          ...data
        });
  container.appendChild(row);
  return row;
}

function ensureDictationTrailingRow(root) {
  const container = root.querySelector('#dictationEditor');
  if (!container) return null;
  const lastRow = container.lastElementChild;
  const lastInput = lastRow?.querySelector('.dictation-word-input');
  if (!lastInput || text(lastInput.value)) return addRow(root, 'dictation');
  return null;
}

function getRowsContainer(root, type) {
  const map = { words: '#wordEditor', custom: '#wordEditor', questions: '#questionEditor', dictation: '#dictationEditor', math: '#mathEditor', spelling: '#spellingEditor' };
  const container = root.querySelector(map[type] || '#wordEditor');
  if (container && !container.querySelector('.editor-row')) container.style.counterReset = 'editorrow';
  return container;
}

function clearEditors(root) {
  ['wordEditor', 'questionEditor', 'dictationEditor', 'mathEditor', 'spellingEditor'].forEach(id => {
    const container = root.querySelector(`#${id}`);
    if (container) container.replaceChildren();
  });
}

function readDraft(root, lessonId) {
  const type = root.querySelector('#lessonType').value || 'words';
  const student = root.querySelector('input[name="lessonStudent"]:checked')?.value || '';
  if (type === 'dictation') {
    const rows = [...root.querySelectorAll('#dictationEditor .editor-row')]
      .map(row => ({ word: row.querySelector('.dictation-word-input')?.value.trim() || '' }))
      .filter(item => item.word);
    return {
      lessonId,
      student,
      subject: root.querySelector('#lessonSubject').value.trim(),
      enteredSubvak: root.querySelector('#lessonSubvak').value.trim(),
      title: root.querySelector('#lessonName').value.trim(),
      type,
      explanation: root.querySelector('#lessonExplanation').value.trim(),
      aiCheckAnswers: false,
      aiInstruction: '',
      editorLabels: null,
      items: rows,
      testDate: root.querySelector('#lessonTestDate').value || ''
    };
  }

  const questionParts = row => [...row.querySelectorAll('.word-q-part')].map(input => input.value.trim()).filter(Boolean);
  const answerParts = row => [...row.querySelectorAll('.word-a-part, .question-a-part, .math-a-part, .spelling-a-part')].map(input => ({ text: input.value.trim(), role: input.closest('.word-part-row')?.querySelector('.word-part-role')?.value === 'extra' ? 'extra' : 'answer' })).filter(part => part.text);
  const rows = [...root.querySelectorAll('.editor-row')].map(row => {
    const item = { question_parts: questionParts(row), answer_parts: answerParts(row) };
    if (type === 'words' || type === 'custom') {
      item.hint = row.querySelector('.word-item-hint')?.value.trim() || '';
      item.min_words = Number(row.querySelector('.word-item-min-words')?.value || 0);
      item.required_terms = (row.querySelector('.word-item-required-terms')?.value || '').split(',').map(text).filter(Boolean);
    }
    return item;
  });
  const editorLabels = type === 'spelling' ? {
    question: root.querySelector('#spellingLabelQuestion')?.value.trim() || 'Werkwoord',
    perfect: root.querySelector('#spellingLabelPerfect')?.value.trim() || 'Voltooid deelwoord',
    adjective: root.querySelector('#spellingLabelAdjective')?.value.trim() || 'Bijvoeglijk gebruikt voltooid deelwoord'
  } : null;
  return {
    lessonId,
    student,
    subject: root.querySelector('#lessonSubject').value.trim(),
    enteredSubvak: root.querySelector('#lessonSubvak').value.trim(),
    title: root.querySelector('#lessonName').value.trim(),
    type,
    explanation: root.querySelector('#lessonExplanation').value.trim(),
    aiCheckAnswers: root.querySelector('#lessonAiCheckAnswers').checked,
    aiInstruction: root.querySelector('#lessonAiInstruction').value.trim(),
    editorLabels,
    items: rows,
    testDate: root.querySelector('#lessonTestDate').value || ''
  };
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function parseDateKey(value) {
  const [year, month, day] = String(value || '').split('-').map(Number);
  return year && month && day ? new Date(year, month - 1, day) : new Date();
}

function renderDatePicker(root, selected = '', month = null) {
  const el = root.querySelector('#lessonTestDatePicker');
  if (!el) return;
  const current = month || (selected ? parseDateKey(selected) : new Date());
  const first = new Date(current.getFullYear(), current.getMonth(), 1);
  const days = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
  const start = (first.getDay() + 6) % 7;
  const title = new Intl.DateTimeFormat('nl-NL', { month: 'long', year: 'numeric' }).format(current).replace(/^./, c => c.toUpperCase());
  let html = `<div class="date-picker-head"><button type="button" class="date-picker-nav" data-date-shift="-1">‹</button><div class="date-picker-title">${esc(title)}</div><button type="button" class="date-picker-nav" data-date-shift="1">›</button></div><div class="date-picker-grid">${['Ma','Di','Wo','Do','Vr','Za','Zo'].map(day => `<div class="date-picker-weekday">${day}</div>`).join('')}`;
  for (let i = 0; i < start; i += 1) html += '<button type="button" class="date-picker-day empty"> </button>';
  const today = dateKey(new Date());
  for (let day = 1; day <= days; day += 1) {
    const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    html += `<button type="button" class="date-picker-day${key === selected ? ' selected' : ''}${key === today ? ' today' : ''}" data-date="${key}">${day}</button>`;
  }
  el.innerHTML = `${html}</div><div class="date-picker-help">Klik op een dag om de toetsdatum te kiezen.</div>`;
}

function applyVisibility(root, type) {
  ['wordEditor', 'questionEditor', 'dictationEditor', 'mathEditor', 'spellingEditor'].forEach(id => root.querySelector(`#${id}`)?.classList.add('hidden'));
  const visible = type === 'words' || type === 'custom' ? 'wordEditor' : `${type}Editor`;
  root.querySelector(`#${visible}`)?.classList.remove('hidden');
  root.querySelector('#spellingLabelsEditor')?.classList.toggle('hidden', type !== 'spelling');
  root.querySelector('#lessonAiBox')?.classList.toggle('hidden', type === 'dictation');
  root.querySelector('#lessonTypeButtonText').textContent = TYPE_LABELS[type] || TYPE_LABELS.words;
}

function populateEditor(root, lesson, calendarDate = '') {
  const type = lesson?.type || 'words';
  root.querySelector('[data-editor-title]').textContent = lesson ? '🐾 LES BEWERKEN' : '🐾 NIEUWE LES';
  root.querySelector('#lessonSubject').value = lesson?.subject || '';
  root.querySelector('#lessonSubvak').value = lesson?.subvak || '';
  root.querySelector('#lessonName').value = lesson?.title || '';
  root.querySelector('#lessonExplanation').value = lesson?.explanation || '';
  root.querySelector('#lessonAiCheckAnswers').checked = lesson?.ai_check_answers === true;
  root.querySelector('#lessonAiInstruction').value = lesson?.ai_instruction || '';
  root.querySelector('#lessonType').value = type;
  root.querySelector('#lessonTestDate').value = calendarDate || '';
  root.querySelector('#lessonTestDateEnabled').checked = Boolean(calendarDate);
  root.querySelector('#lessonTestDatePicker').classList.toggle('hidden', !calendarDate);
  root.querySelectorAll('input[name="lessonStudent"]').forEach(input => { input.checked = input.value === (lesson?.student || 'Zyon'); });
  if (lesson?.editor_labels) {
    root.querySelector('#spellingLabelQuestion').value = lesson.editor_labels.question || 'Werkwoord';
    root.querySelector('#spellingLabelPerfect').value = lesson.editor_labels.perfect || 'Voltooid deelwoord';
    root.querySelector('#spellingLabelAdjective').value = lesson.editor_labels.adjective || 'Bijvoeglijk gebruikt voltooid deelwoord';
  }
  clearEditors(root);
  const items = Array.isArray(lesson?.lesson_items) ? lesson.lesson_items : [];
  if (!items.length) addRow(root, type);
  else items.forEach(item => addRow(root, type, type === 'dictation'
    ? { word: text(item.answer || item.word) }
    : { questionParts: item.question_parts || text(item.question).split('\n'), answerParts: normalizeParts(item.answer_parts, item.answer), rules: item }));
  applyVisibility(root, type);
  renderDatePicker(root, calendarDate, calendarDate ? parseDateKey(calendarDate) : new Date());
  root.querySelector('#lessonAiInstructionBox').classList.toggle('hidden', !root.querySelector('#lessonAiCheckAnswers').checked || type === 'dictation');
}

function showError(root, message) {
  const error = root.querySelector('#editorError');
  if (!error) return;
  error.textContent = message || '';
  error.classList.toggle('hidden', !message);
}

function rowTemplateData(row) {
  if (row.querySelector('.dictation-word-input')) return { word: '' };
  const questionCount = Math.max(1, row.querySelectorAll('.word-q-part').length);
  const answerInputs = [...row.querySelectorAll('.word-a-part, .question-a-part, .math-a-part, .spelling-a-part')];
  const answerParts = answerInputs.length
    ? answerInputs.map(input => ({ text: '', role: input.closest('.word-part-row')?.querySelector('.word-part-role')?.value === 'extra' ? 'extra' : 'answer' }))
    : [{ text: '', role: 'answer' }];
  const rules = {
    hint: row.querySelector('.word-item-hint')?.value.trim() || '',
    min_words: Number(row.querySelector('.word-item-min-words')?.value || 0),
    required_terms: (row.querySelector('.word-item-required-terms')?.value || '').split(',').map(text).filter(Boolean)
  };
  return {
    questionParts: Array.from({ length: questionCount }, () => ''),
    answerParts,
    rules
  };
}

export function createLessonEditorPage({ root, runtime, initialLesson = null, student = '' } = {}) {
  if (!root || typeof root !== 'object') throw new Error('Lesson editor page requires a root element.');
  if (!runtime || typeof runtime.save !== 'function') throw new Error('Lesson editor page requires a lesson editor runtime.');

  root.innerHTML = editorShell();
  const lessonId = initialLesson?.id ?? null;
  let datePickerMonth = initialLesson?.testDate ? parseDateKey(initialLesson.testDate) : new Date();
  populateEditor(root, { ...initialLesson, student: initialLesson?.student || student }, initialLesson?.testDate || '');
  if (!initialLesson && student) root.querySelectorAll('input[name="lessonStudent"]').forEach(input => { input.checked = input.value === student; });

  async function save() {
    showError(root, '');
    const draft = readDraft(root, lessonId);
    const result = await runtime.save(draft);
    if (!result?.ok) {
      showError(root, result?.message || 'De les kon niet worden opgeslagen.');
      return result;
    }
    window.location.href = `management.html?student=${encodeURIComponent(draft.student)}`;
    return result;
  }

  root.addEventListener('click', async event => {
    const button = event.target.closest('button');
    if (!button || !root.contains(button)) return;
    if (button.dataset.type) {
      const type = button.dataset.type;
      root.querySelector('#lessonType').value = type;
      root.querySelector('#lessonTypeMenu').classList.add('hidden');
      if (!getRowsContainer(root, type).children.length) addRow(root, type);
      applyVisibility(root, type);
      return;
    }
    if (button.dataset.action === 'toggle-type') { root.querySelector('#lessonTypeMenu').classList.toggle('hidden'); return; }
    if (button.dataset.action === 'save') { button.disabled = true; try { await save(); } finally { button.disabled = false; } return; }
    if (button.dataset.action === 'remove-row') {
      const row = button.closest('.editor-row'); const container = row?.parentElement; row?.remove();
      if (container && !container.children.length) addRow(root, root.querySelector('#lessonType').value);
      return;
    }
    if (button.dataset.action === 'insert-row') {
      const current = button.closest('.editor-row');
      const container = current?.parentElement;
      if (!current || !container) return;
      const data = rowTemplateData(current);
      const created = addRow(root, root.querySelector('#lessonType').value, data);
      if (created) {
        current.insertAdjacentElement('afterend', created);
        created.querySelector('input,textarea')?.focus();
      }
      return;
    }
    if (button.dataset.action === 'add-question-part') { addQuestionPart(button.closest('.editor-row')); return; }
    if (button.dataset.action === 'add-answer-part') {
      const row = button.closest('.editor-row');
      addAnswerPart(row, row.dataset.answerClass || 'word-answer-parts', row.dataset.answerInputClass || 'word-a-part', '', 'answer', row.dataset.answerPlaceholder || 'Vul hier het antwoord in');
      return;
    }
    if (button.dataset.action === 'remove-part') { button.closest('.word-part-row')?.remove(); return; }
    if (button.dataset.action === 'toggle-role') {
      const row = button.closest('.word-part-row');
      root.querySelectorAll('.word-part-role-menu:not(.hidden)').forEach(menu => { if (!row?.contains(menu)) menu.classList.add('hidden'); });
      row?.querySelector('.word-part-role-menu')?.classList.toggle('hidden');
      return;
    }
    if (button.dataset.role) {
      const row = button.closest('.word-part-row'); const select = row?.querySelector('.word-part-role'); const display = row?.querySelector('.word-part-role-button');
      if (select) select.value = button.dataset.role;
      if (display) { display.classList.toggle('role-extra', button.dataset.role === 'extra'); display.querySelector('span').textContent = button.dataset.role === 'extra' ? 'Wordt niet getoetst' : 'Wordt getoetst'; }
      row?.querySelector('.word-part-role-menu')?.classList.add('hidden');
      return;
    }
    if (button.dataset.dateShift) { datePickerMonth = new Date(datePickerMonth.getFullYear(), datePickerMonth.getMonth() + Number(button.dataset.dateShift), 1); renderDatePicker(root, root.querySelector('#lessonTestDate').value, datePickerMonth); return; }
    if (button.dataset.date) { root.querySelector('#lessonTestDate').value = button.dataset.date; root.querySelector('#lessonTestDateEnabled').checked = true; renderDatePicker(root, button.dataset.date, parseDateKey(button.dataset.date)); }
  });

  root.addEventListener('change', event => {
    if (event.target.id === 'lessonType') applyVisibility(root, event.target.value);
    if (event.target.id === 'lessonTestDateEnabled') {
      const enabled = event.target.checked;
      root.querySelector('#lessonTestDatePicker').classList.toggle('hidden', !enabled);
      if (enabled) renderDatePicker(root, root.querySelector('#lessonTestDate').value, datePickerMonth); else root.querySelector('#lessonTestDate').value = '';
    }
    if (event.target.id === 'lessonAiCheckAnswers') root.querySelector('#lessonAiInstructionBox').classList.toggle('hidden', !event.target.checked);
  });

  root.addEventListener('input', event => {
    if (event.target.matches('.dictation-word-input')) {
      const row = event.target.closest('.editor-row');
      const container = root.querySelector('#dictationEditor');
      if (row && container && row === container.lastElementChild && text(event.target.value)) ensureDictationTrailingRow(root);
    }
    if (!event.target.id.startsWith('spellingLabel')) return;
    const labels = getSpellingLabelsFromRow(root);
    root.querySelectorAll('.spelling-label-question').forEach(el => { el.textContent = labels.question; });
    root.querySelectorAll('.spelling-label-perfect').forEach(el => { el.textContent = labels.perfect; });
    root.querySelectorAll('.spelling-label-adjective').forEach(el => { el.textContent = labels.adjective; });
  });

  return Object.freeze({ save, readDraft: () => readDraft(root, lessonId) });
}
