import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { createPacoTile, createPacoTileGrid } from '../../components/paco-tile.js';
import { createPacoBoneDifficulty } from '../../components/design-system.js';
import { createFractionPracticeTemplate } from '../../../pacogo-engine/fraction-practice-template.js';
import { renderFractionAnswerInput } from '../../../pacogo-engine/fraction-answer-input.js';
import { renderFractionRepresentation, renderMixedNumber, renderFractionInputRepresentation } from '../../../pacogo-engine/fraction-learning-interface-renderers.js';
import { renderFractionOperation } from '../../../pacogo-engine/fraction-practice-operation.js';
import { renderFractionPracticeExpression } from '../../../pacogo-engine/fraction-practice-equation.js';
import { FRACTION_WHOLE_NUMBER_TIMES_PROPER_FRACTION_TASKS } from '../../../pacogo-engine/fraction-whole-number-times-proper-fraction-task-bank.js';
import { createFractionWholeNumberTimesProperFractionSession } from '../../../pacogo-engine/fraction-whole-number-times-proper-fraction-session.js';
import { FRACTION_WHOLE_NUMBER_TIMES_MIXED_FRACTION_GREATER_THAN_ONE_TASKS } from '../../../pacogo-engine/fraction-whole-number-times-mixed-fraction-greater-than-one-task-bank.js';
import { createFractionWholeNumberTimesMixedFractionGreaterThanOneSession } from '../../../pacogo-engine/fraction-whole-number-times-mixed-fraction-greater-than-one-session.js';
import { FRACTION_WHOLE_NUMBER_DIVIDED_BY_FRACTION_GREATER_THAN_ONE_TASKS } from '../../../pacogo-engine/fraction-whole-number-divided-by-fraction-greater-than-one-task-bank.js';
import { FRACTION_WHOLE_NUMBER_DIVIDED_BY_FRACTION_GREATER_THAN_ONE_GUIDED_TASKS } from '../../../pacogo-engine/fraction-whole-number-divided-by-fraction-greater-than-one-guided-task-bank.js';
import { createFractionWholeNumberDividedByFractionGreaterThanOneSession } from '../../../pacogo-engine/fraction-whole-number-divided-by-fraction-greater-than-one-session.js';
import { createFractionWholeNumberDividedByFractionGreaterThanOneGuidedSession } from '../../../pacogo-engine/fraction-whole-number-divided-by-fraction-greater-than-one-guided-session.js';
import { FRACTION_LIKE_DENOMINATOR_DIVISION_TASKS } from '../../../pacogo-engine/fraction-like-denominator-division-task-bank.js';
import { createFractionLikeDenominatorDivisionSession } from '../../../pacogo-engine/fraction-like-denominator-division-session.js';
import { FRACTION_UNLIKE_DENOMINATOR_DIVISION_TASKS } from '../../../pacogo-engine/fraction-unlike-denominator-division-task-bank.js';
import { createFractionUnlikeDenominatorDivisionSession } from '../../../pacogo-engine/fraction-unlike-denominator-division-session.js';
import { createFractionUnlikeDenominatorDivisionGuidedSession } from '../../../pacogo-engine/fraction-unlike-denominator-division-guided-session.js';
import { FRACTION_MIXED_LIKE_DENOMINATOR_DIVISION_TASKS } from '../../../pacogo-engine/fraction-mixed-like-denominator-division-task-bank.js';
import { createFractionMixedLikeDenominatorDivisionSession } from '../../../pacogo-engine/fraction-mixed-like-denominator-division-session.js';
import { FRACTION_LIKE_DENOMINATOR_DIVISION_GUIDED_TASKS } from '../../../pacogo-engine/fraction-like-denominator-division-guided-task-bank.js';
import { createFractionLikeDenominatorDivisionGuidedSession } from '../../../pacogo-engine/fraction-like-denominator-division-guided-session.js';
import { FRACTION_MIXED_LIKE_DENOMINATOR_DIVISION_GUIDED_TASKS } from '../../../pacogo-engine/fraction-mixed-like-denominator-division-guided-task-bank.js';
import { createFractionMixedLikeDenominatorDivisionGuidedSession } from '../../../pacogo-engine/fraction-mixed-like-denominator-division-guided-session.js';
import { createFractionLikeDenominatorSubtractionSession } from '../../../pacogo-engine/fraction-like-denominator-subtraction-session.js';
import { FRACTION_LIKE_DENOMINATOR_MULTIPLICATION_TASKS } from '../../../pacogo-engine/fraction-like-denominator-multiplication-task-bank.js';
import { createFractionLikeDenominatorMultiplicationSession } from '../../../pacogo-engine/fraction-like-denominator-multiplication-session.js';
import { FRACTION_UNLIKE_DENOMINATOR_MULTIPLICATION_TASKS } from '../../../pacogo-engine/fraction-unlike-denominator-multiplication-task-bank.js';
import { createFractionUnlikeDenominatorMultiplicationSession } from '../../../pacogo-engine/fraction-unlike-denominator-multiplication-session.js';
import { FRACTION_MIXED_LIKE_DENOMINATOR_MULTIPLICATION_TASKS } from '../../../pacogo-engine/fraction-mixed-like-denominator-multiplication-task-bank.js';
import { createFractionMixedLikeDenominatorMultiplicationSession } from '../../../pacogo-engine/fraction-mixed-like-denominator-multiplication-session.js';
import { FRACTION_MIXED_UNLIKE_DENOMINATOR_MULTIPLICATION_TASKS } from '../../../pacogo-engine/fraction-mixed-unlike-denominator-multiplication-task-bank.js';
import { createFractionMixedUnlikeDenominatorMultiplicationSession } from '../../../pacogo-engine/fraction-mixed-unlike-denominator-multiplication-session.js';
import { createFractionMixedLikeDenominatorSubtractionSession } from '../../../pacogo-engine/fraction-mixed-like-denominator-subtraction-session.js';
import { createFractionUnlikeMixedDenominatorSubtractionSession } from '../../../pacogo-engine/fraction-unlike-mixed-denominator-subtraction-session.js';
import { createFractionUnlikeDenominatorSubtractionSession } from '../../../pacogo-engine/fraction-unlike-denominator-subtraction-session.js';
import { FRACTION_ADDITION_LEVEL_3_TASKS } from '../../../pacogo-engine/fraction-addition-level-3-task-bank.js';
import { FRACTION_ADDITION_LEVEL_4_EXERCISE, createFractionUnequalIndependentAdditionSession } from '../../../pacogo-engine/fraction-unequal-independent-addition-session.js';
import { FRACTION_ADDITION_LEVEL_3B_TASKS } from '../../../pacogo-engine/fraction-addition-level-3b-task-bank.js';
import { createFractionAdditionPracticeSession } from '../../../pacogo-engine/fraction-addition-practice-session.js';
import { FRACTION_SUBTRACTION_EXERCISE, createFractionSubtractionPracticeSession } from '../../../pacogo-engine/fraction-whole-minus-mixed-subtraction-session.js';
import { FRACTION_ADDITION_LEVEL_5_GUIDED_TASKS, FRACTION_ADDITION_LEVEL_5_INDEPENDENT_TASKS } from '../../../pacogo-engine/fraction-addition-level-5-task-bank.js';
import { createFractionAdditionLevel5GuidedSession, createFractionAdditionLevel5IndependentSession } from '../../../pacogo-engine/fraction-addition-level-5-session.js';
import { FRACTION_WHOLE_MIXED_ADDITION_EXERCISE, createFractionWholeMixedAdditionSession } from '../../../pacogo-engine/fraction-whole-mixed-addition-session.js';
import { FRACTION_SAME_DENOMINATOR_ADDITION_EXERCISE, createFractionSameDenominatorAdditionSession } from '../../../pacogo-engine/fraction-same-denominator-addition-session.js';
import { FRACTION_MIXED_SAME_DENOMINATOR_ADDITION_EXERCISE, createFractionMixedSameDenominatorAdditionSession } from '../../../pacogo-engine/fraction-mixed-same-denominator-addition-session.js';
import { FRACTION_QUANTITY_WHOLE_MINUS_GREATER_THAN_ONE_TASK_BANK } from '../../../pacogo-engine/fraction-quantity-whole-minus-greater-than-one-task-bank.js';
import { createFractionQuantitySubtractionPractice } from '../../../pacogo-engine/fraction-quantity-subtraction-practice.js';
import { buildViewUrl } from '../../core/view-context.js';
import { MATH_SKILL_SUBJECTS, FRACTION_NAVIGATION_TOPICS } from './skills-navigation-catalog.js';

const FRACTION_DOMAIN = 'fractions';

function formatFractionPracticeProgress(progress, exercise) {
  const level = ' · Niveau ' + exercise.difficultyLevel + ' van ' + exercise.maxDifficultyLevel;
  return progress.isComplete
    ? progress.completedCount + ' van ' + progress.totalCount + ' afgerond' + level
    : 'Som ' + (progress.completedCount + 1) + ' van ' + progress.totalCount + level;
}

export function createSkillsRuntime({
  app,
  templateMount,
  context,
  domain = '',
  topic = '',
  exercise = '',
  documentRef = document,
  navigate
} = {}) {
  if (!app) throw new TypeError('Skills runtime requires an app.');
  if (!templateMount) throw new TypeError('Skills runtime requires template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Skills runtime requires a navigation owner.');

  const student = context?.student || '';
  const content = documentRef.createElement('div');
  let quantitySubtractionPractice = null;

  function openFractions() {
    navigate(buildViewUrl('skills.html', {
      student,
      mode: context?.mode,
      extra: { domain: FRACTION_DOMAIN }
    }));
  }

  function renderSubjectOverview() {
    content.replaceChildren();
    const card = documentRef.createElement('section');
    card.className = 'paco-template-card skills-navigation-card';
    const heading = documentRef.createElement('h2');
    heading.textContent = 'Rekenen';
    const introduction = documentRef.createElement('p');
    introduction.className = 'skills-navigation-introduction';
    introduction.textContent = 'Kies een rekenonderwerp.';
    const grid = createPacoTileGrid({ documentRef, className: 'skills-navigation-grid' });

    MATH_SKILL_SUBJECTS.forEach(subject => {
      const isFractions = subject.id === FRACTION_DOMAIN;
      grid.appendChild(createPacoTile({
        documentRef,
        title: subject.label,
        icon: subject.icon,
        className: 'skills-navigation-tile',
        ...(isFractions ? {
          description: 'Bekijk de onderwerpen binnen breuken.',
          actionLabel: 'Openen →',
          onActivate: openFractions
        } : {})
      }));
    });

    card.append(heading, introduction, grid);
    content.appendChild(card);
  }

  function renderFractionOverview() {
    content.replaceChildren();
    const card = documentRef.createElement('section');
    card.className = 'paco-template-card skills-navigation-card';
    const heading = documentRef.createElement('h2');
    heading.textContent = 'Breuken';
    const introduction = documentRef.createElement('p');
    introduction.className = 'skills-navigation-introduction';
    introduction.textContent = 'Kies een onderwerp binnen de breukenleerlijn.';
    const grid = createPacoTileGrid({ documentRef, className: 'skills-navigation-grid skills-navigation-grid--fractions' });

    FRACTION_NAVIGATION_TOPICS.forEach(topicItem => {
      const isSupportedTopic = topicItem.id === 'optellen' || topicItem.id === 'aftrekken' || topicItem.id === 'vermenigvuldigen' || topicItem.id === 'delen';
      grid.appendChild(createPacoTile({
        documentRef,
        title: topicItem.label,
        icon: topicItem.icon,
        meta: 'Onderdeel van de breukenleerlijn',
        className: 'skills-navigation-tile skills-navigation-tile--topic',
        ...(isSupportedTopic ? {
          actionLabel: 'Openen →',
          onActivate: () => navigate(buildViewUrl('skills.html', {
            student,
            mode: context?.mode,
            extra: { domain: FRACTION_DOMAIN, topic: topicItem.id }
          }))
        } : {})
      }));
    });

    card.append(heading, introduction, grid);
    content.appendChild(card);
  }

  function renderFractionAdditionOverview() {
    const items = [
      { label: 'Heel getal optellen bij een breukgetal groter dan 1', level: 1 },
      { label: 'Gelijknamige breuken kleiner dan 1 bij elkaar optellen', level: 1 },
      { label: 'Breuken gelijknamig maken', level: 2 },
      { label: 'Gelijknamige breuken groter dan 1 bij elkaar optellen', level: 2 },
      { label: 'Ongelijknamige breuken kleiner dan 1 bij elkaar optellen', level: 3, exercise: 'unequal-denominator-guided-addition' },
      { label: 'Ongelijknamige breuken met een uitkomst groter dan 1 optellen', level: 3, exercise: 'unequal-denominator-guided-mixed-addition' },
      { label: 'Ongelijknamige breuken zelfstandig optellen', level: 4, exercise: 'unequal-independent-addition' },
      { label: 'Ongelijknamige gemengde getallen bij elkaar optellen', level: 5, exercise: 'unequal-mixed-addition' }
    ];

    content.replaceChildren();
    const overview = documentRef.createElement('section');
    overview.className = 'card skills-addition-overview';
    overview.setAttribute('aria-label', 'Onderwerpen breuken optellen');
    const list = documentRef.createElement('div');
    list.className = 'skills-addition-overview-list';

    items.forEach((item, index) => {
      const row = documentRef.createElement('div');
      row.className = 'skills-addition-overview-row';
      const difficulty = createPacoBoneDifficulty({
        level: item.level,
        maxLevel: 5,
        label: 'Moeilijkheidsgraad',
        documentRef
      });
      difficulty.classList.add('skills-addition-overview-difficulty');
      const label = documentRef.createElement('span');
      label.className = 'skills-addition-overview-label';
      label.textContent = item.label;
      if (index === 0 || index === 1 || index === 3 || index === 4 || index === 5 || index === 6 || index === 7) {
        const open = documentRef.createElement('button');
        open.type = 'button';
        open.className = 'paco-btn paco-btn--primary paco-btn--small skills-addition-overview-open';
        if (index === 0) open.classList.add('skills-addition-overview-open-whole-mixed');
        else if (index === 1) open.classList.add('skills-addition-overview-open-same-denominator');
        else if (index === 4) open.classList.add('skills-addition-overview-open-unequal-denominator-guided');
        else if (index === 5) open.classList.add('skills-addition-overview-open-unequal-denominator-guided-mixed');
        else if (index === 6) open.classList.add('skills-addition-overview-open-unequal-independent');
        else if (index === 7) open.classList.add('skills-addition-overview-open-unequal-mixed');
        else open.classList.add('skills-addition-overview-open-same-denominator-mixed');
        open.textContent = 'Oefenen';
        const exerciseId = item.exercise || (index === 0 ? 'whole-number-mixed-addition' : index === 1 ? 'same-denominator-addition' : index === 3 ? 'mixed-same-denominator-addition' : index === 6 ? 'unequal-independent-addition' : index === 7 ? 'unequal-mixed-addition' : 'unequal-denominator-guided-addition');
        open.addEventListener('click', () => navigate(buildViewUrl('skills.html', {
          student, mode: context?.mode, extra: { domain: FRACTION_DOMAIN, topic: 'optellen', exercise: exerciseId }
        })));
        row.append(difficulty, label, open);
      } else row.append(difficulty, label);
      list.appendChild(row);
    });

    overview.appendChild(list);
    content.appendChild(overview);
  }

  function renderFractionSubtractionOverview() {
    const items = [
      { label: 'Breukgetal groter dan 1 aftrekken van een heel getal', level: 1, exercise: 'whole-minus-mixed-subtraction' },
      { label: 'Breukgetal groter dan 1 aftrekken van een heel getal — visueel oefenen', level: 1, exercise: 'whole-minus-greater-than-one-subtraction' },
      { label: 'Gelijknamige breuken kleiner dan 1 van elkaar aftrekken', level: 1, exercise: 'like-denominator-subtraction' },
      { label: 'Gelijknamige breuken groter dan 1 van elkaar aftrekken', level: 2, exercise: 'mixed-like-denominator-subtraction' },
      { label: 'Ongelijknamige breuken kleiner dan 1 van elkaar aftrekken', level: 3, exercise: 'unlike-denominator-subtraction' },
      { label: 'Ongelijknamige breuken groter dan 1 van elkaar aftrekken', level: 4, exercise: 'unlike-mixed-denominator-subtraction' }
    ];

    content.replaceChildren();
    const overview = documentRef.createElement('section');
    overview.className = 'card skills-addition-overview';
    overview.setAttribute('aria-label', 'Onderwerpen breuken aftrekken');
    const list = documentRef.createElement('div');
    list.className = 'skills-addition-overview-list';

    items.forEach((item, index) => {
      const row = documentRef.createElement('div');
      row.className = 'skills-addition-overview-row';
      const difficulty = createPacoBoneDifficulty({
        level: item.level,
        maxLevel: 5,
        label: 'Moeilijkheidsgraad',
        documentRef
      });
      difficulty.classList.add('skills-addition-overview-difficulty');
      const label = documentRef.createElement('span');
      label.className = 'skills-addition-overview-label';
      label.textContent = item.label;
      row.append(difficulty, label);
      if (item.exercise) {
        const open = documentRef.createElement('button');
        open.type = 'button';
        open.className = 'paco-btn paco-btn--primary paco-btn--small skills-addition-overview-open';
        open.textContent = 'Oefenen';
        open.addEventListener('click', () => navigate(buildViewUrl('skills.html', {
          student, mode: context?.mode,
          extra: { domain: FRACTION_DOMAIN, topic: 'aftrekken', exercise: item.exercise }
        })));
        row.append(open);
      }
      list.appendChild(row);
    });

    overview.appendChild(list);
    content.appendChild(overview);
  }


  function renderFractionDivisionOverview() {
    const items = [
      { label: 'Heel getal delen door een breukgetal groter dan 1 — met stappenplan', level: 1, exercise: 'whole-number-divided-by-fraction-greater-than-one-guided' },
      { label: 'Heel getal delen door een breukgetal groter dan 1 — zonder stappenplan', level: 1, exercise: 'whole-number-divided-by-fraction-greater-than-one' },
      { label: 'Gelijknamige breuken kleiner dan 1 op elkaar delen — met stappenplan', level: 2, exercise: 'like-denominator-division-guided' },
      { label: 'Gelijknamige breuken kleiner dan 1 op elkaar delen', level: 2, exercise: 'like-denominator-division' },
      { label: 'Gelijknamige breuken groter dan 1 op elkaar delen — met stappenplan', level: 2, exercise: 'mixed-like-denominator-division-guided' },
      { label: 'Gelijknamige breuken groter dan 1 op elkaar delen', level: 2, exercise: 'mixed-like-denominator-division' },
      { label: 'Ongelijknamige breuken kleiner dan 1 op elkaar delen — met stappenplan', level: 3, exercise: 'unlike-denominator-division-guided' },
      { label: 'Ongelijknamige breuken kleiner dan 1 op elkaar delen', level: 3, exercise: 'unlike-denominator-division' },
      { label: 'Ongelijknamige breuken groter dan 1 op elkaar delen', level: 4, exercise: 'mixed-unlike-denominator-division' }
    ];

    content.replaceChildren();
    const overview = documentRef.createElement('section');
    overview.className = 'card skills-addition-overview';
    overview.setAttribute('aria-label', 'Onderwerpen breuken delen');
    const list = documentRef.createElement('div');
    list.className = 'skills-addition-overview-list';

    items.forEach(item => {
      const row = documentRef.createElement('div');
      row.className = 'skills-addition-overview-row';
      const difficulty = createPacoBoneDifficulty({
        level: item.level,
        maxLevel: 5,
        label: 'Moeilijkheidsgraad',
        documentRef
      });
      difficulty.classList.add('skills-addition-overview-difficulty');
      const label = documentRef.createElement('span');
      label.className = 'skills-addition-overview-label';
      label.textContent = item.label;
      row.append(difficulty, label);
      if (item.exercise) {
        const open = documentRef.createElement('button');
        open.type = 'button';
        open.className = 'paco-btn paco-btn--primary paco-btn--small skills-addition-overview-open';
        open.textContent = 'Oefenen';
        open.addEventListener('click', () => navigate(buildViewUrl('skills.html', {
          student, mode: context?.mode,
          extra: { domain: FRACTION_DOMAIN, topic: 'delen', exercise: item.exercise }
        })));
        row.append(open);
      }
      list.appendChild(row);
    });

    overview.appendChild(list);
    content.appendChild(overview);
  }

  function renderFractionMultiplicationOverview() {
    const items = [
      { label: 'Een breuk vermenigvuldigen met een heel getal', level: 1 },
      { label: 'Heel getal vermenigvuldigen met een breukgetal kleiner dan 1', level: 1, exercise: 'whole-number-times-proper-fraction' },
      { label: 'Heel getal vermenigvuldigen met een breukgetal groter dan 1', level: 1, exercise: 'whole-number-times-mixed-fraction-greater-than-one' },
      { label: 'Gelijknamige breuken kleiner dan 1 met elkaar vermenigvuldigen', level: 2, exercise: 'like-denominator-multiplication' },
      { label: 'Gelijknamige breuken groter dan 1 met elkaar vermenigvuldigen', level: 2, exercise: 'mixed-like-denominator-multiplication' },
      { label: 'Ongelijknamige breuken kleiner dan 1 met elkaar vermenigvuldigen', level: 3, exercise: 'unlike-denominator-multiplication' },
      { label: 'Ongelijknamige breuken groter dan 1 met elkaar vermenigvuldigen', level: 4, exercise: 'mixed-unlike-denominator-multiplication' }
    ];
    content.replaceChildren();
    const overview = documentRef.createElement('section');
    overview.className = 'card skills-addition-overview';
    overview.setAttribute('aria-label', 'Onderwerpen breuken vermenigvuldigen');
    const list = documentRef.createElement('div');
    list.className = 'skills-addition-overview-list';
    items.forEach(item => {
      const row = documentRef.createElement('div');
      row.className = 'skills-addition-overview-row';
      const difficulty = createPacoBoneDifficulty({
        level: item.level, maxLevel: 5, label: 'Moeilijkheidsgraad', documentRef
      });
      difficulty.classList.add('skills-addition-overview-difficulty');
      const label = documentRef.createElement('span');
      label.className = 'skills-addition-overview-label';
      label.textContent = item.label;
      row.append(difficulty, label);
      if (item.exercise) {
        const open = documentRef.createElement('button');
        open.type = 'button';
        open.className = 'paco-btn paco-btn--primary paco-btn--small skills-addition-overview-open';
        open.textContent = 'Oefenen';
        open.addEventListener('click', () => navigate(buildViewUrl('skills.html', {
          student, mode: context?.mode,
          extra: { domain: FRACTION_DOMAIN, topic: 'vermenigvuldigen', exercise: item.exercise }
        })));
        row.append(open);
      }
      list.appendChild(row);
    });
    overview.appendChild(list);
    content.appendChild(overview);
  }

  function renderWholeMinusGreaterThanOneSubtractionPractice() {
    const bank = FRACTION_QUANTITY_WHOLE_MINUS_GREATER_THAN_ONE_TASK_BANK;
    quantitySubtractionPractice = createFractionQuantitySubtractionPractice({
      mount: content,
      tasks: bank.tasks,
      representation: bank.defaultRepresentation,
      allowedDivisions: bank.allowedDivisions,
      title: bank.title,
      instruction: bank.instruction,
      documentRef
    });
  }

  function renderLikeDenominatorMultiplicationPractice() {
    const learnerKey = student || context?.learnerId || 'local-learner';
    const session = createFractionLikeDenominatorMultiplicationSession({
      learnerKey,
      tasks: FRACTION_LIKE_DENOMINATOR_MULTIPLICATION_TASKS
    });

    function renderCurrentTask() {
      const task = session.getCurrentTask();
      const progress = session.getProgress();
      content.replaceChildren();
      const card = documentRef.createElement('section');
      card.className = 'card fraction-whole-mixed-addition-card';
      const template = createFractionPracticeTemplate({ mount: card });
      const title = documentRef.createElement('h2');
      title.textContent = 'Gelijknamige breuken kleiner dan 1 met elkaar vermenigvuldigen';
      const instruction = documentRef.createElement('p');
      instruction.className = 'fraction-practice-instruction';
      instruction.textContent = 'Vermenigvuldig de tellers met elkaar en de noemers met elkaar. Vereenvoudig je antwoord als dat kan.';
      const progressLabel = documentRef.createElement('p');
      progressLabel.className = 'fraction-practice-progress';
      progressLabel.textContent = task
        ? 'Som ' + task.taskNumber + ' van ' + task.totalTasks + ' • ' + progress.completedCount + ' afgerond'
        : progress.completedCount + ' van ' + progress.totalCount + ' sommen afgerond';
      template.titleArea.append(title);
      template.instructionArea.append(instruction);
      template.progressArea.append(progressLabel);

      if (!task) {
        const done = documentRef.createElement('p');
        done.className = 'fraction-practice-complete';
        done.textContent = 'Je hebt alle 15 sommen afgerond. Goed gewerkt!';
        template.workArea.append(done);
        const restart = documentRef.createElement('button');
        restart.type = 'button';
        restart.className = 'paco-btn paco-btn--primary';
        restart.textContent = 'Oefenronde opnieuw doen';
        restart.addEventListener('click', () => { session.reset(); renderCurrentTask(); });
        template.actionsArea.append(restart);
        content.append(card);
        return;
      }

      const equation = documentRef.createElement('div');
      equation.className = 'construction-equation';
      equation.append(
        renderFractionRepresentation(task.leftFraction, 'symbolic_fraction', 'Eerste breuk'),
        documentRef.createTextNode(' × '),
        renderFractionRepresentation(task.rightFraction, 'symbolic_fraction', 'Tweede breuk'),
        documentRef.createTextNode(' = ')
      );
      const answerMount = documentRef.createElement('div');
      answerMount.className = 'fraction-like-subtraction-answer';
      equation.append(answerMount);
      template.workArea.append(equation);

      const prompt = documentRef.createElement('p');
      prompt.textContent = 'Vul de uitkomst in. Gebruik Vereenvoudigen als de breuk nog kleiner kan.';
      template.promptArea.append(prompt);

      const feedback = documentRef.createElement('p');
      feedback.setAttribute('role', 'status');
      feedback.textContent = 'Je antwoord wordt pas goed gerekend als het volledig is vereenvoudigd wanneer dat mogelijk is.';
      template.feedbackArea.append(feedback);

      const answer = renderFractionAnswerInput({
        workMount: answerMount,
        controlsMount: template.controlsArea
      });
      const submit = documentRef.createElement('button');
      submit.type = 'button';
      submit.className = 'paco-btn paco-btn--primary';
      submit.textContent = 'Controleren';
      template.actionsArea.append(submit);

      submit.addEventListener('click', () => {
        const values = answer.getValues();
        const result = session.recordAnswer({
          numerator: values.numerator,
          denominator: values.denominator,
          simplified: values.simplified,
          simplifiedNumerator: values.simplifiedNumerator,
          simplifiedDenominator: values.simplifiedDenominator
        });
        progressLabel.textContent = 'Som ' + (result.progress.completedCount + (result.progress.isComplete ? 0 : 1)) +
          ' van ' + result.progress.totalCount + ' • ' + result.progress.completedCount + ' afgerond';
        if (result.classification === 'valid') {
          answer.lock();
          submit.disabled = true;
          feedback.textContent = 'Goed gedaan! Je hebt de vermenigvuldiging correct uitgerekend.';
          const next = documentRef.createElement('button');
          next.type = 'button';
          next.className = 'paco-btn paco-btn--primary';
          next.textContent = result.progress.isComplete ? 'Oefenronde afronden' : 'Volgende som';
          next.addEventListener('click', renderCurrentTask);
          template.actionsArea.replaceChildren(next);
        } else {
          const messages = {
            invalid_input: 'Vul bij de uitkomst zowel een teller als een noemer in.',
            incorrect_answer: 'De vermenigvuldiging klopt nog niet. Vermenigvuldig de tellers en de noemers met elkaar.',
            simplification_required: 'Je uitkomst klopt, maar kan nog vereenvoudigd worden. Klik op Vereenvoudigen en vul de nieuwe breuk in.',
            invalid_simplification: 'Vul ook de teller en noemer van de vereenvoudigde breuk in.',
            incorrect_simplification: 'De vereenvoudigde breuk klopt nog niet. Zoek de grootste gemene deler.'
          };
          feedback.textContent = messages[result.classification] || 'Controleer je antwoord en probeer het opnieuw.';
          answer.focus();
        }
      });
      content.append(card);
      answer.focus();
    }
    renderCurrentTask();
  }


  function renderUnlikeDenominatorMultiplicationPractice() {
    const learnerKey = student || context?.learnerId || 'local-learner';
    const session = createFractionUnlikeDenominatorMultiplicationSession({
      learnerKey,
      tasks: FRACTION_UNLIKE_DENOMINATOR_MULTIPLICATION_TASKS
    });

    function renderCurrentTask() {
      const task = session.getCurrentTask();
      const progress = session.getProgress();
      content.replaceChildren();
      const card = documentRef.createElement('section');
      card.className = 'card fraction-whole-mixed-addition-card';
      const template = createFractionPracticeTemplate({ mount: card });
      const title = documentRef.createElement('h2');
      title.textContent = 'Ongelijknamige breuken kleiner dan 1 met elkaar vermenigvuldigen';
      const instruction = documentRef.createElement('p');
      instruction.className = 'fraction-practice-instruction';
      instruction.textContent = 'Vermenigvuldig de tellers met elkaar en de noemers met elkaar. Vereenvoudig je antwoord als dat kan.';
      const progressLabel = documentRef.createElement('p');
      progressLabel.className = 'fraction-practice-progress';
      progressLabel.textContent = task
        ? 'Som ' + task.taskNumber + ' van ' + task.totalTasks + ' • ' + progress.completedCount + ' afgerond'
        : progress.completedCount + ' van ' + progress.totalCount + ' sommen afgerond';
      template.titleArea.append(title);
      template.instructionArea.append(instruction);
      template.progressArea.append(progressLabel);

      if (!task) {
        const done = documentRef.createElement('p');
        done.className = 'fraction-practice-complete';
        done.textContent = 'Je hebt alle 15 sommen afgerond. Goed gewerkt!';
        template.workArea.append(done);
        const restart = documentRef.createElement('button');
        restart.type = 'button';
        restart.className = 'paco-btn paco-btn--primary';
        restart.textContent = 'Oefenronde opnieuw doen';
        restart.addEventListener('click', () => { session.reset(); renderCurrentTask(); });
        template.actionsArea.append(restart);
        content.append(card);
        return;
      }

      const equation = documentRef.createElement('div');
      equation.className = 'construction-equation';
      equation.append(
        renderFractionRepresentation(task.leftFraction, 'symbolic_fraction', 'Eerste breuk'),
        documentRef.createTextNode(' × '),
        renderFractionRepresentation(task.rightFraction, 'symbolic_fraction', 'Tweede breuk'),
        documentRef.createTextNode(' = ')
      );
      const answerMount = documentRef.createElement('div');
      answerMount.className = 'fraction-like-subtraction-answer';
      equation.append(answerMount);
      template.workArea.append(equation);

      const answer = renderFractionAnswerInput({
        workMount: answerMount,
        controlsMount: template.controlsArea
      });
      const feedback = documentRef.createElement('p');
      feedback.setAttribute('role', 'status');
      feedback.textContent = 'Vereenvoudig je antwoord als dat mogelijk is.';
      template.feedbackArea.append(feedback);
      const submit = documentRef.createElement('button');
      submit.type = 'button';
      submit.className = 'paco-btn paco-btn--primary';
      submit.textContent = 'Controleren';
      template.actionsArea.append(submit);

      submit.addEventListener('click', () => {
        const values = answer.getValues();
        const result = session.recordAnswer({
          numerator: values.numerator,
          denominator: values.denominator,
          simplified: values.simplified,
          simplifiedNumerator: values.simplifiedNumerator,
          simplifiedDenominator: values.simplifiedDenominator
        });
        progressLabel.textContent = 'Som ' + (result.progress.completedCount + (result.progress.isComplete ? 0 : 1)) +
          ' van ' + result.progress.totalCount + ' • ' + result.progress.completedCount + ' afgerond';
        if (result.classification === 'valid') {
          answer.lock();
          submit.disabled = true;
          feedback.textContent = 'Goed gedaan! Je hebt de vermenigvuldiging correct uitgerekend.';
          const next = documentRef.createElement('button');
          next.type = 'button';
          next.className = 'paco-btn paco-btn--primary';
          next.textContent = result.progress.isComplete ? 'Oefenronde afronden' : 'Volgende som';
          next.addEventListener('click', renderCurrentTask);
          template.actionsArea.replaceChildren(next);
        } else {
          const messages = {
            invalid_input: 'Vul bij de uitkomst zowel een teller als een noemer in.',
            incorrect_answer: 'De vermenigvuldiging klopt nog niet. Vermenigvuldig de tellers en de noemers met elkaar.',
            simplification_required: 'Je uitkomst klopt, maar kan nog vereenvoudigd worden. Klik op Vereenvoudigen en vul de nieuwe breuk in.',
            invalid_simplification: 'Vul ook de teller en noemer van de vereenvoudigde breuk in.',
            incorrect_simplification: 'De vereenvoudigde breuk klopt nog niet. Controleer de teller en noemer.'
          };
          feedback.textContent = messages[result.classification] || 'Controleer je antwoord en probeer het opnieuw.';
          answer.focus();
        }
      });
      content.append(card);
      answer.focus();
    }
    renderCurrentTask();
  }

  function renderMixedLikeDenominatorMultiplicationPractice(){
 const learnerKey=student||context?.learnerId||'local-learner',session=createFractionMixedLikeDenominatorMultiplicationSession({learnerKey,tasks:FRACTION_MIXED_LIKE_DENOMINATOR_MULTIPLICATION_TASKS});
 function renderCurrentTask(){const task=session.getCurrentTask(),progress=session.getProgress();content.replaceChildren();const card=documentRef.createElement('section');card.className='card fraction-whole-mixed-addition-card';const template=createFractionPracticeTemplate({mount:card});
 const title=documentRef.createElement('h2');title.textContent='Gelijknamige breuken groter dan 1 met elkaar vermenigvuldigen';const instruction=documentRef.createElement('p');instruction.className='fraction-practice-instruction';instruction.textContent='Vermenigvuldig de gemengde getallen. Geef je antwoord als gemengd getal en vereenvoudig als dat kan.';const progressLabel=documentRef.createElement('p');progressLabel.className='fraction-practice-progress';progressLabel.textContent='Som '+(task?task.taskNumber:15)+' van 15 • '+progress.completedCount+' afgerond';template.titleArea.append(title);template.instructionArea.append(instruction);template.progressArea.append(progressLabel);
 if(!task){const done=documentRef.createElement('p');done.className='fraction-practice-complete';done.textContent='Je hebt alle 15 sommen afgerond. Goed gewerkt!';template.workArea.append(done);const restart=documentRef.createElement('button');restart.type='button';restart.className='paco-btn paco-btn--primary';restart.textContent='Oefenronde opnieuw doen';restart.addEventListener('click',()=>{session.reset();renderCurrentTask();});template.actionsArea.append(restart);content.append(card);return;}
 const equation=documentRef.createElement('div');equation.className='fraction-whole-mixed-equation';const expression=documentRef.createElement('div');expression.className='fraction-whole-mixed-expression';expression.append(renderMixedNumber({wholeNumber:task.left.whole,numerator:task.left.numerator,denominator:task.left.denominator},'Eerste gemengde getal'),Object.assign(documentRef.createElement('span'),{className:'fraction-whole-mixed-expression__operator',textContent:'×'}),renderMixedNumber({wholeNumber:task.right.whole,numerator:task.right.numerator,denominator:task.right.denominator},'Tweede gemengde getal'));const equals=documentRef.createElement('span');equals.className='fraction-whole-mixed-expression__operator';equals.textContent='=';const answerMount=documentRef.createElement('div');answerMount.className='fraction-whole-mixed-answer';equation.append(expression,equals,answerMount);template.workArea.append(equation);
 const answer=renderFractionAnswerInput({workMount:answerMount,controlsMount:template.controlsArea,wholeNumberMode:'required'});const feedback=documentRef.createElement('p');feedback.setAttribute('role','status');feedback.textContent='Vereenvoudig het breukdeel als dat mogelijk is.';template.feedbackArea.append(feedback);const submit=documentRef.createElement('button');submit.type='button';submit.className='paco-btn paco-btn--primary';submit.textContent='Controleren';template.actionsArea.append(submit);
 submit.addEventListener('click',()=>{const v=answer.getValues(),r=session.recordAnswer({wholeNumberEnabled:v.wholeNumberEnabled,wholeNumber:v.wholeNumber,numerator:v.numerator,denominator:v.denominator,simplified:v.simplified,simplifiedNumerator:v.simplifiedNumerator,simplifiedDenominator:v.simplifiedDenominator});progressLabel.textContent='Som '+(r.progress.isComplete?15:r.progress.completedCount+1)+' van 15 • '+r.progress.completedCount+' afgerond';if(r.classification==='valid'){answer.lock();submit.disabled=true;feedback.textContent='Goed gedaan! Je hebt de vermenigvuldiging correct uitgerekend.';const next=documentRef.createElement('button');next.type='button';next.className='paco-btn paco-btn--primary';next.textContent=r.progress.isComplete?'Oefenronde afronden':'Volgende som';next.addEventListener('click',renderCurrentTask);template.actionsArea.replaceChildren(next);}else{const messages={invalid_input:'Vul het hele getal, de teller en de noemer van je antwoord in.',incorrect_answer:'De vermenigvuldiging klopt nog niet. Controleer de gemengde getallen en vermenigvuldig de breuken.',simplification_required:'Je antwoord klopt, maar het breukdeel kan nog vereenvoudigd worden. Klik op Vereenvoudigen.',invalid_simplification:'Vul ook de teller en noemer van de vereenvoudigde breuk in.',incorrect_simplification:'De vereenvoudigde breuk klopt nog niet.'};feedback.textContent=messages[r.classification]||'Controleer je antwoord en probeer het opnieuw.';answer.focus();}});content.append(card);answer.focus();}
 renderCurrentTask();
 }


  function renderMixedUnlikeDenominatorMultiplicationPractice() {
    const learnerKey = student || context?.learnerId || 'local-learner';
    const session = createFractionMixedUnlikeDenominatorMultiplicationSession({
      learnerKey,
      tasks: FRACTION_MIXED_UNLIKE_DENOMINATOR_MULTIPLICATION_TASKS
    });

    function renderCurrentTask() {
      const task = session.getCurrentTask();
      const progress = session.getProgress();
      content.replaceChildren();
      const card = documentRef.createElement('section');
      card.className = 'card fraction-whole-mixed-addition-card';
      const template = createFractionPracticeTemplate({ mount: card });
      const title = documentRef.createElement('h2');
      title.textContent = 'Ongelijknamige breuken groter dan 1 met elkaar vermenigvuldigen';
      const instruction = documentRef.createElement('p');
      instruction.className = 'fraction-practice-instruction';
      instruction.textContent = 'Vermenigvuldig de gemengde getallen. Geef je antwoord als gemengd getal en vereenvoudig als dat kan.';
      const progressLabel = documentRef.createElement('p');
      progressLabel.className = 'fraction-practice-progress';
      progressLabel.textContent = task
        ? 'Som ' + task.taskNumber + ' van ' + task.totalTasks + ' • ' + progress.completedCount + ' afgerond'
        : progress.completedCount + ' van ' + progress.totalCount + ' sommen afgerond';
      template.titleArea.append(title);
      template.instructionArea.append(instruction);
      template.progressArea.append(progressLabel);

      if (!task) {
        const done = documentRef.createElement('p');
        done.className = 'fraction-practice-complete';
        done.textContent = 'Je hebt alle 15 sommen afgerond. Goed gewerkt!';
        template.workArea.append(done);
        const restart = documentRef.createElement('button');
        restart.type = 'button';
        restart.className = 'paco-btn paco-btn--primary';
        restart.textContent = 'Oefenronde opnieuw doen';
        restart.addEventListener('click', () => { session.reset(); renderCurrentTask(); });
        template.actionsArea.append(restart);
        content.append(card);
        return;
      }

      const equation = documentRef.createElement('div');
      equation.className = 'fraction-whole-mixed-equation';
      const expression = documentRef.createElement('div');
      expression.className = 'fraction-whole-mixed-expression';
      expression.append(
        renderMixedNumber({
          wholeNumber: task.left.whole,
          numerator: task.left.numerator,
          denominator: task.left.denominator
        }, 'Eerste gemengde getal'),
        Object.assign(documentRef.createElement('span'), {
          className: 'fraction-whole-mixed-expression__operator',
          textContent: '×'
        }),
        renderMixedNumber({
          wholeNumber: task.right.whole,
          numerator: task.right.numerator,
          denominator: task.right.denominator
        }, 'Tweede gemengde getal')
      );
      const equals = documentRef.createElement('span');
      equals.className = 'fraction-whole-mixed-expression__operator';
      equals.textContent = '=';
      const answerMount = documentRef.createElement('div');
      answerMount.className = 'fraction-whole-mixed-answer';
      equation.append(expression, equals, answerMount);
      template.workArea.append(equation);

      const answer = renderFractionAnswerInput({
        workMount: answerMount,
        controlsMount: template.controlsArea,
        wholeNumberMode: 'required'
      });
      const feedback = documentRef.createElement('p');
      feedback.setAttribute('role', 'status');
      feedback.textContent = 'Vereenvoudig het breukdeel als dat mogelijk is.';
      template.feedbackArea.append(feedback);
      const submit = documentRef.createElement('button');
      submit.type = 'button';
      submit.className = 'paco-btn paco-btn--primary';
      submit.textContent = 'Controleren';
      template.actionsArea.append(submit);

      submit.addEventListener('click', () => {
        const values = answer.getValues();
        const result = session.recordAnswer({
          wholeNumberEnabled: values.wholeNumberEnabled,
          wholeNumber: values.wholeNumber,
          numerator: values.numerator,
          denominator: values.denominator,
          simplified: values.simplified,
          simplifiedNumerator: values.simplifiedNumerator,
          simplifiedDenominator: values.simplifiedDenominator
        });
        progressLabel.textContent = 'Som ' +
          (result.progress.isComplete ? 15 : result.progress.completedCount + 1) +
          ' van 15 • ' + result.progress.completedCount + ' afgerond';
        if (result.classification === 'valid') {
          answer.lock();
          submit.disabled = true;
          feedback.textContent = 'Goed gedaan! Je hebt de vermenigvuldiging correct uitgerekend.';
          const next = documentRef.createElement('button');
          next.type = 'button';
          next.className = 'paco-btn paco-btn--primary';
          next.textContent = result.progress.isComplete ? 'Oefenronde afronden' : 'Volgende som';
          next.addEventListener('click', renderCurrentTask);
          template.actionsArea.replaceChildren(next);
        } else {
          const messages = {
            invalid_input: 'Vul het hele getal, de teller en de noemer van je antwoord in.',
            incorrect_answer: 'De vermenigvuldiging klopt nog niet. Controleer de gemengde getallen en vermenigvuldig de breuken.',
            simplification_required: 'Je antwoord klopt, maar het breukdeel kan nog vereenvoudigd worden. Klik op Vereenvoudigen.',
            invalid_simplification: 'Vul ook de teller en noemer van de vereenvoudigde breuk in.',
            incorrect_simplification: 'De vereenvoudigde breuk klopt nog niet.'
          };
          feedback.textContent = messages[result.classification] || 'Controleer je antwoord en probeer het opnieuw.';
          answer.focus();
        }
      });
      content.append(card);
      answer.focus();
    }
    renderCurrentTask();
  }

  function renderLikeDenominatorSubtractionPractice() {
    const learnerKey = student || context?.learnerId || 'local-learner';
    const session = createFractionLikeDenominatorSubtractionSession({ learnerKey });

    function renderCurrentTask() {
      const task = session.getCurrentTask();
      const progress = session.getProgress();
      content.replaceChildren();
      const card = documentRef.createElement('section');
      card.className = 'card fraction-whole-mixed-addition-card';
      const template = createFractionPracticeTemplate({ mount: card });
      const title = documentRef.createElement('h2');
      title.textContent = 'Gelijknamige breuken kleiner dan 1 van elkaar aftrekken';
      const instruction = documentRef.createElement('p');
      instruction.className = 'fraction-practice-instruction';
      instruction.textContent = 'Trek de tellers van elkaar af. De noemer blijft gelijk. Vereenvoudig je antwoord als dat kan.';
      const progressLabel = documentRef.createElement('p');
      progressLabel.className = 'fraction-practice-progress';
      progressLabel.textContent = task
        ? 'Som ' + task.taskNumber + ' van ' + task.totalTasks + ' • ' + progress.completedCount + ' afgerond'
        : progress.completedCount + ' van ' + progress.totalCount + ' sommen afgerond';
      template.titleArea.append(title);
      template.instructionArea.append(instruction);
      template.progressArea.append(progressLabel);

      if (!task) {
        const done = documentRef.createElement('p');
        done.className = 'fraction-practice-complete';
        done.textContent = 'Je hebt alle ' + progress.totalCount + ' sommen afgerond. Goed gewerkt!';
        template.workArea.append(done);
        const restart = documentRef.createElement('button');
        restart.type = 'button';
        restart.className = 'paco-btn paco-btn--primary';
        restart.textContent = 'Oefenronde opnieuw doen';
        restart.addEventListener('click', () => { session.reset(); renderCurrentTask(); });
        template.actionsArea.append(restart);
        content.append(card);
        return;
      }

      const equation = documentRef.createElement('div');
      equation.className = 'construction-equation fraction-like-subtraction-equation';
      equation.append(
        renderFractionRepresentation(task.leftFraction, 'symbolic_fraction', 'Eerste breuk'),
        documentRef.createTextNode(' − '),
        renderFractionRepresentation(task.rightFraction, 'symbolic_fraction', 'Tweede breuk'),
        documentRef.createTextNode(' = ')
      );
      const answerMount = documentRef.createElement('div');
      answerMount.className = 'fraction-like-subtraction-answer';
      equation.append(answerMount);
      template.workArea.append(equation);

      const prompt = documentRef.createElement('p');
      prompt.textContent = 'Vul de uitkomst in. Gebruik Vereenvoudigen als de breuk nog kleiner kan.';
      template.promptArea.append(prompt);

      const feedback = documentRef.createElement('p');
      feedback.setAttribute('role', 'status');
      feedback.textContent = 'Je antwoord wordt pas goed gerekend als het volledig is vereenvoudigd wanneer dat mogelijk is.';
      template.feedbackArea.append(feedback);

      const answer = renderFractionAnswerInput({
        workMount: answerMount,
        controlsMount: template.controlsArea
      });
      const submit = documentRef.createElement('button');
      submit.type = 'button';
      submit.className = 'paco-btn paco-btn--primary';
      submit.textContent = 'Controleren';
      template.actionsArea.append(submit);

      submit.addEventListener('click', () => {
        const values = answer.getValues();
        const result = session.recordAnswer({
          numerator: values.numerator,
          denominator: values.denominator,
          simplified: values.simplified,
          simplifiedNumerator: values.simplifiedNumerator,
          simplifiedDenominator: values.simplifiedDenominator
        });
        progressLabel.textContent = 'Som ' + (result.progress.completedCount + (result.progress.isComplete ? 0 : 1)) +
          ' van ' + result.progress.totalCount + ' • ' + result.progress.completedCount + ' afgerond';
        if (result.classification === 'valid') {
          answer.lock();
          submit.disabled = true;
          feedback.textContent = 'Goed gedaan! Je hebt de breuk correct uitgerekend en vereenvoudigd.';
          const next = documentRef.createElement('button');
          next.type = 'button';
          next.className = 'paco-btn paco-btn--primary';
          next.textContent = result.progress.isComplete ? 'Oefenronde afronden' : 'Volgende som';
          next.addEventListener('click', renderCurrentTask);
          template.actionsArea.replaceChildren(next);
        } else {
          const messages = {
            invalid_input: 'Vul bij de uitkomst zowel een teller als een noemer in.',
            incorrect_answer: 'De aftrekking klopt nog niet. Trek de tellers af en behoud de noemer.',
            simplification_required: 'Je uitkomst klopt, maar kan nog vereenvoudigd worden. Klik op Vereenvoudigen en vul de nieuwe breuk in.',
            invalid_simplification: 'Vul ook de teller en noemer van de vereenvoudigde breuk in.',
            incorrect_simplification: 'De vereenvoudigde breuk klopt nog niet. Zoek de grootste gemene deler.'
          };
          feedback.textContent = messages[result.classification] || 'Controleer je antwoord en probeer het opnieuw.';
          answer.focus();
        }
      });
      content.append(card);
      answer.focus();
    }
    renderCurrentTask();
  }

  function renderUnlikeDenominatorSubtractionPractice() {
    const learnerKey = student || context?.learnerId || 'local-learner';
    const session = createFractionUnlikeDenominatorSubtractionSession({ learnerKey });
    function renderCurrentTask() {
      const task = session.getCurrentTask();
      const progress = session.getProgress();
      content.replaceChildren();
      const card = documentRef.createElement('section');
      card.className = 'card fraction-whole-mixed-addition-card';
      const template = createFractionPracticeTemplate({ mount: card });
      const title = documentRef.createElement('h2');
      title.textContent = 'Ongelijknamige breuken kleiner dan 1 van elkaar aftrekken';
      const instruction = documentRef.createElement('p');
      instruction.className = 'fraction-practice-instruction';
      instruction.textContent = 'Trek de breuken van elkaar af. Vereenvoudig je antwoord als dat kan.';
      const progressLabel = documentRef.createElement('p');
      progressLabel.className = 'fraction-practice-progress';
      progressLabel.textContent = 'Som ' + (task ? task.taskNumber : progress.totalCount) + ' van 15 • ' + progress.completedCount + ' afgerond';
      template.titleArea.append(title);
      template.instructionArea.append(instruction);
      template.progressArea.append(progressLabel);
      if (!task) {
        const done = documentRef.createElement('p');
        done.className = 'fraction-practice-complete';
        done.textContent = 'Je hebt alle 15 sommen afgerond. Goed gewerkt!';
        template.workArea.append(done);
        const restart = documentRef.createElement('button');
        restart.type = 'button';
        restart.className = 'paco-btn paco-btn--primary';
        restart.textContent = 'Oefenronde opnieuw doen';
        restart.addEventListener('click', () => { session.reset(); renderCurrentTask(); });
        template.actionsArea.append(restart);
        content.append(card);
        return;
      }
      const equation = documentRef.createElement('div');
      equation.className = 'construction-equation fraction-like-subtraction-equation';
      equation.append(
        renderFractionRepresentation(task.leftFraction, 'symbolic_fraction', 'Eerste breuk'),
        documentRef.createTextNode(' − '),
        renderFractionRepresentation(task.rightFraction, 'symbolic_fraction', 'Tweede breuk'),
        documentRef.createTextNode(' = ')
      );
      const answerMount = documentRef.createElement('div');
      answerMount.className = 'fraction-like-subtraction-answer';
      equation.append(answerMount);
      template.workArea.append(equation);
      const prompt = documentRef.createElement('p');
      prompt.textContent = 'Vul de uitkomst in. Gebruik Vereenvoudigen als de breuk nog kleiner kan.';
      template.promptArea.append(prompt);
      const feedback = documentRef.createElement('p');
      feedback.setAttribute('role', 'status');
      feedback.textContent = 'Je antwoord moet kloppen en volledig vereenvoudigd zijn als dat mogelijk is.';
      template.feedbackArea.append(feedback);
      const answer = renderFractionAnswerInput({ workMount: answerMount, controlsMount: template.controlsArea });
      const submit = documentRef.createElement('button');
      submit.type = 'button';
      submit.className = 'paco-btn paco-btn--primary';
      submit.textContent = 'Controleren';
      template.actionsArea.append(submit);
      submit.addEventListener('click', () => {
        const values = answer.getValues();
        const result = session.recordAnswer({
          numerator: values.numerator, denominator: values.denominator,
          simplified: values.simplified, simplifiedNumerator: values.simplifiedNumerator,
          simplifiedDenominator: values.simplifiedDenominator
        });
        progressLabel.textContent = 'Som ' + (result.progress.isComplete ? 15 : result.progress.completedCount + 1) +
          ' van 15 • ' + result.progress.completedCount + ' afgerond';
        if (result.classification === 'valid') {
          answer.lock();
          submit.disabled = true;
          feedback.textContent = 'Goed gedaan! Je hebt de aftrekking correct uitgerekend.';
          const next = documentRef.createElement('button');
          next.type = 'button';
          next.className = 'paco-btn paco-btn--primary';
          next.textContent = result.progress.isComplete ? 'Oefenronde afronden' : 'Volgende som';
          next.addEventListener('click', renderCurrentTask);
          template.actionsArea.replaceChildren(next);
        } else {
          const messages = {
            invalid_input: 'Vul bij de uitkomst zowel een teller als een noemer in.',
            incorrect_answer: 'De aftrekking klopt nog niet. Maak de noemers gelijk en controleer je berekening.',
            simplification_required: 'Je antwoord klopt, maar kan nog vereenvoudigd worden. Klik op Vereenvoudigen.',
            invalid_simplification: 'Vul ook de teller en noemer van de vereenvoudigde breuk in.',
            incorrect_simplification: 'De vereenvoudigde breuk klopt nog niet.'
          };
          feedback.textContent = messages[result.classification] || 'Controleer je antwoord en probeer het opnieuw.';
          answer.focus();
        }
      });
      content.append(card);
      answer.focus();
    }
    renderCurrentTask();
  }

  function renderMixedLikeDenominatorSubtractionPractice() {
    const learnerKey = student || context?.learnerId || 'local-learner';
    const session = createFractionMixedLikeDenominatorSubtractionSession({ learnerKey });
    function renderCurrentTask() {
      const task = session.getCurrentTask();
      const progress = session.getProgress();
      content.replaceChildren();
      const card = documentRef.createElement('section');
      card.className = 'card fraction-whole-mixed-addition-card';
      const template = createFractionPracticeTemplate({ mount: card });
      const title = documentRef.createElement('h2');
      title.textContent = 'Gelijknamige breuken groter dan 1 van elkaar aftrekken';
      const instruction = documentRef.createElement('p');
      instruction.className = 'fraction-practice-instruction';
      instruction.textContent = 'Trek de gemengde getallen van elkaar af. Geef je antwoord als breuk of gemengd getal en vereenvoudig als dat kan.';
      const progressLabel = documentRef.createElement('p');
      progressLabel.className = 'fraction-practice-progress';
      progressLabel.textContent = 'Som ' + (task ? task.taskNumber : progress.totalCount) + ' van 15 • ' + progress.completedCount + ' afgerond';
      template.titleArea.append(title);
      template.instructionArea.append(instruction);
      template.progressArea.append(progressLabel);
      if (!task) {
        const done = documentRef.createElement('p');
        done.className = 'fraction-practice-complete';
        done.textContent = 'Je hebt alle 15 sommen afgerond. Goed gewerkt!';
        template.workArea.append(done);
        const restart = documentRef.createElement('button');
        restart.type = 'button';
        restart.className = 'paco-btn paco-btn--primary';
        restart.textContent = 'Oefenronde opnieuw doen';
        restart.addEventListener('click', () => { session.reset(); renderCurrentTask(); });
        template.actionsArea.append(restart);
        content.append(card);
        return;
      }
      const equation = documentRef.createElement('div');
      equation.className = 'construction-equation fraction-like-subtraction-equation';
      const left = documentRef.createElement('span');
      left.className = 'pacogo-fraction-mixed-number';
      left.append(documentRef.createTextNode(String(task.left.whole)));
      left.append(renderFractionRepresentation({numerator:task.left.numerator,denominator:task.left.denominator},'symbolic_fraction','Eerste breuk'));
      const right = documentRef.createElement('span');
      right.className = 'pacogo-fraction-mixed-number';
      right.append(documentRef.createTextNode(String(task.right.whole)));
      right.append(renderFractionRepresentation({numerator:task.right.numerator,denominator:task.right.denominator},'symbolic_fraction','Tweede breuk'));
      equation.append(left, documentRef.createTextNode(' − '), right, documentRef.createTextNode(' = '));
      const answerMount = documentRef.createElement('div');
      answerMount.className = 'fraction-like-subtraction-answer';
      equation.append(answerMount);
      template.workArea.append(equation);
      const prompt = documentRef.createElement('p');
      prompt.textContent = 'Vul de uitkomst in. Gebruik Heel getal toevoegen voor een gemengd getal.';
      template.promptArea.append(prompt);
      const feedback = documentRef.createElement('p');
      feedback.setAttribute('role','status');
      feedback.textContent = 'Vereenvoudig de breuk als dat mogelijk is.';
      template.feedbackArea.append(feedback);
      const answer = renderFractionAnswerInput({workMount:answerMount,controlsMount:template.controlsArea});
      const submit = documentRef.createElement('button');
      submit.type = 'button';
      submit.className = 'paco-btn paco-btn--primary';
      submit.textContent = 'Controleren';
      template.actionsArea.append(submit);
      submit.addEventListener('click', () => {
        const values = answer.getValues();
        const result = session.recordAnswer({
          wholeNumberEnabled:values.wholeNumberEnabled, wholeNumber:values.wholeNumber,
          numerator:values.numerator, denominator:values.denominator,
          simplified:values.simplified, simplifiedNumerator:values.simplifiedNumerator,
          simplifiedDenominator:values.simplifiedDenominator
        });
        progressLabel.textContent = 'Som ' + (result.progress.isComplete ? 15 : result.progress.completedCount + 1) +
          ' van 15 • ' + result.progress.completedCount + ' afgerond';
        if (result.classification === 'valid') {
          answer.lock(); submit.disabled = true;
          feedback.textContent = 'Goed gedaan! Je hebt de aftrekking correct uitgerekend.';
          const next = documentRef.createElement('button');
          next.type = 'button'; next.className = 'paco-btn paco-btn--primary';
          next.textContent = result.progress.isComplete ? 'Oefenronde afronden' : 'Volgende som';
          next.addEventListener('click', renderCurrentTask);
          template.actionsArea.replaceChildren(next);
        } else {
          const messages = {
            invalid_input:'Vul een geldige teller en noemer in.',
            incorrect_answer:'De aftrekking klopt nog niet. Controleer ook het eventuele hele getal.',
            simplification_required:'Je antwoord klopt, maar de breuk kan nog vereenvoudigd worden. Klik op Vereenvoudigen.',
            invalid_simplification:'Vul de teller en noemer van de vereenvoudigde breuk in.',
            incorrect_simplification:'De vereenvoudigde breuk klopt nog niet.'
          };
          feedback.textContent = messages[result.classification] || 'Controleer je antwoord en probeer het opnieuw.';
          answer.focus();
        }
      });
      content.append(card);
      answer.focus();
    }
    renderCurrentTask();
  }

  function renderUnlikeMixedDenominatorSubtractionPractice() {
    const learnerKey = student || context?.learnerId || 'local-learner';
    const session = createFractionUnlikeMixedDenominatorSubtractionSession({ learnerKey });
    function renderCurrentTask() {
      const task = session.getCurrentTask();
      const progress = session.getProgress();
      content.replaceChildren();
      const card = documentRef.createElement('section');
      card.className = 'card fraction-whole-mixed-addition-card';
      const template = createFractionPracticeTemplate({ mount: card });
      const title = documentRef.createElement('h2');
      title.textContent = 'Ongelijknamige breuken groter dan 1 van elkaar aftrekken';
      const instruction = documentRef.createElement('p');
      instruction.className = 'fraction-practice-instruction';
      instruction.textContent = 'Trek de gemengde getallen van elkaar af. Geef je antwoord als gemengd getal en vereenvoudig als dat kan.';
      const progressLabel = documentRef.createElement('p');
      progressLabel.className = 'fraction-practice-progress';
      progressLabel.textContent = 'Som ' + (task ? task.taskNumber : progress.totalCount) + ' van 15 • ' + progress.completedCount + ' afgerond';
      template.titleArea.append(title);
      template.instructionArea.append(instruction);
      template.progressArea.append(progressLabel);
      if (!task) {
        const done = documentRef.createElement('p');
        done.className = 'fraction-practice-complete';
        done.textContent = 'Je hebt alle 15 sommen afgerond. Goed gewerkt!';
        template.workArea.append(done);
        const restart = documentRef.createElement('button');
        restart.type = 'button';
        restart.className = 'paco-btn paco-btn--primary';
        restart.textContent = 'Oefenronde opnieuw doen';
        restart.addEventListener('click', () => { session.reset(); renderCurrentTask(); });
        template.actionsArea.append(restart);
        content.append(card);
        return;
      }
      const equation = documentRef.createElement('div');
      equation.className = 'construction-equation fraction-like-subtraction-equation';
      const left = documentRef.createElement('span');
      left.className = 'pacogo-fraction-mixed-number';
      left.append(documentRef.createTextNode(String(task.left.whole)));
      left.append(renderFractionRepresentation({numerator:task.left.numerator,denominator:task.left.denominator},'symbolic_fraction','Eerste breuk'));
      const right = documentRef.createElement('span');
      right.className = 'pacogo-fraction-mixed-number';
      right.append(documentRef.createTextNode(String(task.right.whole)));
      right.append(renderFractionRepresentation({numerator:task.right.numerator,denominator:task.right.denominator},'symbolic_fraction','Tweede breuk'));
      equation.append(left,documentRef.createTextNode(' − '),right,documentRef.createTextNode(' = '));
      const answerMount = documentRef.createElement('div');
      answerMount.className = 'fraction-like-subtraction-answer';
      equation.append(answerMount);
      template.workArea.append(equation);
      const prompt = documentRef.createElement('p');
      prompt.textContent = 'Vul de uitkomst als gemengd getal in. Gebruik Vereenvoudigen als dat nodig is.';
      template.promptArea.append(prompt);
      const feedback = documentRef.createElement('p');
      feedback.setAttribute('role','status');
      feedback.textContent = 'Je antwoord moet kloppen en volledig vereenvoudigd zijn als dat mogelijk is.';
      template.feedbackArea.append(feedback);
      const answer = renderFractionAnswerInput({workMount:answerMount,controlsMount:template.controlsArea});
      const submit = documentRef.createElement('button');
      submit.type = 'button';
      submit.className = 'paco-btn paco-btn--primary';
      submit.textContent = 'Controleren';
      template.actionsArea.append(submit);
      submit.addEventListener('click', () => {
        const values = answer.getValues();
        const result = session.recordAnswer({
          wholeNumberEnabled:values.wholeNumberEnabled,wholeNumber:values.wholeNumber,
          numerator:values.numerator,denominator:values.denominator,
          simplified:values.simplified,simplifiedNumerator:values.simplifiedNumerator,
          simplifiedDenominator:values.simplifiedDenominator
        });
        progressLabel.textContent = 'Som ' + (result.progress.isComplete ? 15 : result.progress.completedCount + 1) +
          ' van 15 • ' + result.progress.completedCount + ' afgerond';
        if (result.classification === 'valid') {
          answer.lock();
          submit.disabled = true;
          feedback.textContent = 'Goed gedaan! Je hebt de aftrekking correct uitgerekend.';
          const next = documentRef.createElement('button');
          next.type = 'button';
          next.className = 'paco-btn paco-btn--primary';
          next.textContent = result.progress.isComplete ? 'Oefenronde afronden' : 'Volgende som';
          next.addEventListener('click', renderCurrentTask);
          template.actionsArea.replaceChildren(next);
        } else {
          const messages = {
            invalid_input:'Vul het hele getal, de teller en de noemer correct in.',
            incorrect_answer:'De aftrekking klopt nog niet. Maak de noemers gelijk en controleer je berekening.',
            simplification_required:'Je antwoord klopt, maar kan nog vereenvoudigd worden. Klik op Vereenvoudigen.',
            invalid_simplification:'Vul de teller en noemer van de vereenvoudigde breuk in.',
            incorrect_simplification:'De vereenvoudigde breuk klopt nog niet.'
          };
          feedback.textContent = messages[result.classification] || 'Controleer je antwoord en probeer het opnieuw.';
          answer.focus();
        }
      });
      content.append(card);
      answer.focus();
    }
    renderCurrentTask();
  }

  function renderWholeMinusMixedSubtractionPractice() {
    const learnerKey = student || context?.learnerId || 'local-learner';
    const session = createFractionSubtractionPracticeSession({ learnerKey });
    const exercise = FRACTION_SUBTRACTION_EXERCISE;

    function renderCurrentTask() {
      const task = session.getCurrentTask();
      const progress = session.getProgress();
      content.replaceChildren();
      const card = documentRef.createElement('section');
      card.className = 'card fraction-whole-mixed-addition-card';
      const template = createFractionPracticeTemplate({ mount: card });
      const title = documentRef.createElement('h2');
      title.textContent = exercise.title;
      const instruction = documentRef.createElement('p');
      instruction.className = 'fraction-practice-instruction';
      instruction.textContent = 'Trek het gemengde getal af van het hele getal. Geef je antwoord als gemengd getal.';
      const progressLabel = documentRef.createElement('p');
      progressLabel.className = 'fraction-practice-progress';
      progressLabel.textContent = formatFractionPracticeProgress(progress, exercise);
      template.titleArea.append(title);
      template.instructionArea.append(instruction);
      template.progressArea.append(progressLabel);

      if (!task) {
        const done = documentRef.createElement('p');
        done.className = 'fraction-practice-complete';
        done.textContent = 'Je hebt alle 15 sommen afgerond. Goed gewerkt!';
        template.workArea.append(done);
        content.append(card);
        return;
      }

      const equation = documentRef.createElement('div');
      equation.className = 'fraction-whole-mixed-equation';
      const expression = documentRef.createElement('div');
      expression.className = 'fraction-whole-mixed-expression';
      const whole = documentRef.createElement('span');
      whole.className = 'fraction-whole-mixed-expression__whole';
      whole.textContent = String(task.whole);
      const minus = documentRef.createElement('span');
      minus.className = 'fraction-whole-mixed-expression__operator';
      minus.textContent = '−';
      expression.append(whole, minus, renderMixedNumber({
        wholeNumber: task.mixed.whole,
        numerator: task.mixed.numerator,
        denominator: task.mixed.denominator
      }, 'Gemengd getal dat wordt afgetrokken'));
      const equals = documentRef.createElement('span');
      equals.className = 'fraction-whole-mixed-expression__operator';
      equals.textContent = '=';
      const answerMount = documentRef.createElement('div');
      answerMount.className = 'fraction-whole-mixed-answer';
      equation.append(expression, equals, answerMount);
      template.workArea.append(equation);

      const answer = renderFractionAnswerInput({
        workMount: answerMount,
        controlsMount: template.controlsArea,
        wholeNumberMode: 'required'
      });
      const check = documentRef.createElement('button');
      check.type = 'button';
      check.className = 'paco-btn paco-btn--primary';
      check.textContent = 'Controleren';
      template.actionsArea.append(check);

      check.addEventListener('click', () => {
        const result = session.recordAnswer({ values: answer.getValues() });
        if (result.classification === 'valid') {
          answer.lock();
          check.disabled = true;
          const feedback = documentRef.createElement('p');
          feedback.className = 'fraction-practice-feedback is-correct';
          feedback.setAttribute('role', 'status');
          feedback.textContent = 'Goed gedaan! Je antwoord klopt.';
          template.feedbackArea.replaceChildren(feedback);
          const next = documentRef.createElement('button');
          next.type = 'button';
          next.className = 'paco-btn paco-btn--primary';
          next.textContent = result.progress.isComplete ? 'Bekijk resultaat' : 'Volgende som';
          next.addEventListener('click', renderCurrentTask);
          template.actionsArea.replaceChildren(next);
          progressLabel.textContent = formatFractionPracticeProgress(result.progress, exercise);
          return;
        }
        const messages = {
          invalid_input: 'Vul een geldige teller en noemer in. De noemer moet groter zijn dan nul.',
          incorrect_answer: 'Dit antwoord klopt nog niet. Trek het gemengde getal zorgvuldig af.',
          requires_mixed_number: 'Gebruik ook het veld ‘Heel getal toevoegen’ voor je antwoord.',
          requires_simplification: 'Je berekening klopt. Vereenvoudig de breuk zo ver mogelijk.',
          not_simplified: 'Deze breuk is nog niet volledig vereenvoudigd. Probeer het opnieuw.'
        };
        const feedback = documentRef.createElement('p');
        feedback.className = 'fraction-practice-feedback is-error';
        feedback.setAttribute('role', 'alert');
        feedback.textContent = messages[result.classification] || 'Controleer je antwoord en probeer het opnieuw.';
        template.feedbackArea.replaceChildren(feedback);
      });
      content.append(card);
    }

    renderCurrentTask();
  }

  function renderWholeNumberMixedAdditionPractice() {
    const learnerKey = student || context?.learnerId || 'local-learner';
    const session = createFractionWholeMixedAdditionSession({ learnerKey });
    const exercise = FRACTION_WHOLE_MIXED_ADDITION_EXERCISE;

    function renderCurrentTask(feedbackMessage = '') {
      const task = session.getCurrentTask();
      const progress = session.getProgress();
      content.replaceChildren();
      const card = documentRef.createElement('section');
      card.className = 'card fraction-whole-mixed-addition-card';
      const template = createFractionPracticeTemplate({ mount: card });
      const title = documentRef.createElement('h2');
      title.textContent = exercise.title;
      const instruction = documentRef.createElement('p');
      instruction.className = 'fraction-practice-instruction';
      instruction.textContent = 'Tel het hele getal en het gemengde getal bij elkaar op. Geef je antwoord als gemengd getal.';
      const progressLabel = documentRef.createElement('p');
      progressLabel.className = 'fraction-practice-progress';
      progressLabel.textContent = formatFractionPracticeProgress(progress, exercise);
      template.titleArea.append(title);
      template.instructionArea.append(instruction);
      template.progressArea.append(progressLabel);

      if (!task) {
        const done = documentRef.createElement('p');
        done.className = 'fraction-practice-complete';
        done.textContent = 'Je hebt alle 15 sommen afgerond. Goed gewerkt!';
        template.workArea.append(done);
        content.append(card);
        return;
      }

      const equation = documentRef.createElement('div');
      equation.className = 'fraction-whole-mixed-equation';
      const expression = documentRef.createElement('div');
      expression.className = 'fraction-whole-mixed-expression';
      const whole = documentRef.createElement('span');
      whole.className = 'fraction-whole-mixed-expression__whole';
      whole.textContent = String(task.whole);
      const plus = documentRef.createElement('span');
      plus.className = 'fraction-whole-mixed-expression__operator';
      plus.textContent = '+';
      expression.append(whole, plus, renderMixedNumber({
        wholeNumber: task.mixed.whole,
        numerator: task.mixed.numerator,
        denominator: task.mixed.denominator
      }, 'Gemengd getal'));
      const equals = documentRef.createElement('span');
      equals.className = 'fraction-whole-mixed-expression__operator';
      equals.textContent = '=';
      const answerMount = documentRef.createElement('div');
      answerMount.className = 'fraction-whole-mixed-answer';
      equation.append(expression, equals, answerMount);
      template.workArea.append(equation);

      const answer = renderFractionAnswerInput({
        workMount: answerMount,
        controlsMount: template.controlsArea,
        wholeNumberMode: 'required'
      });
      const check = documentRef.createElement('button');
      check.type = 'button';
      check.className = 'paco-btn paco-btn--primary';
      check.textContent = 'Controleren';
      template.actionsArea.append(check);

      if (feedbackMessage) {
        const feedback = documentRef.createElement('p');
        feedback.className = 'fraction-practice-feedback';
        feedback.setAttribute('role', 'status');
        feedback.textContent = feedbackMessage;
        template.feedbackArea.append(feedback);
      }

      check.addEventListener('click', () => {
        const result = session.recordAnswer({ values: answer.getValues() });
        if (result.classification === 'valid') {
          answer.lock();
          check.disabled = true;
          const feedback = documentRef.createElement('p');
          feedback.className = 'fraction-practice-feedback is-correct';
          feedback.setAttribute('role', 'status');
          feedback.textContent = 'Goed gedaan! Je antwoord klopt.';
          template.feedbackArea.replaceChildren(feedback);
          const next = documentRef.createElement('button');
          next.type = 'button';
          next.className = 'paco-btn paco-btn--primary';
          next.textContent = result.progress.isComplete ? 'Bekijk resultaat' : 'Volgende som';
          next.addEventListener('click', () => renderCurrentTask());
          template.actionsArea.replaceChildren(next);
          progressLabel.textContent = formatFractionPracticeProgress(result.progress, exercise);
          return;
        }
        const messages = {
          invalid_input: 'Vul alle benodigde getallen in. De noemer moet groter zijn dan nul.',
          incorrect_answer: 'Dat antwoord klopt nog niet. Probeer het opnieuw.',
          requires_mixed_number: 'Gebruik ook het veld ‘Heel getal toevoegen’ voor je gemengde getal.',
          requires_simplification: 'Je berekening klopt. Je kunt de breuk nog vereenvoudigen. Maak de breuk zo eenvoudig mogelijk.',
          not_simplified: 'Deze breuk is nog niet volledig vereenvoudigd. Probeer het nog eens.'
        };
        template.feedbackArea.replaceChildren();
        const feedback = documentRef.createElement('p');
        feedback.className = 'fraction-practice-feedback is-error';
        feedback.setAttribute('role', 'alert');
        feedback.textContent = messages[result.classification] || 'Controleer je antwoord en probeer het opnieuw.';
        template.feedbackArea.append(feedback);
      });
      content.append(card);
    }

    renderCurrentTask();
  }


  function renderLikeDenominatorDivisionGuidedPractice() {
    const learnerKey = student || context?.learnerId || 'local-learner';
    const session = createFractionLikeDenominatorDivisionGuidedSession({
      learnerKey, tasks: FRACTION_LIKE_DENOMINATOR_DIVISION_GUIDED_TASKS
    });
    const exercise = { title: 'Gelijknamige breuken kleiner dan 1 op elkaar delen', difficultyLevel: 2, maxDifficultyLevel: 5 };
    let awaitingNextTask = false, completedTaskSnapshot = null;

    function fractionEntry(label) {
      const wrap = documentRef.createElement('div');
      wrap.className = 'fraction-like-division-guided-entry';
      const numerator = documentRef.createElement('input');
      numerator.type = 'text'; numerator.inputMode = 'numeric'; numerator.autocomplete = 'off';
      numerator.className = 'fraction-guided-scalar-input fraction-like-division-guided-number';
      numerator.maxLength = 4; numerator.setAttribute('aria-label', label + ' teller');
      const bar = documentRef.createElement('span'); bar.className = 'fraction-like-division-guided-bar';
      const denominator = documentRef.createElement('input');
      denominator.type = 'text'; denominator.inputMode = 'numeric'; denominator.autocomplete = 'off';
      denominator.className = 'fraction-guided-scalar-input fraction-like-division-guided-number';
      denominator.maxLength = 4; denominator.setAttribute('aria-label', label + ' noemer');
      wrap.append(numerator, bar, denominator);
      return { wrap, numerator, denominator, focus: () => numerator.focus() };
    }

    function renderCurrentTask(feedbackMessage = '') {
      const step = awaitingNextTask ? completedTaskSnapshot : session.getCurrentStep();
      const progress = session.getProgress();
      content.replaceChildren();
      const card = documentRef.createElement('section');
      card.className = 'card fraction-whole-mixed-addition-card fraction-addition-guided-card fraction-like-denominator-division-guided-card';
      const template = createFractionPracticeTemplate({ mount: card });
      const title = documentRef.createElement('h2'); title.textContent = exercise.title;
      const instruction = documentRef.createElement('p');
      instruction.className = 'fraction-practice-instruction';
      instruction.textContent = 'Werk de drie stappen één voor één af. Je gaat pas verder als je de huidige stap goed hebt gedaan.';
      const progressLabel = documentRef.createElement('p');
      progressLabel.className = 'fraction-practice-progress';
      progressLabel.textContent = formatFractionPracticeProgress(progress, exercise);
      template.titleArea.append(title); template.instructionArea.append(instruction); template.progressArea.append(progressLabel);
      if (!step) {
        const done = documentRef.createElement('p'); done.className = 'fraction-practice-complete';
        done.textContent = 'Je hebt alle 10 sommen afgerond. Goed gewerkt!';
        template.workArea.append(done); content.append(card);
        template.showRestartAction(() => { session.reset(); awaitingNextTask = false; completedTaskSnapshot = null; renderCurrentTask(); });
        return;
      }
      const op = value => Object.assign(documentRef.createElement('span'), { className: 'fraction-guided-operator', textContent: value });
      const prompt = documentRef.createElement('div'); prompt.className = 'fraction-guided-task-prompt fraction-whole-mixed-expression';
      prompt.append(
        renderFractionRepresentation(step.task.left, 'symbolic_fraction', 'Eerste breuk'),
        op('÷'),
        renderFractionRepresentation(step.task.right, 'symbolic_fraction', 'Tweede breuk')
      );
      const solution = documentRef.createElement('div'); solution.className = 'fraction-guided-solution';
      solution.setAttribute('aria-label', 'Uitgewerkte tussenstappen');
      if (step.completedStepIds.includes('invert_divisor')) {
        solution.append(
          op('='),
          renderFractionRepresentation(step.task.left, 'symbolic_fraction', 'Eerste breuk'),
          op('×'),
          renderFractionRepresentation(step.inverse, 'symbolic_fraction', 'Omgekeerde tweede breuk')
        );
      }
      if (step.completedStepIds.includes('multiply_fractions')) {
        solution.append(
          op('='),
          renderFractionRepresentation(step.product, 'symbolic_fraction', 'Product van de breuken')
        );
      }
      if (step.completedStepIds.includes('simplify_quotient')) {
        solution.append(
          op('='),
          renderMixedNumber({
            wholeNumber: step.task.answer.whole,
            numerator: step.task.answer.numerator,
            denominator: step.task.answer.denominator
          }, 'Vereenvoudigde uitkomst')
        );
      }
      const equation = documentRef.createElement('div'); equation.className = 'fraction-guided-equation';
      equation.setAttribute('aria-label', 'Doelsom en uitgewerkte tussenstappen');
      equation.append(prompt, solution);
      template.promptArea.append(equation);
      const grid = documentRef.createElement('div'); grid.className = 'fraction-guided-step-grid fraction-guided-step-grid--progressive';
      grid.setAttribute('aria-label', 'Drie denkstappen');
      grid.dataset.activeStep = awaitingNextTask ? 'completed' : step.stepId;
      let activeEntry = null, activeAnswer = null;
      const completed = step.completedStepIds;
      const summaries = [
        { id: 'invert_divisor', text: 'Keer de tweede breuk om', result: step.inverse },
        { id: 'multiply_fractions', text: 'Vermenigvuldig de tellers en noemers', result: step.product },
        { id: 'simplify_quotient', text: 'Vereenvoudig de uitkomst', result: step.task.answer }
      ];
      summaries.forEach((item, index) => {
        const isDone = completed.includes(item.id), isActive = step.stepId === item.id;
        const panel = documentRef.createElement('details'); panel.className = 'fraction-guided-step-card';
        panel.open = awaitingNextTask || isActive;
        panel.dataset.stepId = item.id;
        panel.dataset.state = isDone ? 'completed' : isActive ? 'active' : 'locked';
        panel.setAttribute('aria-label', 'Stap ' + (index + 1) + ': ' + item.text);
        const summary = documentRef.createElement('summary'); summary.className = 'fraction-guided-step-summary';
        const heading = documentRef.createElement('h3'); heading.textContent = 'Stap ' + (index + 1);
        const label = documentRef.createElement('p'); label.className = 'fraction-guided-step-title'; label.textContent = item.text;
        summary.append(heading, label); panel.append(summary);
        const body = documentRef.createElement('div'); body.className = 'fraction-guided-step-content';
        if (isDone) {
          const status = documentRef.createElement('p'); status.className = 'fraction-guided-step-status'; status.textContent = 'Afgerond';
          const answer = documentRef.createElement('div'); answer.className = 'fraction-guided-step-completed-answer';
          if (item.id === 'simplify_quotient') {
            answer.append(renderMixedNumber({ wholeNumber: item.result.whole, numerator: item.result.numerator, denominator: item.result.denominator }, 'Vereenvoudigde uitkomst'));
          } else {
            answer.append(renderFractionRepresentation(item.result, 'symbolic_fraction', 'Uitkomst van de stap'));
          }
          body.append(status, answer);
        } else if (isActive) {
          const help = documentRef.createElement('p'); help.className = 'fraction-guided-step-prompt';
          help.textContent = item.id === 'invert_divisor'
            ? 'Draai de tweede breuk om: de noemer wordt de teller en de teller wordt de noemer.'
            : item.id === 'multiply_fractions'
            ? 'Vermenigvuldig de tellers met elkaar en de noemers met elkaar.'
            : 'Vul de uitkomst als een volledig vereenvoudigd gemengd getal in.';
          const expression = documentRef.createElement('div'); expression.className = 'fraction-guided-step-expression';
          if (item.id === 'invert_divisor') {
            expression.append(renderFractionRepresentation(step.task.left, 'symbolic_fraction', 'Eerste breuk'), op('×'));
            activeEntry = fractionEntry('Omgekeerde tweede breuk'); expression.append(activeEntry.wrap);
          } else if (item.id === 'multiply_fractions') {
            expression.append(
              renderFractionRepresentation(step.task.left, 'symbolic_fraction', 'Eerste breuk'), op('×'),
              renderFractionRepresentation(step.inverse, 'symbolic_fraction', 'Omgekeerde tweede breuk'), op('=')
            );
            activeEntry = fractionEntry('Product'); expression.append(activeEntry.wrap);
          } else {
            expression.append(renderFractionRepresentation(step.product, 'symbolic_fraction', 'Onvereenvoudigde uitkomst'), op('='));
            const answerMount = documentRef.createElement('div'); answerMount.className = 'fraction-guided-mixed-answer';
            expression.append(answerMount);
            activeAnswer = renderFractionAnswerInput({ workMount: answerMount, controlsMount: template.controlsArea, wholeNumberMode: 'required' });
          }
          const check = documentRef.createElement('button'); check.type = 'button';
          check.className = 'paco-btn paco-btn--primary paco-btn--small'; check.textContent = 'Controleren';
          check.addEventListener('click', () => {
            const result = session.recordResponse(item.id === 'simplify_quotient'
              ? { values: activeAnswer?.getValues() }
              : { numerator: activeEntry?.numerator.value || '', denominator: activeEntry?.denominator.value || '' });
            if (result.classification === 'valid') {
              activeAnswer?.lock();
              if (item.id === 'simplify_quotient') {
                completedTaskSnapshot = { ...step, completedStepIds: [...step.completedStepIds, item.id] };
                awaitingNextTask = true;
              }
              renderCurrentTask(item.id === 'simplify_quotient' ? 'Goed gedaan! Je hebt deze som afgerond.' : 'Goed gedaan! Deze stap is afgerond.');
              return;
            }
            const messages = {
              invalid_input: 'Vul zowel de teller als de noemer in.',
              incorrect_answer: item.id === 'invert_divisor'
                ? 'Draai de tweede breuk om: de teller en noemer wisselen van plaats.'
                : item.id === 'multiply_fractions'
                ? 'Vermenigvuldig de tellers met elkaar en de noemers met elkaar.'
                : 'Dat antwoord klopt nog niet. Controleer de vereenvoudiging.',
              requires_simplification: 'Je antwoord klopt, maar de breuk moet nog verder vereenvoudigd worden.',
              not_simplified: 'Vul het volledig vereenvoudigde antwoord in.'
            };
            const feedback = documentRef.createElement('p'); feedback.className = 'fraction-practice-feedback is-error';
            feedback.setAttribute('role','alert'); feedback.textContent = messages[result.classification] || 'Controleer je antwoord en probeer het opnieuw.';
            template.feedbackArea.replaceChildren(feedback); activeEntry?.focus(); activeAnswer?.focus();
          });
          panel.addEventListener('keydown', event => {
            if (event.key === 'Enter' && event.target instanceof documentRef.defaultView.HTMLInputElement) { event.preventDefault(); check.click(); }
          });
          body.append(help, expression, check);
        } else {
          const status = documentRef.createElement('p'); status.className = 'fraction-guided-step-status';
          status.textContent = 'Komt hierna'; body.append(status);
        }
        panel.append(body); grid.append(panel);
      });
      template.workArea.append(grid);
      if (feedbackMessage) {
        const feedback = documentRef.createElement('p'); feedback.className = 'fraction-practice-feedback is-correct';
        feedback.setAttribute('role','status'); feedback.textContent = feedbackMessage; template.feedbackArea.append(feedback);
      }
      content.append(card);
      if (awaitingNextTask) {
        const done = documentRef.createElement('p'); done.className = 'fraction-practice-complete';
        done.textContent = progress.isComplete ? 'Deze laatste som is afgerond. Je hebt alle 10 sommen goed gemaakt.' : 'Deze som is afgerond. Klik op Volgende som als je klaar bent.';
        template.workArea.append(done);
        if (progress.isComplete) {
          template.showRestartAction(() => { session.reset(); awaitingNextTask = false; completedTaskSnapshot = null; renderCurrentTask(); });
        } else {
          template.showNextAction(() => { awaitingNextTask = false; completedTaskSnapshot = null; renderCurrentTask(); });
        }
      } else if (activeEntry) activeEntry.focus();
    }
    renderCurrentTask();
  }

  function renderUnlikeDenominatorDivisionGuidedPractice() {
    const learnerKey = student || context?.learnerId || 'local-learner';
    const session = createFractionUnlikeDenominatorDivisionGuidedSession({
      learnerKey, tasks: FRACTION_UNLIKE_DENOMINATOR_DIVISION_GUIDED_TASKS
    });
    const exercise = { title: 'Ongelijknamige breuken kleiner dan 1 op elkaar delen', difficultyLevel: 3, maxDifficultyLevel: 5 };
    let awaitingNextTask = false, completedTaskSnapshot = null;

    function fractionEntry(label) {
      const wrap = documentRef.createElement('div');
      wrap.className = 'fraction-like-division-guided-entry';
      const numerator = documentRef.createElement('input');
      numerator.type = 'text'; numerator.inputMode = 'numeric'; numerator.autocomplete = 'off';
      numerator.className = 'fraction-guided-scalar-input fraction-like-division-guided-number';
      numerator.maxLength = 4; numerator.setAttribute('aria-label', label + ' teller');
      const bar = documentRef.createElement('span'); bar.className = 'fraction-like-division-guided-bar';
      const denominator = documentRef.createElement('input');
      denominator.type = 'text'; denominator.inputMode = 'numeric'; denominator.autocomplete = 'off';
      denominator.className = 'fraction-guided-scalar-input fraction-like-division-guided-number';
      denominator.maxLength = 4; denominator.setAttribute('aria-label', label + ' noemer');
      wrap.append(numerator, bar, denominator);
      return { wrap, numerator, denominator, focus: () => numerator.focus() };
    }

    function renderCurrentTask(feedbackMessage = '') {
      const step = awaitingNextTask ? completedTaskSnapshot : session.getCurrentStep();
      const progress = session.getProgress();
      content.replaceChildren();
      const card = documentRef.createElement('section');
      card.className = 'card fraction-whole-mixed-addition-card fraction-addition-guided-card fraction-unlike-denominator-division-guided-card';
      const template = createFractionPracticeTemplate({ mount: card });
      const title = documentRef.createElement('h2'); title.textContent = exercise.title;
      const instruction = documentRef.createElement('p');
      instruction.className = 'fraction-practice-instruction';
      instruction.textContent = 'Werk de drie stappen één voor één af. Je gaat pas verder als je de huidige stap goed hebt gedaan.';
      const progressLabel = documentRef.createElement('p');
      progressLabel.className = 'fraction-practice-progress';
      progressLabel.textContent = formatFractionPracticeProgress(progress, exercise);
      template.titleArea.append(title); template.instructionArea.append(instruction); template.progressArea.append(progressLabel);
      if (!step) {
        const done = documentRef.createElement('p'); done.className = 'fraction-practice-complete';
        done.textContent = 'Je hebt alle 10 sommen afgerond. Goed gewerkt!';
        template.workArea.append(done); content.append(card);
        template.showRestartAction(() => { session.reset(); awaitingNextTask = false; completedTaskSnapshot = null; renderCurrentTask(); });
        return;
      }
      const op = value => Object.assign(documentRef.createElement('span'), { className: 'fraction-guided-operator', textContent: value });
      const prompt = documentRef.createElement('div'); prompt.className = 'fraction-guided-task-prompt fraction-whole-mixed-expression';
      prompt.append(
        renderFractionRepresentation(step.task.left, 'symbolic_fraction', 'Eerste breuk'),
        op('÷'),
        renderFractionRepresentation(step.task.right, 'symbolic_fraction', 'Tweede breuk')
      );
      const solution = documentRef.createElement('div'); solution.className = 'fraction-guided-solution';
      solution.setAttribute('aria-label', 'Uitgewerkte tussenstappen');
      if (step.completedStepIds.includes('invert_divisor')) {
        solution.append(
          op('='),
          renderFractionRepresentation(step.task.left, 'symbolic_fraction', 'Eerste breuk'),
          op('×'),
          renderFractionRepresentation(step.inverse, 'symbolic_fraction', 'Omgekeerde tweede breuk')
        );
      }
      if (step.completedStepIds.includes('multiply_fractions')) {
        solution.append(
          op('='),
          renderFractionRepresentation(step.product, 'symbolic_fraction', 'Product van de breuken')
        );
      }
      if (step.completedStepIds.includes('simplify_quotient')) {
        solution.append(
          op('='),
          renderMixedNumber({
            wholeNumber: step.task.answer.whole,
            numerator: step.task.answer.numerator,
            denominator: step.task.answer.denominator
          }, 'Vereenvoudigde uitkomst')
        );
      }
      const equation = documentRef.createElement('div'); equation.className = 'fraction-guided-equation';
      equation.setAttribute('aria-label', 'Doelsom en uitgewerkte tussenstappen');
      equation.append(prompt, solution);
      template.promptArea.append(equation);
      const grid = documentRef.createElement('div'); grid.className = 'fraction-guided-step-grid fraction-guided-step-grid--progressive';
      grid.setAttribute('aria-label', 'Drie denkstappen');
      grid.dataset.activeStep = awaitingNextTask ? 'completed' : step.stepId;
      let activeEntry = null, activeAnswer = null;
      const completed = step.completedStepIds;
      const summaries = [
        { id: 'invert_divisor', text: 'Keer de tweede breuk om', result: step.inverse },
        { id: 'multiply_fractions', text: 'Vermenigvuldig de tellers en noemers', result: step.product },
        { id: 'simplify_quotient', text: 'Vereenvoudig de uitkomst', result: step.task.answer }
      ];
      summaries.forEach((item, index) => {
        const isDone = completed.includes(item.id), isActive = step.stepId === item.id;
        const panel = documentRef.createElement('details'); panel.className = 'fraction-guided-step-card';
        panel.open = awaitingNextTask || isActive;
        panel.dataset.stepId = item.id;
        panel.dataset.state = isDone ? 'completed' : isActive ? 'active' : 'locked';
        panel.setAttribute('aria-label', 'Stap ' + (index + 1) + ': ' + item.text);
        const summary = documentRef.createElement('summary'); summary.className = 'fraction-guided-step-summary';
        const heading = documentRef.createElement('h3'); heading.textContent = 'Stap ' + (index + 1);
        const label = documentRef.createElement('p'); label.className = 'fraction-guided-step-title'; label.textContent = item.text;
        summary.append(heading, label); panel.append(summary);
        const body = documentRef.createElement('div'); body.className = 'fraction-guided-step-content';
        if (isDone) {
          const status = documentRef.createElement('p'); status.className = 'fraction-guided-step-status'; status.textContent = 'Afgerond';
          const answer = documentRef.createElement('div'); answer.className = 'fraction-guided-step-completed-answer';
          if (item.id === 'simplify_quotient') {
            answer.append(renderMixedNumber({ wholeNumber: item.result.whole, numerator: item.result.numerator, denominator: item.result.denominator }, 'Vereenvoudigde uitkomst'));
          } else {
            answer.append(renderFractionRepresentation(item.result, 'symbolic_fraction', 'Uitkomst van de stap'));
          }
          body.append(status, answer);
        } else if (isActive) {
          const help = documentRef.createElement('p'); help.className = 'fraction-guided-step-prompt';
          help.textContent = item.id === 'invert_divisor'
            ? 'Draai de tweede breuk om: de noemer wordt de teller en de teller wordt de noemer.'
            : item.id === 'multiply_fractions'
            ? 'Vermenigvuldig de tellers met elkaar en de noemers met elkaar.'
            : 'Vul de uitkomst als een volledig vereenvoudigd gemengd getal in.';
          const expression = documentRef.createElement('div'); expression.className = 'fraction-guided-step-expression';
          if (item.id === 'invert_divisor') {
            expression.append(renderFractionRepresentation(step.task.left, 'symbolic_fraction', 'Eerste breuk'), op('×'));
            activeEntry = fractionEntry('Omgekeerde tweede breuk'); expression.append(activeEntry.wrap);
          } else if (item.id === 'multiply_fractions') {
            expression.append(
              renderFractionRepresentation(step.task.left, 'symbolic_fraction', 'Eerste breuk'), op('×'),
              renderFractionRepresentation(step.inverse, 'symbolic_fraction', 'Omgekeerde tweede breuk'), op('=')
            );
            activeEntry = fractionEntry('Product'); expression.append(activeEntry.wrap);
          } else {
            expression.append(renderFractionRepresentation(step.product, 'symbolic_fraction', 'Onvereenvoudigde uitkomst'), op('='));
            const answerMount = documentRef.createElement('div'); answerMount.className = 'fraction-guided-mixed-answer';
            expression.append(answerMount);
            activeAnswer = renderFractionAnswerInput({ workMount: answerMount, controlsMount: template.controlsArea, wholeNumberMode: 'required' });
          }
          const check = documentRef.createElement('button'); check.type = 'button';
          check.className = 'paco-btn paco-btn--primary paco-btn--small'; check.textContent = 'Controleren';
          check.addEventListener('click', () => {
            const result = session.recordResponse(item.id === 'simplify_quotient'
              ? { values: activeAnswer?.getValues() }
              : { numerator: activeEntry?.numerator.value || '', denominator: activeEntry?.denominator.value || '' });
            if (result.classification === 'valid') {
              activeAnswer?.lock();
              if (item.id === 'simplify_quotient') {
                completedTaskSnapshot = { ...step, completedStepIds: [...step.completedStepIds, item.id] };
                awaitingNextTask = true;
              }
              renderCurrentTask(item.id === 'simplify_quotient' ? 'Goed gedaan! Je hebt deze som afgerond.' : 'Goed gedaan! Deze stap is afgerond.');
              return;
            }
            const messages = {
              invalid_input: 'Vul zowel de teller als de noemer in.',
              incorrect_answer: item.id === 'invert_divisor'
                ? 'Draai de tweede breuk om: de teller en noemer wisselen van plaats.'
                : item.id === 'multiply_fractions'
                ? 'Vermenigvuldig de tellers met elkaar en de noemers met elkaar.'
                : 'Dat antwoord klopt nog niet. Controleer de vereenvoudiging.',
              requires_simplification: 'Je antwoord klopt, maar de breuk moet nog verder vereenvoudigd worden.',
              not_simplified: 'Vul het volledig vereenvoudigde antwoord in.'
            };
            const feedback = documentRef.createElement('p'); feedback.className = 'fraction-practice-feedback is-error';
            feedback.setAttribute('role','alert'); feedback.textContent = messages[result.classification] || 'Controleer je antwoord en probeer het opnieuw.';
            template.feedbackArea.replaceChildren(feedback); activeEntry?.focus(); activeAnswer?.focus();
          });
          panel.addEventListener('keydown', event => {
            if (event.key === 'Enter' && event.target instanceof documentRef.defaultView.HTMLInputElement) { event.preventDefault(); check.click(); }
          });
          body.append(help, expression, check);
        } else {
          const status = documentRef.createElement('p'); status.className = 'fraction-guided-step-status';
          status.textContent = 'Komt hierna'; body.append(status);
        }
        panel.append(body); grid.append(panel);
      });
      template.workArea.append(grid);
      if (feedbackMessage) {
        const feedback = documentRef.createElement('p'); feedback.className = 'fraction-practice-feedback is-correct';
        feedback.setAttribute('role','status'); feedback.textContent = feedbackMessage; template.feedbackArea.append(feedback);
      }
      content.append(card);
      if (awaitingNextTask) {
        const done = documentRef.createElement('p'); done.className = 'fraction-practice-complete';
        done.textContent = progress.isComplete ? 'Deze laatste som is afgerond. Je hebt alle 10 sommen goed gemaakt.' : 'Deze som is afgerond. Klik op Volgende som als je klaar bent.';
        template.workArea.append(done);
        if (progress.isComplete) {
          template.showRestartAction(() => { session.reset(); awaitingNextTask = false; completedTaskSnapshot = null; renderCurrentTask(); });
        } else {
          template.showNextAction(() => { awaitingNextTask = false; completedTaskSnapshot = null; renderCurrentTask(); });
        }
      } else if (activeEntry) activeEntry.focus();
    }
    renderCurrentTask();
  }

  function renderLikeDenominatorDivisionPractice() {
    const learnerKey = student || context?.learnerId || 'local-learner';
    const session = createFractionLikeDenominatorDivisionSession({
      learnerKey, tasks: FRACTION_LIKE_DENOMINATOR_DIVISION_TASKS
    });
    const exercise = { title: 'Gelijknamige breuken kleiner dan 1 op elkaar delen', difficultyLevel: 2, maxDifficultyLevel: 5 };

    function renderCurrentTask() {
      const task = session.getCurrentTask();
      const progress = session.getProgress();
      content.replaceChildren();
      const card = documentRef.createElement('section');
      card.className = 'card fraction-whole-mixed-addition-card';
      const template = createFractionPracticeTemplate({ mount: card });
      const title = documentRef.createElement('h2');
      title.textContent = exercise.title;
      const instruction = documentRef.createElement('p');
      instruction.className = 'fraction-practice-instruction';
      instruction.textContent = 'Deel de tellers door elkaar. De noemers zijn gelijk en vallen tegen elkaar weg. Geef je antwoord als gemengd getal.';
      const progressLabel = documentRef.createElement('p');
      progressLabel.className = 'fraction-practice-progress';
      progressLabel.textContent = formatFractionPracticeProgress(progress, exercise);
      template.titleArea.append(title);
      template.instructionArea.append(instruction);
      template.progressArea.append(progressLabel);

      if (!task) {
        const done = documentRef.createElement('p');
        done.className = 'fraction-practice-complete';
        done.textContent = 'Je hebt alle 15 sommen afgerond. Goed gewerkt!';
        template.workArea.append(done);
        content.append(card);
        template.showRestartAction(() => { session.reset(); renderCurrentTask(); });
        return;
      }

      const equation = documentRef.createElement('div');
      equation.className = 'fraction-whole-mixed-equation';
      const expression = documentRef.createElement('div');
      expression.className = 'fraction-whole-mixed-expression';
      expression.append(
        renderFractionRepresentation(task.left, 'symbolic_fraction', 'Eerste breuk'),
        Object.assign(documentRef.createElement('span'), { className: 'fraction-whole-mixed-expression__operator', textContent: '÷' }),
        renderFractionRepresentation(task.right, 'symbolic_fraction', 'Tweede breuk')
      );
      const equals = documentRef.createElement('span');
      equals.className = 'fraction-whole-mixed-expression__operator';
      equals.textContent = '=';
      const answerMount = documentRef.createElement('div');
      answerMount.className = 'fraction-whole-mixed-answer';
      equation.append(expression, equals, answerMount);
      template.workArea.append(equation);

      const answer = renderFractionAnswerInput({
        workMount: answerMount, controlsMount: template.controlsArea, wholeNumberMode: 'required'
      });
      const feedback = documentRef.createElement('p');
      feedback.className = 'fraction-practice-feedback';
      feedback.setAttribute('role', 'status');
      feedback.textContent = 'Vul het antwoord als gemengd getal in en vereenvoudig het breukdeel.';
      template.feedbackArea.append(feedback);
      const check = documentRef.createElement('button');
      check.type = 'button';
      check.className = 'paco-btn paco-btn--primary';
      check.textContent = 'Controleren';
      template.actionsArea.append(check);

      check.addEventListener('click', () => {
        const result = session.recordAnswer({ values: answer.getValues() });
        if (result.classification === 'valid') {
          answer.lock();
          check.disabled = true;
          feedback.classList.add('is-correct');
          feedback.textContent = 'Goed gedaan! Je hebt de deling correct uitgerekend.';
          const next = documentRef.createElement('button');
          next.type = 'button';
          next.className = 'paco-btn paco-btn--primary';
          next.textContent = 'Volgende som';
          next.addEventListener('click', renderCurrentTask);
          template.actionsArea.replaceChildren(next);
          progressLabel.textContent = formatFractionPracticeProgress(result.progress, exercise);
          return;
        }
        const messages = {
          invalid_input: 'Vul het hele getal, de teller en de noemer van je antwoord in.',
          incorrect_answer: 'Dat antwoord klopt nog niet. Deel de teller van de eerste breuk door de teller van de tweede breuk.',
          requires_simplification: 'Je antwoord klopt, maar het breukdeel moet nog vereenvoudigd worden.',
          not_simplified: 'De vereenvoudigde breuk klopt nog niet. Probeer het opnieuw.'
        };
        feedback.classList.add('is-error');
        feedback.textContent = messages[result.classification] || 'Controleer je antwoord en probeer het opnieuw.';
        answer.focus();
      });
      content.append(card);
      answer.focus();
    }
    renderCurrentTask();
  }


  function renderUnlikeDenominatorDivisionPractice() {
    const learnerKey = student || context?.learnerId || 'local-learner';
    const session = createFractionUnlikeDenominatorDivisionSession({
      learnerKey, tasks: FRACTION_UNLIKE_DENOMINATOR_DIVISION_TASKS
    });
    const exercise = { title: 'Ongelijknamige breuken kleiner dan 1 op elkaar delen', difficultyLevel: 3, maxDifficultyLevel: 5 };

    function renderCurrentTask() {
      const task = session.getCurrentTask();
      const progress = session.getProgress();
      content.replaceChildren();
      const card = documentRef.createElement('section');
      card.className = 'card fraction-whole-mixed-addition-card';
      const template = createFractionPracticeTemplate({ mount: card });
      const title = documentRef.createElement('h2');
      title.textContent = exercise.title;
      const instruction = documentRef.createElement('p');
      instruction.className = 'fraction-practice-instruction';
      instruction.textContent = 'Bereken de uitkomst en schrijf je antwoord als een vereenvoudigd gemengd getal.';
      const progressLabel = documentRef.createElement('p');
      progressLabel.className = 'fraction-practice-progress';
      progressLabel.textContent = formatFractionPracticeProgress(progress, exercise);
      template.titleArea.append(title);
      template.instructionArea.append(instruction);
      template.progressArea.append(progressLabel);

      if (!task) {
        const done = documentRef.createElement('p');
        done.className = 'fraction-practice-complete';
        done.textContent = 'Je hebt alle 15 sommen afgerond. Goed gewerkt!';
        template.workArea.append(done);
        content.append(card);
        template.showRestartAction(() => { session.reset(); renderCurrentTask(); });
        return;
      }

      const equation = documentRef.createElement('div');
      equation.className = 'fraction-whole-mixed-equation';
      const expression = documentRef.createElement('div');
      expression.className = 'fraction-whole-mixed-expression';
      expression.append(
        renderFractionRepresentation(task.left, 'symbolic_fraction', 'Eerste breuk'),
        Object.assign(documentRef.createElement('span'), { className: 'fraction-whole-mixed-expression__operator', textContent: '÷' }),
        renderFractionRepresentation(task.right, 'symbolic_fraction', 'Tweede breuk')
      );
      const equals = documentRef.createElement('span');
      equals.className = 'fraction-whole-mixed-expression__operator';
      equals.textContent = '=';
      const answerMount = documentRef.createElement('div');
      answerMount.className = 'fraction-whole-mixed-answer';
      equation.append(expression, equals, answerMount);
      template.workArea.append(equation);

      const answer = renderFractionAnswerInput({
        workMount: answerMount, controlsMount: template.controlsArea, wholeNumberMode: 'required'
      });
      const feedback = documentRef.createElement('p');
      feedback.className = 'fraction-practice-feedback';
      feedback.setAttribute('role', 'status');
      feedback.textContent = 'Vul het antwoord als gemengd getal in en vereenvoudig het breukdeel.';
      template.feedbackArea.append(feedback);
      const check = documentRef.createElement('button');
      check.type = 'button';
      check.className = 'paco-btn paco-btn--primary';
      check.textContent = 'Controleren';
      template.actionsArea.append(check);

      check.addEventListener('click', () => {
        const result = session.recordAnswer({ values: answer.getValues() });
        if (result.classification === 'valid') {
          answer.lock();
          check.disabled = true;
          feedback.classList.add('is-correct');
          feedback.textContent = 'Goed gedaan! Je hebt de deling correct uitgerekend.';
          progressLabel.textContent = formatFractionPracticeProgress(result.progress, exercise);
          if (result.progress.isComplete) {
            template.showRestartAction(() => { session.reset(); renderCurrentTask(); });
          } else {
            const next = documentRef.createElement('button');
            next.type = 'button';
            next.className = 'paco-btn paco-btn--primary';
            next.textContent = 'Volgende som';
            next.addEventListener('click', renderCurrentTask);
            template.actionsArea.replaceChildren(next);
            next.focus();
          }
          return;
        }
        const messages = {
          invalid_input: 'Vul het hele getal, de teller en de noemer van je antwoord in.',
          incorrect_answer: 'Dat antwoord klopt nog niet. Controleer je berekening en probeer het opnieuw.',
          requires_simplification: 'Je antwoord klopt, maar het breukdeel moet nog vereenvoudigd worden.',
          not_simplified: 'De vereenvoudigde breuk klopt nog niet. Probeer het opnieuw.'
        };
        feedback.classList.add('is-error');
        feedback.textContent = messages[result.classification] || 'Controleer je antwoord en probeer het opnieuw.';
        answer.focus();
      });
      content.append(card);
      answer.focus();
    }
    renderCurrentTask();
  }


  function renderMixedLikeDenominatorDivisionPractice() {
    const learnerKey = student || context?.learnerId || 'local-learner';
    const session = createFractionMixedLikeDenominatorDivisionSession({
      learnerKey, tasks: FRACTION_MIXED_LIKE_DENOMINATOR_DIVISION_TASKS
    });
    const exercise = { title: 'Gelijknamige breuken groter dan 1 op elkaar delen', difficultyLevel: 2, maxDifficultyLevel: 5 };

    function renderCurrentTask() {
      const task = session.getCurrentTask();
      const progress = session.getProgress();
      content.replaceChildren();
      const card = documentRef.createElement('section');
      card.className = 'card fraction-whole-mixed-addition-card';
      const template = createFractionPracticeTemplate({ mount: card });
      const title = documentRef.createElement('h2');
      title.textContent = exercise.title;
      const instruction = documentRef.createElement('p');
      instruction.className = 'fraction-practice-instruction';
      instruction.textContent = 'Zet beide gemengde getallen om naar breuken. Deel de tellers; de gelijke noemers vallen tegen elkaar weg. Vereenvoudig je antwoord en schrijf het als gemengd getal.';
      const progressLabel = documentRef.createElement('p');
      progressLabel.className = 'fraction-practice-progress';
      progressLabel.textContent = formatFractionPracticeProgress(progress, exercise);
      template.titleArea.append(title);
      template.instructionArea.append(instruction);
      template.progressArea.append(progressLabel);

      if (!task) {
        const done = documentRef.createElement('p');
        done.className = 'fraction-practice-complete';
        done.textContent = 'Je hebt alle 15 sommen afgerond. Goed gewerkt!';
        template.workArea.append(done);
        content.append(card);
        template.showRestartAction(() => { session.reset(); renderCurrentTask(); });
        return;
      }

      const equation = documentRef.createElement('div');
      equation.className = 'fraction-whole-mixed-equation';
      const expression = documentRef.createElement('div');
      expression.className = 'fraction-whole-mixed-expression';
      expression.append(
        renderMixedNumber({ wholeNumber: task.left.whole, numerator: task.left.numerator, denominator: task.left.denominator }, 'Eerste gemengde getal'),
        Object.assign(documentRef.createElement('span'), { className: 'fraction-whole-mixed-expression__operator', textContent: '÷' }),
        renderMixedNumber({ wholeNumber: task.right.whole, numerator: task.right.numerator, denominator: task.right.denominator }, 'Tweede gemengde getal')
      );
      const equals = documentRef.createElement('span');
      equals.className = 'fraction-whole-mixed-expression__operator';
      equals.textContent = '=';
      const answerMount = documentRef.createElement('div');
      answerMount.className = 'fraction-whole-mixed-answer';
      equation.append(expression, equals, answerMount);
      template.workArea.append(equation);

      const answer = renderFractionAnswerInput({
        workMount: answerMount, controlsMount: template.controlsArea, wholeNumberMode: 'required'
      });
      const feedback = documentRef.createElement('p');
      feedback.className = 'fraction-practice-feedback';
      feedback.setAttribute('role', 'status');
      feedback.textContent = 'Vul het antwoord als gemengd getal in en vereenvoudig het breukdeel.';
      template.feedbackArea.append(feedback);
      const check = documentRef.createElement('button');
      check.type = 'button';
      check.className = 'paco-btn paco-btn--primary';
      check.textContent = 'Controleren';
      template.actionsArea.append(check);

      check.addEventListener('click', () => {
        const result = session.recordAnswer({ values: answer.getValues() });
        if (result.classification === 'valid') {
          answer.lock();
          check.disabled = true;
          feedback.classList.add('is-correct');
          feedback.textContent = 'Goed gedaan! Je hebt de deling correct uitgerekend.';
          progressLabel.textContent = formatFractionPracticeProgress(result.progress, exercise);
          if (result.progress.isComplete) {
            template.showRestartAction(() => { session.reset(); renderCurrentTask(); });
          } else {
            template.showNextAction(renderCurrentTask);
          }
          return;
        }
        const messages = {
          invalid_input: 'Vul het hele getal, de teller en de noemer van je antwoord in.',
          incorrect_answer: 'Dat antwoord klopt nog niet. Zet beide gemengde getallen om naar breuken en controleer je deling.',
          requires_simplification: 'Je antwoord klopt, maar het breukdeel moet nog vereenvoudigd worden.',
          not_simplified: 'De vereenvoudigde breuk klopt nog niet. Probeer het opnieuw.'
        };
        feedback.classList.add('is-error');
        feedback.textContent = messages[result.classification] || 'Controleer je antwoord en probeer het opnieuw.';
        answer.focus();
      });
      content.append(card);
      answer.focus();
    }
    renderCurrentTask();
  }


  function renderMixedLikeDenominatorDivisionGuidedPractice() {
    const learnerKey = student || context?.learnerId || 'local-learner';
    const session = createFractionMixedLikeDenominatorDivisionGuidedSession({
      learnerKey, tasks: FRACTION_MIXED_LIKE_DENOMINATOR_DIVISION_GUIDED_TASKS
    });
    const exercise = { title: 'Gelijknamige breuken groter dan 1 op elkaar delen', difficultyLevel: 2, maxDifficultyLevel: 5 };
    let awaitingNextTask = false, completedTaskSnapshot = null;

    function fractionEntry(label) {
      const wrap = documentRef.createElement('div');
      wrap.className = 'fraction-like-division-guided-entry';
      const numerator = documentRef.createElement('input');
      numerator.type = 'text'; numerator.inputMode = 'numeric'; numerator.autocomplete = 'off';
      numerator.className = 'fraction-guided-scalar-input fraction-like-division-guided-number';
      numerator.maxLength = 5; numerator.setAttribute('aria-label', label + ' teller');
      const bar = documentRef.createElement('span'); bar.className = 'fraction-like-division-guided-bar';
      const denominator = documentRef.createElement('input');
      denominator.type = 'text'; denominator.inputMode = 'numeric'; denominator.autocomplete = 'off';
      denominator.className = 'fraction-guided-scalar-input fraction-like-division-guided-number';
      denominator.maxLength = 5; denominator.setAttribute('aria-label', label + ' noemer');
      wrap.append(numerator, bar, denominator);
      return { wrap, numerator, denominator, focus: () => numerator.focus() };
    }
    function scalarEntry(label) {
      const input = documentRef.createElement('input');
      input.type = 'text'; input.inputMode = 'numeric'; input.autocomplete = 'off';
      input.className = 'fraction-guided-scalar-input fraction-like-division-guided-number fraction-guided-whole-entry';
      input.maxLength = 5; input.setAttribute('aria-label', label);
      return input;
    }
    function renderCurrentTask(feedbackMessage = '') {
      const step = awaitingNextTask ? completedTaskSnapshot : session.getCurrentStep();
      const progress = session.getProgress();
      content.replaceChildren();
      const card = documentRef.createElement('section');
      card.className = 'card fraction-whole-mixed-addition-card fraction-addition-guided-card fraction-like-denominator-division-guided-card fraction-mixed-like-denominator-division-guided-card';
      const template = createFractionPracticeTemplate({ mount: card });
      const title = documentRef.createElement('h2'); title.textContent = exercise.title;
      const instruction = documentRef.createElement('p');
      instruction.className = 'fraction-practice-instruction';
      instruction.textContent = 'Werk de vijf stappen één voor één af. Je gaat pas verder als je de huidige stap goed hebt gedaan.';
      const progressLabel = documentRef.createElement('p');
      progressLabel.className = 'fraction-practice-progress';
      progressLabel.textContent = formatFractionPracticeProgress(progress, exercise);
      template.titleArea.append(title); template.instructionArea.append(instruction); template.progressArea.append(progressLabel);
      if (!step) {
        const done = documentRef.createElement('p'); done.className = 'fraction-practice-complete';
        done.textContent = 'Je hebt alle 10 sommen afgerond. Goed gewerkt!';
        template.workArea.append(done); content.append(card);
        template.showRestartAction(() => { session.reset(); awaitingNextTask = false; completedTaskSnapshot = null; renderCurrentTask(); });
        return;
      }
      const task = step.task;
      const op = value => Object.assign(documentRef.createElement('span'), { className: 'fraction-guided-operator', textContent: value });
      const prompt = documentRef.createElement('div'); prompt.className = 'fraction-guided-task-prompt fraction-whole-mixed-expression';
      prompt.append(
        renderMixedNumber({ wholeNumber: task.left.whole, numerator: task.left.numerator, denominator: task.left.denominator }, 'Eerste gemengde getal'),
        op('÷'),
        renderMixedNumber({ wholeNumber: task.right.whole, numerator: task.right.numerator, denominator: task.right.denominator }, 'Tweede gemengde getal')
      );
      const solution = documentRef.createElement('div'); solution.className = 'fraction-guided-solution';
      solution.setAttribute('aria-label', 'Uitgewerkte tussenstappen');
      if (step.completedStepIds.includes('convert_mixed_numbers')) {
        solution.append(op('='), renderFractionRepresentation({ numerator: task.leftImproper, denominator: task.left.denominator }, 'symbolic_fraction', 'Eerste onechte breuk'), op('÷'), renderFractionRepresentation({ numerator: task.rightImproper, denominator: task.right.denominator }, 'symbolic_fraction', 'Tweede onechte breuk'));
      }
      if (step.completedStepIds.includes('invert_divisor')) {
        solution.append(op('='), renderFractionRepresentation({ numerator: task.leftImproper, denominator: task.left.denominator }, 'symbolic_fraction', 'Eerste onechte breuk'), op('×'), renderFractionRepresentation(task.inverse, 'symbolic_fraction', 'Omgekeerde tweede breuk'));
      }
      if (step.completedStepIds.includes('multiply_fractions')) {
        solution.append(op('='), renderFractionRepresentation(task.product, 'symbolic_fraction', 'Product van de breuken'));
      }
      if (step.completedStepIds.includes('convert_to_mixed_number')) {
        solution.append(op('='), renderMixedNumber({ wholeNumber: task.mixed.whole, numerator: task.mixed.numerator, denominator: task.mixed.denominator }, 'Gemengd getal'));
      }
      if (step.completedStepIds.includes('simplify_quotient')) {
        solution.append(op('='), renderMixedNumber({ wholeNumber: task.answer.whole, numerator: task.answer.numerator, denominator: task.answer.denominator }, 'Vereenvoudigde uitkomst'));
      }
      const equation = documentRef.createElement('div'); equation.className = 'fraction-guided-equation';
      equation.setAttribute('aria-label', 'Doelsom en uitgewerkte tussenstappen');
      equation.append(prompt, solution);
      template.promptArea.append(equation);

      const grid = documentRef.createElement('div'); grid.className = 'fraction-guided-step-grid fraction-guided-step-grid--five fraction-guided-step-grid--progressive';
      grid.setAttribute('aria-label', 'Vijf denkstappen');
      grid.dataset.activeStep = awaitingNextTask ? 'completed' : step.stepId;
      let activeEntry = null, activeEntries = [], activeAnswer = null;
      const completed = step.completedStepIds;
      const summaries = [
        { id: 'convert_mixed_numbers', text: 'Zet beide gemengde getallen om naar breuken' },
        { id: 'invert_divisor', text: 'Keer de tweede breuk om' },
        { id: 'multiply_fractions', text: 'Vermenigvuldig de tellers en noemers' },
        { id: 'convert_to_mixed_number', text: 'Maak van de onechte breuk een gemengd getal' },
        { id: 'simplify_quotient', text: 'Vereenvoudig het breukdeel' }
      ];
      summaries.forEach((item, index) => {
        const isDone = completed.includes(item.id), isActive = step.stepId === item.id;
        const panel = documentRef.createElement('details'); panel.className = 'fraction-guided-step-card';
        panel.open = !awaitingNextTask && isActive;
        panel.dataset.stepId = item.id;
        panel.dataset.state = isDone ? 'completed' : isActive ? 'active' : 'locked';
        panel.setAttribute('aria-label', 'Stap ' + (index + 1) + ': ' + item.text);
        const summary = documentRef.createElement('summary'); summary.className = 'fraction-guided-step-summary';
        const heading = documentRef.createElement('h3'); heading.textContent = 'Stap ' + (index + 1);
        const label = documentRef.createElement('p'); label.className = 'fraction-guided-step-title'; label.textContent = item.text;
        summary.append(heading, label); panel.append(summary);
        const body = documentRef.createElement('div'); body.className = 'fraction-guided-step-content';
        if (isDone) {
          const status = documentRef.createElement('p'); status.className = 'fraction-guided-step-status'; status.textContent = 'Afgerond';
          const answer = documentRef.createElement('div'); answer.className = 'fraction-guided-step-completed-answer';
          if (item.id === 'convert_mixed_numbers') {
            answer.append(renderFractionRepresentation({ numerator: task.leftImproper, denominator: task.left.denominator }, 'symbolic_fraction', 'Eerste onechte breuk'), op('÷'), renderFractionRepresentation({ numerator: task.rightImproper, denominator: task.right.denominator }, 'symbolic_fraction', 'Tweede onechte breuk'));
          } else if (item.id === 'invert_divisor') {
            answer.append(renderFractionRepresentation(task.inverse, 'symbolic_fraction', 'Omgekeerde tweede breuk'));
          } else if (item.id === 'multiply_fractions') {
            answer.append(renderFractionRepresentation(task.product, 'symbolic_fraction', 'Product van de breuken'));
          } else if (item.id === 'convert_to_mixed_number') {
            answer.append(renderMixedNumber({ wholeNumber: task.mixed.whole, numerator: task.mixed.numerator, denominator: task.mixed.denominator }, 'Gemengd getal'));
          } else {
            answer.append(renderMixedNumber({ wholeNumber: task.answer.whole, numerator: task.answer.numerator, denominator: task.answer.denominator }, 'Vereenvoudigde uitkomst'));
          }
          body.append(status, answer);
        } else if (isActive) {
          const help = documentRef.createElement('p'); help.className = 'fraction-guided-step-prompt';
          help.textContent = item.id === 'convert_mixed_numbers'
            ? 'Vermenigvuldig bij elk gemengd getal het hele getal met de noemer en tel daarna de teller erbij op. De noemer blijft gelijk.'
            : item.id === 'invert_divisor'
            ? 'Draai de tweede breuk om: de noemer wordt de teller en de teller wordt de noemer.'
            : item.id === 'multiply_fractions'
            ? 'Vermenigvuldig de tellers met elkaar en de noemers met elkaar.'
            : item.id === 'convert_to_mixed_number'
            ? 'Kijk hoe vaak de noemer in de teller past. Trek dat aantal keer de noemer van de teller af. Vul het hele getal en de rest in.'
            : 'Vul het antwoord als gemengd getal in en vereenvoudig het breukdeel zo ver mogelijk.';
          const expression = documentRef.createElement('div'); expression.className = 'fraction-guided-step-expression';
          if (item.id === 'convert_mixed_numbers') expression.classList.add('fraction-guided-step-expression--paired');
          if (item.id === 'convert_mixed_numbers') {
            const leftWork = documentRef.createElement('div'); leftWork.className = 'fraction-guided-step-subexpression';
            leftWork.append(renderMixedNumber({ wholeNumber: task.left.whole, numerator: task.left.numerator, denominator: task.left.denominator }, 'Eerste gemengde getal'), op('='));
            const leftEntry = fractionEntry('Omgezette eerste breuk'); activeEntries.push(leftEntry); leftWork.append(leftEntry.wrap);
            const rightWork = documentRef.createElement('div'); rightWork.className = 'fraction-guided-step-subexpression';
            rightWork.append(renderMixedNumber({ wholeNumber: task.right.whole, numerator: task.right.numerator, denominator: task.right.denominator }, 'Tweede gemengde getal'), op('='));
            const rightEntry = fractionEntry('Omgezette tweede breuk'); activeEntries.push(rightEntry); rightWork.append(rightEntry.wrap);
            expression.append(leftWork, rightWork);
          } else if (item.id === 'invert_divisor') {
            expression.append(renderFractionRepresentation({ numerator: task.leftImproper, denominator: task.left.denominator }, 'symbolic_fraction', 'Eerste onechte breuk'), op('×'));
            activeEntry = fractionEntry('Omgekeerde tweede breuk'); expression.append(activeEntry.wrap);
          } else if (item.id === 'multiply_fractions') {
            expression.append(renderFractionRepresentation({ numerator: task.leftImproper, denominator: task.left.denominator }, 'symbolic_fraction', 'Eerste onechte breuk'), op('×'), renderFractionRepresentation(task.inverse, 'symbolic_fraction', 'Omgekeerde tweede breuk'), op('='));
            activeEntry = fractionEntry('Product'); expression.append(activeEntry.wrap);
          } else if (item.id === 'convert_to_mixed_number') {
            expression.append(renderFractionRepresentation(task.product, 'symbolic_fraction', 'Onvereenvoudigde uitkomst'), op('='));
            const whole = scalarEntry('Hele getal van het gemengde antwoord');
            activeEntry = fractionEntry('Rest van de onechte breuk');
            activeEntries.push(activeEntry);
            activeEntries.push({ numerator: whole, focus: () => whole.focus() });
            activeEntry.denominator.value = String(task.product.denominator);
            activeEntry.denominator.disabled = true;
            expression.append(whole, activeEntry.wrap);
          } else {
            expression.append(renderMixedNumber({ wholeNumber: task.mixed.whole, numerator: task.mixed.numerator, denominator: task.mixed.denominator }, 'Onvereenvoudigd gemengd getal'), op('='));
            const answerMount = documentRef.createElement('div'); answerMount.className = 'fraction-guided-mixed-answer';
            expression.append(answerMount);
            activeAnswer = renderFractionAnswerInput({ workMount: answerMount, controlsMount: template.controlsArea, wholeNumberMode: 'required' });
          }
          const check = documentRef.createElement('button'); check.type = 'button';
          check.className = 'paco-btn paco-btn--primary paco-btn--small'; check.textContent = 'Controleren';
          check.addEventListener('click', () => {
            let values = {};
            if (item.id === 'convert_mixed_numbers') {
              values = { leftNumerator: activeEntries[0].numerator.value, leftDenominator: activeEntries[0].denominator.value, rightNumerator: activeEntries[1].numerator.value, rightDenominator: activeEntries[1].denominator.value };
            } else if (item.id === 'convert_to_mixed_number') {
              values = { wholeNumber: activeEntries[1].numerator.value, remainder: activeEntries[0].numerator.value };
            } else if (item.id === 'simplify_quotient') {
              values = activeAnswer?.getValues() || {};
            } else {
              values = { numerator: activeEntry?.numerator.value || '', denominator: activeEntry?.denominator.value || '' };
            }
            const result = session.recordResponse({ values });
            if (result.classification === 'valid') {
              activeAnswer?.lock();
              if (item.id === 'simplify_quotient') {
                completedTaskSnapshot = { ...step, completedStepIds: [...step.completedStepIds, item.id] };
                awaitingNextTask = true;
              }
              renderCurrentTask(item.id === 'simplify_quotient' ? 'Goed gedaan! Je hebt deze som afgerond.' : 'Goed gedaan! Deze stap is afgerond.');
              return;
            }
            const messages = {
              invalid_input: 'Vul alle benodigde getallen in.',
              incorrect_answer: item.id === 'convert_mixed_numbers'
                ? 'Reken beide gemengde getallen om: het hele getal × de noemer + de teller. De noemer blijft gelijk.'
                : item.id === 'invert_divisor'
                ? 'Draai de tweede breuk om: de teller en noemer wisselen van plaats.'
                : item.id === 'multiply_fractions'
                ? 'Vermenigvuldig de tellers met elkaar en de noemers met elkaar.'
                : item.id === 'convert_to_mixed_number'
                ? 'Controleer hoe vaak de noemer in de teller past en trek dat aantal keer de noemer af.'
                : 'Dat antwoord klopt nog niet. Controleer het gemengde getal en vereenvoudig het breukdeel.',
              requires_simplification: 'Je antwoord klopt, maar de breuk moet nog verder vereenvoudigd worden.',
              not_simplified: 'Vul het volledig vereenvoudigde antwoord in.'
            };
            const feedback = documentRef.createElement('p'); feedback.className = 'fraction-practice-feedback is-error';
            feedback.setAttribute('role','alert'); feedback.textContent = messages[result.classification] || 'Controleer je antwoord en probeer het opnieuw.';
            template.feedbackArea.replaceChildren(feedback);
            activeEntries.find(entry => entry.focus)?.focus();
            activeEntry?.focus(); activeAnswer?.focus();
          });
          panel.addEventListener('keydown', event => {
            if (event.key === 'Enter' && event.target instanceof documentRef.defaultView.HTMLInputElement) { event.preventDefault(); check.click(); }
          });
          body.append(help, expression, check);
        } else {
          const status = documentRef.createElement('p'); status.className = 'fraction-guided-step-status';
          status.textContent = 'Komt hierna'; body.append(status);
        }
        panel.append(body); grid.append(panel);
      });
      template.workArea.append(grid);
      if (feedbackMessage) {
        const feedback = documentRef.createElement('p'); feedback.className = 'fraction-practice-feedback is-correct';
        feedback.setAttribute('role','status'); feedback.textContent = feedbackMessage; template.feedbackArea.append(feedback);
      }
      content.append(card);
      if (awaitingNextTask) {
        const done = documentRef.createElement('p'); done.className = 'fraction-practice-complete';
        done.textContent = progress.isComplete ? 'Deze laatste som is afgerond. Je hebt alle 10 sommen goed gemaakt.' : 'Deze som is afgerond. Klik op Volgende som als je klaar bent.';
        template.workArea.append(done);
        if (progress.isComplete) template.showRestartAction(() => { session.reset(); awaitingNextTask = false; completedTaskSnapshot = null; renderCurrentTask(); });
        else template.showNextAction(() => { awaitingNextTask = false; completedTaskSnapshot = null; renderCurrentTask(); });
      } else if (activeEntries.length) activeEntries.find(entry => entry.focus)?.focus();
      else if (activeEntry) activeEntry.focus();
    }
    renderCurrentTask();
  }


  function renderWholeNumberDividedByFractionGreaterThanOnePractice() {
    const learnerKey = student || context?.learnerId || 'local-learner';
    const session = createFractionWholeNumberDividedByFractionGreaterThanOneSession({
      learnerKey,
      tasks: FRACTION_WHOLE_NUMBER_DIVIDED_BY_FRACTION_GREATER_THAN_ONE_TASKS
    });
    const exercise = { title: 'Heel getal delen door een breukgetal groter dan 1', difficultyLevel: 1, maxDifficultyLevel: 5 };

    function renderCurrentTask() {
      const task = session.getCurrentTask();
      const progress = session.getProgress();
      content.replaceChildren();
      const card = documentRef.createElement('section');
      card.className = 'card fraction-whole-mixed-addition-card';
      const template = createFractionPracticeTemplate({ mount: card });
      const title = documentRef.createElement('h2');
      title.textContent = exercise.title;
      const instruction = documentRef.createElement('p');
      instruction.className = 'fraction-practice-instruction';
      instruction.textContent = 'Deel het hele getal door het gemengde getal. Geef je antwoord als gemengd getal.';
      const progressLabel = documentRef.createElement('p');
      progressLabel.className = 'fraction-practice-progress';
      progressLabel.textContent = formatFractionPracticeProgress(progress, exercise);
      template.titleArea.append(title);
      template.instructionArea.append(instruction);
      template.progressArea.append(progressLabel);

      if (!task) {
        const done = documentRef.createElement('p');
        done.className = 'fraction-practice-complete';
        done.textContent = 'Je hebt alle 15 sommen afgerond. Goed gewerkt!';
        template.workArea.append(done);
        content.append(card);
        return;
      }

      const equation = documentRef.createElement('div');
      equation.className = 'fraction-whole-mixed-equation';
      const expression = documentRef.createElement('div');
      expression.className = 'fraction-whole-mixed-expression';
      const whole = documentRef.createElement('span');
      whole.className = 'fraction-whole-mixed-expression__whole';
      whole.textContent = String(task.wholeNumber);
      const divide = documentRef.createElement('span');
      divide.className = 'fraction-whole-mixed-expression__operator';
      divide.textContent = '÷';
      expression.append(
        whole,
        divide,
        renderMixedNumber({
          wholeNumber: task.divisor.whole,
          numerator: task.divisor.numerator,
          denominator: task.divisor.denominator
        }, 'Gemengd getal')
      );
      const equals = documentRef.createElement('span');
      equals.className = 'fraction-whole-mixed-expression__operator';
      equals.textContent = '=';
      const answerMount = documentRef.createElement('div');
      answerMount.className = 'fraction-whole-mixed-answer';
      equation.append(expression, equals, answerMount);
      template.workArea.append(equation);

      const answer = renderFractionAnswerInput({
        workMount: answerMount,
        controlsMount: template.controlsArea,
        wholeNumberMode: 'required'
      });
      const check = documentRef.createElement('button');
      check.type = 'button';
      check.className = 'paco-btn paco-btn--primary';
      check.textContent = 'Controleren';
      template.actionsArea.append(check);

      check.addEventListener('click', () => {
        const result = session.recordAnswer({ values: answer.getValues() });
        if (result.classification === 'valid') {
          answer.lock();
          check.disabled = true;
          const feedback = documentRef.createElement('p');
          feedback.className = 'fraction-practice-feedback is-correct';
          feedback.setAttribute('role', 'status');
          feedback.textContent = 'Goed gedaan! Je antwoord klopt.';
          template.feedbackArea.replaceChildren(feedback);
          const next = documentRef.createElement('button');
          next.type = 'button';
          next.className = 'paco-btn paco-btn--primary';
          next.textContent = result.progress.isComplete ? 'Bekijk resultaat' : 'Volgende som';
          next.addEventListener('click', renderCurrentTask);
          template.actionsArea.replaceChildren(next);
          progressLabel.textContent = formatFractionPracticeProgress(result.progress, exercise);
          return;
        }
        const messages = {
          invalid_input: 'Vul het hele getal, de teller en de noemer in.',
          incorrect_answer: 'Dat antwoord klopt nog niet. Controleer je deling.',
          requires_simplification: 'Je antwoord klopt. Vereenvoudig de breuk zo ver mogelijk.',
          not_simplified: 'De vereenvoudigde breuk klopt nog niet. Probeer het opnieuw.'
        };
        const feedback = documentRef.createElement('p');
        feedback.className = 'fraction-practice-feedback is-error';
        feedback.setAttribute('role', 'alert');
        feedback.textContent = messages[result.classification] || 'Controleer je antwoord en probeer het opnieuw.';
        template.feedbackArea.replaceChildren(feedback);
      });

      content.append(card);
    }

    renderCurrentTask();
  }

  function renderWholeNumberDividedByFractionGreaterThanOneGuidedPractice() {
    const learnerKey = student || context?.learnerId || 'local-learner';
    const session = createFractionWholeNumberDividedByFractionGreaterThanOneGuidedSession({
      learnerKey,
      tasks: FRACTION_WHOLE_NUMBER_DIVIDED_BY_FRACTION_GREATER_THAN_ONE_GUIDED_TASKS
    });
    const exercise = { title: 'Heel getal delen door een breukgetal groter dan 1', difficultyLevel: 1, maxDifficultyLevel: 5 };
    const stepIds = ['convert_mixed_number', 'make_divisor_whole', 'scale_dividend', 'calculate_quotient'];
    const stepLabels = ['Zet het gemengde getal om', 'Vergroot de breuk tot een heel getal', 'Vergroot het hele getal', 'Reken de som uit'];
    let awaitingNextTask = false;
    let completedTaskStep = null;

    function renderCurrentTask(feedbackMessage = '') {
      const step = awaitingNextTask && completedTaskStep
        ? completedTaskStep
        : session.getCurrentStep();
      const progress = session.getProgress();
      content.replaceChildren();
      const card = documentRef.createElement('section');
      card.className = 'card fraction-whole-mixed-addition-card fraction-addition-guided-card fraction-whole-number-divided-guided-card';
      const template = createFractionPracticeTemplate({ mount: card });
      const title = documentRef.createElement('h2');
      title.textContent = exercise.title;
      const instruction = documentRef.createElement('p');
      instruction.className = 'fraction-practice-instruction';
      instruction.textContent = 'Werk de vier stappen één voor één af. Je gaat pas verder als je de huidige stap goed hebt gedaan.';
      const progressLabel = documentRef.createElement('p');
      progressLabel.className = 'fraction-practice-progress';
      progressLabel.textContent = formatFractionPracticeProgress(progress, exercise);
      template.titleArea.append(title);
      template.instructionArea.append(instruction);
      template.progressArea.append(progressLabel);

      if (!step) {
        const done = documentRef.createElement('p');
        done.className = 'fraction-practice-complete';
        done.textContent = 'Je hebt alle 10 sommen afgerond. Goed gewerkt!';
        template.workArea.append(done);
        content.append(card);
        template.showRestartAction(() => {
          session.reset();
          awaitingNextTask = false;
          renderCurrentTask();
        });
        return;
      }

      const op = value => Object.assign(documentRef.createElement('span'), {
        className: 'fraction-guided-operator', textContent: value
      });
      const divisorFraction = () => renderFractionRepresentation({
        numerator: step.divisorNumerator, denominator: step.task.divisor.denominator
      }, 'symbolic_fraction', 'Onechte breuk');
      const prompt = documentRef.createElement('div');
      prompt.className = 'fraction-guided-task-prompt fraction-whole-mixed-expression';
      const whole = documentRef.createElement('span');
      whole.className = 'fraction-whole-mixed-expression__whole';
      whole.textContent = String(step.task.wholeNumber);
      prompt.append(
        whole, op('÷'),
        renderMixedNumber({
          wholeNumber: step.task.divisor.whole,
          numerator: step.task.divisor.numerator,
          denominator: step.task.divisor.denominator
        }, 'Gemengd getal')
      );
      const solution = documentRef.createElement('div');
      solution.className = 'fraction-guided-solution';
      solution.setAttribute('aria-label', 'Volledige gelijkwaardige deling');
      if (step.completedStepIds.includes('convert_mixed_number')) {
        const originalDividend = documentRef.createElement('span');
        originalDividend.className = 'fraction-whole-mixed-expression__whole';
        originalDividend.textContent = String(step.task.wholeNumber);
        solution.append(
          op('='),
          originalDividend,
          op('÷'),
          divisorFraction()
        );
      }
      if (step.completedStepIds.includes('scale_dividend')) {
        solution.append(
          op('='),
          documentRef.createTextNode(String(step.scaledDividend)),
          op('÷'),
          documentRef.createTextNode(String(step.divisorWholeNumber))
        );
      }
      if (step.completedStepIds.includes('calculate_quotient')) {
        solution.append(
          op('='),
          renderMixedNumber({
            wholeNumber: step.task.answer.whole,
            numerator: step.task.answer.numerator,
            denominator: step.task.answer.denominator
          }, 'Gemengd getal als uitkomst')
        );
      }
      const equation = documentRef.createElement('div');
      equation.className = 'fraction-guided-equation';
      equation.setAttribute('aria-label', 'Opgave en tussenstappen');
      equation.append(prompt, solution);
      template.promptArea.append(equation);

      const grid = documentRef.createElement('div');
      grid.className = 'fraction-guided-step-grid fraction-guided-step-grid--progressive';
      grid.setAttribute('aria-label', 'Vier denkstappen');
      grid.dataset.activeStep = awaitingNextTask ? 'completed' : step.stepId;
      let activeInput = null;
      let activeAnswer = null;

      stepIds.forEach((stepId, index) => {
        const completed = step.completedStepIds.includes(stepId);
        const active = step.stepId === stepId;
        const item = documentRef.createElement('details');
        item.className = 'fraction-guided-step-card';
        item.open = awaitingNextTask || active;
        item.dataset.stepId = stepId;
        item.dataset.state = completed ? 'completed' : active ? 'active' : 'locked';
        item.setAttribute('aria-label', 'Stap ' + (index + 1) + ': ' + stepLabels[index]);

        const summary = documentRef.createElement('summary');
        summary.className = 'fraction-guided-step-summary';
        const heading = documentRef.createElement('h3');
        heading.textContent = 'Stap ' + (index + 1);
        const label = documentRef.createElement('p');
        label.className = 'fraction-guided-step-title';
        label.textContent = stepLabels[index];
        summary.append(heading, label);
        item.append(summary);

        const body = documentRef.createElement('div');
        body.className = 'fraction-guided-step-content';
        if (completed) {
          const status = documentRef.createElement('p');
          status.className = 'fraction-guided-step-status';
          status.textContent = 'Afgerond';
          body.append(status);
          const answer = documentRef.createElement('div');
          answer.className = 'fraction-guided-step-completed-answer';
          if (stepId === 'convert_mixed_number') {
            answer.append(
              documentRef.createTextNode(String(step.task.wholeNumber)),
              op('÷'),
              divisorFraction()
            );
          } else if (stepId === 'make_divisor_whole') {
            answer.append(divisorFraction(), op('× ' + step.task.divisor.denominator + ' = ' + step.divisorWholeNumber));
          } else if (stepId === 'scale_dividend') {
            answer.textContent = step.task.wholeNumber + ' × ' + step.task.divisor.denominator + ' = ' + step.scaledDividend;
          } else {
            answer.append(
              documentRef.createTextNode(step.scaledDividend + ' ÷ ' + step.divisorWholeNumber + ' = '),
              renderMixedNumber({
                wholeNumber: step.task.answer.whole,
                numerator: step.task.answer.numerator,
                denominator: step.task.answer.denominator
              }, 'Gemengd getal als uitkomst')
            );
          }
          body.append(answer);
        } else if (active) {
          const help = documentRef.createElement('p');
          help.className = 'fraction-guided-step-prompt';
          help.textContent = step.prompt;
          const expression = documentRef.createElement('div');
          expression.className = 'fraction-guided-step-expression';
          if (stepId === 'convert_mixed_number') {
            expression.append(
              renderMixedNumber({
                wholeNumber: step.task.divisor.whole,
                numerator: step.task.divisor.numerator,
                denominator: step.task.divisor.denominator
              }, 'Gemengd getal'),
              op('='),
              renderFractionInputRepresentation({
                denominator: step.task.divisor.denominator,
                inputPart: 'numerator',
                inputLabel: 'Teller van de onechte breuk',
                documentRef
              })
            );
            activeInput = expression.querySelector('[data-fraction-step-answer="true"]');
          } else if (stepId === 'make_divisor_whole') {
            expression.append(
              divisorFraction(),
              op('× ' + step.task.divisor.denominator + '='),
            );
            activeInput = documentRef.createElement('input');
            activeInput.type = 'text';
            activeInput.inputMode = 'numeric';
            activeInput.autocomplete = 'off';
            activeInput.maxLength = 6;
            activeInput.className = 'fraction-guided-scalar-input';
            activeInput.dataset.fractionGuidedAnswer = 'true';
            activeInput.setAttribute('aria-label', 'Deler als heel getal');
            expression.append(activeInput);
          } else if (stepId === 'scale_dividend') {
            const dividend = documentRef.createElement('span');
            dividend.className = 'fraction-guided-step-number';
            dividend.textContent = String(step.task.wholeNumber);
            expression.append(
              dividend,
              op('× ' + step.task.divisor.denominator + '='),
            );
            activeInput = documentRef.createElement('input');
            activeInput.type = 'text';
            activeInput.inputMode = 'numeric';
            activeInput.autocomplete = 'off';
            activeInput.maxLength = 6;
            activeInput.className = 'fraction-guided-scalar-input';
            activeInput.dataset.fractionGuidedAnswer = 'true';
            activeInput.setAttribute('aria-label', 'Vergroot heel getal');
            expression.append(activeInput);
          } else {
            expression.append(documentRef.createTextNode(step.scaledDividend + ' ÷ ' + step.divisorWholeNumber + '='));
            const quotientHelp = documentRef.createElement('p');
            quotientHelp.className = 'fraction-guided-quotient-help';
            quotientHelp.textContent = 'Zoek hoe vaak ' + step.divisorWholeNumber + ' in ' + step.scaledDividend +
              ' past zonder eroverheen te gaan. Dat aantal is het hele getal. Trek het gebruikte getal van ' +
              step.scaledDividend + ' af. Wat overblijft, is de teller. De deler wordt de noemer.';
            expression.append(quotientHelp);
            const answerMount = documentRef.createElement('div');
            answerMount.className = 'fraction-guided-mixed-answer';
            expression.append(answerMount);
            activeAnswer = renderFractionAnswerInput({
              workMount: answerMount,
              controlsMount: template.controlsArea,
              wholeNumberMode: 'required'
            });
          }
          const check = documentRef.createElement('button');
          check.type = 'button';
          check.className = 'paco-btn paco-btn--primary paco-btn--small';
          check.textContent = 'Controleren';
          check.addEventListener('click', () => {
            const result = session.recordResponse(
              stepId === 'calculate_quotient'
                ? { values: activeAnswer?.getValues() }
                : { rawValue: activeInput?.value || '' }
            );
            if (result.classification === 'valid') {
              activeAnswer?.lock();
              if (stepId === 'calculate_quotient') {
                completedTaskStep = {
                  ...step,
                  completedStepIds: [...step.completedStepIds, stepId]
                };
                awaitingNextTask = true;
              }
              renderCurrentTask(stepId === 'calculate_quotient'
                ? 'Goed gedaan! Je hebt deze som afgerond.'
                : 'Goed gedaan! Deze stap is afgerond.');
              return;
            }
            const messages = {
              invalid_input: stepId === 'calculate_quotient'
                ? 'Vul het hele getal, de teller en de noemer in.'
                : 'Vul het getal in.',
              incorrect_answer: stepId === 'convert_mixed_number'
                ? 'Vermenigvuldig het hele getal met de noemer en tel de teller erbij op. De noemer blijft hetzelfde.'
                : stepId === 'make_divisor_whole'
                ? 'Je hoeft de teller niet nog eens met de noemer te vermenigvuldigen. De noemer en de keerfactor vallen tegen elkaar weg. Wat blijft over?'
                : stepId === 'scale_dividend'
                ? 'Vermenigvuldig het hele getal met dezelfde factor als waarmee je de deler hebt vergroot.'
                : 'Dat antwoord klopt nog niet. Controleer de deling.',
              requires_simplification: 'Je antwoord klopt. Vereenvoudig de breuk zo ver mogelijk.',
              not_simplified: 'De vereenvoudigde breuk klopt nog niet. Probeer het opnieuw.'
            };
            const feedback = documentRef.createElement('p');
            feedback.className = 'fraction-practice-feedback is-error';
            feedback.setAttribute('role', 'alert');
            feedback.textContent = messages[result.classification] || 'Controleer je antwoord en probeer het opnieuw.';
            template.feedbackArea.replaceChildren(feedback);
            activeInput?.focus();
          });
          item.addEventListener('keydown', event => {
            if (event.key === 'Enter' && event.target instanceof documentRef.defaultView.HTMLInputElement) {
              event.preventDefault();
              check.click();
            }
          });
          body.append(help, expression, check);
        } else {
          const status = documentRef.createElement('p');
          status.className = 'fraction-guided-step-status';
          status.textContent = 'Komt hierna';
          body.append(status);
        }
        item.append(body);
        grid.append(item);
      });

      template.workArea.append(grid);
      if (feedbackMessage) {
        const feedback = documentRef.createElement('p');
        feedback.className = 'fraction-practice-feedback is-correct';
        feedback.setAttribute('role', 'status');
        feedback.textContent = feedbackMessage;
        template.feedbackArea.append(feedback);
      }
      content.append(card);
      if (awaitingNextTask) {
        const done = documentRef.createElement('p');
        done.className = 'fraction-practice-complete';
        done.textContent = progress.isComplete
          ? 'Deze laatste som is afgerond. Je hebt alle 10 sommen goed gemaakt.'
          : 'Deze som is afgerond. Klik op Volgende som als je klaar bent voor de volgende.';
        template.workArea.append(done);
        template.feedbackArea.replaceChildren();
        const feedback = documentRef.createElement('p');
        feedback.className = 'fraction-practice-feedback is-correct';
        feedback.setAttribute('role', 'status');
        feedback.textContent = feedbackMessage || 'Goed gedaan! Je hebt deze som afgerond.';
        template.feedbackArea.append(feedback);
        if (progress.isComplete) {
          template.showRestartAction(() => {
            session.reset();
            awaitingNextTask = false;
            completedTaskStep = null;
            renderCurrentTask();
          });
        } else {
          template.showNextAction(() => {
            awaitingNextTask = false;
            completedTaskStep = null;
            renderCurrentTask();
          });
        }
      } else {
        activeInput?.focus();
      }
    }
    renderCurrentTask();
  }
  function renderSameDenominatorAdditionPractice() {
    const learnerKey = student || context?.learnerId || 'local-learner';
    const session = createFractionSameDenominatorAdditionSession({ learnerKey });
    const exercise = FRACTION_SAME_DENOMINATOR_ADDITION_EXERCISE;

    function renderCurrentTask() {
      const task = session.getCurrentTask();
      const progress = session.getProgress();
      content.replaceChildren();
      const card = documentRef.createElement('section');
      card.className = 'card fraction-whole-mixed-addition-card fraction-same-denominator-addition-card';
      const template = createFractionPracticeTemplate({ mount: card });
      const title = documentRef.createElement('h2');
      title.textContent = exercise.title;
      const instruction = documentRef.createElement('p');
      instruction.className = 'fraction-practice-instruction';
      instruction.textContent = 'Tel de tellers bij elkaar op. De noemer blijft hetzelfde. Is je antwoord groter dan 1? Schrijf het dan als gemengd getal.';
      const progressLabel = documentRef.createElement('p');
      progressLabel.className = 'fraction-practice-progress';
      progressLabel.textContent = formatFractionPracticeProgress(progress, exercise);
      template.titleArea.append(title);
      template.instructionArea.append(instruction);
      template.progressArea.append(progressLabel);

      if (!task) {
        const done = documentRef.createElement('p');
        done.className = 'fraction-practice-complete';
        done.textContent = 'Je hebt alle 15 sommen afgerond. Goed gewerkt!';
        template.workArea.append(done);
        content.append(card);
        return;
      }

      const equation = documentRef.createElement('div');
      equation.className = 'fraction-whole-mixed-equation';
      const expression = documentRef.createElement('div');
      expression.className = 'fraction-whole-mixed-expression';
      expression.append(
        renderFractionRepresentation(task.left, 'symbolic_fraction', 'Eerste breuk'),
        Object.assign(documentRef.createElement('span'), { className: 'fraction-whole-mixed-expression__operator', textContent: '+' }),
        renderFractionRepresentation(task.right, 'symbolic_fraction', 'Tweede breuk')
      );
      const equals = documentRef.createElement('span');
      equals.className = 'fraction-whole-mixed-expression__operator';
      equals.textContent = '=';
      const answerMount = documentRef.createElement('div');
      answerMount.className = 'fraction-whole-mixed-answer';
      equation.append(expression, equals, answerMount);
      template.workArea.append(equation);

      const answer = renderFractionAnswerInput({
        workMount: answerMount,
        controlsMount: template.controlsArea,
        wholeNumberMode: 'optional'
      });
      const check = documentRef.createElement('button');
      check.type = 'button';
      check.className = 'paco-btn paco-btn--primary';
      check.textContent = 'Controleren';
      template.actionsArea.append(check);

      check.addEventListener('click', () => {
        const result = session.recordAnswer({ values: answer.getValues() });
        if (result.classification === 'valid') {
          answer.lock();
          check.disabled = true;
          const feedback = documentRef.createElement('p');
          feedback.className = 'fraction-practice-feedback is-correct';
          feedback.setAttribute('role', 'status');
          feedback.textContent = 'Goed gedaan! Je antwoord klopt.';
          template.feedbackArea.replaceChildren(feedback);
          const next = documentRef.createElement('button');
          next.type = 'button';
          next.className = 'paco-btn paco-btn--primary';
          next.textContent = result.progress.isComplete ? 'Bekijk resultaat' : 'Volgende som';
          next.addEventListener('click', renderCurrentTask);
          template.actionsArea.replaceChildren(next);
          progressLabel.textContent = formatFractionPracticeProgress(result.progress, exercise);
          return;
        }
        const messages = {
          invalid_input: 'Vul de teller en noemer in. De noemer moet groter zijn dan nul.',
          incorrect_answer: 'Dat antwoord klopt nog niet. Tel de tellers op en houd de noemer gelijk.',
          requires_mixed_number: 'De uitkomst is groter dan 1. Voeg het hele getal toe en schrijf de uitkomst als gemengd getal.',
          requires_simplification: 'Je berekening klopt. Je kunt de breuk nog vereenvoudigen. Maak de breuk zo eenvoudig mogelijk.',
          not_simplified: 'De vereenvoudigde breuk klopt nog niet. Probeer het nog eens.'
        };
        const feedback = documentRef.createElement('p');
        feedback.className = 'fraction-practice-feedback is-error';
        feedback.setAttribute('role', 'alert');
        feedback.textContent = messages[result.classification] || 'Controleer je antwoord en probeer het opnieuw.';
        template.feedbackArea.replaceChildren(feedback);
      });
      content.append(card);
    }
    renderCurrentTask();
  }

  function renderMixedSameDenominatorAdditionPractice() {
    const learnerKey = student || context?.learnerId || 'local-learner';
    const session = createFractionMixedSameDenominatorAdditionSession({ learnerKey });
    const exercise = FRACTION_MIXED_SAME_DENOMINATOR_ADDITION_EXERCISE;

    function renderCurrentTask() {
      const task = session.getCurrentTask();
      const progress = session.getProgress();
      content.replaceChildren();
      const card = documentRef.createElement('section');
      card.className = 'card fraction-whole-mixed-addition-card fraction-mixed-same-denominator-addition-card';
      const template = createFractionPracticeTemplate({ mount: card });
      const title = documentRef.createElement('h2');
      title.textContent = exercise.title;
      const instruction = documentRef.createElement('p');
      instruction.className = 'fraction-practice-instruction';
      instruction.textContent = 'Tel de hele getallen bij elkaar op. Tel de breukdelen bij elkaar op en schrijf je uitkomst als gemengd getal.';
      const progressLabel = documentRef.createElement('p');
      progressLabel.className = 'fraction-practice-progress';
      progressLabel.textContent = formatFractionPracticeProgress(progress, exercise);
      template.titleArea.append(title);
      template.instructionArea.append(instruction);
      template.progressArea.append(progressLabel);

      if (!task) {
        const done = documentRef.createElement('p');
        done.className = 'fraction-practice-complete';
        done.textContent = 'Je hebt alle 15 sommen afgerond. Goed gewerkt!';
        template.workArea.append(done);
        content.append(card);
        return;
      }

      const equation = documentRef.createElement('div');
      equation.className = 'fraction-whole-mixed-equation';
      const expression = documentRef.createElement('div');
      expression.className = 'fraction-whole-mixed-expression';
      expression.append(
        renderMixedNumber(task.left, 'Eerste gemengde getal'),
        Object.assign(documentRef.createElement('span'), { className: 'fraction-whole-mixed-expression__operator', textContent: '+' }),
        renderMixedNumber(task.right, 'Tweede gemengde getal')
      );
      const equals = documentRef.createElement('span');
      equals.className = 'fraction-whole-mixed-expression__operator';
      equals.textContent = '=';
      const answerMount = documentRef.createElement('div');
      answerMount.className = 'fraction-whole-mixed-answer';
      equation.append(expression, equals, answerMount);
      template.workArea.append(equation);

      const answer = renderFractionAnswerInput({
        workMount: answerMount,
        controlsMount: template.controlsArea,
        wholeNumberMode: 'required'
      });
      const check = documentRef.createElement('button');
      check.type = 'button';
      check.className = 'paco-btn paco-btn--primary';
      check.textContent = 'Controleren';
      template.actionsArea.append(check);

      check.addEventListener('click', () => {
        const result = session.recordAnswer({ values: answer.getValues() });
        if (result.classification === 'valid') {
          answer.lock();
          check.disabled = true;
          const feedback = documentRef.createElement('p');
          feedback.className = 'fraction-practice-feedback is-correct';
          feedback.setAttribute('role', 'status');
          feedback.textContent = 'Goed gedaan! Je antwoord klopt.';
          template.feedbackArea.replaceChildren(feedback);
          const next = documentRef.createElement('button');
          next.type = 'button';
          next.className = 'paco-btn paco-btn--primary';
          next.textContent = result.progress.isComplete ? 'Bekijk resultaat' : 'Volgende som';
          next.addEventListener('click', renderCurrentTask);
          template.actionsArea.replaceChildren(next);
          progressLabel.textContent = formatFractionPracticeProgress(result.progress, exercise);
          return;
        }
        const messages = {
          invalid_input: 'Vul het hele getal, de teller en de noemer in. De noemer moet groter zijn dan nul.',
          incorrect_answer: 'Dat antwoord klopt nog niet. Tel de hele getallen en de breukdelen allebei op.',
          requires_simplification: 'Je berekening klopt. Je kunt de breuk nog vereenvoudigen. Maak de breuk zo eenvoudig mogelijk.',
          not_simplified: 'De vereenvoudigde breuk klopt nog niet. Probeer het nog eens.'
        };
        const feedback = documentRef.createElement('p');
        feedback.className = 'fraction-practice-feedback is-error';
        feedback.setAttribute('role', 'alert');
        feedback.textContent = messages[result.classification] || 'Controleer je antwoord en probeer het opnieuw.';
        template.feedbackArea.replaceChildren(feedback);
      });
      content.append(card);
    }

    renderCurrentTask();
  }


  function renderUnequalIndependentAdditionPractice(){
    const learnerKey=student||context?.learnerId||'local-learner';
    const session=createFractionUnequalIndependentAdditionSession({learnerKey}),exercise=FRACTION_ADDITION_LEVEL_4_EXERCISE;
    function renderCurrentTask(){
      const task=session.getCurrentTask(),progress=session.getProgress();content.replaceChildren();
      const card=documentRef.createElement('section');card.className='card fraction-whole-mixed-addition-card fraction-unequal-independent-addition-card';
      const template=createFractionPracticeTemplate({mount:card});
      const title=documentRef.createElement('h2');title.textContent=exercise.title;
      const instruction=documentRef.createElement('p');instruction.className='fraction-practice-instruction';instruction.textContent='Tel de ongelijknamige breuken bij elkaar op. Is je uitkomst groter dan 1? Schrijf die dan als gemengd getal. Vereenvoudig als dat nodig is.';
      const progressLabel=documentRef.createElement('p');progressLabel.className='fraction-practice-progress';progressLabel.textContent=formatFractionPracticeProgress(progress,exercise);
      template.titleArea.append(title);template.instructionArea.append(instruction);template.progressArea.append(progressLabel);
      if(!task){const done=documentRef.createElement('p');done.className='fraction-practice-complete';done.textContent='Je hebt alle 15 sommen afgerond. Goed gewerkt!';template.workArea.append(done);content.append(card);return;}
      const equation=documentRef.createElement('div');equation.className='fraction-whole-mixed-equation';
      const expression=documentRef.createElement('div');expression.className='fraction-whole-mixed-expression';
      expression.append(renderFractionRepresentation(task.leftFraction,'symbolic_fraction','Eerste breuk'),
        Object.assign(documentRef.createElement('span'),{className:'fraction-whole-mixed-expression__operator',textContent:'+'}),
        renderFractionRepresentation(task.rightFraction,'symbolic_fraction','Tweede breuk'));
      const equals=documentRef.createElement('span');equals.className='fraction-whole-mixed-expression__operator';equals.textContent='=';
      const answerMount=documentRef.createElement('div');answerMount.className='fraction-whole-mixed-answer';equation.append(expression,equals,answerMount);template.workArea.append(equation);
      const answer=renderFractionAnswerInput({workMount:answerMount,controlsMount:template.controlsArea,wholeNumberMode:'optional'});
      const check=documentRef.createElement('button');check.type='button';check.className='paco-btn paco-btn--primary';check.textContent='Controleren';template.actionsArea.append(check);
      check.addEventListener('click',()=>{
        const result=session.recordAnswer({values:answer.getValues()});
        if(result.classification==='valid'){
          answer.lock();check.disabled=true;const feedback=documentRef.createElement('p');feedback.className='fraction-practice-feedback is-correct';feedback.setAttribute('role','status');feedback.textContent='Goed gedaan! Je antwoord klopt.';template.feedbackArea.replaceChildren(feedback);
          const next=documentRef.createElement('button');next.type='button';next.className='paco-btn paco-btn--primary';next.textContent=result.progress.isComplete?'Bekijk resultaat':'Volgende som';next.addEventListener('click',renderCurrentTask);template.actionsArea.replaceChildren(next);progressLabel.textContent=formatFractionPracticeProgress(result.progress,exercise);return;
        }
        const messages={invalid_input:'Vul de teller en noemer in. De noemer moet groter zijn dan nul.',incorrect_answer:'Dat antwoord klopt nog niet. Maak de breuken eerst gelijknamig en tel daarna de tellers op.',requires_mixed_number:'De uitkomst is groter dan 1. Voeg het hele getal toe en schrijf de uitkomst als gemengd getal.',requires_simplification:'Je berekening klopt. Je kunt de breuk nog vereenvoudigen. Maak de breuk zo eenvoudig mogelijk.',not_simplified:'De vereenvoudigde breuk klopt nog niet. Probeer het nog eens.'};
        const feedback=documentRef.createElement('p');feedback.className='fraction-practice-feedback is-error';feedback.setAttribute('role','alert');feedback.textContent=messages[result.classification]||'Controleer je antwoord en probeer het opnieuw.';template.feedbackArea.replaceChildren(feedback);
      });
      content.append(card);
    }
    renderCurrentTask();
  }

  function renderUnequalDenominatorGuidedAdditionPractice({ mixedNumberResult = false } = {}) {
    const learnerKey=student||context?.learnerId||'local-learner';
    const tasks=mixedNumberResult?FRACTION_ADDITION_LEVEL_3B_TASKS:FRACTION_ADDITION_LEVEL_3_TASKS;
    const session=createFractionAdditionPracticeSession({learnerKey,tasks,sessionId:mixedNumberResult?'level-3b':'level-3a'});
    const stepIds=['common_denominator','left_equivalent_numerator','right_equivalent_numerator','addition_result',...(mixedNumberResult?['mixed_number_conversion']:[])];
    const stepLabels=['Gemeenschappelijke noemer kiezen','Eerste breuk gelijkwaardig maken','Tweede breuk gelijkwaardig maken','Tellers optellen',...(mixedNumberResult?['Omzetten naar een gemengd getal']:[])];
    function renderExpression(step,mount) {
      const left=step.leftFraction,right=step.rightFraction;
      const op=value=>Object.assign(documentRef.createElement('span'),{className:'fraction-guided-operator',textContent:value});
      if(step.stepId==='common_denominator'){
        mount.append(renderFractionRepresentation(left,'symbolic_fraction','Eerste breuk'),op('+'),renderFractionRepresentation(right,'symbolic_fraction','Tweede breuk'),op('→'));
        const input=documentRef.createElement('input');input.type='text';input.inputMode='numeric';input.autocomplete='off';input.maxLength=6;input.className='fraction-guided-scalar-input';input.dataset.fractionGuidedAnswer='true';input.setAttribute('aria-label','Gemeenschappelijke noemer');mount.append(input);return input;
      }
      if(step.stepId==='left_equivalent_numerator')mount.append(renderFractionRepresentation(left,'symbolic_fraction','Eerste breuk'),op('='),renderFractionInputRepresentation({denominator:step.commonDenominator,inputPart:'numerator',inputLabel:'Nieuwe teller van de eerste breuk',documentRef}));
      else if(step.stepId==='right_equivalent_numerator')mount.append(renderFractionRepresentation(right,'symbolic_fraction','Tweede breuk'),op('='),renderFractionInputRepresentation({denominator:step.commonDenominator,inputPart:'numerator',inputLabel:'Nieuwe teller van de tweede breuk',documentRef}));
      else mount.append(renderFractionRepresentation({numerator:step.leftEquivalentNumerator,denominator:step.commonDenominator},'symbolic_fraction','Eerste gelijkwaardige breuk'),op('+'),renderFractionRepresentation({numerator:step.rightEquivalentNumerator,denominator:step.commonDenominator},'symbolic_fraction','Tweede gelijkwaardige breuk'),op('='),renderFractionInputRepresentation({denominator:step.commonDenominator,inputPart:'numerator',inputLabel:'Teller van de som',documentRef}));
      return mount.querySelector('[data-fraction-step-answer="true"]');
    }
    function renderCurrentTask(feedbackMessage='',completedTask=null) {
      const currentStep=session.getCurrentStep(),progress=session.getProgress();
      const step=completedTask?{...completedTask,completedStepIds:stepIds,stepId:null}:currentStep;
      content.replaceChildren();
      const card=documentRef.createElement('section');card.className='card fraction-whole-mixed-addition-card fraction-addition-guided-card';
      const template=createFractionPracticeTemplate({mount:card});
      const title=documentRef.createElement('h2');title.textContent='Ongelijknamige breuken kleiner dan 1 bij elkaar optellen';
      const instruction=documentRef.createElement('p');instruction.className='fraction-practice-instruction';instruction.textContent=mixedNumberResult?'Werk de vijf stappen één voor één af. Bij de laatste stap zet je de onechte breuk om in een gemengd getal.':'Werk de vier stappen één voor één af. Een volgende stap komt vrij zodra je de huidige stap goed hebt gedaan.';
      const progressLabel=documentRef.createElement('p');progressLabel.className='fraction-practice-progress';progressLabel.textContent='Som '+(completedTask?completedTask.taskNumber:progress.completedTaskCount+1)+' van '+progress.totalTaskCount;
      template.titleArea.append(title);template.instructionArea.append(instruction);template.progressArea.append(progressLabel);
      if(!step){const done=documentRef.createElement('p');done.className='fraction-practice-complete';done.textContent='Je hebt alle 10 sommen afgerond. Goed gewerkt!';template.workArea.append(done);content.append(card);return;}
      const prompt=documentRef.createElement('div');prompt.className='fraction-guided-task-prompt';const op=value=>Object.assign(documentRef.createElement('span'),{className:'fraction-guided-operator',textContent:value});
      prompt.append(renderFractionRepresentation(step.leftFraction,'symbolic_fraction','Eerste breuk'),op('+'),renderFractionRepresentation(step.rightFraction,'symbolic_fraction','Tweede breuk'));
      const completedIds=step.completedStepIds||[];
      const denominator=completedTask?.denominator??step.commonDenominator;
      const leftNumerator=completedTask?.leftNumerator??step.leftEquivalentNumerator;
      const rightNumerator=completedTask?.rightNumerator??step.rightEquivalentNumerator;
      const resultNumerator=completedTask?.resultNumerator??step.resultNumerator??(Number.isSafeInteger(leftNumerator)&&Number.isSafeInteger(rightNumerator)?leftNumerator+rightNumerator:null);
      const hasDenominator=completedIds.includes('common_denominator')||completedTask!==null;
      const hasLeft=completedIds.includes('left_equivalent_numerator')||completedTask!==null;
      const hasRight=completedIds.includes('right_equivalent_numerator')||completedTask!==null;
      const hasResult=completedIds.includes('addition_result')||completedTask!==null;
      const solution=documentRef.createElement('div');solution.className='fraction-guided-solution';solution.setAttribute('aria-label','Uitwerking van de som');
      const appendSummaryFraction=(numerator,denom,label)=>{
        const fraction=documentRef.createElement('span');fraction.className='fraction-guided-summary-fraction';fraction.setAttribute('aria-label',label);
        const top=documentRef.createElement('span');top.className='fraction-guided-summary-numerator';top.textContent=Number.isSafeInteger(numerator)?String(numerator):'?';
        const bar=documentRef.createElement('span');bar.className='fraction-guided-summary-divider';
        const bottom=documentRef.createElement('span');bottom.className='fraction-guided-summary-denominator';bottom.textContent=String(denom);
        fraction.append(top,bar,bottom);solution.append(fraction);
      };
      if(hasDenominator&&Number.isSafeInteger(denominator)){
        solution.append(op('='));
        appendSummaryFraction(hasLeft?leftNumerator:null,denominator,'Eerste gelijkwaardige breuk');
        solution.append(op('+'));
        appendSummaryFraction(hasRight?rightNumerator:null,denominator,'Tweede gelijkwaardige breuk');
      }
      if(hasResult&&Number.isSafeInteger(resultNumerator)&&Number.isSafeInteger(denominator)){
        solution.append(op('='));
        appendSummaryFraction(resultNumerator,denominator,'Som als onechte breuk');
      }
      const isMixedStepCompleted=completedIds.includes('mixed_number_conversion')||completedTask?.requiresMixedNumber===true;
      if(mixedNumberResult&&isMixedStepCompleted){
        const whole=completedTask?.resultWholeNumber??step.resultWholeNumber;
        const remainder=completedTask?.resultRemainderNumerator??step.resultRemainderNumerator;
        solution.append(op('='));
        solution.append(renderMixedNumber({wholeNumber:whole,numerator:remainder,denominator},'Gemengd getal als uitkomst'));
      }
      const equation=documentRef.createElement('div');equation.className='fraction-guided-equation';equation.setAttribute('aria-label','Som en uitwerking naast elkaar');equation.append(prompt,solution);template.promptArea.append(equation);
      const grid=documentRef.createElement('div');grid.className='fraction-guided-step-grid'+(mixedNumberResult?' fraction-guided-step-grid--five':'');grid.setAttribute('aria-label',mixedNumberResult?'Vijf denkstappen':'Vier denkstappen');grid.dataset.activeStep=step.stepId||'';let activeInput=null;let activeFractionAnswer=null;
      stepIds.forEach((stepId,index)=>{
        const completed=step.completedStepIds.includes(stepId),active=step.stepId===stepId;
        const item=documentRef.createElement('section');item.className='fraction-guided-step-card';item.dataset.stepId=stepId;item.dataset.state=completed?'completed':active?'active':'locked';item.setAttribute('aria-label','Stap '+(index+1)+': '+stepLabels[index]);
        const heading=documentRef.createElement('h3');heading.textContent='Stap '+(index+1);const label=documentRef.createElement('p');label.className='fraction-guided-step-title';label.textContent=stepLabels[index];item.append(heading,label);
        if(completed){
          const status=documentRef.createElement('p');status.className='fraction-guided-step-status';status.textContent='Afgerond';item.append(status);
          const answer=documentRef.createElement('div');answer.className='fraction-guided-step-completed-answer';
          if(stepId==='common_denominator')answer.textContent='Noemer: '+denominator;
          else if(stepId==='left_equivalent_numerator')answer.append(renderFractionRepresentation({numerator:leftNumerator,denominator},'symbolic_fraction','Eerste gelijkwaardige breuk'));
          else if(stepId==='right_equivalent_numerator')answer.append(renderFractionRepresentation({numerator:rightNumerator,denominator},'symbolic_fraction','Tweede gelijkwaardige breuk'));
          else if(stepId==='addition_result')answer.append(renderFractionRepresentation({numerator:resultNumerator,denominator},'symbolic_fraction','Som als onechte breuk'));
          else if(stepId==='mixed_number_conversion')answer.append(renderMixedNumber({wholeNumber:completedTask?.resultWholeNumber??step.resultWholeNumber,numerator:completedTask?.resultRemainderNumerator??step.resultRemainderNumerator,denominator},'Gemengd getal als uitkomst'));
          item.append(answer);
        }
        else if(active){
          const help=documentRef.createElement('p');help.className='fraction-guided-step-prompt';help.textContent=step.prompt;
          const expression=documentRef.createElement('div');expression.className='fraction-guided-step-expression';
          if(step.stepId==='mixed_number_conversion'){
            expression.append(renderFractionRepresentation({numerator:step.resultNumerator,denominator:step.commonDenominator},'symbolic_fraction','Onechte breuk'));
            const answerMount=documentRef.createElement('div');answerMount.className='fraction-guided-mixed-answer';expression.append(answerMount);
            activeFractionAnswer=renderFractionAnswerInput({workMount:answerMount,controlsMount:template.controlsArea,wholeNumberMode:'optional'});
          }else activeInput=renderExpression(step,expression);
          const check=documentRef.createElement('button');check.type='button';check.className='paco-btn paco-btn--primary paco-btn--small';check.textContent='Controleren';
          check.addEventListener('click',()=>{const result=session.recordResponse(step.stepId==='mixed_number_conversion'?{values:activeFractionAnswer?.getValues()}:{rawValue:activeInput?.value||''});if(result.classification==='valid'){if(step.stepId==='addition_result'&&!mixedNumberResult){renderCurrentTask('Goed gedaan! Deze som is afgerond.',result.completion);return;}if(step.stepId==='mixed_number_conversion'){activeFractionAnswer?.lock();renderCurrentTask('Goed gedaan! Deze som is afgerond.',result.completion);return;}renderCurrentTask('Goed gedaan! Deze stap is afgerond.');return;}
            const messages={invalid_input:'Vul alle benodigde getallen in. Controleer ook de noemer.',not_common_denominator:'Deze noemer past niet bij beide breuken. Kies een noemer die door beide noemers gedeeld kan worden.',not_equivalent:'Deze teller maakt de breuk nog niet gelijkwaardig. Controleer met welke factor de noemer is vermenigvuldigd.',arithmetic_error:'Tel de twee tellers bij elkaar op. De noemer blijft hetzelfde.',incorrect_mixed_number:'Dit gemengde getal is nog niet gelijk aan de uitkomst. Controleer het hele getal en de breuk.',requires_mixed_number:'De uitkomst is groter dan 1. Schakel ‘Heel getal toevoegen’ in en vul het gemengde getal in.',requires_simplification:'Je gemengde getal klopt. Vereenvoudig de breuk nog voordat je verdergaat.',not_simplified:'De vereenvoudigde breuk klopt nog niet. Probeer het opnieuw.'};
            const feedback=documentRef.createElement('p');feedback.className='fraction-practice-feedback is-error';feedback.setAttribute('role','alert');feedback.textContent=messages[result.classification]||'Controleer je antwoord en probeer het opnieuw.';template.feedbackArea.replaceChildren(feedback);activeInput?.focus();});
          item.addEventListener('keydown',event=>{if(event.key==='Enter'&&event.target instanceof documentRef.defaultView.HTMLInputElement){event.preventDefault();check.click();}});item.append(help,expression,check);
        }else{const status=documentRef.createElement('p');status.className='fraction-guided-step-status';status.textContent='Komt hierna';item.append(status);}
        grid.append(item);
      });
      template.workArea.append(grid);if(feedbackMessage){const feedback=documentRef.createElement('p');feedback.className='fraction-practice-feedback is-correct';feedback.setAttribute('role','status');feedback.textContent=feedbackMessage;template.feedbackArea.append(feedback);}if(completedTask){const next=documentRef.createElement('button');next.type='button';next.className='paco-btn paco-btn--primary paco-btn--small';next.textContent=progress.isComplete?'Afronden':'Volgende';next.addEventListener('click',()=>renderCurrentTask());template.actionsArea.replaceChildren(next);}content.append(card);activeInput?.focus();
    }
    renderCurrentTask();
  }


  function renderUnequalMixedAdditionPractice() {
    const learnerKey=student||context?.learnerId||'local-learner';
    const guided=createFractionAdditionLevel5GuidedSession({learnerKey});
    const independent=createFractionAdditionLevel5IndependentSession({learnerKey});
    const stepIds=['common_denominator','left_equivalent_numerator','right_equivalent_numerator','whole_number_conversion','fraction_parts_addition','mixed_number_answer'];
    const labels=['Gemeenschappelijke noemer kiezen','Eerste breukdeel gelijkwaardig maken','Tweede breukdeel gelijkwaardig maken','Hele getallen omzetten naar breuken','Tellers optellen','Antwoord als gemengd getal'];
    const prompts=['Kies een noemer die bij beide breukdelen past.','Maak het eerste breukdeel gelijkwaardig.','Maak het tweede breukdeel gelijkwaardig.','Zet ieder heel getal om in een breuk met dezelfde noemer.','Tel de tellers van de twee breuken bij elkaar op. De noemer blijft hetzelfde.','Vul het antwoord als gemengd getal in. Vereenvoudig als dat nodig is.'];
    const op=v=>Object.assign(documentRef.createElement('span'),{className:'fraction-guided-operator',textContent:v});
    const renderMixed=(value,label)=>renderMixedNumber({wholeNumber:value.wholeNumber,numerator:value.numerator,denominator:value.denominator},label);
    const renderFraction=(numerator,denominator,label)=>renderFractionRepresentation({numerator,denominator},'symbolic_fraction',label);
    let mode='guided';

    function createCard(titleText,instructionText,progressText){
      const card=documentRef.createElement('section');
      card.className='card fraction-whole-mixed-addition-card fraction-addition-guided-card fraction-addition-level-5-card';
      const template=createFractionPracticeTemplate({mount:card});
      const title=documentRef.createElement('h2');title.textContent=titleText;
      const instruction=documentRef.createElement('p');instruction.className='fraction-practice-instruction';instruction.textContent=instructionText;
      const progress=documentRef.createElement('p');progress.className='fraction-practice-progress';progress.textContent=progressText;
      template.titleArea.append(title);template.instructionArea.append(instruction);template.progressArea.append(progress);
      return {card,template,progress};
    }

    function renderIndependent(){
      mode='independent';
      const task=independent.getCurrentTask(),progress=independent.getProgress();
      content.replaceChildren();
      const view=createCard('Zelfstandig oefenen: ongelijknamige gemengde getallen','Tel de gemengde getallen bij elkaar op. Schrijf je antwoord als gemengd getal en vereenvoudig als dat nodig is.','Zelfstandig — som '+(task?.index||progress.completedCount+1)+' van '+progress.totalCount);
      const {card,template,progress:progressLabel}=view;
      if(!task){
        const done=documentRef.createElement('p');done.className='fraction-practice-complete';done.textContent='Je hebt alle 15 zelfstandige sommen afgerond. Goed gewerkt!';
        template.workArea.append(done);content.append(card);return;
      }
      const equation=documentRef.createElement('div');equation.className='fraction-guided-equation';
      const prompt=documentRef.createElement('div');prompt.className='fraction-guided-task-prompt';
      prompt.append(renderMixed(task.leftMixedNumber,'Eerste gemengde getal'),op('+'),renderMixed(task.rightMixedNumber,'Tweede gemengde getal'),op('='));
      const answerMount=documentRef.createElement('div');answerMount.className='fraction-guided-mixed-answer';
      equation.append(prompt,answerMount);template.promptArea.append(equation);
      const answer=renderFractionAnswerInput({workMount:answerMount,controlsMount:template.controlsArea,wholeNumberMode:'required'});
      const check=documentRef.createElement('button');check.type='button';check.className='paco-btn paco-btn--primary';check.textContent='Controleren';template.actionsArea.append(check);
      check.addEventListener('click',()=>{
        const result=independent.recordAnswer({values:answer.getValues()});
        if(result.classification==='valid'){
          answer.lock();check.disabled=true;
          const feedback=documentRef.createElement('p');feedback.className='fraction-practice-feedback is-correct';feedback.setAttribute('role','status');feedback.textContent='Goed gedaan! Je antwoord klopt.';
          template.feedbackArea.replaceChildren(feedback);
          const next=documentRef.createElement('button');next.type='button';next.className='paco-btn paco-btn--primary';next.textContent=result.progress.isComplete?'Bekijk resultaat':'Volgende som';next.addEventListener('click',renderIndependent);
          template.actionsArea.replaceChildren(next);
          progressLabel.textContent='Zelfstandig — '+result.progress.completedCount+' van '+result.progress.totalCount+' afgerond';
          return;
        }
        const messages={invalid_input:'Vul een geldig gemengd getal in. De noemer moet groter zijn dan nul.',incorrect_answer:'Dit antwoord klopt nog niet. Tel de hele getallen en de breukdelen bij elkaar op.',requires_mixed_number:'Vul ook het hele getal in.',requires_simplification:'Je berekening klopt. Vereenvoudig de breuk als dat nodig is.',not_simplified:'De vereenvoudigde breuk klopt nog niet. Probeer het opnieuw.'};
        const feedback=documentRef.createElement('p');feedback.className='fraction-practice-feedback is-error';feedback.setAttribute('role','alert');feedback.textContent=messages[result.classification]||'Controleer je antwoord en probeer het opnieuw.';
        template.feedbackArea.replaceChildren(feedback);
      });
      content.append(card);
    }

    function renderProgression(task){
      const completed=new Set(task.completedStepIds||[]);
      const hasLeft=completed.has('left_equivalent_numerator');
      const hasRight=completed.has('right_equivalent_numerator');
      const hasWhole=completed.has('whole_number_conversion');
      const hasTotal=completed.has('fraction_parts_addition');
      const hasAnswer=completed.has('mixed_number_answer');
      if(!hasLeft&&!hasRight&&!hasWhole&&!hasTotal&&!hasAnswer)return null;
      const solution=documentRef.createElement('div');solution.className='fraction-guided-solution';solution.setAttribute('aria-label','Stapsgewijs opgebouwde breukuitwerking');
      solution.append(op('='));
      solution.append(renderMixed({wholeNumber:task.leftMixedNumber.wholeNumber,numerator:hasLeft?task.leftNumerator:task.leftMixedNumber.numerator,denominator:hasLeft?task.denominator:task.leftMixedNumber.denominator},'Eerste getal na gelijknamig maken'),
        op('+'),
        renderMixed({wholeNumber:task.rightMixedNumber.wholeNumber,numerator:hasRight?task.rightNumerator:task.rightMixedNumber.numerator,denominator:hasRight?task.denominator:task.rightMixedNumber.denominator},'Tweede getal na gelijknamig maken'));
      if(hasWhole){
        solution.append(op('='),renderFraction(task.leftWholeNumerator+task.leftNumerator,task.denominator,'Eerste gemengde getal als onechte breuk'),
          op('+'),renderFraction(task.rightWholeNumerator+task.rightNumerator,task.denominator,'Tweede gemengde getal als onechte breuk'));
      }
      if(hasTotal)solution.append(op('='),renderFraction(task.improperNumerator,task.denominator,'Som als onechte breuk'));
      if(hasAnswer)solution.append(op('='),renderMixed({wholeNumber:task.whole,numerator:task.numerator,denominator:task.reducedDenominator},'Gemengd eindantwoord'));
      return solution;
    }

    function renderGuided(message=''){
      mode='guided';
      const task=guided.getCurrentTask(),progress=guided.getProgress();
      content.replaceChildren();
      const view=createCard('Ongelijknamige gemengde getallen bij elkaar optellen','Werk de zes stappen één voor één af. De som wordt na iedere stap verder opgebouwd.','Begeleid — som '+(task?.taskNumber||progress.completedCount+1)+' van '+progress.totalCount);
      const {card,template}=view;
      if(!task){
        const done=documentRef.createElement('p');done.className='fraction-practice-complete';done.textContent='Je hebt alle 10 begeleide sommen afgerond. Goed gewerkt!';
        template.workArea.append(done);
        const next=documentRef.createElement('button');next.type='button';next.className='paco-btn paco-btn--primary';next.textContent='Start 15 zelfstandige sommen';next.addEventListener('click',renderIndependent);
        template.actionsArea.append(next);content.append(card);return;
      }
      const equation=documentRef.createElement('div');equation.className='fraction-guided-equation';
      const prompt=documentRef.createElement('div');prompt.className='fraction-guided-task-prompt';
      prompt.append(renderMixed(task.leftMixedNumber,'Eerste gemengde getal'),op('+'),renderMixed(task.rightMixedNumber,'Tweede gemengde getal'));
      equation.append(prompt);
      const progression=renderProgression(task);if(progression)equation.append(progression);
      template.promptArea.append(equation);
      const grid=documentRef.createElement('div');grid.className='fraction-guided-step-grid fraction-guided-step-grid--progressive';grid.setAttribute('aria-label','Zes denkstappen');grid.dataset.activeStep=task.stepId||'awaiting-next';
      const completed=task.completedStepIds||[],den=task.denominator;
      let activeInputs=[],activeAnswer=null;
      stepIds.forEach((id,index)=>{
        const done=completed.includes(id),active=task.stepId===id,item=documentRef.createElement('section');
        item.className='fraction-guided-step-card';item.dataset.stepId=id;item.dataset.state=done?'completed':active?'active':'locked';
        item.setAttribute('aria-label','Stap '+(index+1)+': '+labels[index]);
        const h=documentRef.createElement('h3');h.textContent='Stap '+(index+1);
        const label=documentRef.createElement('p');label.className='fraction-guided-step-title';label.textContent=labels[index];item.append(h,label);
        if(done){
          const status=documentRef.createElement('p');status.className='fraction-guided-step-status';status.textContent='Afgerond';item.append(status);
          const answer=documentRef.createElement('div');answer.className='fraction-guided-step-completed-answer';
          if(id==='common_denominator')answer.textContent='Noemer: '+den;
          else if(id==='left_equivalent_numerator')answer.append(renderMixed({wholeNumber:task.leftMixedNumber.wholeNumber,numerator:task.leftNumerator,denominator:den},'Eerste gelijkwaardige gemengde getal'));
          else if(id==='right_equivalent_numerator')answer.append(renderMixed({wholeNumber:task.rightMixedNumber.wholeNumber,numerator:task.rightNumerator,denominator:den},'Tweede gelijkwaardige gemengde getal'));
          else if(id==='whole_number_conversion')answer.append(renderFraction(task.leftWholeNumerator+task.leftNumerator,den,'Eerste gemengde getal als onechte breuk'),op('+'),renderFraction(task.rightWholeNumerator+task.rightNumerator,den,'Tweede gemengde getal als onechte breuk'));
          else if(id==='fraction_parts_addition')answer.append(renderFraction(task.improperNumerator,den,'Som als onechte breuk'));
          else answer.append(renderMixed({wholeNumber:task.whole,numerator:task.numerator,denominator:task.reducedDenominator},'Gemengd eindantwoord'));
          item.append(answer);
        }else if(active&&!task.isAwaitingNext){
          const help=documentRef.createElement('p');help.className='fraction-guided-step-prompt';help.textContent=prompts[index];item.append(help);
          const expression=documentRef.createElement('div');expression.className='fraction-guided-step-expression';
          if(id==='common_denominator'){
            expression.append(renderMixed(task.leftMixedNumber,'Eerste gemengde getal'),op('+'),renderMixed(task.rightMixedNumber,'Tweede gemengde getal'),op('→'));
            const input=documentRef.createElement('input');input.type='text';input.inputMode='numeric';input.className='fraction-guided-scalar-input';input.setAttribute('aria-label','Gemeenschappelijke noemer');activeInputs=[input];expression.append(input);
          }else if(id==='left_equivalent_numerator'){
            expression.append(renderFractionRepresentation({numerator:task.leftMixedNumber.numerator,denominator:task.leftMixedNumber.denominator},'symbolic_fraction','Eerste breukdeel'),op('='),renderFractionInputRepresentation({denominator:den,inputPart:'numerator',inputLabel:'Nieuwe teller eerste breukdeel',documentRef}));
            activeInputs=[expression.querySelector('[data-fraction-step-answer="true"]')];
          }else if(id==='right_equivalent_numerator'){
            expression.append(renderFractionRepresentation({numerator:task.rightMixedNumber.numerator,denominator:task.rightMixedNumber.denominator},'symbolic_fraction','Tweede breukdeel'),op('='),renderFractionInputRepresentation({denominator:den,inputPart:'numerator',inputLabel:'Nieuwe teller tweede breukdeel',documentRef}));
            activeInputs=[expression.querySelector('[data-fraction-step-answer="true"]')];
          }else if(id==='whole_number_conversion'){
            const left=renderFractionInputRepresentation({denominator:den,inputPart:'numerator',inputLabel:'Teller van het eerste hele getal',documentRef});
            const right=renderFractionInputRepresentation({denominator:den,inputPart:'numerator',inputLabel:'Teller van het tweede hele getal',documentRef});
            expression.append(documentRef.createTextNode(String(task.leftMixedNumber.wholeNumber)),op('='),left,op('+'),documentRef.createTextNode(String(task.rightMixedNumber.wholeNumber)),op('='),right);
            activeInputs=[...expression.querySelectorAll('[data-fraction-step-answer="true"]')];
          }else if(id==='fraction_parts_addition'){
            expression.append(renderFraction(task.leftWholeNumerator+task.leftNumerator,den,'Eerste onechte breuk'),op('+'),
              renderFraction(task.rightWholeNumerator+task.rightNumerator,den,'Tweede onechte breuk'),op('='),
              renderFractionInputRepresentation({denominator:den,inputPart:'numerator',inputLabel:'Teller van de som',documentRef}));
            activeInputs=[expression.querySelector('[data-fraction-step-answer="true"]')];
          }else{
            const mount=documentRef.createElement('div');mount.className='fraction-guided-mixed-answer';expression.append(mount);
            activeAnswer=renderFractionAnswerInput({workMount:mount,controlsMount:template.controlsArea,wholeNumberMode:'required'});
          }
          item.append(expression);
          const check=documentRef.createElement('button');check.type='button';check.className='paco-btn paco-btn--primary paco-btn--small';check.textContent='Controleren';
          check.addEventListener('click',()=>{
            let result;
            if(id==='mixed_number_answer')result=guided.recordGuided({stepId:id,values:activeAnswer.getValues()});
            else if(id==='whole_number_conversion')result=guided.recordGuided({stepId:id,values:{leftWholeNumerator:activeInputs[0]?.value||'',rightWholeNumerator:activeInputs[1]?.value||''}});
            else result=guided.recordGuided({stepId:id,rawValue:activeInputs[0]?.value||''});
            if(result.classification==='valid'){
              if(id==='mixed_number_answer')activeAnswer.lock();
              renderGuided(id==='mixed_number_answer'?'Goed gedaan! Je hebt deze som goed afgerond.':'Goed gedaan! Deze stap is afgerond.');return;
            }
            const messages={invalid_input:'Vul alle benodigde getallen in.',not_common_denominator:'Kies een noemer die bij beide breukdelen past.',not_equivalent:'Deze omzetting klopt nog niet. Controleer de vermenigvuldigingsfactor.',arithmetic_error:'Tel de twee omgezette hele getallen en de twee breukdelen bij elkaar op. De noemer blijft gelijk.',incorrect_answer:'Dit gemengde getal klopt nog niet.',requires_simplification:'Je antwoord klopt. Vereenvoudig de breuk als dat nodig is.',not_simplified:'De vereenvoudigde breuk klopt nog niet.'};
            const feedback=documentRef.createElement('p');feedback.className='fraction-practice-feedback is-error';feedback.setAttribute('role','alert');feedback.textContent=messages[result.classification]||'Controleer je antwoord en probeer het opnieuw.';
            template.feedbackArea.replaceChildren(feedback);activeInputs[0]?.focus();
          });
          item.addEventListener('keydown',event=>{if(event.key==='Enter'&&event.target instanceof documentRef.defaultView.HTMLInputElement){event.preventDefault();check.click();}});
          item.append(check);
        }else{
          const status=documentRef.createElement('p');status.className='fraction-guided-step-status';status.textContent='Komt hierna';item.append(status);
        }
        grid.append(item);
      });
      template.workArea.append(grid);
      if(message){const feedback=documentRef.createElement('p');feedback.className='fraction-practice-feedback is-correct';feedback.setAttribute('role','status');feedback.textContent=message;template.feedbackArea.append(feedback);}
      if(task.isAwaitingNext){
        const next=documentRef.createElement('button');next.type='button';next.className='paco-btn paco-btn--primary';
        next.textContent=progress.isComplete?'Bekijk resultaat':'Volgende som';
        next.addEventListener('click',()=>{guided.advanceGuidedTask();renderGuided();});
        template.actionsArea.replaceChildren(next);
      }
      content.append(card);activeInputs[0]?.focus();
    }

    renderGuided();
  }


  function renderWholeNumberTimesMixedFractionGreaterThanOnePractice() {
    const learnerKey = student || context?.learnerId || 'local-learner';
    const session = createFractionWholeNumberTimesMixedFractionGreaterThanOneSession({
      learnerKey,
      tasks: FRACTION_WHOLE_NUMBER_TIMES_MIXED_FRACTION_GREATER_THAN_ONE_TASKS
    });

    function renderCurrentTask() {
      const task = session.getCurrentTask();
      const progress = session.getProgress();
      content.replaceChildren();
      const card = documentRef.createElement('section');
      card.className = 'card fraction-whole-mixed-addition-card';
      const template = createFractionPracticeTemplate({ mount: card });
      const title = documentRef.createElement('h2');
      title.textContent = 'Heel getal vermenigvuldigen met een breukgetal groter dan 1';
      const instruction = documentRef.createElement('p');
      instruction.className = 'fraction-practice-instruction';
      instruction.textContent = 'Vermenigvuldig het hele getal met het gemengde getal. Geef je antwoord als gemengd getal.';
      const progressLabel = documentRef.createElement('p');
      progressLabel.className = 'fraction-practice-progress';
      progressLabel.textContent = 'Som ' + (task ? task.taskNumber : progress.totalCount) +
        ' van 15 • ' + progress.completedCount + ' afgerond';
      template.titleArea.append(title);
      template.instructionArea.append(instruction);
      template.progressArea.append(progressLabel);

      if (!task) {
        const done = documentRef.createElement('p');
        done.className = 'fraction-practice-complete';
        done.textContent = 'Je hebt alle 15 sommen afgerond. Goed gewerkt!';
        template.workArea.append(done);
        const restart = documentRef.createElement('button');
        restart.type = 'button';
        restart.className = 'paco-btn paco-btn--primary';
        restart.textContent = 'Oefenronde opnieuw doen';
        restart.addEventListener('click', () => { session.reset(); renderCurrentTask(); });
        template.actionsArea.append(restart);
        content.append(card);
        return;
      }

      // Reuse the central mixed-number renderer, equation composition and
      // answer controls already used by the existing fraction exercises.
      const equation = documentRef.createElement('div');
      equation.className = 'fraction-whole-mixed-equation';
      const expression = documentRef.createElement('div');
      expression.className = 'fraction-whole-mixed-expression';
      const whole = documentRef.createElement('span');
      whole.className = 'fraction-whole-mixed-expression__whole';
      whole.textContent = String(task.wholeNumber);
      const multiply = documentRef.createElement('span');
      multiply.className = 'fraction-whole-mixed-expression__operator';
      multiply.textContent = '×';
      expression.append(
        whole,
        multiply,
        renderMixedNumber({
          wholeNumber: task.multiplier.whole,
          numerator: task.multiplier.numerator,
          denominator: task.multiplier.denominator
        }, 'Gemengd getal')
      );
      const equals = documentRef.createElement('span');
      equals.className = 'fraction-whole-mixed-expression__operator';
      equals.textContent = '=';
      const answerMount = documentRef.createElement('div');
      answerMount.className = 'fraction-whole-mixed-answer';
      equation.append(expression, equals, answerMount);
      template.workArea.append(equation);

      const answer = renderFractionAnswerInput({
        workMount: answerMount,
        controlsMount: template.controlsArea,
        wholeNumberMode: 'required'
      });
      const check = documentRef.createElement('button');
      check.type = 'button';
      check.className = 'paco-btn paco-btn--primary';
      check.textContent = 'Controleren';
      template.actionsArea.append(check);

      check.addEventListener('click', () => {
        const result = session.recordAnswer({ values: answer.getValues() });
        progressLabel.textContent = 'Som ' + (result.progress.completedCount + (result.progress.isComplete ? 0 : 1)) +
          ' van 15 • ' + result.progress.completedCount + ' afgerond';
        if (result.classification === 'valid') {
          answer.lock();
          check.disabled = true;
          const feedback = documentRef.createElement('p');
          feedback.className = 'fraction-practice-feedback is-correct';
          feedback.setAttribute('role', 'status');
          feedback.textContent = 'Goed gedaan! Je antwoord klopt.';
          template.feedbackArea.replaceChildren(feedback);
          const next = documentRef.createElement('button');
          next.type = 'button';
          next.className = 'paco-btn paco-btn--primary';
          next.textContent = result.progress.isComplete ? 'Oefenronde afronden' : 'Volgende som';
          next.addEventListener('click', renderCurrentTask);
          template.actionsArea.replaceChildren(next);
          return;
        }
        const messages = {
          invalid_input: 'Vul het hele getal, de teller en de noemer in. De noemer moet groter zijn dan nul.',
          incorrect_answer: 'Dat antwoord klopt nog niet. Vermenigvuldig beide delen van het gemengde getal met het hele getal.',
          requires_simplification: 'Je berekening klopt, maar de breuk kan nog vereenvoudigd worden. Klik op Vereenvoudigen en vul de eenvoudigste breuk in.',
          not_simplified: 'De vereenvoudigde breuk klopt nog niet. Controleer de teller en noemer.'
        };
        const feedback = documentRef.createElement('p');
        feedback.className = 'fraction-practice-feedback is-error';
        feedback.setAttribute('role', 'alert');
        feedback.textContent = messages[result.classification] || 'Controleer je antwoord en probeer het opnieuw.';
        template.feedbackArea.replaceChildren(feedback);
        answer.focus();
      });

      content.append(card);
      answer.focus();
    }

    renderCurrentTask();
  }

  function renderWholeNumberTimesProperFractionPractice() {
    const learnerKey = student || context?.learnerId || 'local-learner';
    const session = createFractionWholeNumberTimesProperFractionSession({
      learnerKey,
      tasks: FRACTION_WHOLE_NUMBER_TIMES_PROPER_FRACTION_TASKS
    });

    function renderCurrentTask() {
      const task = session.getCurrentTask();
      const progress = session.getProgress();
      content.replaceChildren();
      const card = documentRef.createElement('section');
      card.className = 'card fraction-whole-mixed-addition-card';
      const template = createFractionPracticeTemplate({ mount: card });
      const title = documentRef.createElement('h2');
      title.textContent = 'Heel getal vermenigvuldigen met een breukgetal kleiner dan 1';
      const instruction = documentRef.createElement('p');
      instruction.className = 'fraction-practice-instruction';
      instruction.textContent = 'Bereken de uitkomst.';
      const progressLabel = documentRef.createElement('p');
      progressLabel.className = 'fraction-practice-progress';
      progressLabel.textContent = 'Som ' + (task ? task.taskNumber : progress.totalCount) +
        ' van 15 • ' + progress.completedCount + ' afgerond';
      template.titleArea.append(title);
      template.instructionArea.append(instruction);
      template.progressArea.append(progressLabel);

      if (!task) {
        const done = documentRef.createElement('p');
        done.className = 'fraction-practice-complete';
        done.textContent = 'Je hebt alle 15 sommen afgerond. Goed gewerkt!';
        template.workArea.append(done);
        const restart = documentRef.createElement('button');
        restart.type = 'button';
        restart.className = 'paco-btn paco-btn--primary';
        restart.textContent = 'Oefenronde opnieuw doen';
        restart.addEventListener('click', () => { session.reset(); renderCurrentTask(); });
        template.actionsArea.append(restart);
        content.append(card);
        return;
      }

      // Reuse the exact symbolic-fraction and equation typography used by the
      // existing fraction exercises. Only the single whole-number answer is
      // rendered with the shared inline-expression field.
      const equation = documentRef.createElement('div');
      equation.className = 'fraction-whole-mixed-equation';
      const expression = documentRef.createElement('div');
      expression.className = 'fraction-whole-mixed-expression';
      const whole = documentRef.createElement('span');
      whole.className = 'fraction-whole-mixed-expression__whole';
      whole.textContent = String(task.wholeNumber);
      const multiply = documentRef.createElement('span');
      multiply.className = 'fraction-whole-mixed-expression__operator';
      multiply.textContent = '×';
      expression.append(
        whole,
        multiply,
        renderFractionRepresentation(
          { numerator: task.numerator, denominator: task.denominator },
          'symbolic_fraction',
          'Breuk'
        )
      );
      const equals = documentRef.createElement('span');
      equals.className = 'fraction-whole-mixed-expression__operator';
      equals.textContent = '=';
      const answerMount = documentRef.createElement('div');
      answerMount.className = 'fraction-whole-mixed-answer';
      const answerExpression = documentRef.createElement('div');
      answerExpression.className = 'fraction-whole-mixed-expression';
      answerMount.append(answerExpression);
      equation.append(expression, equals, answerMount);
      template.workArea.append(equation);

      const answer = renderFractionPracticeExpression({
        mount: answerExpression,
        expression: '?',
        inputLabels: ['Uitkomst']
      });

      const submit = documentRef.createElement('button');
      submit.type = 'button';
      submit.className = 'paco-btn paco-btn--primary';
      submit.textContent = 'Controleren';
      template.actionsArea.append(submit);

      submit.addEventListener('click', () => {
        const result = session.recordAnswer({ answer: answer.getValues()[0] });
        progressLabel.textContent = 'Som ' + (result.progress.isComplete ? 15 : result.progress.completedCount + 1) +
          ' van 15 • ' + result.progress.completedCount + ' afgerond';
        if (result.classification === 'valid') {
          answer.lock();
          submit.disabled = true;
          const feedback = documentRef.createElement('p');
          feedback.className = 'fraction-practice-feedback is-correct';
          feedback.setAttribute('role', 'status');
          feedback.textContent = 'Goed gedaan! Je antwoord klopt.';
          template.feedbackArea.replaceChildren(feedback);
          const next = documentRef.createElement('button');
          next.type = 'button';
          next.className = 'paco-btn paco-btn--primary';
          next.textContent = result.progress.isComplete ? 'Oefenronde afronden' : 'Volgende som';
          next.addEventListener('click', renderCurrentTask);
          template.actionsArea.replaceChildren(next);
          return;
        }
        const feedback = documentRef.createElement('p');
        feedback.className = 'fraction-practice-feedback is-error';
        feedback.setAttribute('role', 'alert');
        feedback.textContent = result.classification === 'invalid_input'
          ? 'Vul een heel getal in.'
          : 'Dat antwoord klopt nog niet. Probeer het opnieuw.';
        template.feedbackArea.replaceChildren(feedback);
        answer.focus();
      });

      content.append(card);
      answer.focus();
    }

    renderCurrentTask();
  }

  async function mount() {
    const showingFractions = domain === FRACTION_DOMAIN;
    const showingAddition = showingFractions && topic === 'optellen';
    const showingSubtraction = showingFractions && topic === 'aftrekken';
    const showingMultiplication = showingFractions && topic === 'vermenigvuldigen';
    const showingDivision = showingFractions && topic === 'delen';
    const showingWholeNumberDividedByFractionGreaterThanOnePractice = showingDivision && exercise === 'whole-number-divided-by-fraction-greater-than-one';
    const showingWholeNumberDividedByFractionGreaterThanOneGuidedPractice = showingDivision && exercise === 'whole-number-divided-by-fraction-greater-than-one-guided';
    const showingLikeDenominatorDivisionPractice = showingDivision && exercise === 'like-denominator-division';
    const showingUnlikeDenominatorDivisionPractice = showingDivision && exercise === 'unlike-denominator-division';
    const showingUnlikeDenominatorDivisionGuidedPractice = showingDivision && exercise === 'unlike-denominator-division-guided';
    const showingMixedLikeDenominatorDivisionPractice = showingDivision && exercise === 'mixed-like-denominator-division';
    const showingMixedLikeDenominatorDivisionGuidedPractice = showingDivision && exercise === 'mixed-like-denominator-division-guided';
    const showingLikeDenominatorDivisionGuidedPractice = showingDivision && exercise === 'like-denominator-division-guided';
    const showingWholeNumberTimesProperFractionPractice = showingMultiplication && exercise === 'whole-number-times-proper-fraction';
    const showingWholeNumberTimesMixedFractionGreaterThanOnePractice = showingMultiplication && exercise === 'whole-number-times-mixed-fraction-greater-than-one';
    const showingLikeDenominatorMultiplicationPractice = showingMultiplication && exercise === 'like-denominator-multiplication';
    const showingMixedLikeDenominatorMultiplicationPractice = showingMultiplication && exercise === 'mixed-like-denominator-multiplication';
    const showingUnlikeDenominatorMultiplicationPractice = showingMultiplication && exercise === 'unlike-denominator-multiplication';
    const showingMixedUnlikeDenominatorMultiplicationPractice = showingMultiplication && exercise === 'mixed-unlike-denominator-multiplication';
    const showingWholeMinusMixedSubtraction = showingSubtraction && exercise === 'whole-minus-mixed-subtraction';
    const showingLikeDenominatorSubtractionPractice = showingSubtraction && exercise === 'like-denominator-subtraction';
    const showingMixedLikeDenominatorSubtractionPractice = showingSubtraction && exercise === 'mixed-like-denominator-subtraction';
    const showingUnlikeDenominatorSubtractionPractice = showingSubtraction && exercise === 'unlike-denominator-subtraction';
    const showingUnlikeMixedDenominatorSubtractionPractice = showingSubtraction && exercise === 'unlike-mixed-denominator-subtraction';
    const showingWholeMinusGreaterThanOneSubtraction = showingSubtraction && exercise === 'whole-minus-greater-than-one-subtraction';
    const showingWholeMixedPractice = showingAddition && exercise === 'whole-number-mixed-addition';
    const showingSameDenominatorPractice = showingAddition && exercise === 'same-denominator-addition';
    const showingMixedSameDenominatorPractice = showingAddition && exercise === 'mixed-same-denominator-addition';
    const showingUnequalDenominatorGuidedPractice = showingAddition && exercise === 'unequal-denominator-guided-addition';
    const showingUnequalIndependentPractice = showingAddition && exercise === 'unequal-independent-addition';
    const showingUnequalDenominatorGuidedMixedPractice = showingAddition && exercise === 'unequal-denominator-guided-mixed-addition';
    const showingUnequalMixedAdditionPractice = showingAddition && exercise === 'unequal-mixed-addition';
    const showingPractice = showingWholeMixedPractice || showingSameDenominatorPractice || showingMixedSameDenominatorPractice || showingUnequalDenominatorGuidedPractice || showingUnequalDenominatorGuidedMixedPractice || showingUnequalIndependentPractice || showingUnequalMixedAdditionPractice;
    const showingAnyPractice = showingPractice || showingLikeDenominatorDivisionPractice || showingMixedLikeDenominatorDivisionPractice || showingMixedLikeDenominatorDivisionGuidedPractice || showingLikeDenominatorDivisionGuidedPractice || showingUnlikeDenominatorDivisionPractice || showingWholeNumberDividedByFractionGreaterThanOnePractice || showingWholeNumberDividedByFractionGreaterThanOneGuidedPractice || showingWholeNumberTimesProperFractionPractice || showingWholeNumberTimesMixedFractionGreaterThanOnePractice || showingLikeDenominatorMultiplicationPractice || showingMixedLikeDenominatorMultiplicationPractice || showingUnlikeDenominatorMultiplicationPractice || showingMixedUnlikeDenominatorMultiplicationPractice || showingWholeMinusMixedSubtraction || showingWholeMinusGreaterThanOneSubtraction || showingLikeDenominatorSubtractionPractice || showingMixedLikeDenominatorSubtractionPractice || showingUnlikeDenominatorSubtractionPractice || showingUnlikeMixedDenominatorSubtractionPractice;
    mountPacoPageTemplate({
      mount: templateMount,
      greeting: student ? `Hoi ${student}! 🐶` : 'Welkom bij PacoGO!',
      title: showingAnyPractice ? 'Oefenen' : showingAddition ? 'Optellen' : showingSubtraction ? 'Aftrekken' : showingMultiplication ? 'Vermenigvuldigen' : showingDivision ? 'Delen' : showingFractions ? 'Breuken' : 'Skills',
      icon: showingAddition ? '➕' : showingSubtraction ? '➖' : showingMultiplication ? '✖️' : showingDivision ? '➗' : showingFractions ? '½' : '📘',
      layoutMode: showingAnyPractice ? 'practice' : 'standard',
      subtitle: showingUnlikeDenominatorDivisionPractice
        ? 'Breuken → Delen → Ongelijknamige breuken kleiner dan 1 op elkaar delen.'
        : showingMixedLikeDenominatorDivisionGuidedPractice
        ? 'Breuken → Delen → Gelijknamige breuken groter dan 1 op elkaar delen — met stappenplan.'
        : showingMixedLikeDenominatorDivisionPractice
        ? 'Breuken → Delen → Gelijknamige breuken groter dan 1 op elkaar delen.'
        : showingLikeDenominatorDivisionGuidedPractice
        ? 'Breuken → Delen → Gelijknamige breuken kleiner dan 1 op elkaar delen — met stappenplan.'
        : showingLikeDenominatorDivisionPractice
        ? 'Breuken → Delen → Gelijknamige breuken kleiner dan 1 op elkaar delen.'
        : showingWholeNumberDividedByFractionGreaterThanOneGuidedPractice
        ? 'Breuken → Delen → Heel getal delen door een breukgetal groter dan 1 — met stappenplan.'
        : showingWholeNumberDividedByFractionGreaterThanOnePractice
        ? 'Breuken → Delen → Heel getal delen door een breukgetal groter dan 1 — zonder stappenplan.'
        : showingWholeNumberTimesMixedFractionGreaterThanOnePractice
        ? 'Breuken → Vermenigvuldigen → Heel getal vermenigvuldigen met een breukgetal groter dan 1.'
        : showingWholeNumberTimesProperFractionPractice
        ? 'Breuken → Vermenigvuldigen → Heel getal vermenigvuldigen met een breukgetal kleiner dan 1.'
        : showingLikeDenominatorMultiplicationPractice
        ? 'Breuken → Vermenigvuldigen → Gelijknamige breuken kleiner dan 1 met elkaar vermenigvuldigen.'
        : showingMixedLikeDenominatorMultiplicationPractice
        ? 'Breuken → Vermenigvuldigen → Gelijknamige breuken groter dan 1 met elkaar vermenigvuldigen.'
        : showingUnlikeDenominatorMultiplicationPractice
        ? 'Breuken → Vermenigvuldigen → Ongelijknamige breuken kleiner dan 1 met elkaar vermenigvuldigen.'
        : showingMixedUnlikeDenominatorMultiplicationPractice
        ? 'Breuken → Vermenigvuldigen → Ongelijknamige breuken groter dan 1 met elkaar vermenigvuldigen.'
        : showingWholeMixedPractice
        ? 'Breuken → Optellen → Heel getal optellen bij een breukgetal groter dan 1.'
        : showingMixedSameDenominatorPractice
        ? 'Breuken → Optellen → Gelijknamige breuken groter dan 1 bij elkaar optellen.'
        : showingSameDenominatorPractice
        ? 'Breuken → Optellen → Gelijknamige breuken kleiner dan 1 bij elkaar optellen.'
        : showingUnequalDenominatorGuidedMixedPractice
        ? 'Breuken → Optellen → Ongelijknamige breuken met een uitkomst groter dan 1 optellen.'
        : showingUnequalIndependentPractice
        ? 'Breuken → Optellen → Ongelijknamige breuken zelfstandig optellen.'
        : showingUnequalDenominatorGuidedPractice
        ? 'Breuken → Optellen → Ongelijknamige breuken kleiner dan 1 bij elkaar optellen.'
        : showingAddition
        ? 'Breuken → Optellen.'
        : showingMixedLikeDenominatorSubtractionPractice
        ? 'Breuken → Aftrekken → Gelijknamige breuken groter dan 1 van elkaar aftrekken.'
        : showingUnlikeMixedDenominatorSubtractionPractice
        ? 'Breuken → Aftrekken → Ongelijknamige breuken groter dan 1 van elkaar aftrekken.'
        : showingUnlikeDenominatorSubtractionPractice
        ? 'Breuken → Aftrekken → Ongelijknamige breuken kleiner dan 1 van elkaar aftrekken.'
        : showingLikeDenominatorSubtractionPractice
        ? 'Breuken → Aftrekken → Gelijknamige breuken kleiner dan 1 van elkaar aftrekken.'
        : showingWholeMinusGreaterThanOneSubtraction
        ? 'Breuken → Aftrekken → ' + FRACTION_QUANTITY_WHOLE_MINUS_GREATER_THAN_ONE_TASK_BANK.title + '.'
        : showingWholeMinusMixedSubtraction
        ? 'Breuken → Aftrekken → ' + FRACTION_SUBTRACTION_EXERCISE.title + '.'
        : showingMultiplication
        ? 'Breuken → Vermenigvuldigen.'
        : showingDivision
        ? 'Breuken → Delen.'
        : showingSubtraction
        ? 'Breuken → Aftrekken.'
        : showingFractions
        ? 'Onderwerpen binnen de breukenleerlijn.'
        : 'Wat leer je, waarom is het belangrijk en wat is je volgende stap?',
      navigation: createPacoNavigation({
        app,
        active: 'skills',
        student,
        viewMode: context?.mode,
        includeManagement: true,
        navigate
      }),
      content
    });

    if (showingUnlikeDenominatorDivisionGuidedPractice) renderUnlikeDenominatorDivisionGuidedPractice();
    else if (showingUnlikeDenominatorDivisionPractice) renderUnlikeDenominatorDivisionPractice();
    else if (showingMixedLikeDenominatorDivisionGuidedPractice) renderMixedLikeDenominatorDivisionGuidedPractice();
    else if (showingMixedLikeDenominatorDivisionPractice) renderMixedLikeDenominatorDivisionPractice();
    else if (showingMixedLikeDenominatorDivisionGuidedPractice) renderMixedLikeDenominatorDivisionGuidedPractice();
    else if (showingLikeDenominatorDivisionGuidedPractice) renderLikeDenominatorDivisionGuidedPractice();
    else if (showingLikeDenominatorDivisionPractice) renderLikeDenominatorDivisionPractice();
    else if (showingWholeNumberDividedByFractionGreaterThanOneGuidedPractice) renderWholeNumberDividedByFractionGreaterThanOneGuidedPractice();
    else if (showingWholeNumberDividedByFractionGreaterThanOnePractice) renderWholeNumberDividedByFractionGreaterThanOnePractice();
    else if (showingWholeNumberTimesMixedFractionGreaterThanOnePractice) renderWholeNumberTimesMixedFractionGreaterThanOnePractice();
    else if (showingWholeNumberTimesProperFractionPractice) renderWholeNumberTimesProperFractionPractice();
    else if (showingUnequalIndependentPractice) renderUnequalIndependentAdditionPractice();
    else if (showingUnequalMixedAdditionPractice) renderUnequalMixedAdditionPractice();
    else if (showingWholeMixedPractice) renderWholeNumberMixedAdditionPractice();
    else if (showingSameDenominatorPractice) renderSameDenominatorAdditionPractice();
    else if (showingMixedSameDenominatorPractice) renderMixedSameDenominatorAdditionPractice();
    else if (showingUnequalDenominatorGuidedMixedPractice) renderUnequalDenominatorGuidedAdditionPractice({ mixedNumberResult: true });
    else if (showingUnequalDenominatorGuidedPractice) renderUnequalDenominatorGuidedAdditionPractice();
    else if (showingAddition) renderFractionAdditionOverview();
    else if (showingUnlikeMixedDenominatorSubtractionPractice) renderUnlikeMixedDenominatorSubtractionPractice();
    else if (showingUnlikeDenominatorSubtractionPractice) renderUnlikeDenominatorSubtractionPractice();
    else if (showingMixedLikeDenominatorSubtractionPractice) renderMixedLikeDenominatorSubtractionPractice();
    else if (showingMixedLikeDenominatorMultiplicationPractice) renderMixedLikeDenominatorMultiplicationPractice();
    else if (showingUnlikeDenominatorMultiplicationPractice) renderUnlikeDenominatorMultiplicationPractice();
    else if (showingMixedUnlikeDenominatorMultiplicationPractice) renderMixedUnlikeDenominatorMultiplicationPractice();
    else if (showingLikeDenominatorMultiplicationPractice) renderLikeDenominatorMultiplicationPractice();
    else if (showingLikeDenominatorSubtractionPractice) renderLikeDenominatorSubtractionPractice();
    else if (showingWholeMinusGreaterThanOneSubtraction) renderWholeMinusGreaterThanOneSubtractionPractice();
    else if (showingWholeMinusMixedSubtraction) renderWholeMinusMixedSubtractionPractice();
    else if (showingMultiplication) renderFractionMultiplicationOverview();
    else if (showingDivision) renderFractionDivisionOverview();
    else if (showingSubtraction) renderFractionSubtractionOverview();
    else if (showingFractions) renderFractionOverview();
    else renderSubjectOverview();
  }

  return Object.freeze({
    mount,
    destroy() {
      if (quantitySubtractionPractice) quantitySubtractionPractice.destroy();
      quantitySubtractionPractice = null;
    },
    content
  });
}
