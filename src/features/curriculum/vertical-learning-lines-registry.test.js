import { describe, expect, it } from 'vitest';
import { createVerticalLearningLinesRegistry, verticalLearningLinesRegistry } from './vertical-learning-lines-registry.js';

describe('vertical learning lines registry', () => {
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

  it('loads all 50 inventoried objectives across groups 2 to 8', () => {
    const objectives = verticalLearningLinesRegistry.listObjectives({ domain: 'Breuken' });
    expect(objectives).toHaveLength(53);
    expect([2, 3, 4, 5, 6, 7, 8].map(group => verticalLearningLinesRegistry.listObjectives({ domain: 'Breuken', group }).length))
      .toEqual([2, 1, 4, 4, 19, 12, 11]);
    expect(new Set(objectives.map(item => item.id)).size).toBe(50);
    expect(verticalLearningLinesRegistry.getCoverageSummary({ domain: 'Breuken' }).objectives).toBe(53);
  });

  it('connects existing FR1 and FR2 curriculum without inventing a formal FR1 contract', () => {
    const skills = verticalLearningLinesRegistry.listCurriculumSkills();
    expect(skills.map(skill => skill.id)).toEqual(['FR1', 'FR2']);
    expect(skills[0].status).toBe('definition_only_unregistered');
    expect(skills[1].developments.map(item => item.id)).toEqual(['FR2.D1', 'FR2.D2', 'FR2.D3']);
    expect(verticalLearningLinesRegistry.getObjective('FR-0034').related_skill_ids).toContain('FR2');\n    expect(verticalLearningLinesRegistry.getObjective('FR-0052').objective).toContain('decimaal getal');\n    expect(verticalLearningLinesRegistry.getObjective('FR-0007').slo_group).toBe(6);
    expect(verticalLearningLinesRegistry.getExercise('fr2-equivalence-practice').route.page).toBe('curriculum-fr2-practice-learner.html');
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
    expect(() => createVerticalLearningLinesRegistry({ objectives: [{ ...base, exercise_ids: ['unknown'] }] })).toThrow(/Unknown exercise/);
  });

  it('rejects malformed IDs, invalid groups and unknown statuses', () => {
    const base = { id: 'FR-0001', domain: 'Breuken', slo_group: 6, slo_source: 'SLO 2017', slo_component: 'Getalbegrip', objective: 'Doel', source_reference: 'SLO 2017', status: 'active', coverage_status: 'partial', coverage_note: 'Deel van doel', related_skill_ids: [], exercise_ids: [] };
    expect(() => createVerticalLearningLinesRegistry({ objectives: [{ ...base, id: 'BREUKEN001' }] })).toThrow(/ID/);
    expect(() => createVerticalLearningLinesRegistry({ objectives: [{ ...base, slo_group: 9 }] })).toThrow(/SLO group/);
    expect(() => createVerticalLearningLinesRegistry({ objectives: [{ ...base, status: 'unknown' }] })).toThrow(/status/);
  });
});
