import { describe, expect, it } from 'vitest';
import { getLessonSubjectGroups, getSubjectSubvakGroups } from './list-view-model.js';

describe('lessons list view model', () => {
  it('includes a learning topic as a subject even when no lesson exists', () => {
    const groups = getLessonSubjectGroups([], 'Zyon', [
      { id: 12, student: 'Zyon', subject: 'Nederlands', subvak: 'Boekbespreking' }
    ]);

    expect(groups).toHaveLength(1);
    expect(groups[0].label).toBe('Nederlands');
    expect(groups[0].lessons).toEqual([]);
    expect(groups[0].topics).toHaveLength(1);
  });

  it('combines lesson-owned and topic-owned content under one subject without duplicating topics', () => {
    const lessons = [{ id: 1, student: 'Zyon', subject: 'Nederlands', subvak: 'Grammatica', archived: false, deleted_at: null }];
    const topics = [
      { id: 10, student: 'Zyon', subject: 'Nederlands', subvak: 'Grammatica' },
      { id: 11, student: 'Zyon', subject: 'Nederlands', subvak: 'Boekbespreking' }
    ];

    const groups = getLessonSubjectGroups(lessons, 'Zyon', topics);

    expect(groups).toHaveLength(1);
    expect(groups[0].lessons).toHaveLength(1);
    expect(groups[0].topics.map(topic => topic.id)).toEqual([10, 11]);
  });

  it('combines lessons and learning topics by subvak for the subject view', () => {
    const groups = getSubjectSubvakGroups(
      [{ id: 1, subject: 'Nederlands', subvak: 'Grammatica' }],
      [{ id: 10, subject: 'Nederlands', subvak: 'Boekbespreking' }]
    );

    expect(groups.map(group => group.label)).toEqual(['Grammatica', 'Boekbespreking']);
    expect(groups[0].lessons).toHaveLength(1);
    expect(groups[1].topics).toHaveLength(1);
  });
});
