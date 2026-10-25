import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';

function numberValue(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function setNestedValue(target, key, value) {
  return { ...target, [key]: value };
}

function createField(documentRef, label, input) {
  const field = documentRef.createElement('label');
  field.className = 'challenge-config-field';
  const caption = documentRef.createElement('span');
  caption.className = 'challenge-config-label';
  caption.textContent = label;
  field.append(caption, input);
  return field;
}

function createCheckbox(documentRef, label, checked) {
  const input = documentRef.createElement('input');
  input.type = 'checkbox';
  input.checked = Boolean(checked);
  return createField(documentRef, label, input);
}

function createNumberInput(documentRef, value, min = 0, max = 100) {
  const input = documentRef.createElement('input');
  input.type = 'number';
  input.min = String(min);
  input.max = String(max);
  input.step = '1';
  input.value = String(value ?? '');
  return input;
}

export function createChallengeConfigurationRuntime({ app, templateMount, documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Challenge configuration runtime requires an app.');
  if (!templateMount) throw new TypeError('Challenge configuration runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Challenge configuration runtime requires a navigation owner.');

  const content = documentRef.createElement('div');
  content.className = 'management-page challenge-config-page';
  const state = documentRef.createElement('div');
  state.className = 'management-state';
  state.textContent = 'Challenge-instellingen laden…';
  content.appendChild(state);

  function renderDenied() {
    const section = documentRef.createElement('section');
    section.className = 'management-section';
    const heading = documentRef.createElement('div');
    heading.className = 'page-heading';
    const title = documentRef.createElement('h2');
    title.textContent = 'Challenge-instellingen';
    heading.appendChild(title);
    const message = documentRef.createElement('p');
    message.textContent = 'Alleen de hoofdbeheerder kan Challenge-instellingen wijzigen.';
    section.append(heading, message);
    content.replaceChildren(section);
  }

  function renderConfiguration(configuration) {
    const unlock = { ...(configuration.unlock || {}) };
    const ai = { ...(configuration.ai || {}) };
    const distractors = { ...(ai.distractors || {}) };
    const game = { ...(configuration.game || {}) };
    const lifelines = { ...(game.lifelines || {}) };

    const section = documentRef.createElement('section');
    section.className = 'management-section';
    const heading = documentRef.createElement('div');
    heading.className = 'page-heading';
    const title = documentRef.createElement('h2');
    title.textContent = `Challenge: ${configuration.challengeKey}`;
    heading.appendChild(title);
    section.appendChild(heading);

    const form = documentRef.createElement('form');
    form.className = 'challenge-config-form';

    const general = documentRef.createElement('section');
    general.className = 'challenge-config-group';
    const generalTitle = documentRef.createElement('h3');
    generalTitle.textContent = 'Algemeen';
    const enabled = createCheckbox(documentRef, 'Challenge actief', configuration.enabled);
    general.append(generalTitle, enabled);

    const unlockGroup = documentRef.createElement('section');
    unlockGroup.className = 'challenge-config-group';
    const unlockTitle = documentRef.createElement('h3');
    unlockTitle.textContent = 'Vrijspelen';
    const unlockType = documentRef.createElement('input');
    unlockType.type = 'text';
    unlockType.value = String(unlock.type || '');
    unlockType.readOnly = true;
    const minimumScore = createNumberInput(documentRef, unlock.minimumScore ?? 10, 0, 10);
    unlockGroup.append(
      unlockTitle,
      createField(documentRef, 'Beleid', unlockType),
      createField(documentRef, 'Minimumscore', minimumScore)
    );

    const aiGroup = documentRef.createElement('section');
    aiGroup.className = 'challenge-config-group';
    const aiTitle = documentRef.createElement('h3');
    aiTitle.textContent = 'AI';
    const aiEnabled = createCheckbox(documentRef, 'AI gebruiken', ai.enabled);
    const distractorsEnabled = createCheckbox(documentRef, 'AI-afleiders gebruiken', distractors.enabled);
    const distractorCount = createNumberInput(documentRef, distractors.count ?? 3, 1, 8);
    aiGroup.append(
      aiTitle,
      aiEnabled,
      distractorsEnabled,
      createField(documentRef, 'Aantal afleiders', distractorCount)
    );

    const gameGroup = documentRef.createElement('section');
    gameGroup.className = 'challenge-config-group';
    const gameTitle = documentRef.createElement('h3');
    gameTitle.textContent = 'Spel';
    const questionCount = createNumberInput(documentRef, game.questionCount ?? 11, 1, 100);
    gameGroup.append(
      gameTitle,
      createField(documentRef, 'Aantal vragen', questionCount),
      createCheckbox(documentRef, '50/50', lifelines.fiftyFifty),
      createCheckbox(documentRef, 'Vraag iemand', lifelines.askSomeone),
      createCheckbox(documentRef, 'Publiek', lifelines.askAudience)
    );

    const actions = documentRef.createElement('div');
    actions.className = 'management-links';
    const save = documentRef.createElement('button');
    save.type = 'submit';
    save.className = 'management-link';
    save.textContent = 'Instellingen opslaan';
    const status = documentRef.createElement('span');
    status.className = 'challenge-config-status';
    actions.append(save, status);

    form.append(general, unlockGroup, aiGroup, gameGroup, actions);
    form.addEventListener('submit', async event => {
      event.preventDefault();
      save.disabled = true;
      status.textContent = 'Opslaan…';
      try {
        const nextAi = setNestedValue(ai, 'enabled', aiEnabled.querySelector('input')?.checked ?? false);
        const nextDistractors = {
          ...distractors,
          enabled: distractorsEnabled.querySelector('input')?.checked ?? false,
          count: numberValue(distractorCount.value, distractors.count ?? 3)
        };
        const nextGame = {
          ...game,
          questionCount: numberValue(questionCount.value, game.questionCount ?? 11),
          lifelines: {
            ...lifelines,
            fiftyFifty: gameGroup.querySelectorAll('input[type="checkbox"]')[0]?.checked ?? false,
            askSomeone: gameGroup.querySelectorAll('input[type="checkbox"]')[1]?.checked ?? false,
            askAudience: gameGroup.querySelectorAll('input[type="checkbox"]')[2]?.checked ?? false
          }
        };
        await app.challengeConfiguration.save(configuration.challengeKey, {
          enabled: enabled.querySelector('input')?.checked ?? false,
          unlock: { ...unlock, minimumScore: numberValue(minimumScore.value, unlock.minimumScore ?? 10) },
          ai: { ...nextAi, distractors: nextDistractors },
          game: nextGame
        });
        status.textContent = 'Opgeslagen.';
      } catch (error) {
        console.error('Challenge configuration save error:', error);
        status.textContent = error?.message || 'Opslaan mislukt.';
      } finally {
        save.disabled = false;
      }
    });

    section.appendChild(form);
    content.replaceChildren(section);
  }

  async function mount() {
    const session = await app.initializeSession();
    if (!session) { window.location.href = 'auth.html'; return; }
    if (!app.auth.isMainAdministrator) { renderDenied(); return; }

    mountPacoPageTemplate({
      mount: templateMount,
      greeting: 'PAB beheer ⚙️',
      title: 'Challenge-instellingen',
      icon: '⚙️',
      subtitle: 'Beheer de centrale instellingen van Challenges.',
      navigation: createPacoNavigation({ app, active: 'dashboard', student: '', viewMode: 'management', includeManagementTools: false, includeCreator: false, navigate }),
      content
    });

    try {
      const configurations = await app.challengeConfiguration.list();
      if (!configurations.length) {
        state.textContent = 'Er zijn nog geen Challenge-configuraties beschikbaar.';
        return;
      }
      renderConfiguration(configurations[0]);
    } catch (error) {
      console.error('Challenge configuration load error:', error);
      state.textContent = 'Challenge-instellingen konden niet worden geladen.';
    }
  }

  return Object.freeze({ mount, content });
}
