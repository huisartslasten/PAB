import fs from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { createPacoDropdown } from './design-system.js';

describe('createPacoDropdown', () => {
  it('renders the selected option and changes value', () => {
    const onChange = vi.fn();
    const dropdown = createPacoDropdown({ options: [{ value: 'manual', label: 'GEEN TIJDSLIMIET' }, { value: '3', label: '3 seconden' }], value: 'manual', onChange });
    expect(dropdown.getValue()).toBe('manual');
    expect(dropdown.element.querySelector('.paco-dropdown-label').textContent).toBe('GEEN TIJDSLIMIET');
    const trigger = dropdown.element.querySelector('.paco-dropdown-trigger');
    trigger.click();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    dropdown.element.querySelectorAll('.paco-dropdown-option')[1].click();
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

  it('keeps dropdown menus hidden until the dropdown is open', () => {
    const css = fs.readFileSync(new URL('./design-system.css', import.meta.url), 'utf8');
    expect(css).toContain('.paco-dropdown-menu { display:none;');
    expect(css).toContain('.paco-dropdown.open .paco-dropdown-menu { display:block; }');
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

describe('PacoGO card primitive', () => {
  it('is owned by the Design System stylesheet and not the Page Template stylesheet', () => {
    const designSystemCss = fs.readFileSync(new URL('./design-system.css', import.meta.url), 'utf8');
    const pageTemplateCss = fs.readFileSync(new URL('./page-template.css', import.meta.url), 'utf8');
    expect(designSystemCss).toContain('.card {');
    expect(designSystemCss).toContain('.card h2');
    expect(designSystemCss).toContain('.card label');
    expect(designSystemCss).toContain('.card .small');
    expect(pageTemplateCss).not.toContain('.paco-page-template .card');
    expect(pageTemplateCss).not.toContain('.paco-template-card');
  });
});

describe('PacoGO form control primitives', () => {
  it('are owned by the Design System and no longer by Page Template', () => {
    const designSystemCss = fs.readFileSync(new URL('./design-system.css', import.meta.url), 'utf8');
    const pageTemplateCss = fs.readFileSync(new URL('./page-template.css', import.meta.url), 'utf8');
    expect(designSystemCss).toContain('.paco-form-control');
    expect(designSystemCss).toContain('input[type="text"]');
    expect(designSystemCss).toContain('input[type="date"]');
    expect(designSystemCss).toContain('input[type="time"]');
    expect(designSystemCss).toContain('textarea');
    expect(designSystemCss).toContain('select');
    expect(pageTemplateCss).not.toContain('input[type="text"]');
    expect(pageTemplateCss).not.toContain('input[type="date"]');
    expect(pageTemplateCss).not.toContain('textarea');
    expect(pageTemplateCss).not.toContain('select');
  });
});


describe('PacoGO bone difficulty indicator', () => {
  it('renders five original vector bones with the correct filled state and accessible label', async () => {
    const { createPacoBoneDifficulty } = await import('./design-system.js');
    const indicator = createPacoBoneDifficulty({ level: 1, maxLevel: 5 });
    expect(indicator.getAttribute('aria-label')).toBe('Moeilijkheidsgraad: 1 van 5');
    expect(indicator.querySelectorAll('svg')).toHaveLength(5);
    expect(indicator.querySelectorAll('svg.is-filled')).toHaveLength(1);
    expect(indicator.querySelectorAll('svg:not(.is-filled)')).toHaveLength(4);
    expect(indicator.querySelector('path').getAttribute('d')).toContain('M11 5.5');\n    expect(indicator.querySelector('path').getAttribute('d')).toContain('H14.5');
  });

  it('renders all filled bones at level five and rejects invalid levels', async () => {
    const { createPacoBoneDifficulty } = await import('./design-system.js');
    expect(createPacoBoneDifficulty({ level: 5 }).querySelectorAll('svg.is-filled')).toHaveLength(5);
    expect(() => createPacoBoneDifficulty({ level: 0 })).toThrow(RangeError);
    expect(() => createPacoBoneDifficulty({ level: 6 })).toThrow(RangeError);
  });

  it('keeps bone illustration styling in the central Design System stylesheet', () => {
    const css = fs.readFileSync(new URL('./design-system.css', import.meta.url), 'utf8');
    expect(css).toContain('.paco-bone-difficulty__shape');
    expect(css).toContain('.paco-bone-difficulty__bone.is-filled');
  });
});
