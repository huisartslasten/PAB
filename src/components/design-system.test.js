import fs from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { createPacoDropdown } from './design-system.js';

describe('createPacoDropdown', () => {
  it('renders the selected option and changes value', () => {
    const onChange = vi.fn();
    const dropdown = createPacoDropdown({
      options: [
        { value: 'manual', label: 'GEEN TIJDSLIMIET' },
        { value: '3', label: '3 seconden' }
      ],
      value: 'manual',
      onChange
    });

    expect(dropdown.getValue()).toBe('manual');
    expect(dropdown.element.querySelector('.paco-dropdown-label').textContent).toBe('GEEN TIJDSLIMIET');

    const trigger = dropdown.element.querySelector('.paco-dropdown-trigger');
    trigger.click();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    const option = dropdown.element.querySelectorAll('.paco-dropdown-option')[1];
    option.click();

    expect(dropdown.getValue()).toBe('3');
    expect(onChange).toHaveBeenCalledWith('3', { value: '3', label: '3 seconden' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes on Escape and restores focus to the trigger', () => {
    const dropdown = createPacoDropdown({ options: [{ value: 'a', label: 'A' }] });
    const trigger = dropdown.element.querySelector('.paco-dropdown-trigger');

    trigger.click();
    dropdown.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});

describe('PacoGO button primitives', () => {
  it('are owned by the Design System stylesheet', () => {
    const css = fs.readFileSync(new URL('./design-system.css', import.meta.url), 'utf8');

    expect(css).toContain('.paco-btn {');
    expect(css).toContain('.paco-btn--primary');
    expect(css).toContain('.paco-btn--secondary');
    expect(css).toContain('.paco-btn--accent');
    expect(css).toContain('.paco-btn--danger');
    expect(css).toContain('.paco-btn--small');
    expect(css).toContain('.paco-btn--large');
    expect(css).toContain('.paco-btn--block');
  });
});
