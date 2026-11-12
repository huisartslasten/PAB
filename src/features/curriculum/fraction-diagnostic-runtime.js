import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { getStudentLearningProfile } from '../../core/student-registry.js';
import { buildViewUrl } from '../../core/view-context.js';
import { createFractionDiagnosticSessionV2, FRACTION_DIAGNOSTIC_TASKS_V2 } from '../../../pacogo-engine/fraction-diagnostic-session-v2.js';

const TASK_ORDER = Object.freeze(['F1', 'F2', 'F3', 'F4']);
const ACTION_LABELS = Object.freeze({
  factor: 'Factor',
  new_numerator: 'Teller',
  common_denominator: 'Noemer',
  first_numerator: 'Eerste teller',
  second_numerator: 'Tweede teller',
  result_numerator: 'Uitkomst',
  mixed_numerator: 'Teller na omzetten'
});
const ACTION_PROMPTS = Object.freeze({
  factor: 'Vul het ontbrekende getal in.',
  new_numerator: 'Vul de ontbrekende teller in.',
  common_denominator: 'Welke noemer gebruik je voor beide breuken?',
  first_numerator: 'Vul de ontbrekende teller in.',
  second_numerator: 'Vul de ontbrekende teller in.',
  result_numerator: 'Welke teller krijg je als uitkomst?',
  mixed_numerator: 'Vul de ontbrekende teller in.'
});

function expressionFor(action, taskId, snapshot) {
  const task = snapshot.tasks[taskId];
  const value = id => task.actions.find(item => item.actionId === id)?.rawValue;
  const common = value('common_denominator');
  const mixed = value('mixed_numerator');
  const first = value('first_numerator');
  const second = value('second_numerator');
  switch (taskId + '.' + action.actionId) {
    case 'F1.factor': return '2/3 → 3 × ? = 6';
    case 'F1.new_numerator': return '2/3 = ?/6';
    case 'F2.common_denominator': return '1/3 + 1/4 → noemer ?';
    case 'F2.first_numerator': return '1/3 = ?/' + common;
    case 'F2.second_numerator': return '1/4 = ?/' + common;
    case 'F2.result_numerator': return first + '/' + common + ' + ' + second + '/' + common + ' = ?/' + common;
    case 'F3.common_denominator': return '1/2 − 2/5 → noemer ?';
    case 'F3.first_numerator': return '1/2 = ?/' + common;
    case 'F3.second_numerator': return '2/5 = ?/' + common;
    case 'F3.result_numerator': return first + '/' + common + ' − ' + second + '/' + common + ' = ?/' + common;
    case 'F4.mixed_numerator': return '1 1/3 = ?/3';
    case 'F4.common_denominator': return mixed + '/3 − 2/5 → noemer ?';
    case 'F4.first_numerator': return mixed + '/3 = ?/' + common;
    case 'F4.second_numerator': return '2/5 = ?/' + common;
    case 'F4.result_numerator': return first + '/' + common + ' − ' + second + '/' + common + ' = ?/' + common;
    default: return action.expression;
  }
}

export function createFractionDiagnosticRuntime({ app, templateMount, context, documentRef = document, navigate } = {}) {
  if (!app || !templateMount || typeof navigate !== 'function') throw new TypeError('Fraction diagnostic runtime requires app, template mount and navigation.');
  const student = context?.student || '';
  const studentProfile = getStudentLearningProfile(student);
  const content = documentRef.createElement('div');
  content.className = 'fraction-diagnostic';
  let session = null;
  let learner = null;

  const setup = documentRef.createElement('section');
  setup.id = 'fraction-diagnostic-setup';
  setup.className = 'card fraction-diagnostic-card';
  const setupTitle = documentRef.createElement('h2');
  setupTitle.textContent = 'Wie gaat de breukendiagnose maken?';
  const setupCopy = documentRef.createElement('p');
  setupCopy.className = 'fraction-diagnostic-muted';
  setupCopy.textContent = 'PacoGO onderzoekt jouw tussenstappen. Jij voert iedere rekenstap zelf uit. Dit is een formatieve diagnose, geen toets of mastery-beslissing.';
  const setupStatus = documentRef.createElement('p');
  setupStatus.className = 'fraction-diagnostic-status';
  setupStatus.setAttribute('role', 'status');
  setupStatus.setAttribute('aria-live', 'polite');
  setupStatus.textContent = 'Ouderaccount controleren…';
  const learnerList = documentRef.createElement('div');
  learnerList.className = 'fraction-diagnostic-learners';
  setup.append(setupTitle, setupCopy, setupStatus, learnerList);

  const diagnostic = documentRef.createElement('section');
  diagnostic.id = 'fraction-diagnostic-card';
  diagnostic.className = 'card fraction-diagnostic-card';
  diagnostic.hidden = true;
  const learnerLabel = documentRef.createElement('p');
  learnerLabel.className = 'fraction-diagnostic-muted';
  const taskTitle = documentRef.createElement('h2');
  const actionPrompt = documentRef.createElement('p');
  actionPrompt.className = 'fraction-diagnostic-muted';
  const progress = documentRef.createElement('p');
  progress.className = 'fraction-diagnostic-progress';
  const expression = documentRef.createElement('div');
  expression.className = 'fraction-diagnostic-expression';
  expression.setAttribute('aria-label', 'Rekenopgave');
  const form = documentRef.createElement('form');
  form.id = 'fraction-diagnostic-action-form';
  const fields = documentRef.createElement('div');
  fields.className = 'fraction-diagnostic-fields';
  const submit = documentRef.createElement('button');
  submit.type = 'submit';
  submit.className = 'success';
  submit.textContent = 'Volgende stap';
  form.append(expression, fields, submit);
  const historyTitle = documentRef.createElement('h3');
  historyTitle.className = 'fraction-diagnostic-history-title';
  historyTitle.textContent = 'Jouw eerdere antwoorden';
  const history = documentRef.createElement('div');
  history.className = 'fraction-diagnostic-history';
  const diagnosticNotice = documentRef.createElement('p');
  diagnosticNotice.className = 'fraction-diagnostic-muted';
  diagnosticNotice.textContent = 'Je krijgt tijdens deze diagnose nog geen goed/fout-feedback. PacoGO bekijkt de samenhang tussen jouw tussenstappen nadat je klaar bent.';
  const diagnosticStatus = documentRef.createElement('p');
  diagnosticStatus.className = 'fraction-diagnostic-status';
  diagnosticStatus.setAttribute('role', 'status');
  const stop = documentRef.createElement('button');
  stop.type = 'button';
  stop.className = 'secondary';
  stop.id = 'fraction-diagnostic-stop';
  stop.textContent = 'Diagnose stoppen';
  diagnostic.append(learnerLabel, taskTitle, actionPrompt, progress, form, historyTitle, history, diagnosticNotice, diagnosticStatus, stop);

  const result = documentRef.createElement('section');
  result.id = 'fraction-diagnostic-result';
  result.className = 'card fraction-diagnostic-card';
  result.hidden = true;
  const resultTitle = documentRef.createElement('h2');
  const resultCopy = documentRef.createElement('p');
  resultCopy.className = 'fraction-diagnostic-muted';
  const resultHistoryTitle = documentRef.createElement('h3');
  resultHistoryTitle.textContent = 'Ingevulde tussenstappen';
  const resultHistory = documentRef.createElement('div');
  resultHistory.className = 'fraction-diagnostic-result-history';
  const resultAction = documentRef.createElement('div');
  resultAction.className = 'fraction-diagnostic-result-actions';
  result.append(resultTitle, resultCopy, resultHistoryTitle, resultHistory, resultAction);
  content.append(setup, diagnostic, result);

  function renderMathExpression(host, text, inputLabel) {
    host.replaceChildren();
    host.setAttribute('data-expression', text);
    host.setAttribute('aria-label', text);
    let inputCreated = false;
    const appendValue = (parent, value, slotClass) => {
      const slot = documentRef.createElement('span');
      slot.className = slotClass;
      if (value === '?' && !inputCreated) {
        const input = documentRef.createElement('input');
        input.type = 'number';
        input.inputMode = 'numeric';
        input.min = '0';
        input.step = '1';
        input.required = true;
        input.name = 'answer';
        input.className = 'fraction-diagnostic-inline-input';
        input.setAttribute('aria-label', inputLabel || 'Jouw antwoord');
        slot.classList.add('fraction-diagnostic-inline-field');
        slot.appendChild(input);
        inputCreated = true;
      } else {
        slot.textContent = value === '?' ? 'zelfde' : value;
      }
      parent.appendChild(slot);
    };
    const tokenPattern = /(\d+\s+)?(\d+|\?)\/(\d+|\?)|(\?)/g;
    let cursor = 0;
    for (const match of text.matchAll(tokenPattern)) {
      if (match.index > cursor) host.append(documentRef.createTextNode(text.slice(cursor, match.index)));
      if (match[4]) {
        appendValue(host, '?', 'fraction-diagnostic-inline-field');
      } else {
        if (match[1]) {
          const whole = documentRef.createElement('span');
          whole.textContent = match[1].trim();
          host.append(whole);
        }
        const fraction = documentRef.createElement('span');
        fraction.className = 'fraction-diagnostic-fraction';
        appendValue(fraction, match[2], 'fraction-diagnostic-numerator');
        appendValue(fraction, match[3], 'fraction-diagnostic-denominator');
        host.append(fraction);
      }
      cursor = match.index + match[0].length;
    }
    if (cursor < text.length) host.append(documentRef.createTextNode(text.slice(cursor)));
  }

  function renderHistory(host, snapshot, activeTaskId = null) {
    host.replaceChildren();
    const list = documentRef.createElement('ol');
    list.className = 'fraction-diagnostic-history-list';
    let count = 0;
    for (const taskId of TASK_ORDER) {
      const task = snapshot.tasks[taskId];
      if (task.actions.length === 0 || (activeTaskId && taskId === activeTaskId)) continue;
      const group = documentRef.createElement('section');
      group.className = 'fraction-diagnostic-history-group';
      const heading = documentRef.createElement('h4');
      heading.textContent = FRACTION_DIAGNOSTIC_TASKS_V2[taskId].title;
      group.appendChild(heading);
      const items = documentRef.createElement('ul');
      for (const entry of task.actions) {
        const item = documentRef.createElement('li');
        item.textContent = (ACTION_LABELS[entry.actionId] || entry.actionId) + ': ' + entry.rawValue;
        items.appendChild(item);
        count++;
      }
      group.appendChild(items);
      host.appendChild(group);
    }
    if (activeTaskId) {
      const active = snapshot.tasks[activeTaskId];
      for (const entry of active.actions) {
        const item = documentRef.createElement('li');
        item.textContent = (ACTION_LABELS[entry.actionId] || entry.actionId) + ': ' + entry.rawValue;
        list.appendChild(item);
        count++;
      }
    }
    if (activeTaskId && list.childElementCount) {
      const heading = documentRef.createElement('h4');
      heading.textContent = FRACTION_DIAGNOSTIC_TASKS_V2[activeTaskId].title;
      host.append(heading, list);
    }
    if (count === 0) {
      const empty = documentRef.createElement('p');
      empty.className = 'fraction-diagnostic-muted';
      empty.textContent = 'Je antwoorden verschijnen hier nadat je een stap hebt vastgelegd.';
      host.appendChild(empty);
    }
  }

  function renderCurrentAction() {
    const current = session.getCurrentAction();
    if (!current) return showResult();
    const snapshot = session.getSessionSnapshot();
    const state = session.getProgress();
    taskTitle.textContent = current.taskTitle;
    actionPrompt.textContent = ACTION_PROMPTS[current.action.actionId] || current.action.prompt;
    progress.textContent = 'Stap ' + (state.submittedActions + 1) + ' van maximaal 15';
    renderMathExpression(expression, expressionFor(current.action, current.taskId, snapshot), ACTION_LABELS[current.action.actionId]);
    fields.replaceChildren();
    history.replaceChildren();
    renderHistory(history, snapshot, current.taskId);
    diagnosticStatus.textContent = '';
    diagnostic.hidden = false;
    result.hidden = true;
    expression.querySelector('input')?.focus();
  }

  function showResult() {
    const snapshot = session.getSessionSnapshot();
    const state = session.getProgress();
    diagnostic.hidden = true;
    result.hidden = false;
    resultTitle.textContent = state.isStopped ? 'Diagnose gestopt' : 'Diagnose afgerond';
    resultCopy.textContent = state.isStopped
      ? 'Je ingevulde antwoorden zijn bewaard. Er is nog geen beoordeling of mastery-beslissing vastgelegd.'
      : snapshot.tasks.F4.status === 'not_administered'
        ? 'De basisstappen zijn vastgelegd. De extra opdracht met een gemengde breuk is overgeslagen omdat de vereiste tussenstappen bij het aftrekken nog niet allemaal zijn aangetoond.'
        : 'Alle aangeboden tussenstappen zijn vastgelegd. PacoGO heeft tijdens het maken geen goed/fout-antwoorden getoond.';
    resultHistory.replaceChildren();
    resultAction.replaceChildren();
    renderHistory(resultHistory, snapshot);
    resultHistoryTitle.hidden = resultHistory.childElementCount === 0;
    if (state.isComplete && !state.isStopped) {
      const practice = documentRef.createElement('button');
      practice.type = 'button';
      practice.id = 'fraction-diagnostic-open-practice';
      practice.className = 'success';
      practice.textContent = 'Start breuken oefenen';
      practice.addEventListener('click', () => {
        documentRef.defaultView.location.href = buildViewUrl('curriculum-fr2-practice-learner.html', {
          student,
          mode: context?.mode || 'student'
        }).toString();
      });
      resultAction.appendChild(practice);
    }
  }

  function start(selectedLearner) {
    learner = selectedLearner;
    session = createFractionDiagnosticSessionV2({
      learnerKey: learner.learner_key,
      storage: documentRef.defaultView?.localStorage || globalThis.localStorage
    });
    setup.hidden = true;
    learnerLabel.textContent = 'PacoGO • ' + learner.display_name + ' • Rekenen • Breuken';
    if (session.getProgress().isComplete || session.getProgress().isStopped) showResult();
    else renderCurrentAction();
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    try {
      const input = expression.querySelector('input');
      if (!input?.value.trim() || !Number.isSafeInteger(Number(input.value)) || Number(input.value) < 0) {
        input?.focus();
        throw new Error('Vul een niet-negatief heel getal in.');
      }
      session.submitCurrentAction(Number(input.value));
      renderCurrentAction();
    } catch (error) {
      diagnosticStatus.textContent = error.message;
    }
  });

  stop.addEventListener('click', () => {
    session.stop();
    showResult();
  });

  async function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
      greeting: student ? 'Hoi ' + student + '! 🐶' : 'Welkom bij PacoGO! 🐶',
      title: 'Breuken',
      icon: '📘',
      subtitle: 'Jij voert de rekenstappen uit. PacoGO kijkt naar de samenhang tussen jouw antwoorden.',
      navigation: createPacoNavigation({ app, active: 'skills', student, viewMode: context?.mode, includeManagement: true, navigate }),
      content
    });
    try {
      const auth = await app.initializeSession();
      if (!auth || !app.auth.isParent) {
        documentRef.defaultView.location.replace('auth.html?returnTo=curriculum-fraction-diagnostic-learner.html');
        return;
      }
      if (!student || !studentProfile?.curriculumKey) {
        setupStatus.textContent = 'Selecteer eerst een leerling via de balk bovenaan en open daarna opnieuw de breukendiagnose.';
        return;
      }
      const linkedLearner = await app.learnerCurriculum.getAppLearnerProfile(studentProfile.curriculumKey);
      if (!linkedLearner) {
        setupStatus.textContent = 'Voor ' + student + ' is nog geen curriculumprofiel gekoppeld. Open Beheer om een bestaand profiel te koppelen of een profiel aan te maken.';
        const manage = documentRef.createElement('button');
        manage.type = 'button';
        manage.className = 'secondary';
        manage.textContent = 'Open leerlingbeheer';
        manage.addEventListener('click', () => navigate(buildViewUrl('management.html', {
          student,
          mode: 'management',
          managementFilter: 'beheer'
        })));
        learnerList.appendChild(manage);
        return;
      }
      setupStatus.textContent = 'Leerlingprofiel voor ' + student + ' gevonden. De diagnose wordt geopend.';
      start(linkedLearner);
    } catch (error) {
      setupStatus.textContent = error?.message || 'De leerlingprofielen konden niet worden geladen.';
      setupStatus.classList.add('is-error');
    }
  }

  return Object.freeze({ mount, destroy() {}, content });
}
