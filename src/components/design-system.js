export function createPacoDropdown({
  label = '',
  options = [],
  value = null,
  onChange = null,
  className = ''
} = {}) {
  const root = document.createElement('div');
  root.className = `paco-dropdown ${className}`.trim();

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'paco-dropdown-trigger';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');

  const triggerLabel = document.createElement('span');
  triggerLabel.className = 'paco-dropdown-label';

  const chevron = document.createElement('span');
  chevron.className = 'paco-dropdown-chevron';
  chevron.setAttribute('aria-hidden', 'true');

  trigger.appendChild(triggerLabel);
  trigger.appendChild(chevron);
  root.appendChild(trigger);

  const menu = document.createElement('div');
  menu.className = 'paco-dropdown-menu';
  menu.setAttribute('role', 'listbox');
  root.appendChild(menu);

  let selectedValue = value ?? (options[0]?.value ?? '');

  const selectedOption = () => options.find(option => option.value === selectedValue) || options[0];

  function render() {
    const selected = selectedOption();
    triggerLabel.textContent = selected?.label ?? label;
    menu.replaceChildren();

    options.forEach(option => {
      const optionButton = document.createElement('button');
      optionButton.type = 'button';
      optionButton.className = 'paco-dropdown-option';
      optionButton.setAttribute('role', 'option');
      optionButton.setAttribute('aria-selected', String(option.value === selectedValue));

      const check = document.createElement('span');
      check.className = 'paco-dropdown-check';
      check.textContent = option.value === selectedValue ? '✓' : '';
      check.setAttribute('aria-hidden', 'true');

      const text = document.createElement('span');
      text.textContent = option.label || '';

      optionButton.appendChild(check);
      optionButton.appendChild(text);

      optionButton.addEventListener('click', () => {
        selectedValue = option.value;
        render();
        close();
        if (typeof onChange === 'function') onChange(selectedValue, option);
      });

      menu.appendChild(optionButton);
    });
  }

  function open() {
    root.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
  }

  function close() {
    root.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  }

  trigger.addEventListener('click', event => {
    event.stopPropagation();
    root.classList.contains('open') ? close() : open();
  });

  root.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      close();
      trigger.focus();
    }
  });

  document.addEventListener('click', event => {
    if (!root.contains(event.target)) close();
  });

  render();

  return {
    element: root,
    getValue: () => selectedValue,
    setValue: nextValue => {
      selectedValue = nextValue;
      render();
    },
    open,
    close
  };
}
