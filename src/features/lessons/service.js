// Compatibility adapter for the lessons feature.
// The canonical data boundary lives in src/services/lesson-service.js.
// Keep this adapter only while the staged migration is in progress.

import { createLessonService } from '../../services/lesson-service.js';

export function createLessonRepository(db) {
  const service = createLessonService(db);
  return Object.freeze({
    list: () => service.listAll()
  });
}
