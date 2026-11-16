import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { getActivePacoGames } from '../../services/game-catalog.js';

function numberInput(documentRef, value, min, max) {
  const input = documentRef.createElement('input');
  input.type = 'number'; input.min = String(min); input.max = String(max); input.step = '1'; input.value = String(value);
  return input;
}

export function createGameAccessRuntime({ app, templateMount, context, documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Game access runtime requires an app.');
  if (!templateMount) throw new TypeError('Game access runtime requires a template mount.');
  if (!context) throw new TypeError('Game access runtime requires a view context.');
  if (typeof navigate !== 'function') throw new TypeError('Game access runtime requires a navigation owner.');

  const student = context.student || '';
  const content = documentRef.createElement('div');
  content.className = 'management-page game-access-page';

  function renderDenied() {
    const section = documentRef.createElement('section'); section.className = 'management-section';
    const heading = documentRef.createElement('div'); heading.className = 'page-heading';
    const title = documentRef.createElement('h2'); title.textContent = 'Spelvrijgave'; heading.appendChild(title);
    const message = documentRef.createElement('p'); message.textContent = 'Alleen de hoofdbeheerder kan spelvrijgave en de voortgangsinstellingen wijzigen.';
    section.append(heading, message); content.replaceChildren(section);
  }

  function render(access) {
    const settings = access[0] || { requiredTests: 10, minimumScore: 9, creditedTests: 0, cycle: 1 };
    const byGame = new Map(access.map(item => [item.gameKey, item]));
    const section = documentRef.createElement('section'); section.className = 'management-section';
    const heading = documentRef.createElement('div'); heading.className = 'page-heading';
    const title = documentRef.createElement('h2'); title.textContent = `Spelvrijgave: ${student}`;
    const subtitle = documentRef.createElement('p'); subtitle.textContent = `${settings.creditedTests} / ${settings.requiredTests} kwalificerende toetsen in cyclus ${settings.cycle}.`;
    heading.append(title, subtitle); section.appendChild(heading);

    const form = documentRef.createElement('form'); form.className = 'challenge-config-form';
    const configGroup = documentRef.createElement('section'); configGroup.className = 'challenge-config-group';
    const configTitle = documentRef.createElement('h3'); configTitle.textContent = 'Voortgangscriteria'; configGroup.appendChild(configTitle);
    const required = numberInput(documentRef, settings.requiredTests, 1, 100);
    const minimum = numberInput(documentRef, settings.minimumScore, 0, 10);
    for (const [label, input] of [['Aantal toetsen', required], ['Minimumcijfer', minimum]]) {
      const field = documentRef.createElement('label'); field.className = 'challenge-config-field';
      const caption = documentRef.createElement('span'); caption.className = 'challenge-config-label'; caption.textContent = label;
      field.append(caption, input); configGroup.appendChild(field);
    }
    const actions = documentRef.createElement('div'); actions.className = 'management-links';
    const save = documentRef.createElement('button'); save.type = 'submit'; save.className = 'management-link'; save.textContent = 'Criteria opslaan';
    const status = documentRef.createElement('span'); status.className = 'challenge-config-status'; actions.append(save, status); configGroup.appendChild(actions);
    form.appendChild(configGroup);

    form.addEventListener('submit', async event => {
      event.preventDefault(); save.disabled = true; status.textContent = 'Opslaan…';
      try { await app.gameAccess.setSettings({ student, requiredTests: required.value, minimumScore: minimum.value }); status.textContent = 'Opgeslagen.'; }
      catch (error) { status.textContent = error?.message || 'Opslaan mislukt.'; }
      finally { save.disabled = false; }
    });

    const games = documentRef.createElement('section'); games.className = 'challenge-config-group';
    const gamesTitle = documentRef.createElement('h3'); gamesTitle.textContent = 'Spellen'; games.appendChild(gamesTitle);
    getActivePacoGames().forEach(game => {
      const state = byGame.get(game.id);
      const row = documentRef.createElement('div'); row.className = 'management-action';
      const text = documentRef.createElement('div');
      const name = documentRef.createElement('strong'); name.textContent = game.label;
      const detail = documentRef.createElement('span'); detail.textContent = game.id === 'double-or-nothing' ? 'Altijd beschikbaar voor de leerling.' : state?.unlocked === true ? 'Ontgrendeld.' : 'Vergrendeld.';
      text.append(name, detail);
      const toggle = documentRef.createElement('button'); toggle.type = 'button'; toggle.className = 'management-link'; toggle.textContent = game.id === 'double-or-nothing' ? 'Altijd open' : (state?.unlocked ? 'Vergrendelen' : 'Ontgrendelen'); toggle.disabled = game.id === 'double-or-nothing';
      toggle.addEventListener('click', async () => {
        toggle.disabled = true;
        try { render(await app.gameAccess.setGameAccess({ student, gameKey: game.id, unlocked: !state?.unlocked })); }
        catch (error) { detail.textContent = error?.message || 'Wijzigen mislukt.'; toggle.disabled = false; }
      });
      row.append(text, toggle); games.appendChild(row);
    });
    form.appendChild(games); section.appendChild(form); content.replaceChildren(section);
  }

  async function mount() {
    const session = await app.initializeSession();
    if (!session) { window.location.href = 'auth.html'; return; }
    if (!app.auth.isMainAdministrator) { renderDenied(); return; }
    mountPacoPageTemplate({ mount: templateMount, greeting: 'PAB beheer ⚙️', title: 'Spelvrijgave', icon: '🎮', subtitle: student ? `Centrale spelprogressie voor ${student}.` : 'Beheer spelprogressie centraal.', navigation: createPacoNavigation({ app, active: 'dashboard', student, viewMode: 'management', includeManagementTools: true, includeCreator: false, navigate }), content });
    if (!student) { content.innerHTML = '<section class="management-section"><div class="page-heading"><h2>Spelvrijgave</h2><p>Kies eerst een leerling in de LB.</p></div></section>'; return; }
    try { render(await app.gameAccess.getAccess(student)); }
    catch (error) { content.innerHTML = `<section class="management-section"><p class="management-state">${error?.message || 'Spelvrijgave kon niet worden geladen.'}</p></section>`; }
  }

  return Object.freeze({ mount, content });
}
