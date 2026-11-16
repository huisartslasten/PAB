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


const PACO_BONE_SILHOUETTE = "M11 5.5C8.2 2.2 3.5 2.7 2.1 6.2c-1.3 3.1.4 6.1 4.2 7.8-3.8 1.7-5.5 4.7-4.2 7.8 1.4 3.5 6.1 4 8.9.7l3.5-4h19l3.5 4c2.8 3.3 7.5 2.8 8.9-.7 1.3-3.1-.4-6.1-4.2-7.8 3.8-1.7 5.5-4.7 4.2-7.8-1.4-3.5-6.1-4-8.9-.7l-3.5 4H14.5z";

function createPacoBoneDifficulty({ level, maxLevel = 5, label = "Moeilijkheidsgraad", documentRef = document } = {}) {
  const maximum = Number(maxLevel);
  const current = Number(level);
  if (!Number.isInteger(maximum) || maximum < 1 || maximum > 10) throw new RangeError("maxLevel must be an integer between 1 and 10.");
  if (!Number.isInteger(current) || current < 1 || current > maximum) throw new RangeError("level must be an integer between 1 and maxLevel.");

  const root = documentRef.createElement("div");
  root.className = "paco-bone-difficulty";
  root.dataset.level = String(current);
  root.dataset.maxLevel = String(maximum);
  root.setAttribute("role", "img");
  root.setAttribute("aria-label", label + ": " + current + " van " + maximum);

  for (let index = 1; index <= maximum; index += 1) {
    const svg = documentRef.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 48 28");
    svg.setAttribute("aria-hidden", "true");
    svg.classList.add("paco-bone-difficulty__bone");
    if (index <= current) svg.classList.add("is-filled");
    const path = documentRef.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", PACO_BONE_SILHOUETTE);
    path.setAttribute("class", "paco-bone-difficulty__shape");
    svg.appendChild(path);
    root.appendChild(svg);
  }
  return root;
}

export { createPacoBoneDifficulty };
