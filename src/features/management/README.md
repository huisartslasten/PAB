# Management feature

Owns parent/admin pages, student management, lesson management actions, archive/trash, parent feedback and creator-console boundaries.

Preserve the existing role and navigation behavior. Management extraction must not change student-facing UI or permissions.

## Current ownership boundaries

- `management.js` owns the parent-facing domain contract.
- `management-view.js` owns reusable management presentation.
- `src/services/lesson-service.js` owns direct lesson persistence.
- `src/services/feedback-service.js` owns direct access to the existing `parent_feedback` table.

The legacy V4.78 runtime remains the visual/behavioral reference until each extracted boundary is integrated and parity-tested.
