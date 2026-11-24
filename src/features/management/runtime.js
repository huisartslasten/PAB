import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoManagementNavigation } from '../../components/page-navigation.js';
import { getStudentLearningProfile, listStudents } from '../../core/student-registry.js';
import { buildViewUrl } from '../../core/view-context.js';
import { verticalLearningLinesRegistry } from '../curriculum/vertical-learning-lines-registry.js';

const FILTER_LABELS = Object.freeze({
  dashboard: 'Dashboard',
  vakken: 'Vakken',
  lessons: 'Lessen',
  'learning-material': 'Leerstof',
  tests: 'Toetsen',
  planning: 'Planning',
  agenda: 'Agenda',
  'month-calendar': 'Maandkalender',
  extra: 'Extra',
  challenges: 'Challenges',
  games: 'Spelletjes',
  beheer: 'Beheer',
  'vertical-learning-lines': 'Verticale leerlijnen',
  archive: 'Archief',
  trash: 'Prullenbak'
});

function createCard(documentRef, { title, description, actionLabel = 'Openen', onClick, secondaryLabel = '', onSecondaryClick = null, disabled = false } = {}) {
  const card = documentRef.createElement('article');
  card.className = 'management-dashboard-card';
  const titleElement = documentRef.createElement('h3');
  titleElement.textContent = title;
  card.appendChild(titleElement);
  const descriptionElement = documentRef.createElement('p');
  descriptionElement.textContent = description;
  card.appendChild(descriptionElement);
  const actions = documentRef.createElement('div');
  actions.className = 'management-dashboard-card-actions';
  if (actionLabel) {
    const action = documentRef.createElement('button');
    action.type = 'button';
    action.className = 'management-dashboard-card-primary';
    action.textContent = actionLabel;
    action.disabled = disabled;
    if (typeof onClick === 'function') action.addEventListener('click', onClick);
    actions.appendChild(action);
  }
  if (secondaryLabel) {
    const secondary = documentRef.createElement('button');
    secondary.type = 'button';
    secondary.className = 'management-dashboard-card-secondary';
    secondary.textContent = secondaryLabel;
    secondary.disabled = disabled;
    if (typeof onSecondaryClick === 'function') secondary.addEventListener('click', onSecondaryClick);
    actions.appendChild(secondary);
  }
  card.appendChild(actions);
  return card;
}

function capabilityMap(capabilities) { return new Map(capabilities.map(capability => [capability.id, capability])); }

export function createManagementRuntime({ app, templateMount, context, documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Management runtime requires app.');
  if (!templateMount) throw new TypeError('Management runtime requires template mount.');
  if (!context) throw new TypeError('Management runtime requires a view context.');
  if (typeof navigate !== 'function') throw new TypeError('Management runtime requires a navigation owner.');
  if (!app.managementCapabilities) throw new TypeError('Management runtime requires management capabilities.');

  const selectedStudent = context.student || '';
  const filter = FILTER_LABELS[context.managementFilter] ? context.managementFilter : 'dashboard';
  let selectedVerticalLearningArea = '';
  let selectedVerticalLearningCoreGoal = '';
  const content = documentRef.createElement('div');
  content.className = 'management-dashboard';

  function go(path, extra = {}) { return navigate(buildViewUrl(path, { student: selectedStudent, extra })); }

  function renderSection(title, cards) {
    if (!cards.length) return;
    const section = documentRef.createElement('section');
    section.className = 'management-dashboard-section';
    const heading = documentRef.createElement('h2');
    heading.textContent = title;
    section.appendChild(heading);
    const grid = documentRef.createElement('div');
    grid.className = 'management-dashboard-grid';
    grid.append(...cards);
    section.appendChild(grid);
    content.appendChild(section);
  }

  function createManagementCard(id, title, description, capabilityById) {
    const capability = capabilityById.get(id);
    const createId = id === 'lesson.manage' ? 'lesson.create' : id === 'learningTopic.manage' ? 'learningTopic.create' : '';
    const createCapability = createId ? capabilityById.get(createId) : null;
    return createCard(documentRef, {
      title,
      description,
      actionLabel: capability ? 'Beheren' : 'Niet beschikbaar',
      disabled: !capability,
      onClick: capability ? () => navigate(capability.target, { managementCapability: capability.id }) : null,
      secondaryLabel: createCapability ? createCapability.label.replace(/^➕\s*/, '+ ') : '',
      onSecondaryClick: createCapability ? () => navigate(createCapability.target, { managementCapability: createCapability.id }) : null
    });
  }

  function renderLearnerProfileSection() {
    if (!selectedStudent) return;
    const studentProfile = getStudentLearningProfile(selectedStudent);
    if (!studentProfile?.curriculumKey) return;
    const section = documentRef.createElement('section');
    section.className = 'management-dashboard-section';
    const heading = documentRef.createElement('h2');
    heading.textContent = 'Curriculum-leerlingprofiel';
    const card = documentRef.createElement('article');
    card.className = 'management-dashboard-card management-learner-link-card';
    const title = documentRef.createElement('h3');
    title.textContent = selectedStudent;
    const description = documentRef.createElement('p');
    description.textContent = 'Koppel de bestaande PacoGO-leerling aan één curriculumprofiel. De koppeling gebruikt een vaste leerlingcode, niet de naam.';
    const status = documentRef.createElement('p');
    status.className = 'management-learner-link-status';
    status.setAttribute('role', 'status');
    status.textContent = 'Curriculumprofiel controleren…';
    const controls = documentRef.createElement('div');
    controls.className = 'management-dashboard-card-actions';
    const existing = documentRef.createElement('select');
    existing.className = 'management-learner-link-select';
    existing.setAttribute('aria-label', 'Bestaand curriculumprofiel');
    const placeholder = documentRef.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Kies bestaand profiel…';
    existing.appendChild(placeholder);
    const linkButton = documentRef.createElement('button');
    linkButton.type = 'button';
    linkButton.className = 'management-dashboard-card-secondary';
    linkButton.textContent = 'Koppel bestaand profiel';
    linkButton.disabled = true;
    existing.addEventListener('change', () => { linkButton.disabled = !existing.value; });
    const createButton = documentRef.createElement('button');
    createButton.type = 'button';
    createButton.className = 'management-dashboard-card-primary';
    createButton.textContent = 'Maak profiel voor ' + selectedStudent;
    controls.append(existing, linkButton, createButton);
    card.append(title, description, status, controls);
    section.append(heading, card);
    content.appendChild(section);

    const setBusy = busy => {
      existing.disabled = busy;
      linkButton.disabled = busy || !existing.value;
      createButton.disabled = busy;
    };
    const refresh = async () => {
      const linked = await app.learnerCurriculum.getAppLearnerProfile(studentProfile.curriculumKey);
      if (linked) {
        status.textContent = 'Gekoppeld aan curriculumprofiel: ' + linked.display_name;
        controls.hidden = true;
        return;
      }
      status.textContent = 'Nog niet gekoppeld. Koppel een bestaand profiel of maak er één aan.';
      const profiles = await app.learnerCurriculum.listLearners();
      profiles.forEach(profile => {
        const option = documentRef.createElement('option');
        option.value = profile.learner_key;
        option.textContent = profile.display_name;
        existing.appendChild(option);
      });
      if (!profiles.length) linkButton.hidden = true;
    };
    linkButton.addEventListener('click', async () => {
      if (!existing.value) return;
      setBusy(true);
      try {
        await app.learnerCurriculum.linkAppLearnerProfile(studentProfile.curriculumKey, existing.value);
        render();
      } catch (error) {
        status.textContent = error?.message || 'Het bestaande profiel kon niet worden gekoppeld.';
        setBusy(false);
      }
    });
    createButton.addEventListener('click', async () => {
      setBusy(true);
      try {
        await app.learnerCurriculum.createAppLearnerProfile(studentProfile.curriculumKey, selectedStudent);
        render();
      } catch (error) {
        status.textContent = error?.message || 'Het curriculumprofiel kon niet worden aangemaakt.';
        setBusy(false);
      }
    });
    void refresh().catch(error => {
      status.textContent = error?.message || 'De curriculumprofielen konden niet worden geladen.';
      status.classList.add('is-error');
      setBusy(false);
    });
  }

  function renderDomainVerticalLearningLine({ domain, title: domainTitle, sourceLabel, showCurriculumSkills = false, scopeComponents = null, scopeSource = '', objectiveFilter = null, introText = 'Alle geïnventariseerde SLO-tussendoelen, gekoppeld aan bestaande PacoGO-curriculumonderdelen en oefenroutes.', scopeTitle = 'Actueel kerndoel KD10A — SLO 2026', scopeDescription = 'Dit is de actuele inhoudelijke afbakening van KD10A. De groepsgewijze doelen hieronder komen uit SLO 2017 en zijn een kandidaat-crosswalk; ze zijn geen officiële groepsdoelen uit de publicatie van 2026.' }) {
    const allObjectives = verticalLearningLinesRegistry.listObjectives({ domain });
    const objectives = typeof objectiveFilter === 'function' ? allObjectives.filter(objectiveFilter) : allObjectives;
    const summary = typeof objectiveFilter === 'function' ? {
      objectives: objectives.length,
      exerciseLinks: objectives.reduce((total, item) => total + item.exercise_ids.length, 0),
      partial: objectives.filter(item => item.coverage_status === 'partial').length,
      notDemonstrated: objectives.filter(item => item.coverage_status === 'not_demonstrated').length
    } : verticalLearningLinesRegistry.getCoverageSummary({ domain });
    const exercises = verticalLearningLinesRegistry.listExercises();
    const skills = verticalLearningLinesRegistry.listCurriculumSkills();
    const exerciseById = new Map(exercises.map(item => [item.id, item]));
    const section = documentRef.createElement('section');
    section.className = 'management-dashboard-section vertical-learning-lines';
    // Keep the complete vertical-learning page readable on the blue management canvas.
    // This is the shared central template, so the white surface applies consistently to every domain.
    section.style.backgroundColor = '#ffffff';
    section.style.color = '#17345f';
    section.style.borderRadius = '20px';
    section.style.padding = '24px';

    const backButton = documentRef.createElement('button');
    backButton.type = 'button';
    backButton.className = 'vertical-learning-back';
    backButton.textContent = '← Terug naar SLO-kerndoelen';
    backButton.addEventListener('click', () => {
      selectedVerticalLearningCoreGoal = '';
      render();
    });
    section.appendChild(backButton);

    const heading = documentRef.createElement('h2');
    heading.textContent = 'Verticale leerlijn — ' + domainTitle;
    const intro = documentRef.createElement('p');
    intro.className = 'vertical-learning-lines-intro';
    intro.textContent = introText;
    const source = documentRef.createElement('p');
    source.className = 'vertical-learning-lines-source';
    source.textContent = sourceLabel;

    let scopeSection = null;
    if (Array.isArray(scopeComponents) && scopeComponents.length) {
      scopeSection = documentRef.createElement('section');
      scopeSection.className = 'vertical-learning-core-scope';
      const scopeHeading = documentRef.createElement('h3');
      scopeHeading.textContent = scopeTitle;
      const scopeIntro = documentRef.createElement('p');
      scopeIntro.textContent = scopeDescription;
      const scopeList = documentRef.createElement('ul');
      scopeComponents.forEach(component => {
        const item = documentRef.createElement('li');
        item.textContent = component;
        scopeList.appendChild(item);
      });
      const scopeCitation = documentRef.createElement('p');
      scopeCitation.className = 'vertical-learning-lines-source';
      scopeCitation.textContent = 'Actuele kerndoelbron: ' + scopeSource;
      scopeSection.append(scopeHeading, scopeIntro, scopeList, scopeCitation);
    }

    const summaryGrid = documentRef.createElement('div');
    summaryGrid.className = 'vertical-learning-lines-summary';
    const metrics = [
      [String(summary.objectives), 'SLO-tussendoelen'],
      [String(exercises.length), 'Bestaande oefenroutes'],
      [String(summary.exerciseLinks), 'Oefeningkoppelingen'],
      [String(summary.partial), 'Gedeeltelijk gedekt'],
      [String(summary.notDemonstrated), 'Niet aangetoond']
    ];
    metrics.forEach(([value, label]) => {
      const card = documentRef.createElement('article');
      card.className = 'vertical-learning-lines-metric';
      const number = documentRef.createElement('strong');
      number.textContent = value;
      const caption = documentRef.createElement('span');
      caption.textContent = label;
      card.append(number, caption);
      summaryGrid.appendChild(card);
    });

    const legend = documentRef.createElement('div');
    legend.className = 'vertical-learning-lines-legend';
    legend.textContent = 'Dekkingsstatus komt uit de bestaande PacoGO-inventarisatie. Een verwante oefening is nog geen bewijs dat het volledige SLO-doel wordt gedekt.';
    const curriculumHeading = documentRef.createElement('h3');
    curriculumHeading.textContent = 'Bestaande PacoGO-curriculumstructuur';
    const curriculumGrid = documentRef.createElement('div');
    curriculumGrid.className = 'vertical-learning-lines-skill-grid';
    skills.forEach(skill => {
      const card = documentRef.createElement('article');
      card.className = 'vertical-learning-skill-card';
      const title = documentRef.createElement('strong');
      title.textContent = skill.id + ' — ' + skill.name;
      const status = documentRef.createElement('span');
      status.className = 'vertical-learning-skill-status';
      status.textContent = skill.status === 'candidate_registered' ? 'Kandidaat in registry' : 'Skilldefinitie; formeel contract niet teruggevonden';
      card.append(title, status);
      if (skill.developments?.length) {
        const detail = documentRef.createElement('p');
        detail.textContent = skill.developments.map(item => item.id + ' ' + item.name).join(' · ');
        card.appendChild(detail);
        const contract = documentRef.createElement('p');
        contract.textContent = 'Claims: ' + skill.claims.join(', ') + ' · Evidence targets: ' + skill.evidence_targets.join(', ') + ' · Task models: ' + skill.task_models.join(', ');
        card.appendChild(contract);
      } else {
        const note = documentRef.createElement('p');
        note.textContent = skill.note;
        card.appendChild(note);
      }
      curriculumGrid.appendChild(card);
    });

    const groupContainer = documentRef.createElement('div');
    groupContainer.className = 'vertical-learning-lines-groups';
    const groupNumbers = [...new Set(objectives.map(item => item.slo_group))].sort((a, b) => a - b);
    for (const group of groupNumbers) {
      const groupObjectives = objectives.filter(item => item.slo_group === group);
      if (!groupObjectives.length) continue;
      const groupCard = documentRef.createElement('section');
      groupCard.className = 'vertical-learning-group';
      const groupHeader = documentRef.createElement('div');
      groupHeader.className = 'vertical-learning-group-header';
      const groupTitle = documentRef.createElement('h3');
      groupTitle.textContent = groupObjectives[0]?.slo_group_label || 'Groep ' + group;
      const groupCount = documentRef.createElement('span');
      groupCount.textContent = groupObjectives.length + ' tussendoelen';
      groupHeader.append(groupTitle, groupCount);
      const objectiveGrid = documentRef.createElement('div');
      objectiveGrid.className = 'vertical-learning-objective-grid';

      groupObjectives.forEach(objective => {
        const card = documentRef.createElement('article');
        card.className = 'vertical-learning-objective-card';
        const top = documentRef.createElement('div');
        top.className = 'vertical-learning-objective-top';
        const id = documentRef.createElement('strong');
        id.className = 'vertical-learning-objective-id';
        id.textContent = objective.id;
        const coverage = documentRef.createElement('span');
        coverage.className = 'vertical-learning-coverage vertical-learning-coverage--' + objective.coverage_status;
        coverage.textContent = objective.coverage_status === 'partial' ? 'Gedeeltelijk gedekt' : objective.coverage_status === 'not_demonstrated' ? 'Niet aangetoond' : objective.coverage_status === 'full' ? 'Volledig gedekt' : 'Nog niet beoordeeld';
        top.append(id, coverage);
        const title = documentRef.createElement('h4');
        title.textContent = objective.objective;
        const meta = documentRef.createElement('p');
        meta.className = 'vertical-learning-objective-meta';
        meta.textContent = objective.slo_component + ' · ' + objective.slo_source + ' · ' + objective.source_reference;
        card.append(top, title, meta);

        if (objective.related_skill_ids.length) {
          const skillTags = documentRef.createElement('div');
          skillTags.className = 'vertical-learning-skill-tags';
          objective.related_skill_ids.forEach(skillId => {
            const tag = documentRef.createElement('span');
            tag.textContent = skillId;
            skillTags.appendChild(tag);
          });
          card.appendChild(skillTags);
        }

        const exerciseHeading = documentRef.createElement('h5');
        exerciseHeading.className = 'vertical-learning-exercise-heading';
        exerciseHeading.textContent = 'Bestaande PacoGO-oefeningen';
        card.appendChild(exerciseHeading);
        if (objective.exercise_ids.length) {
          const exerciseList = documentRef.createElement('div');
          exerciseList.className = 'vertical-learning-exercise-list';
          objective.exercise_ids.forEach(exerciseId => {
            const exercise = exerciseById.get(exerciseId);
            if (!exercise) return;
            const open = documentRef.createElement('button');
            open.type = 'button';
            open.className = 'vertical-learning-exercise-link';
            open.textContent = exercise.label + '  →';
            open.addEventListener('click', () => {
              if (exercise.route.domain === 'fractions') {
                navigate(buildViewUrl('skills.html', { student: selectedStudent, mode: context?.mode, extra: { domain: exercise.route.domain, topic: exercise.route.topic, exercise: exercise.route.exercise } }));
              } else {
                window.location.href = buildViewUrl(exercise.route.page, { student: selectedStudent, mode: context?.mode });
              }
            });
            exerciseList.appendChild(open);
          });
          card.appendChild(exerciseList);
          const caution = documentRef.createElement('p');
          caution.className = 'vertical-learning-exercise-caution';
          caution.textContent = 'Verwante bestaande oefenroute(s); de volledige dekking van dit doel is hiermee niet automatisch vastgesteld.';
          card.appendChild(caution);
        } else {
          const empty = documentRef.createElement('p');
          empty.className = 'vertical-learning-no-exercises';
          empty.textContent = 'Nog geen passende, gecontroleerde oefenroute gekoppeld.';
          card.appendChild(empty);
        }

        const rationale = documentRef.createElement('details');
        rationale.className = 'vertical-learning-objective-rationale';
        const summaryLabel = documentRef.createElement('summary');
        summaryLabel.textContent = 'Waarom deze dekkingsstatus?';
        const note = documentRef.createElement('p');
        note.textContent = objective.coverage_note;
        const sourceNote = documentRef.createElement('p');
        sourceNote.textContent = objective.source_wording.includes('samenvatting') ? 'Doelomschrijving is een inhoudelijke samenvatting uit de PacoGO-traceability-inventarisatie; geen woordelijk SLO-citaat.' : 'Doelomschrijving is gebaseerd op de SLO 2017-bronformulering en licht genormaliseerd; raadpleeg de PDF-verwijzing voor de bronpassage.';
        rationale.append(summaryLabel, note, sourceNote);
        card.appendChild(rationale);
        objectiveGrid.appendChild(card);
      });
      groupCard.append(groupHeader, objectiveGrid);
      groupContainer.appendChild(groupCard);
    }

    section.append(heading, intro, source);
    if (scopeSection) section.appendChild(scopeSection);
    section.append(summaryGrid, legend);
    if (showCurriculumSkills) section.append(curriculumHeading, curriculumGrid);
    section.appendChild(groupContainer);
    content.appendChild(section);
  }


  function renderVerticalLearningAreaMenu() {
    const section = documentRef.createElement('section');
    section.className = 'management-dashboard-section vertical-learning-lines';
    const heading = documentRef.createElement('h2');
    heading.textContent = 'Verticale leerlijnen';
    const intro = documentRef.createElement('p');
    intro.className = 'vertical-learning-lines-intro';
    intro.textContent = 'Kies een leergebied.';
    const grid = documentRef.createElement('div');
    grid.className = 'vertical-learning-objective-grid vertical-learning-core-grid';
    grid.append(
      createCard(documentRef, {
        title: 'Rekenen',
        description: 'Bekijk de SLO-kerndoelen en de beschikbare verticale uitwerkingen voor rekenen.',
        actionLabel: 'Rekenen openen',
        onClick: () => { selectedVerticalLearningArea = 'rekenen'; selectedVerticalLearningCoreGoal = ''; render(); }
      }),
      createCard(documentRef, {
        title: 'Nederlands',
        description: 'De verticale leerlijn Nederlands wordt hier beschikbaar zodra de SLO-doelen zijn uitgewerkt.',
        actionLabel: 'Nederlands openen',
        onClick: () => { selectedVerticalLearningArea = 'nederlands'; selectedVerticalLearningCoreGoal = ''; render(); }
      })
    );
    section.append(heading, intro, grid);
    content.appendChild(section);
  }

  function renderDutchVerticalLearningLines() {
    if (selectedVerticalLearningCoreGoal === 'KD2') {
      renderDomainVerticalLearningLine({
        domain: 'Teksten begrijpen',
        title: 'KD2 — De leerling begrijpt teksten',
        sourceLabel: 'Actuele kerndoelen: SLO Nederlands 2025 · leesopbouw: SLO Leerstoflijnen lezen beschreven (2010) · historische kandidaat-crosswalk',
        objectiveFilter: objective => !/luister|kijk/i.test((objective.slo_component || '') + ' ' + (objective.objective || '')),
        introText: 'PacoGO werkt binnen KD2 alleen de leescomponenten uit: begrijpend lezen, diep tekstbegrip en bronnen verkennen. Luister- en kijkopdrachten blijven buiten de PacoGO-scope en worden aan school overgelaten. Woordenschat, waaronder themawoorden met definities, ondersteunt het lezen. De groepsopbouw is een historische, voorbeeldmatige kandidaat-crosswalk en geen officiële tussendoelenreeks uit 2025.',
        scopeComponents: [
          'KD2A — De leerling toont begrip van zakelijke en literaire teksten.',
          'KD2B — De leerling evalueert en reflecteert op zakelijke en literaire teksten.',
          'KD2C — De leerling verkent de betrouwbaarheid van verschillende bronnen.'
        ],
        scopeSource: 'SLO Kerndoelen primair onderwijs 2025, KD2A–KD2C',
        scopeTitle: 'Actueel kerndoel KD2 — SLO 2025',
        scopeDescription: 'De officiële kerndoelbeschrijving 2A omvat luisteren, kijken en lezen. PacoGO kiest daarbinnen uitsluitend voor lezen. Ook 2B (diep tekstbegrip) en 2C (bronnen verkennen) worden alleen via leesactiviteiten benaderd. De groepsindeling hieronder is een voorlopige kandidaat-crosswalk uit een oudere SLO-leerstoflijn en is geen officiële tussendoelenreeks uit 2025.'
      });
      return;
    }
    const coreObjectives = verticalLearningLinesRegistry.listDutchCoreObjectives();
    const section = documentRef.createElement('section');
    section.className = 'management-dashboard-section vertical-learning-lines';
    section.style.backgroundColor = '#ffffff';
    section.style.color = '#17345f';
    section.style.borderRadius = '20px';
    section.style.padding = '24px';

    const backButton = documentRef.createElement('button');
    backButton.type = 'button';
    backButton.className = 'vertical-learning-back';
    backButton.textContent = '← Terug naar leergebieden';
    backButton.addEventListener('click', () => {
      selectedVerticalLearningArea = '';
      selectedVerticalLearningCoreGoal = '';
      render();
    });

    const heading = documentRef.createElement('h2');
    heading.textContent = 'Verticale leerlijnen — Nederlands';
    const intro = documentRef.createElement('p');
    intro.className = 'vertical-learning-lines-intro';
    intro.textContent = 'Alle negen officiële SLO-kerndoelen blijven zichtbaar. De geselecteerde PacoGO-onderdelen zijn begrijpend lezen, woordenschat/themawoorden, grammatica en spelling. Klap een ander kerndoel open voor een korte uitleg.';
    const source = documentRef.createElement('p');
    source.className = 'vertical-learning-lines-source';
    source.textContent = 'Bron: SLO, Kerndoelen primair onderwijs, herziene versie 2025, pp. 16–25. De beschrijvingen hieronder zijn compacte wegwijzers, geen vervanging van de officiële kerndoelteksten.';

    const grid = documentRef.createElement('div');
    grid.className = 'vertical-learning-objective-grid vertical-learning-core-grid';
    coreObjectives.forEach(coreGoal => {
      if (coreGoal.status === 'selected') {
        const card = createCard(documentRef, {
          title: coreGoal.id + ' — ' + coreGoal.title,
          description: coreGoal.description,
          actionLabel: coreGoal.id === 'KD2' ? 'KD2 openen' : '',
          onClick: coreGoal.id === 'KD2' ? () => { selectedVerticalLearningCoreGoal = 'KD2'; render(); } : null
        });
        card.classList.add('vertical-learning-core-selected');
        grid.appendChild(card);
        return;
      }

      const details = documentRef.createElement('details');
      details.className = 'management-dashboard-card vertical-learning-core-collapsed';
      details.style.padding = '16px 18px';
      details.style.border = '1px solid var(--paco-border)';
      details.style.borderRadius = '16px';
      details.style.background = '#ffffff';
      const summaryLine = documentRef.createElement('summary');
      summaryLine.textContent = coreGoal.id + ' — ' + coreGoal.title + ' · Nog niet uitgewerkt';
      summaryLine.style.cursor = 'pointer';
      summaryLine.style.fontWeight = '800';
      summaryLine.style.lineHeight = '1.3';
      const description = documentRef.createElement('p');
      description.textContent = coreGoal.description;
      description.style.margin = '12px 0 0';
      description.style.color = '#38577d';
      details.append(summaryLine, description);
      if (coreGoal.pacogo_note) {
        const note = documentRef.createElement('p');
        note.textContent = coreGoal.pacogo_note;
        note.style.margin = '8px 0 0';
        note.style.color = '#38577d';
        details.appendChild(note);
      }
      grid.appendChild(details);
    });

    section.append(backButton, heading, intro, source, grid);
    content.appendChild(section);
  }

  function renderVerticalLearningLines() {
    if (!selectedVerticalLearningArea) { renderVerticalLearningAreaMenu(); return; }
    if (selectedVerticalLearningArea === 'nederlands') { renderDutchVerticalLearningLines(); return; }
    if (selectedVerticalLearningCoreGoal === 'KD11') {
      const coreGoal = verticalLearningLinesRegistry.listCoreObjectives().find(item => item.id === 'KD11');
      renderDomainVerticalLearningLine({
        domain: 'Grootheden en eenheden',
        title: 'KD11 — Grootheden en eenheden',
        sourceLabel: 'Groepsgewijze bron: SLO 2017 · historische, voorbeeldmatige kandidaat-crosswalk naar actueel KD11 (SLO 2026) · bronverwijzing per doel',
        scopeComponents: coreGoal?.scope_components,
        scopeSource: coreGoal?.scope_source || '',
        introText: 'De onderstaande doelen zijn samengevat uit de voorbeeldmatige SLO 2017-groepsuitwerking. Ze vormen geen officiële groepsindeling van KD11 uit SLO 2026.',
        scopeTitle: 'Actueel kerndoel KD11 — SLO 2026',
        scopeDescription: 'Dit is de actuele inhoudelijke afbakening van KD11. De groepsgewijze doelen hieronder komen uit de afzonderlijke SLO 2017-publicatie en zijn een historische, voorbeeldmatige broninventarisatie; ze zijn geen officiële groepsdoelen uit de publicatie van 2026.'
      });
      return;
    }
    if (selectedVerticalLearningCoreGoal === 'KD10B') {
      renderDomainVerticalLearningLine({ domain: 'Breuken', title: 'Breuken', sourceLabel: 'Bron: SLO 2017 · eind groep 2 t/m 8 · PDF-paginaverwijzingen per doel', showCurriculumSkills: true });
      return;
    }
    if (selectedVerticalLearningCoreGoal === 'KD10A') {
      const coreGoal = verticalLearningLinesRegistry.listCoreObjectives().find(item => item.id === 'KD10A');
      renderDomainVerticalLearningLine({ domain: 'Gehele en decimale getallen', title: 'KD10A — Gehele en decimale getallen', sourceLabel: 'Groepsgewijze bron: SLO 2017 · kandidaat-crosswalk naar actueel KD10A (SLO 2026) · bronverwijzing per doel', scopeComponents: coreGoal?.scope_components, scopeSource: coreGoal?.scope_source || '' });
      return;
    }

    const coreObjectives = verticalLearningLinesRegistry.listCoreObjectives();
    const section = documentRef.createElement('section');
    section.className = 'management-dashboard-section vertical-learning-lines';
    const backButton = documentRef.createElement('button');
    backButton.type = 'button';
    backButton.className = 'vertical-learning-back';
    backButton.textContent = '← Terug naar leergebieden';
    backButton.addEventListener('click', () => { selectedVerticalLearningArea = ''; selectedVerticalLearningCoreGoal = ''; render(); });
    const heading = documentRef.createElement('h2');
    heading.textContent = 'Verticale leerlijnen — Rekenen';
    const intro = documentRef.createElement('p');
    intro.className = 'vertical-learning-lines-intro';
    intro.textContent = 'Kies een SLO-kerndoel om de bijbehorende verticale leerlijn te bekijken.';
    const source = documentRef.createElement('p');
    source.className = 'vertical-learning-lines-source';
    source.textContent = 'Bron: SLO Kerndoelen primair onderwijs, juli 2026 · PacoGO-mapping: kandidaat-synthese';

    const contentObjectives = coreObjectives.filter(item => item.category === 'content');
    const crossCuttingObjectives = coreObjectives.filter(item => item.category === 'cross_cutting');

    const appendCards = (items, container) => {
      items.forEach(objective => {
        const card = documentRef.createElement('article');
        card.className = 'vertical-learning-objective-card vertical-learning-core-card';
        const top = documentRef.createElement('div');
        top.className = 'vertical-learning-objective-top vertical-learning-core-card-top';
        const id = documentRef.createElement('strong');
        id.className = 'vertical-learning-objective-id';
        id.textContent = objective.id;
        const kind = documentRef.createElement('span');
        kind.className = 'vertical-learning-coverage vertical-learning-coverage--unassessed';
        kind.textContent = objective.category === 'cross_cutting' ? 'Doorlopende laag' : 'Kerndoel';
        top.append(id, kind);
        const title = documentRef.createElement('h4');
        title.textContent = objective.title;
        const description = documentRef.createElement('p');
        description.className = 'vertical-learning-objective-meta';
        description.textContent = objective.summary;
        card.append(top, title, description);

        if (objective.detail_domain) {
          const open = documentRef.createElement('button');
          open.type = 'button';
          open.className = 'management-dashboard-card-primary';
          open.textContent = objective.title + ' openen';
          open.addEventListener('click', () => {
            selectedVerticalLearningCoreGoal = objective.id;
            render();
          });
          card.appendChild(open);
        } else {
          const status = documentRef.createElement('span');
          status.className = 'vertical-learning-core-status';
          status.textContent = 'Uitwerking nog niet beschikbaar';
          card.appendChild(status);
        }
        container.appendChild(card);
      });
    };

    const contentGroup = documentRef.createElement('section');
    contentGroup.className = 'vertical-learning-group vertical-learning-core-group';
    const contentHeading = documentRef.createElement('h3');
    contentHeading.textContent = 'Kerndoelen en rekendomeinen';
    const contentGrid = documentRef.createElement('div');
    contentGrid.className = 'vertical-learning-objective-grid vertical-learning-core-grid';
    appendCards(contentObjectives, contentGrid);
    contentGroup.append(contentHeading, contentGrid);

    const crossGroup = documentRef.createElement('section');
    crossGroup.className = 'vertical-learning-group vertical-learning-core-group';
    const crossHeading = documentRef.createElement('h3');
    crossHeading.textContent = 'Doorlopende kerndoelen';
    const crossNote = documentRef.createElement('p');
    crossNote.className = 'vertical-learning-core-note';
    crossNote.textContent = 'KD15–KD18 zijn cross-cutting lagen. Ze vormen geen extra rekendomeinen of afzonderlijke content skills.';
    const crossGrid = documentRef.createElement('div');
    crossGrid.className = 'vertical-learning-objective-grid vertical-learning-core-grid vertical-learning-core-grid--cross-cutting';
    appendCards(crossCuttingObjectives, crossGrid);
    crossGroup.append(crossHeading, crossNote, crossGrid);

    section.append(backButton, heading, intro, source, contentGroup, crossGroup);
    content.appendChild(section);
  }

  function render() {
    content.replaceChildren();
    const allCapabilities = app.managementCapabilities.getAvailableForPage({ page: 'management', student: selectedStudent });
    const capabilities = capabilityMap(allCapabilities);
    const hasStudent = Boolean(selectedStudent);
    const showAll = filter === 'dashboard';
    const show = (...filters) => showAll || filters.includes(filter);

    if (!hasStudent && filter !== 'vertical-learning-lines') {
      const notice = documentRef.createElement('div');
      notice.className = 'management-dashboard-notice';
      notice.textContent = 'Kies bovenaan een leerling om leerlinggebonden beheer te openen.';
      content.appendChild(notice);
    }

    const vakkenCards = [];
    if (show('vakken', 'lessons')) vakkenCards.push(createManagementCard('lesson.manage', 'Lessen', 'Bekijk, bewerk, archiveer of verwijder lessen.', capabilities));
    if (show('vakken', 'learning-material')) vakkenCards.push(createManagementCard('learningTopic.manage', 'Leerstof', 'Beheer de leerstof van de actieve leerling.', capabilities));
    if (show('vakken', 'tests')) vakkenCards.push(createCard(documentRef, { title: 'Toetsen', description: 'Bekijk de toetsgeschiedenis van de actieve leerling.', actionLabel: 'Toetsen bekijken', disabled: !hasStudent, onClick: () => go('test-history.html') }));
    renderSection('Vakken', vakkenCards);

    const planningCards = [];
    if (show('planning', 'agenda')) planningCards.push(createCard(documentRef, { title: 'Agenda', description: 'Bekijk en beheer de agenda van de actieve leerling.', actionLabel: 'Agenda openen', disabled: !hasStudent, onClick: () => go('agenda.html') }));
    if (show('planning', 'month-calendar')) planningCards.push(createCard(documentRef, { title: 'Maandkalender', description: 'Open de maandkalender van de actieve leerling.', actionLabel: 'Maandkalender openen', disabled: !hasStudent, onClick: () => go('month-calendar.html') }));
    renderSection('Planning', planningCards);

    const extraCards = [];
    if (show('extra', 'challenges')) extraCards.push(createCard(documentRef, { title: 'Challenges', description: 'Open de centrale Challenge-instellingen.', actionLabel: 'Challenges openen', onClick: () => go('challenge-settings.html') }));
    if (show('extra', 'games')) extraCards.push(createCard(documentRef, { title: 'Spelletjes', description: 'Beheer de spelvrijgave van de actieve leerling.', actionLabel: 'Spelletjes openen', disabled: !hasStudent, onClick: () => go('game-access.html') }));
    renderSection('Extra', extraCards);
    if (show('beheer') && hasStudent) renderLearnerProfileSection();
    if (filter === 'vertical-learning-lines') renderVerticalLearningLines();

    const beheerCards = [];
    if (show('beheer', 'vertical-learning-lines')) beheerCards.push(createCard(documentRef, { title: 'Verticale leerlijnen', description: 'Bekijk SLO-doelen en de PacoGO-oefeningen die deze doelen dekken.', actionLabel: 'Leerlijnen openen', onClick: () => go('management.html', { managementFilter: 'vertical-learning-lines' }) }));
    if (show('beheer', 'archive')) beheerCards.push(createCard(documentRef, { title: 'Archief', description: 'Bekijk items die uit de actieve omgeving zijn gearchiveerd.', actionLabel: 'Archief openen', onClick: () => go('archive.html', { recovery: 'archive' }) }));
    if (show('beheer', 'trash')) beheerCards.push(createCard(documentRef, { title: 'Prullenbak', description: 'Open de bestaande centrale herstel- en prullenbakfunctie.', actionLabel: 'Prullenbak openen', onClick: () => go('archive.html', { recovery: 'trash' }) }));
    renderSection('Beheer', beheerCards);
  }

  async function mount() {
    const session = await app.initializeSession();
    if (!session) { window.location.href = 'auth.html'; return; }
    if (!app.auth.isParent) {
      mountPacoPageTemplate({ mount: templateMount, greeting: 'PacoGO beheer ⚙️', title: 'Beheer', icon: '⚙️', subtitle: 'Je hebt geen toegang tot Beheer.', navigation: [], content });
      return;
    }

    mountPacoPageTemplate({
      mount: templateMount,
      className: 'management-template',
      greeting: 'PacoGO beheer ⚙️',
      title: FILTER_LABELS[filter],
      icon: '⚙️',
      subtitle: selectedStudent ? `Je beheert nu de omgeving van ${selectedStudent}.` : 'Kies bovenaan een leerling.',
      navigation: createPacoManagementNavigation({ app, active: filter, student: selectedStudent, managementStudents: listStudents(), navigate }),
      content
    });
    render();
  }

  return Object.freeze({ mount, content, render });
}
