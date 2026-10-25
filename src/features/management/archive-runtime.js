import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { confirmPacoAction } from '../../components/confirm-dialog.js';
import { renderRecovery, renderLearningTopicRecovery } from './management-view.js';

export function createArchiveRuntime({
  app,
  templateMount,
  context,
  documentRef = document,
  navigate
} = {}) {
  if (!app) throw new TypeError('Archive runtime requires app.');
  if (!templateMount) throw new TypeError('Archive runtime requires template mount.');
  if (!context) throw new TypeError('Archive runtime requires a view context.');
  if (typeof navigate !== 'function') throw new TypeError('Archive runtime requires a navigation owner.');

  const content = documentRef.createElement('div');
  content.className = 'management-page';

  const state = documentRef.createElement('div');
  state.className = 'management-state';
  state.textContent = 'Archief laden…';
  content.appendChild(state);

  const notice = documentRef.createElement('div');
  notice.className = 'management-state';
  notice.hidden = true;

  const archive = documentRef.createElement('section');
  archive.className = 'management-section';
  const archiveHeading = documentRef.createElement('h2');
  archiveHeading.textContent = 'Archief';
  const archiveList = documentRef.createElement('div');
  archive.append(archiveHeading, archiveList);

  const trash = documentRef.createElement('section');
  trash.className = 'management-section';
  const trashHeading = documentRef.createElement('h2');
  trashHeading.textContent = 'Prullenbak';
  const trashList = documentRef.createElement('div');
  trash.append(trashHeading, trashList);

  const learningArchive = documentRef.createElement('section');
  learningArchive.className = 'management-section';
  const learningArchiveHeading = documentRef.createElement('h2');
  learningArchiveHeading.textContent = 'Leerstof — Archief';
  const learningArchiveList = documentRef.createElement('div');
  learningArchive.append(learningArchiveHeading, learningArchiveList);

  const learningTrash = documentRef.createElement('section');
  learningTrash.className = 'management-section';
  const learningTrashHeading = documentRef.createElement('h2');
  learningTrashHeading.textContent = 'Leerstof — Prullenbak';
  const learningTrashList = documentRef.createElement('div');
  learningTrash.append(learningTrashHeading, learningTrashList);

  const skillArchive = documentRef.createElement('section');
  skillArchive.className = 'management-section';
  const skillArchiveHeading = documentRef.createElement('h2');
  skillArchiveHeading.textContent = 'Skills — Archief';
  const skillArchiveList = documentRef.createElement('div');
  skillArchive.append(skillArchiveHeading, skillArchiveList);

  const skillTrash = documentRef.createElement('section');
  skillTrash.className = 'management-section';
  const skillTrashHeading = documentRef.createElement('h2');
  skillTrashHeading.textContent = 'Skills — Prullenbak';
  const skillTrashList = documentRef.createElement('div');
  skillTrash.append(skillTrashHeading, skillTrashList);

  const management = app.management;

  function showNotice(message) {
    notice.textContent = message;
    notice.hidden = false;
  }

  async function handleRecoveryError(error) {
    console.error('Recovery action error:', error);
    showNotice(error?.message || 'De actie kon niet worden uitgevoerd.');
  }

  async function handleRestore(lesson) {
    showNotice(`“${lesson.title}” is hersteld en staat weer bij de actieve lessen van ${lesson.student}.`);
    await refreshRecovery();
  }

  async function permanentlyDeleteLesson(lesson) {
    const confirmed = await confirmPacoAction({ title: 'Les definitief verwijderen?', message: `“${lesson.title}” wordt definitief verwijderd. De bijbehorende toetsgeschiedenis wordt ook verwijderd. Dit kan niet ongedaan worden gemaakt.`, confirmLabel: 'Definitief verwijderen', cancelLabel: 'Annuleren' });
    if (!confirmed) return;
    await management.permanentlyDeleteRecoveryLesson(lesson.id);
    showNotice(`“${lesson.title}” is definitief verwijderd.`);
    await refreshRecovery();
  }

  async function emptyTrash() {
    const confirmed = await confirmPacoAction({ title: 'Prullenbak definitief leegmaken?', message: 'Alle lessen in de prullenbak worden definitief verwijderd. De bijbehorende toetsgeschiedenis wordt ook verwijderd. Dit kan niet ongedaan worden gemaakt.', confirmLabel: 'Definitief verwijderen', cancelLabel: 'Annuleren' });
    if (!confirmed) return;
    await management.emptyTrash();
    showNotice('De prullenbak is leeggemaakt.');
    await refreshRecovery();
  }

  async function handleLearningRestore(topic) {
    showNotice(`“${topic.subject}” is hersteld en staat weer bij de actieve leerstof van ${topic.student}.`);
    await refreshRecovery();
  }

  async function permanentlyDeleteLearningTopic(topic) {
    const confirmed = await confirmPacoAction({ title: 'Leerstof definitief verwijderen?', message: `“${topic.subject}${topic.subvak ? ` · ${topic.subvak}` : ''}” wordt definitief verwijderd, inclusief de onderliggende leerstofkaarten. Dit kan niet ongedaan worden gemaakt.`, confirmLabel: 'Definitief verwijderen', cancelLabel: 'Annuleren' });
    if (!confirmed) return;
    await management.permanentlyDeleteLearningTopic(topic.id);
    showNotice(`“${topic.subject}” is definitief verwijderd.`);
    await refreshRecovery();
  }

  async function emptyLearningTrash() {
    const confirmed = await confirmPacoAction({ title: 'Leerstof-prullenbak definitief leegmaken?', message: 'Alle leerstofonderwerpen in de prullenbak worden definitief verwijderd, inclusief de onderliggende leerstofkaarten. Dit kan niet ongedaan worden gemaakt.', confirmLabel: 'Definitief verwijderen', cancelLabel: 'Annuleren' });
    if (!confirmed) return;
    await management.emptyLearningTopicTrash();
    showNotice('De leerstof-prullenbak is leeggemaakt.');
    await refreshRecovery();
  }

  function renderSkillRecovery(list, skills, kind) {
    list.replaceChildren();
    if (!skills.length) {
      const empty = documentRef.createElement('div');
      empty.className = 'management-state';
      empty.textContent = kind === 'archive' ? 'Geen Skills in het archief.' : 'Geen Skills in de prullenbak.';
      list.appendChild(empty);
      return;
    }
    skills.forEach(skill => {
      const row = documentRef.createElement('div');
      row.className = 'management-recovery-lesson';
      const title = documentRef.createElement('h3');
      title.textContent = skill.title;
      const meta = documentRef.createElement('p');
      meta.textContent = `${skill.category || 'Overig'}${skill.description ? ` · ${skill.description}` : ''}`;
      const actions = documentRef.createElement('div');
      actions.className = 'management-links';
      const restore = documentRef.createElement('button');
      restore.type = 'button';
      restore.className = 'management-link';
      restore.textContent = 'Herstellen';
      restore.addEventListener('click', async () => {
        try {
          if (kind === 'archive') await app.skillDefinitions.restoreFromArchive(skill.id);
          else await app.skillDefinitions.restoreFromTrash(skill.id);
          showNotice(`“${skill.title}” is hersteld.`);
          await refreshRecovery();
        } catch (error) { await handleRecoveryError(error); }
      });
      actions.appendChild(restore);
      if (kind === 'trash') {
        const remove = documentRef.createElement('button');
        remove.type = 'button';
        remove.className = 'management-link danger';
        remove.textContent = 'Definitief verwijderen';
        remove.addEventListener('click', async () => {
          const confirmed = await confirmPacoAction({ title: 'Skill definitief verwijderen?', message: `“${skill.title}” wordt definitief verwijderd. Dit kan niet ongedaan worden gemaakt.`, confirmLabel: 'Definitief verwijderen', cancelLabel: 'Annuleren' });
          if (!confirmed) return;
          try {
            await app.skillDefinitions.permanentlyDelete(skill.id);
            showNotice(`“${skill.title}” is definitief verwijderd.`);
            await refreshRecovery();
          } catch (error) { await handleRecoveryError(error); }
        });
        actions.appendChild(remove);
      }
      row.append(title, meta, actions);
      list.appendChild(row);
    });
  }

  async function refreshRecovery() {
    archiveList.replaceChildren();
    trashList.replaceChildren();
    learningArchiveList.replaceChildren();
    learningTrashList.replaceChildren();
    renderRecovery(archiveList, management, 'archive', handleRestore, undefined, undefined, handleRecoveryError);
    renderRecovery(trashList, management, 'trash', handleRestore, emptyTrash, permanentlyDeleteLesson, handleRecoveryError);
    await renderLearningTopicRecovery(learningArchiveList, management, 'archive', handleLearningRestore, undefined, undefined, handleRecoveryError);
    await renderLearningTopicRecovery(learningTrashList, management, 'trash', handleLearningRestore, emptyLearningTrash, permanentlyDeleteLearningTopic, handleRecoveryError);
    renderSkillRecovery(skillArchiveList, await app.skillDefinitions.listRecovery('archive'), 'archive');
    renderSkillRecovery(skillTrashList, await app.skillDefinitions.listRecovery('trash'), 'trash');
  }

  async function mount() {
    const session = await app.initializeSession();
    if (!session) { window.location.href = 'auth.html'; return; }
    if (!app.auth.isParent) {
      mountPacoPageTemplate({ mount: templateMount, greeting: 'PAB beheer ⚙️', title: 'Archief / Prullenbak', icon: '🗂️', subtitle: 'Je hebt geen toegang tot Archief / Prullenbak.', navigation: createPacoNavigation({ app, active: 'recovery', viewMode: 'management', navigate }), content });
      state.textContent = 'Je hebt geen toegang tot Archief / Prullenbak.';
      return;
    }

    mountPacoPageTemplate({ mount: templateMount, greeting: 'PAB beheer ⚙️', title: 'Archief / Prullenbak', icon: '🗂️', subtitle: 'Herstel of verwijder lessen, leerstofonderwerpen en Skills.', navigation: createPacoNavigation({ app, active: 'recovery', viewMode: 'management', navigate }), content });

    try {
      await management.loadRecoveryLessons();
      await refreshRecovery();
      content.replaceChildren(notice, archive, trash, learningArchive, learningTrash, skillArchive, skillTrash);
    } catch (error) {
      console.error('Archive page load error:', error);
      state.textContent = 'Archief / Prullenbak kon niet worden geladen.';
    }
  }

  return Object.freeze({ mount, content, render: refreshRecovery });
}
