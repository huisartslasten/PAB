import { describe, expect, it, vi } from 'vitest';
import { createActivityCardGrid } from './activity-card-grid.js';

describe('createActivityCardGrid', () => {
  it('composes the canonical card primitive with activity-specific styling', () => {
    const onOpen = vi.fn();
    const grid = createActivityCardGrid({
      items: [{ title: 'Memory', description: 'Oefenen', icon: '🧠' }],
      onOpen
    });

    const card = grid.querySelector('button');
    expect(card.classList.contains('card')).toBe(true);
    expect(card.classList.contains('activity-card')).toBe(true);

    card.click();
    expect(onOpen).toHaveBeenCalledWith({ title: 'Memory', description: 'Oefenen', icon: '🧠' });
  });
});
