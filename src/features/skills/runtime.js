import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { createPacoTile, createPacoTileGrid } from '../../components/paco-tile.js';
import { createPacoBoneDifficulty } from '../../components/design-system.js';
import { createFractionPracticeTemplate } from '../../../pacogo-engine/fraction-practice-template.js';
import { renderFractionAnswerInput } from '../../../pacogo-engine/fraction-answer-input.js';
import { renderFractionRepresentation, renderMixedNumber } from '../../../pacogo-engine/fraction-learning-interface-renderers.js';
import { FRACTION_WHOLE_MIXED_ADDITION_EXERCISE, createFractionWholeMixedAdditionSession } from '../../../pacogo-engine/fraction-whole-mixed-addition-session.js';
import { FRACTION_SAME_DENOMINATOR_ADDITION_EXERCISE, createFractionSameDenominatorAdditionSession } from '../../../pacogo-engine/fraction-same-denominator-addition-session.js';
import { FRACTION_MIXED_SAME_DENOMINATOR_ADDITION_EXERCISE, createFractionMixedSameDenominatorAdditionSession } from '../../../pacogo-engine/fraction-mixed-same-denominator-addition-session.js';
import { buildViewUrl } from '../../core/view-context.js';
import { MATH_SKILL_SUBJECTS, FRACTION_NAVIGATION_TOPICS } from './skills-navigation-catalog.js';

const FRACTION_DOMAIN = 'fractions';

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
      { label: 'Ongelijknamige breuken kleiner dan 1 bij elkaar optellen', level: 4 },
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
      if (index === 0 || index === 1 || index === 3) {
        const open = documentRef.createElement('button');
        open.type = 'button';
        open.className = 'paco-btn paco-btn--primary paco-btn--small skills-addition-overview-open';
        if (index === 0) open.classList.add('skills-addition-overview-open-whole-mixed');
        else open.classList.add('skills-addition-overview-open-same-denominator');
        open.textContent = 'Oefenen';
        const exerciseId = index === 0 ? 'whole-number-mixed-addition' : index === 1 ? 'same-denominator-addition' : 'mixed-same-denominator-addition';
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
      progressLabel.textContent = 'Som ' + (progress.completedCount + 1) + ' van ' + progress.totalCount + ' · Niveau ' + exercise.difficultyLevel + ' van ' + exercise.maxDifficultyLevel;
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
          progressLabel.textContent = 'Som ' + result.progress.completedCount + ' van ' + result.progress.totalCount + ' · Niveau ' + exercise.difficultyLevel + ' van ' + exercise.maxDifficultyLevel;
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
      progressLabel.textContent = 'Som ' + (progress.completedCount + 1) + ' van ' + progress.totalCount + ' · Niveau ' + exercise.difficultyLevel + ' van ' + exercise.maxDifficultyLevel;
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
          progressLabel.textContent = 'Som ' + result.progress.completedCount + ' van ' + result.progress.totalCount + ' · Niveau ' + exercise.difficultyLevel + ' van ' + exercise.maxDifficultyLevel;
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
      progressLabel.textContent = 'Som ' + (progress.completedCount + 1) + ' van ' + progress.totalCount + ' · Niveau ' + exercise.difficultyLevel + ' van ' + exercise.maxDifficultyLevel;
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
          progressLabel.textContent = 'Som ' + result.progress.completedCount + ' van ' + result.progress.totalCount + ' · Niveau ' + exercise.difficultyLevel + ' van ' + exercise.maxDifficultyLevel;
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

  async function mount() {
    const showingFractions = domain === FRACTION_DOMAIN;
    const showingAddition = showingFractions && topic === 'optellen';
    const showingWholeMixedPractice = showingAddition && exercise === 'whole-number-mixed-addition';
    const showingSameDenominatorPractice = showingAddition && exercise === 'same-denominator-addition';
    const showingMixedSameDenominatorPractice = showingAddition && exercise === 'mixed-same-denominator-addition';
    const showingPractice = showingWholeMixedPractice || showingSameDenominatorPractice || showingMixedSameDenominatorPractice;
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
    else if (showingAddition) renderFractionAdditionOverview();
    else if (showingFractions) renderFractionOverview();
    else renderSubjectOverview();
  }

  return Object.freeze({ mount, destroy() {}, content });
}
