import { inheritMultipleChoiceConfig, normalizeMultipleChoiceConfig, MULTIPLE_CHOICE_LIMITS } from './multiple-choice-config.js';

const text = value => String(value ?? '').trim();
const esc = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function getAnswerInput(row) {
  return row.querySelector('.math-a-part, .question-a-part, .word-a-part, .spelling-a-part, .dictation-word-input');
}

function getWrongOptionInputs(row) {
  return [...row.querySelectorAll('.multiple-choice-wrong-input')];
}

function renderWrongOptions(row, values = []) {
  const box = row.querySelector('.multiple-choice-options');
  if (!box) return;
  box.innerHTML = values.map((value, index) => `
    <div class="multiple-choice-option-row">
      <input class="multiple-choice-wrong-input" value="${esc(value)}" placeholder="Fout antwoord ${index + 1}">
      <button type="button" class="word-part-remove" data-action="remove-multiple-choice-option" aria-label="Verwijder fout antwoord">✕</button>
    </div>`).join('');
}

export function getMultipleChoiceConfigFromRow(row) {
  if (!row) return normalizeMultipleChoiceConfig();
  const enabled = row.querySelector('.multiple-choice-enabled')?.checked === true;
  const count = row.querySelector('.multiple-choice-option-count')?.value;
  return normalizeMultipleChoiceConfig({
    enabled,
    optionCount: count ?? row.dataset.multipleChoiceOptionCount
  });
}

export function inheritMultipleChoiceConfigFromRow(row) {
  return inheritMultipleChoiceConfig(getMultipleChoiceConfigFromRow(row));
}

export function renderMultipleChoiceEditor(row, config = {}, wrongOptions = []) {
  if (!row) return;
  const normalized = normalizeMultipleChoiceConfig(config);
  const checkbox = row.querySelector('.multiple-choice-enabled');
  const count = row.querySelector('.multiple-choice-option-count');
  const controls = row.querySelector('.multiple-choice-controls');
  const responseMode = row.querySelector('.response-mode');
  const optionBox = row.querySelector('.multiple-choice-options');

  if (checkbox) checkbox.checked = normalized.enabled;
  if (count) count.value = String(normalized.optionCount);
  row.dataset.multipleChoiceOptionCount = String(normalized.optionCount);
  if (controls) controls.classList.toggle('hidden', !normalized.enabled);
  if (responseMode) responseMode.classList.toggle('hidden', normalized.enabled);
  if (optionBox) optionBox.classList.toggle('hidden', !normalized.enabled);

  if (normalized.enabled) {
    row.dataset.multipleChoiceBaseResponseType = row.dataset.multipleChoiceBaseResponseType || row.dataset.responseType || 'text';
    row.dataset.responseType = 'multiple_choice';
    renderWrongOptions(row, wrongOptions);
  } else {
    row.dataset.responseType = row.dataset.multipleChoiceBaseResponseType || row.dataset.responseType || 'text';
  }
}

export function readMultipleChoiceDraft(row) {
  const config = getMultipleChoiceConfigFromRow(row);
  const correctAnswer = text(getAnswerInput(row)?.value);
  const wrongOptions = getWrongOptionInputs(row).map(input => text(input.value)).filter(Boolean);
  return {
    enabled: config.enabled,
    optionCount: config.optionCount,
    correctAnswer,
    wrongOptions,
    options: config.enabled ? [correctAnswer, ...wrongOptions] : [],
    correctOption: config.enabled ? correctAnswer : ''
  };
}

export async function generateMultipleChoiceDistractors(row, { generate, context = {} } = {}) {
  if (typeof generate !== 'function') throw new TypeError('Multiple-choice generation requires an AI generator.');
  const draft = readMultipleChoiceDraft(row);
  if (!draft.enabled) throw new Error('Multiple choice is not enabled.');
  if (!draft.correctAnswer) throw new Error('Vul eerst het juiste antwoord in.');
  const question = [...row.querySelectorAll('.word-q-part')].map(input => text(input.value)).filter(Boolean).join('\n');
  if (!question && context.lessonType !== 'dictation') throw new Error('Vul eerst de vraag in.');

  const button = row.querySelector('[data-action="generate-distractors"]');
  if (button) { button.disabled = true; button.dataset.generating = 'true'; button.textContent = 'Bezig…'; }
  try {
    const options = await generate({
      question: question || 'Dictee: kies de juiste spelling.',
      correctAnswer: draft.correctAnswer,
      optionCount: draft.optionCount,
      subject: context.subject || '',
      subvak: context.subvak || '',
      context: { lessonType: context.lessonType || '', theme: context.theme || '' }
    });
    renderWrongOptions(row, options);
    return options;
  } finally {
    if (button) { button.disabled = false; button.dataset.generating = 'false'; button.textContent = 'Genereer'; }
  }
}

export function multipleChoiceOptionCountOptions() {
  return Array.from({ length: MULTIPLE_CHOICE_LIMITS.maxOptionCount - MULTIPLE_CHOICE_LIMITS.minOptionCount + 1 }, (_, index) => {
    const value = index + MULTIPLE_CHOICE_LIMITS.minOptionCount;
    return `<option value="${value}">${value}</option>`;
  }).join('');
}