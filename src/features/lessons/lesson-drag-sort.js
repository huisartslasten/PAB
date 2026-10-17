export function getLessonCardOrder(container, selector = '[data-lesson-id]') {
  return [...container.querySelectorAll(selector)]
    .map(card => Number(card.dataset.lessonId))
    .filter(Boolean);
}

export function attachLessonDragSorting(container, {
  selector = '[data-lesson-id][draggable="true"]',
  onOrderChange = async () => {},
  onError = async () => {}
} = {}) {
  if (!container) throw new Error('attachLessonDragSorting requires a container.');

  const clearDragState = () => {
    container.querySelectorAll('.paco-lesson-card.dragging,.paco-lesson-card.drag-over')
      .forEach(element => element.classList.remove('dragging', 'drag-over'));
  };

  container.querySelectorAll(selector).forEach(card => {
    card.addEventListener('dragstart', event => {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', card.dataset.lessonId);
      card.classList.add('dragging');
    });

    card.addEventListener('dragover', event => {
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = 'move';
      if (!card.classList.contains('dragging')) card.classList.add('drag-over');
    });

    card.addEventListener('dragleave', () => card.classList.remove('drag-over'));

    card.addEventListener('drop', async event => {
      event.preventDefault();
      event.stopPropagation();

      const sourceId = Number(event.dataTransfer.getData('text/plain'));
      const targetId = Number(card.dataset.lessonId);
      if (!sourceId || !targetId || sourceId === targetId) {
        clearDragState();
        return;
      }

      const source = container.querySelector(`[data-lesson-id="${sourceId}"]`);
      if (!source) {
        clearDragState();
        return;
      }

      const rect = card.getBoundingClientRect();
      const position = event.clientY > rect.top + rect.height / 2 ? 'after' : 'before';
      if (position === 'after') card.after(source);
      else card.before(source);

      const orderedIds = getLessonCardOrder(container);
      try {
        await onOrderChange({ sourceId, targetId, position, orderedIds, source, target: card });
      } catch (error) {
        await onError(error);
      } finally {
        clearDragState();
      }
    });

    card.addEventListener('dragend', clearDragState);
  });

  return { clearDragState };
}
