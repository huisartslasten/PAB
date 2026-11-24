import { describe, expect, it } from 'vitest';
import { createVerticalLearningLinesRegistry, verticalLearningLinesRegistry } from './vertical-learning-lines-registry.js';

describe('vertical learning lines registry', () => {
  it('exposes the SLO core objectives from the central mapping', () => {
    const coreObjectives = verticalLearningLinesRegistry.listCoreObjectives();
    expect(coreObjectives.map(item => item.id)).toEqual([
      'KD10A', 'KD10B', 'KD10C', 'KD11', 'KD12', 'KD13', 'KD14',
      'KD15', 'KD16', 'KD17', 'KD18'
    ]);
    expect(coreObjectives.find(item => item.id === 'KD10A')).toMatchObject({
      detail_domain: 'Gehele en decimale getallen',
      scope_source: 'SLO, Kerndoelen primair onderwijs, juli 2026, p. 34',
      scope_components: [
        "Bewerkingen: vergelijken, ordenen, optellen, aftrekken, vermenigvuldigen en delen.",
        "Getalrelaties, splitsingen tot 20 en de tafels memoriseren en deze kennis vlot en wendbaar toepassen.",
        "Beredeneerd kiezen van rekenvorm en rekenwijze en reflecteren op de keuze en uitvoering.",
        "Rekenvormen: hoofdrekenen, schattend rekenen, schriftelijk rekenen en rekenen met de rekenmachine.",
        "Rekenwijzen: eigenschappen van getallen en bewerkingen gebruiken en standaardprocedures toepassen."
      ]
    });
    expect(coreObjectives.find(item => item.id === 'KD10B')).toMatchObject({
      title: 'Breuken',
      category: 'content',
      detail_domain: 'Breuken'
    });
    expect(coreObjectives.filter(item => item.category === 'cross_cutting').map(item => item.id))
      .toEqual(['KD15', 'KD16', 'KD17', 'KD18']);
    expect(coreObjectives.find(item => item.id === 'KD15').mapped_skills)
      .toBe('Cross-cutting: mathematisch denken/werken');
  });


  it('exposes the current KD11 scope and central detail domain', () => {
    expect(verticalLearningLinesRegistry.listCoreObjectives().find(item => item.id === 'KD11')).toMatchObject({
      title: 'Grootheden en eenheden',
      detail_domain: 'Grootheden en eenheden',
      scope_source: 'SLO, Kerndoelen primair onderwijs, juli 2026, p. 35',
      scope_components: [
        'Grootheden: lengte, oppervlakte, inhoud, gewicht/massa, snelheid, tijd, geld, temperatuur en geheugenomvang.',
        'Meten met passende meetinstrumenten.',
        'Omtrek, oppervlakte en inhoud van rechthoekige figuren bepalen.',
        'Schatten en controleren met referentiematen en meetreferenties.',
        'Relaties leggen tussen grootheden en eenheden, tussen grootheden onderling en tussen eenheden onderling.'
      ]
    });
  });

  it('exposes all nine official Dutch core goals and the selected PacoGO scope', () => {
    const goals = verticalLearningLinesRegistry.listDutchCoreObjectives();
    expect(goals.map(item => item.id)).toEqual(['KD1', 'KD2', 'KD3', 'KD4', 'KD5', 'KD6', 'KD7', 'KD8', 'KD9']);
    expect(goals.filter(item => item.status === 'selected').map(item => item.id)).toEqual(['KD2', 'KD6']);
    expect(goals.find(item => item.id === 'KD1')).toMatchObject({
      status_label: 'Nog niet uitgewerkt',
      pacogo_note: expect.stringContaining('themawoorden')
    });
    expect(goals.find(item => item.id === 'KD2')).toMatchObject({
      status_label: 'Geselecteerd — begrijpend lezen',
      selected_components: ['Leescomponent van 2A', '2B — Diep tekstbegrip', '2C — Bronnen verkennen']
    });
    expect(goals.find(item => item.id === 'KD6')).toMatchObject({
      status_label: 'Geselecteerd — grammatica en spelling',
      selected_components: ['6A — Grammatica en taalbeschouwing', '6B — Spelling, formulering en interpunctie']
    });
    expect(goals.filter(item => item.status === 'not_yet_developed').every(item => item.status_label === 'Nog niet uitgewerkt')).toBe(true);
  });

  it('loads all KD11 SLO group objectives as source-traceable, unassessed records', () => {
    const objectives = verticalLearningLinesRegistry.listObjectives({ domain: 'Grootheden en eenheden' });
    expect(objectives).toHaveLength(186);
    expect([2, 3, 4, 5, 6, 7, 8].map(group => verticalLearningLinesRegistry.listObjectives({ domain: 'Grootheden en eenheden', group }).length))
      .toEqual([19, 25, 30, 28, 36, 26, 22]);
    expect(new Set(objectives.map(item => item.id)).size).toBe(186);
    expect(objectives[0]).toMatchObject({
      id: 'KD11-0001',
      domain: 'Grootheden en eenheden',
      slo_group: 2,
      slo_source: 'SLO 2017 — kandidaat-crosswalk naar KD11',
      slo_component: 'Lengte en omtrek',
      coverage_status: 'unassessed',
      related_skill_ids: [],
      exercise_ids: []
    });
    expect(objectives.at(-1).id).toBe('KD11-0186');
    expect(objectives.every(item => item.source_reference.includes('gedrukte pp.') && item.source_wording.includes('geen woordelijk SLO-citaat'))).toBe(true);
    expect(objectives.every(item => item.related_skill_ids.length === 0 && item.exercise_ids.length === 0 && item.coverage_status === 'unassessed')).toBe(true);
    expect(verticalLearningLinesRegistry.getCoverageSummary({ domain: 'Grootheden en eenheden' }).unassessed).toBe(186);
  });

  it('loads KD10A SLO group objectives as traceable, unassessed records', () => {
    const objectives = verticalLearningLinesRegistry.listObjectives({ domain: 'Gehele en decimale getallen' });
    expect(objectives).toHaveLength(170);
    expect([2, 3, 4, 5, 6, 7, 8].map(group => verticalLearningLinesRegistry.listObjectives({ domain: 'Gehele en decimale getallen', group }).length)).toEqual([12,15,20,29,24,31,39]);
    expect(new Set(objectives.map(item => item.id)).size).toBe(170);
    expect(objectives[0]).toMatchObject({ id: 'KD10A-0001', domain: 'Gehele en decimale getallen', slo_group: 2, slo_source: 'SLO 2017 — kandidaat-crosswalk naar KD10A', slo_component: 'Getalbegrip', coverage_status: 'unassessed', related_skill_ids: [], exercise_ids: [] });
    expect(objectives.every(item => item.source_reference && item.source_wording.includes('geen woordelijk'))).toBe(true);
    expect(verticalLearningLinesRegistry.getCoverageSummary({ domain: 'Gehele en decimale getallen' }).unassessed).toBe(170);
  });

  it('preserves FR-0001 as the stable SLO objective identity', () => {
    expect(verticalLearningLinesRegistry.getObjective('FR-0001')).toMatchObject({
      id: 'FR-0001',
      domain: 'Breuken',
      slo_group: 6,
      slo_source: 'SLO 2017',
      slo_component: 'Getalbegrip',
      objective: 'Breuken op een getallenlijn plaatsen',
      status: 'active',
      exercise_ids: []
    });
  });

  it('loads all 53 inventoried objectives across groups 2 to 8', () => {
    const objectives = verticalLearningLinesRegistry.listObjectives({ domain: 'Breuken' });
    expect(objectives).toHaveLength(53);
    expect([2, 3, 4, 5, 6, 7, 8].map(group => verticalLearningLinesRegistry.listObjectives({ domain: 'Breuken', group }).length))
      .toEqual([2, 1, 4, 4, 19, 12, 11]);
    expect(new Set(objectives.map(item => item.id)).size).toBe(53);
    expect(verticalLearningLinesRegistry.getCoverageSummary({ domain: 'Breuken' }).objectives).toBe(53);
  });

  it('connects existing FR1 and FR2 curriculum without inventing a formal FR1 contract', () => {
    const skills = verticalLearningLinesRegistry.listCurriculumSkills();
    expect(skills.map(skill => skill.id)).toEqual(['FR1', 'FR2']);
    expect(skills[0].status).toBe('definition_only_unregistered');
    expect(skills[1].developments.map(item => item.id)).toEqual(['FR2.D1', 'FR2.D2', 'FR2.D3']);
    expect(verticalLearningLinesRegistry.getObjective('FR-0034').related_skill_ids).toContain('FR2');
    expect(verticalLearningLinesRegistry.getObjective('FR-0052').objective).toContain('decimaal getal');
    expect(verticalLearningLinesRegistry.getObjective('FR-0007').slo_group).toBe(6);
    expect(verticalLearningLinesRegistry.getExercise('fr2-equivalence-practice').route.page).toBe('curriculum-fr2-practice-learner.html');
    expect(verticalLearningLinesRegistry.getExercise('fr2-pencil-length-ordering')).toMatchObject({
      kind: 'non_formal_learning_activity',
      route: { page: 'curriculum-fr2-length-order-learner.html' }
    });
    expect(verticalLearningLinesRegistry.getObjective('FR-0002')).toMatchObject({
      exercise_ids: ['fr2-pencil-length-ordering'],
      coverage_status: 'partial'
    });
  });

  it('supports many-to-many links between objectives and exercises', () => {
    const exercise = { id: 'fraction-task-01', label: 'Task', topic: 'optellen', route: { page: 'skills.html', domain: 'fractions', topic: 'optellen', exercise: 'fraction-task-01' } };
    const base = { domain: 'Breuken', slo_group: 7, slo_source: 'SLO 2017', slo_component: 'Bewerkingen', objective: 'Doel', status: 'active', coverage_status: 'partial', coverage_note: 'Deel van doel', source_reference: 'SLO 2017', related_skill_ids: [] };
    const registry = createVerticalLearningLinesRegistry({
      exercises: [exercise],
      objectives: [
        { ...base, id: 'FR-0091', exercise_ids: ['fraction-task-01'] },
        { ...base, id: 'FR-0092', exercise_ids: ['fraction-task-01'] }
      ]
    });
    expect(registry.getObjective('FR-0091').exercise_ids).toEqual(['fraction-task-01']);
    expect(registry.getObjective('FR-0092').exercise_ids).toEqual(['fraction-task-01']);
  });

  it('rejects duplicate IDs, missing exercise references and incomplete metadata', () => {
    const base = { id: 'FR-0001', domain: 'Breuken', slo_group: 6, slo_source: 'SLO 2017', slo_component: 'Getalbegrip', objective: 'Doel', source_reference: 'SLO 2017', status: 'active', coverage_status: 'partial', coverage_note: 'Deel van doel', related_skill_ids: [], exercise_ids: [] };
    expect(() => createVerticalLearningLinesRegistry({ objectives: [base, base] })).toThrow(/Duplicate/);
    expect(() => createVerticalLearningLinesRegistry({ objectives: [{ ...base, slo_component: '' }] })).toThrow(/slo_component/);
    expect(() => createVerticalLearningLinesRegistry({ objectives: [{ ...base, exercise_ids: ['unknown'] }] })).toThrow(/unknown exercise/i);
  });

  it('rejects malformed IDs, invalid groups and unknown statuses', () => {
    const base = { id: 'FR-0001', domain: 'Breuken', slo_group: 6, slo_source: 'SLO 2017', slo_component: 'Getalbegrip', objective: 'Doel', source_reference: 'SLO 2017', status: 'active', coverage_status: 'partial', coverage_note: 'Deel van doel', related_skill_ids: [], exercise_ids: [] };
    expect(() => createVerticalLearningLinesRegistry({ objectives: [{ ...base, id: 'BREUKEN001' }] })).toThrow(/ID/);
    expect(() => createVerticalLearningLinesRegistry({ objectives: [{ ...base, slo_group: 9 }] })).toThrow(/SLO group/);
    expect(() => createVerticalLearningLinesRegistry({ objectives: [{ ...base, status: 'unknown' }] })).toThrow(/status/);
  });
});
