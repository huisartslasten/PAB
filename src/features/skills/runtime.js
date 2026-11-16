import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { createPacoTile, createPacoTileGrid } from '../../components/paco-tile.js';
import { createPacoBoneDifficulty } from '../../components/design-system.js';
import { createFractionPracticeTemplate } from '../../../pacogo-engine/fraction-practice-template.js';
import { renderFractionAnswerInput } from '../../../pacogo-engine/fraction-answer-input.js';
import { renderFractionRepresentation, renderMixedNumber, renderFractionInputRepresentation } from '../../../pacogo-engine/fraction-learning-interface-renderers.js';
import { FRACTION_ADDITION_LEVEL_3_TASKS } from '../../../pacogo-engine/fraction-addition-level-3-task-bank.js';
import { FRACTION_ADDITION_LEVEL_3B_TASKS } from '../../../pacogo-engine/fraction-addition-level-3b-task-bank.js';
import { createFractionAdditionPracticeSession } from '../../../pacogo-engine/fraction-addition-practice-session.js';
import { FRACTION_WHOLE_MIXED_ADDITION_EXERCISE, createFractionWholeMixedAdditionSession } from '../../../pacogo-engine/fraction-whole-mixed-addition-session.js';
import { FRACTION_SAME_DENOMINATOR_ADDITION_EXERCISE, createFractionSameDenominatorAdditionSession } from '../../../pacogo-engine/fraction-same-denominator-addition-session.js';
import { FRACTION_MIXED_SAME_DENOMINATOR_ADDITION_EXERCISE, createFractionMixedSameDenominatorAdditionSession } from '../../../pacogo-engine/fraction-mixed-same-denominator-addition-session.js';
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
      const isAddition = topicItem.id === 'optellen';
      grid.appendChild(createPacoTile({
        documentRef,
        title: topicItem.label,
        icon: topicItem.icon,
        meta: 'Onderdeel van de breukenleerlijn',
        className: 'skills-navigation-tile skills-navigation-tile--topic',
        ...(isAddition ? {
          actionLabel: 'Openen →',
          onActivate: () => navigate(buildViewUrl('skills.html', {
            student,
            mode: context?.mode,
            extra: { domain: FRACTION_DOMAIN, topic: 'optellen' }
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
      { label: 'Ongelijknamige breuken groter dan 1 bij elkaar optellen', level: 5 }
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
      if (index === 0 || index === 1 || index === 3 || index === 4 || index === 5) {
        const open = documentRef.createElement('button');
        open.type = 'button';
        open.className = 'paco-btn paco-btn--primary paco-btn--small skills-addition-overview-open';
        if (index === 0) open.classList.add('skills-addition-overview-open-whole-mixed');
        else if (index === 1) open.classList.add('skills-addition-overview-open-same-denominator');
        else if (index === 4) open.classList.add('skills-addition-overview-open-unequal-denominator-guided');
        else if (index === 5) open.classList.add('skills-addition-overview-open-unequal-denominator-guided-mixed');
        else open.classList.add('skills-addition-overview-open-same-denominator-mixed');
        open.textContent = 'Oefenen';
        const exerciseId = item.exercise || (index === 0 ? 'whole-number-mixed-addition' : index === 1 ? 'same-denominator-addition' : index === 3 ? 'mixed-same-denominator-addition' : 'unequal-denominator-guided-addition');
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
      const grid=documentRef.createElement('div');grid.className='fraction-guided-step-grid'+(mixedNumberResult?' fraction-guided-step-grid--five':'');grid.setAttribute('aria-label',mixedNumberResult?'Vijf denkstappen':'Vier denkstappen');let activeInput=null;let activeFractionAnswer=null;
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
          item.append(help,expression,check);
        }else{const status=documentRef.createElement('p');status.className='fraction-guided-step-status';status.textContent='Komt hierna';item.append(status);}
        grid.append(item);
      });
      template.workArea.append(grid);if(feedbackMessage){const feedback=documentRef.createElement('p');feedback.className='fraction-practice-feedback is-correct';feedback.setAttribute('role','status');feedback.textContent=feedbackMessage;template.feedbackArea.append(feedback);}if(completedTask){const next=documentRef.createElement('button');next.type='button';next.className='paco-btn paco-btn--primary paco-btn--small';next.textContent=progress.isComplete?'Afronden':'Volgende';next.addEventListener('click',()=>renderCurrentTask());template.actionsArea.replaceChildren(next);}content.append(card);activeInput?.focus();
    }
    renderCurrentTask();
  }

  async function mount() {
    const showingFractions = domain === FRACTION_DOMAIN;
    const showingAddition = showingFractions && topic === 'optellen';
    const showingWholeMixedPractice = showingAddition && exercise === 'whole-number-mixed-addition';
    const showingSameDenominatorPractice = showingAddition && exercise === 'same-denominator-addition';
    const showingMixedSameDenominatorPractice = showingAddition && exercise === 'mixed-same-denominator-addition';
    const showingUnequalDenominatorGuidedPractice = showingAddition && exercise === 'unequal-denominator-guided-addition';
    const showingUnequalDenominatorGuidedMixedPractice = showingAddition && exercise === 'unequal-denominator-guided-mixed-addition';
    const showingPractice = showingWholeMixedPractice || showingSameDenominatorPractice || showingMixedSameDenominatorPractice || showingUnequalDenominatorGuidedPractice || showingUnequalDenominatorGuidedMixedPractice;
    mountPacoPageTemplate({
      mount: templateMount,
      greeting: student ? `Hoi ${student}! 🐶` : 'Welkom bij PacoGO!',
      title: showingPractice ? 'Oefenen' : showingAddition ? 'Optellen' : showingFractions ? 'Breuken' : 'Skills',
      icon: showingAddition ? '➕' : showingFractions ? '½' : '📘',
      subtitle: showingWholeMixedPractice
        ? 'Breuken → Optellen → Heel getal optellen bij een breukgetal groter dan 1.'
        : showingMixedSameDenominatorPractice
        ? 'Breuken → Optellen → Gelijknamige breuken groter dan 1 bij elkaar optellen.'
        : showingSameDenominatorPractice
        ? 'Breuken → Optellen → Gelijknamige breuken kleiner dan 1 bij elkaar optellen.'
        : showingUnequalDenominatorGuidedMixedPractice
        ? 'Breuken → Optellen → Ongelijknamige breuken met een uitkomst groter dan 1 optellen.'
        : showingUnequalDenominatorGuidedPractice
        ? 'Breuken → Optellen → Ongelijknamige breuken kleiner dan 1 bij elkaar optellen.'
        : showingAddition
        ? 'Breuken → Optellen.'
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

    if (showingWholeMixedPractice) renderWholeNumberMixedAdditionPractice();
    else if (showingSameDenominatorPractice) renderSameDenominatorAdditionPractice();
    else if (showingMixedSameDenominatorPractice) renderMixedSameDenominatorAdditionPractice();
    else if (showingUnequalDenominatorGuidedMixedPractice) renderUnequalDenominatorGuidedAdditionPractice({ mixedNumberResult: true });
    else if (showingUnequalDenominatorGuidedPractice) renderUnequalDenominatorGuidedAdditionPractice();
    else if (showingAddition) renderFractionAdditionOverview();
    else if (showingFractions) renderFractionOverview();
    else renderSubjectOverview();
  }

  return Object.freeze({ mount, destroy() {}, content });
}
