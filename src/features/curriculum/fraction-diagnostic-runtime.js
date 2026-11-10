import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { createFractionDiagnosticSession, FRACTION_DIAGNOSTIC_STEPS } from '../../../../pacogo-engine/fraction-diagnostic-session.js';

export function createFractionDiagnosticRuntime({ app, templateMount, context, documentRef = document, navigate } = {}) {
  if (!app || !templateMount || typeof navigate !== 'function') throw new TypeError('Fraction diagnostic runtime requires app, template mount and navigation.');
  const student = context?.student || '';
  const content = documentRef.createElement('div');
  content.className = 'fraction-diagnostic';
  let session = null;
  let recommendation = null;
  let learner = null;

  const setup = documentRef.createElement('section');
  setup.className = 'paco-template-card fraction-diagnostic-card';
  const setupTitle = documentRef.createElement('h2');
  setupTitle.textContent = 'Wie gaat de breukendiagnose maken?';
  const setupCopy = documentRef.createElement('p');
  setupCopy.className = 'fraction-diagnostic-muted';
  setupCopy.textContent = 'PacoGO onderzoekt de tussenstappen bij breuken. Dit is een formatieve check, geen toets of mastery-beslissing.';
  const setupStatus = documentRef.createElement('p');
  setupStatus.className = 'fraction-diagnostic-status';
  setupStatus.setAttribute('role', 'status');
  setupStatus.setAttribute('aria-live', 'polite');
  setupStatus.textContent = 'Ouderaccount controleren…';
  const learnerList = documentRef.createElement('div');
  learnerList.className = 'fraction-diagnostic-learners';
  setup.append(setupTitle, setupCopy, setupStatus, learnerList);

  const diagnostic = documentRef.createElement('section');
  diagnostic.className = 'paco-template-card fraction-diagnostic-card';
  diagnostic.hidden = true;
  const learnerLabel = documentRef.createElement('p');
  learnerLabel.className = 'fraction-diagnostic-muted';
  const stepTitle = documentRef.createElement('h2');
  const prompt = documentRef.createElement('p');
  prompt.className = 'fraction-diagnostic-muted';
  const progress = documentRef.createElement('p');
  progress.className = 'fraction-diagnostic-progress';
  const expression = documentRef.createElement('div');
  expression.className = 'fraction-diagnostic-expression';
  const form = documentRef.createElement('form');
  const fields = documentRef.createElement('div');
  fields.className = 'fraction-diagnostic-fields';
  const submit = documentRef.createElement('button');
  submit.type = 'submit';
  submit.className = 'success';
  submit.textContent = 'Antwoord vastleggen';
  form.append(fields, submit);
  const diagnosticNotice = documentRef.createElement('p');
  diagnosticNotice.className = 'fraction-diagnostic-muted';
  diagnosticNotice.textContent = 'Tijdens de diagnose geeft PacoGO nog geen goed/fout-feedback. Zo worden eerst je eigen tussenstappen zichtbaar.';
  const diagnosticStatus = documentRef.createElement('p');
  diagnosticStatus.className = 'fraction-diagnostic-status';
  diagnosticStatus.setAttribute('role', 'status');
  diagnostic.append(learnerLabel, stepTitle, prompt, progress, expression, form, diagnosticNotice, diagnosticStatus);

  const result = documentRef.createElement('section');
  result.className = 'paco-template-card fraction-diagnostic-card';
  result.hidden = true;
  const resultTitle = documentRef.createElement('h2');
  const resultCopy = documentRef.createElement('p');
  resultCopy.className = 'fraction-diagnostic-muted';
  const explanation = documentRef.createElement('div');
  explanation.className = 'fraction-diagnostic-explanation';
  const practiceTitle = documentRef.createElement('h3');
  const practicePrompt = documentRef.createElement('p');
  practicePrompt.className = 'fraction-diagnostic-muted';
  const practiceExpression = documentRef.createElement('div');
  practiceExpression.className = 'fraction-diagnostic-expression';
  const practiceForm = documentRef.createElement('form');
  const practiceFields = documentRef.createElement('div');
  practiceFields.className = 'fraction-diagnostic-fields';
  const practiceSubmit = documentRef.createElement('button');
  practiceSubmit.type = 'submit';
  practiceSubmit.className = 'success';
  practiceSubmit.textContent = 'Oefening controleren';
  practiceForm.append(practiceFields, practiceSubmit);
  const practiceStatus = documentRef.createElement('p');
  practiceStatus.className = 'fraction-diagnostic-status';
  practiceStatus.setAttribute('role', 'status');
  const restart = documentRef.createElement('button');
  restart.type = 'button';
  restart.className = 'secondary';
  restart.textContent = 'Diagnose opnieuw doen';
  result.append(resultTitle, resultCopy, explanation, practiceTitle, practicePrompt, practiceExpression, practiceForm, practiceStatus, restart);

  const practiceLink = documentRef.createElement('button');
  practiceLink.type = 'button';
  practiceLink.className = 'secondary';
  practiceLink.textContent = 'Naar de gewone breukenoefeningen';
  practiceLink.addEventListener('click', () => navigate('curriculum-fr2-practice-learner.html'));
  content.append(setup, diagnostic, result, practiceLink);

  function renderFields(host, definitions) {
    host.replaceChildren();
    definitions.forEach(([id, labelText]) => {
      const label = documentRef.createElement('label');
      label.className = 'fraction-diagnostic-field';
      const caption = documentRef.createElement('span');
      caption.textContent = labelText;
      const input = documentRef.createElement('input');
      input.type = 'number';
      input.inputMode = 'numeric';
      input.min = '0';
      input.step = '1';
      input.required = true;
      input.name = id;
      input.className = 'paco-form-control';
      label.append(caption, input);
      host.appendChild(label);
    });
  }

  function readValues(host) {
    const values = {};
    for (const input of host.querySelectorAll('input')) {
      if (!input.value.trim() || !Number.isSafeInteger(Number(input.value)) || Number(input.value) < 0) {
        input.focus();
        throw new Error('Vul bij iedere stap een niet-negatief heel getal in.');
      }
      values[input.name] = Number(input.value);
    }
    return values;
  }

  function renderStep() {
    const step = session.getCurrentStep();
    if (!step) return showRecommendation();
    const state = session.getProgress();
    stepTitle.textContent = step.title;
    prompt.textContent = step.prompt;
    expression.textContent = step.expression;
    progress.textContent = 'Stap ' + (state.completedCount + 1) + ' van ' + state.totalCount;
    renderFields(fields, step.fields);
    diagnosticStatus.textContent = '';
  }

  function showRecommendation() {
    diagnostic.hidden = true;
    result.hidden = false;
    recommendation = session.getRecommendation();
    resultTitle.textContent = recommendation.kind === 'targeted-practice' ? 'Volgende stap: ' + recommendation.title : 'Breder toepassen';
    resultCopy.textContent = recommendation.kind === 'targeted-practice'
      ? 'PacoGO begint bij de eerste tussenstap die nog niet helemaal goed is ingevuld.'
      : 'Alle onderzochte tussenstappen zijn goed ingevuld. Dit is geen mastery-beslissing; een bredere toepassingssituatie is de volgende controle.';
    explanation.textContent = recommendation.explanation;
    const targeted = recommendation.kind === 'targeted-practice';
    practiceTitle.hidden = !targeted;
    practicePrompt.hidden = !targeted;
    practiceExpression.hidden = !targeted;
    practiceForm.hidden = !targeted;
    if (targeted) {
      const step = FRACTION_DIAGNOSTIC_STEPS.find(item => item.id === recommendation.stepId);
      practiceTitle.textContent = 'Probeer een vergelijkbare opgave';
      practicePrompt.textContent = recommendation.practice.prompt;
      practiceExpression.textContent = recommendation.practice.expression;
      renderFields(practiceFields, step.fields);
    } else {
      practiceStatus.textContent = '';
    }
  }

  function start(selectedLearner) {
    learner = selectedLearner;
    session = createFractionDiagnosticSession({ learnerKey: learner.learner_key, storage: documentRef.defaultView?.localStorage || globalThis.localStorage });
    setup.hidden = true;
    result.hidden = false;
    result.hidden = true;
    diagnostic.hidden = false;
    learnerLabel.textContent = 'PacoGO • ' + learner.display_name + ' • Rekenen • Breuken';
    if (session.getProgress().isComplete) showRecommendation();
    else renderStep();
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    try {
      const step = session.getCurrentStep();
      session.submitStep({ stepId: step.id, values: readValues(fields) });
      if (session.getCurrentStep()) renderStep();
      else showRecommendation();
    } catch (error) {
      diagnosticStatus.textContent = error.message;
    }
  });

  practiceForm.addEventListener('submit', event => {
    event.preventDefault();
    try {
      const outcome = session.evaluatePractice({ stepId: recommendation.stepId, values: readValues(practiceFields) });
      practiceStatus.textContent = outcome.correct
        ? 'Goed uitgevoerd. Je hebt deze aanpak in een nieuwe opgave toegepast. Probeer later nog een andere opgave.'
        : 'Deze oefening is nog niet helemaal goed. Vergelijk iedere tussenstap opnieuw met de uitleg.';
      practiceStatus.classList.toggle('is-error', !outcome.correct);
    } catch (error) {
      practiceStatus.textContent = error.message;
      practiceStatus.classList.add('is-error');
    }
  });

  function reset() {
    session.reset();
    result.hidden = true;
    diagnostic.hidden = false;
    renderStep();
  }
  restart.addEventListener('click', reset);

  async function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
      greeting: student ? 'Hoi ' + student + '! 🐶' : 'Welkom bij PacoGO! 🐶',
      title: 'Breuken',
      icon: '📘',
      subtitle: 'Ontdek welke tussenstap je al beheerst en wat je volgende leerstap is.',
      navigation: createPacoNavigation({ app, active: 'skills', student, viewMode: context?.mode, includeManagement: true, navigate }),
      content
    });
    try {
      const auth = await app.initializeSession();
      if (!auth || !app.auth.isParent) {
        documentRef.defaultView.location.replace('auth.html?returnTo=curriculum-fr2-fractions.html');
        return;
      }
      const learners = await app.learnerCurriculum.listLearners();
      if (!learners.length) {
        setupStatus.textContent = 'Er is nog geen leerlingprofiel beschikbaar. Maak eerst een profiel aan via Beheer.';
        return;
      }
      setupStatus.textContent = 'Kies het leerlingprofiel.';
      learners.forEach(item => {
        const button = documentRef.createElement('button');
        button.type = 'button';
        button.className = 'secondary';
        button.textContent = 'Start diagnose voor ' + item.display_name;
        button.addEventListener('click', () => start(item));
        learnerList.appendChild(button);
      });
    } catch (error) {
      setupStatus.textContent = error?.message || 'De leerlingprofielen konden niet worden geladen.';
      setupStatus.classList.add('is-error');
    }
  }

  return Object.freeze({ mount, destroy() {}, content });
}
