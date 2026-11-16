import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';

export function createCreatorRuntime({ app, templateMount, documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Creator runtime requires an app.');
  if (!templateMount) throw new TypeError('Creator runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Creator runtime requires a navigation owner.');

  const content = documentRef.createElement('div');
  content.className = 'creator-page';
  const status = documentRef.createElement('div');

  const goManagement = () => navigate('management.html');
  const showStatus = (text, error = false) => {
    status.className = error ? 'creator-error' : 'creator-success';
    status.textContent = text;
    documentRef.defaultView?.clearTimeout?.(showStatus.timer);
    showStatus.timer = documentRef.defaultView?.setTimeout?.(() => status.replaceChildren(), 3500);
  };
  const empty = text => {
    const el = documentRef.createElement('div');
    el.className = 'creator-empty';
    el.textContent = text;
    return el;
  };
  const labels = { problem:'🐛 Probleem', improvement:'🔧 Verbetering', idea:'💡 Idee', ai_rule:'🤖 AI-afspraak', other:'❓ Anders' };

  const rulesSection = documentRef.createElement('section');
  rulesSection.className = 'creator-section';
  const rulesTitle = documentRef.createElement('h2'); rulesTitle.textContent = '🤖 AI-afspraken';
  const rulesForm = documentRef.createElement('form'); rulesForm.className = 'creator-form';
  const ruleInput = documentRef.createElement('input'); ruleInput.type = 'text'; ruleInput.placeholder = 'Nieuwe extra AI-afspraak'; ruleInput.autocomplete = 'off';
  const ruleActions = documentRef.createElement('div'); ruleActions.className = 'creator-actions';
  const ruleSubmit = documentRef.createElement('button'); ruleSubmit.type = 'submit'; ruleSubmit.textContent = 'AI-afspraak toevoegen'; ruleActions.append(ruleSubmit);
  rulesForm.append(ruleInput, ruleActions);
  const rulesList = documentRef.createElement('div'); rulesList.className = 'creator-page';
  rulesSection.append(rulesTitle, rulesForm, rulesList);

  const notesSection = documentRef.createElement('section'); notesSection.className = 'creator-section';
  const notesTitle = documentRef.createElement('h2'); notesTitle.textContent = '📝 Ontwikkelnotities';
  const noteForm = documentRef.createElement('form'); noteForm.className = 'creator-form';
  const noteType = documentRef.createElement('select');
  [['problem','🐛 Probleem'],['improvement','🔧 Verbetering'],['idea','💡 Idee'],['ai_rule','🤖 AI-afspraak'],['other','❓ Anders']].forEach(([value,label]) => { const option = documentRef.createElement('option'); option.value = value; option.textContent = label; noteType.append(option); });
  const noteTitle = documentRef.createElement('input'); noteTitle.type = 'text'; noteTitle.placeholder = 'Onderwerp';
  const noteBody = documentRef.createElement('textarea'); noteBody.placeholder = 'Notitie';
  const noteActions = documentRef.createElement('div'); noteActions.className = 'creator-actions';
  const noteSubmit = documentRef.createElement('button'); noteSubmit.type = 'submit'; noteSubmit.textContent = 'Notitie opslaan'; noteActions.append(noteSubmit);
  noteForm.append(noteType, noteTitle, noteBody, noteActions);
  const notesList = documentRef.createElement('div'); notesList.className = 'creator-page';
  notesSection.append(notesTitle, noteForm, notesList);
  content.append(status, rulesSection, notesSection);

  async function renderRules() {
    rulesList.replaceChildren();
    try {
      const rules = await app.creator.listAiRules();
      if (!rules.length) { rulesList.append(empty('Nog geen extra AI-afspraken. De vaste AI-regel werkt altijd.')); return; }
      rules.forEach(rule => {
        const row = documentRef.createElement('div'); row.className = 'creator-rule';
        const checkbox = documentRef.createElement('input'); checkbox.type = 'checkbox'; checkbox.checked = Boolean(rule.enabled);
        checkbox.addEventListener('change', async () => {
          checkbox.disabled = true;
          try { await app.creator.setAiRuleEnabled(rule.id, checkbox.checked); showStatus('AI-afspraak aangepast.'); }
          catch (error) { checkbox.checked = !checkbox.checked; showStatus(error?.message || 'AI-afspraak kon niet worden aangepast.', true); }
          finally { checkbox.disabled = false; }
        });
        const label = documentRef.createElement('label'); label.textContent = rule.rule_text;
        const remove = documentRef.createElement('button'); remove.type = 'button'; remove.textContent = '🗑️'; remove.title = 'Verwijderen';
        remove.addEventListener('click', async () => {
          if (!documentRef.defaultView?.confirm?.('Deze extra AI-afspraak verwijderen?')) return;
          remove.disabled = true;
          try { await app.creator.deleteAiRule(rule.id); await renderRules(); showStatus('AI-afspraak verwijderd.'); }
          catch (error) { remove.disabled = false; showStatus(error?.message || 'AI-afspraak kon niet worden verwijderd.', true); }
        });
        row.append(checkbox, label, remove); rulesList.append(row);
      });
    } catch (error) { rulesList.append(empty(error?.message || 'AI-afspraken konden niet worden geladen.')); }
  }

  async function renderNotes() {
    notesList.replaceChildren();
    try {
      const notes = await app.creator.listNotes();
      if (!notes.length) { notesList.append(empty('Nog geen ontwikkelnotities.')); return; }
      notes.forEach(note => {
        const card = documentRef.createElement('article'); card.className = 'creator-note';
        const head = documentRef.createElement('div'); head.className = 'creator-note-head';
        const meta = documentRef.createElement('div');
        const type = documentRef.createElement('span'); type.className = `creator-chip${note.status === 'done' ? ' done' : ''}`; type.textContent = labels[note.note_type] || note.note_type;
        const date = documentRef.createElement('div'); date.className = 'creator-note-meta'; date.textContent = note.created_at ? new Intl.DateTimeFormat('nl-NL',{dateStyle:'medium',timeStyle:'short'}).format(new Date(note.created_at)) : 'Onbekende datum';
        meta.append(type, date);
        const state = documentRef.createElement('span'); state.className = `creator-chip${note.status === 'done' ? ' done' : ''}`; state.textContent = note.status === 'done' ? '✅ Klaar' : '🟡 Open';
        head.append(meta, state);
        const title = documentRef.createElement('h3'); title.textContent = note.title;
        const body = documentRef.createElement('div'); body.className = 'creator-note-body'; body.textContent = note.body;
        const actions = documentRef.createElement('div'); actions.className = 'creator-actions';
        const toggle = documentRef.createElement('button'); toggle.type = 'button'; toggle.textContent = note.status === 'done' ? '↩️ Heropenen' : '✅ Markeer als klaar';
        toggle.addEventListener('click', async () => { toggle.disabled = true; try { await app.creator.toggleNoteStatus(note.id); await renderNotes(); showStatus('Notitie aangepast.'); } catch (error) { toggle.disabled = false; showStatus(error?.message || 'Notitie kon niet worden aangepast.', true); } });
        const remove = documentRef.createElement('button'); remove.type = 'button'; remove.textContent = '🗑️ Verwijderen';
        remove.addEventListener('click', async () => { if (!documentRef.defaultView?.confirm?.('Deze ontwikkelnotitie verwijderen?')) return; remove.disabled = true; try { await app.creator.deleteNote(note.id); await renderNotes(); showStatus('Ontwikkelnotitie verwijderd.'); } catch (error) { remove.disabled = false; showStatus(error?.message || 'Notitie kon niet worden verwijderd.', true); } });
        actions.append(toggle, remove);
        card.append(head, title, body, actions); notesList.append(card);
      });
    } catch (error) { notesList.append(empty(error?.message || 'Ontwikkelnotities konden niet worden geladen.')); }
  }

  async function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Beheer',
      backAction: goManagement,
      greeting: 'PacoGO Creator 🧠',
      title: 'Creator Console',
      icon: '🧠',
      subtitle: 'Beheer extra AI-afspraken en ontwikkelnotities.',
      navigation: createPacoNavigation({ app, active: 'creator', includeManagementDashboard: true, includeManagement: true, includeManagementTools: true, includeCreator: true, navigate }),
      content
    });
    try {
      await app.initializeSession();
      if (!app.auth.isCreator) throw new Error('Alleen de hoofdbeheerder heeft toegang tot de Creator Console.');
      await Promise.all([renderRules(), renderNotes()]);
    } catch (error) {
      content.replaceChildren(empty(error?.message || 'Creator Console kon niet worden geladen.'));
    }
  }

  return Object.freeze({ mount, content });
}
