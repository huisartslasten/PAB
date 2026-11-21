import { describe, expect, it } from 'vitest';
import { createVerticalLearningLinesRegistry, verticalLearningLinesRegistry } from './vertical-learning-lines-registry.js';

describe('vertical learning lines registry', () => {
  it('exposes the supplied FR objective metadata without deriving IDs from descriptions', () => {
    const objective = verticalLearningLinesRegistry.getObjective('FR-0001');
    expect(objective).toMatchObject({
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

  it('supports multiple domains, objectives and exercise references', () => {
    const registry = createVerticalLearningLinesRegistry({ objectives: [
      { id: 'FR-0002', domain: 'Breuken', slo_group: 7, slo_source: 'SLO 2017', slo_component: 'Bewerkingen', objective: 'Doel B', status: 'planned', exercise_ids: ['fraction-task-01'] },
      { id: 'BR-0001', domain: 'Verhoudingen', slo_group: 8, slo_source: 'SLO 2017', slo_component: 'Verhoudingen', objective: 'Doel A', status: 'active', exercise_ids: [] }
    ] });
    expect(registry.listDomains()).toEqual(['Breuken', 'Verhoudingen']);
    expect(registry.listObjectives({ domain: 'Breuken' }).map(item => item.id)).toEqual(['FR-0002']);
    expect(registry.getObjective('FR-0002').exercise_ids).toEqual(['fraction-task-01']);
  });

  it('loads the complete SLO 2017 fraction inventory and existing curriculum links', () => {\n    expect(verticalLearningLinesRegistry.listObjectives({ domain: 'Breuken' })).toHaveLength(50);\n    expect(verticalLearningLinesRegistry.listObjectives({ domain: 'Breuken', group: 2 })).toHaveLength(2);\n    expect(verticalLearningLinesRegistry.getCoverageSummary({ domain: 'Breuken' }).objectives).toBe(50);\n    expect(verticalLearningLinesRegistry.getObjective('FR-0034').related_skill_ids).toContain('FR2');\n    expect(verticalLearningLinesRegistry.getExercise('fr2-equivalence-practice').route.page).toBe('curriculum-fr2-practice-learner.html');\n    expect(verticalLearningLinesRegistry.listCurriculumSkills().map(skill => skill.id)).toEqual(['FR1', 'FR2']);\n  });\n\n  it('rejects duplicate IDs and incomplete objective metadata', () => {
    const objective = { id: 'FR-0001', domain: 'Breuken', slo_group: 6, slo_source: 'SLO 2017', slo_component: 'Getalbegrip', objective: 'Doel', status: 'active', exercise_ids: [] };
    expect(() => createVerticalLearningLinesRegistry({ objectives: [objective, objective] })).toThrow(/Duplicate/);
    expect(() => createVerticalLearningLinesRegistry({ objectives: [{ ...objective, slo_component: '' }] })).toThrow(/slo_component/);
  });

  it('rejects malformed objective IDs, invalid groups and unknown statuses', () => {
    const base = { id: 'FR-0001', domain: 'Breuken', slo_group: 6, slo_source: 'SLO 2017', slo_component: 'Getalbegrip', objective: 'Doel', status: 'active', exercise_ids: [] };
    expect(() => createVerticalLearningLinesRegistry({ objectives: [{ ...base, id: 'BREUKEN001' }] })).toThrow(/ID/);
    expect(() => createVerticalLearningLinesRegistry({ objectives: [{ ...base, slo_group: 9 }] })).toThrow(/SLO group/);
    expect(() => createVerticalLearningLinesRegistry({ objectives: [{ ...base, status: 'unknown' }] })).toThrow(/status/);
  });
});
