/**
 * PacoGO canonical page template.
 *
 * This is the default structural shell for normal PacoGO pages.
 * Page-specific functionality belongs in the content slot; the shell owns
 * the visual frame: hero banner, left sidebar and middle field.
 */

function nodeFrom(value) {
  if (value instanceof Node) return value;
  if (typeof value === 'string') {
    const template = document.createElement('template');
    template.innerHTML = value.trim();
    return template.content.firstElementChild || document.createTextNode(value);
  }
  return null;
}

function createNavigationItem(item) {
  const group = document.createElement('div');
  group.className = 'paco-template-nav-group';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'paco-template-nav-item' + (item.active ? ' active' : '');

  if (item.icon) {
    const iconElement = document.createElement('span');
    iconElement.className = 'paco-template-nav-icon';
    iconElement.textContent = item.icon;
    button.appendChild(iconElement);
  }

  const label = document.createElement('span');
  label.textContent = item.label || '';
  button.appendChild(label);

  if (Array.isArray(item.submenu) && item.submenu.length) {
    const chevron = document.createElement('span');
    chevron.className = 'paco-template-nav-chevron';
    chevron.textContent = '›';
    button.appendChild(chevron);

    if (item.expanded === true) {
      group.classList.add('always-open');
    }
  }

  if (typeof item.onClick === 'function') button.addEventListener('click', item.onClick);
  group.appendChild(button);

  if (Array.isArray(item.submenu) && item.submenu.length) {
    const submenu = document.createElement('div');
    submenu.className = 'paco-template-nav-submenu';

    item.submenu.forEach(subitem => {
      const subbutton = document.createElement('button');
      subbutton.type = 'button';
      subbutton.className = 'paco-template-nav-subitem' + (subitem.active ? ' active' : '');
      subbutton.textContent = subitem.label || '';
      if (typeof subitem.onClick === 'function') subbutton.addEventListener('click', subitem.onClick);
      submenu.appendChild(subbutton);
    });

    group.appendChild(submenu);
  }

  return group;
}

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

export function createPacoPageTemplate({
  backLabel = '← Terug',
  backAction = null,
  greeting = '',
  navigation = [],
  title = '',
  icon = '',
  subtitle = '',
  content = null,
  className = ''
} = {}) {
  const root = document.createElement('div');
  root.className = `paco-page-template ${className}`.trim();

  const hero = document.createElement('header');
  hero.className = 'paco-template-hero';
  const heroImage = document.createElement('img');
  heroImage.src = 'pacogo-aruba-hero.png';
  heroImage.alt = 'PacoGO Aruba';
  heroImage.className = 'paco-template-hero-image';
  hero.appendChild(heroImage);
  root.appendChild(hero);

  const body = document.createElement('div');
  body.className = 'paco-template-body';

  const sidebar = document.createElement('aside');
  sidebar.className = 'paco-template-sidebar';

  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'paco-template-back';
  back.textContent = backLabel;
  if (typeof backAction === 'function') back.addEventListener('click', backAction);
  sidebar.appendChild(back);

  const sidebarCard = document.createElement('div');
  sidebarCard.className = 'paco-template-sidebar-card';

  if (greeting) {
    const greetingElement = document.createElement('div');
    greetingElement.className = 'paco-template-greeting';
    greetingElement.textContent = greeting;
    sidebarCard.appendChild(greetingElement);
  }

  const nav = document.createElement('nav');
  nav.className = 'paco-template-navigation';
  navigation.forEach(item => nav.appendChild(createNavigationItem(item)));
  sidebarCard.appendChild(nav);

  sidebar.appendChild(sidebarCard);
  body.appendChild(sidebar);

  const main = document.createElement('main');
  main.className = 'paco-template-main';

  const pageHeader = document.createElement('header');
  pageHeader.className = 'paco-template-page-header';
  if (icon) {
    const iconElement = document.createElement('span');
    iconElement.className = 'paco-template-page-icon';
    iconElement.textContent = icon;
    pageHeader.appendChild(iconElement);
  }

  const headingWrap = document.createElement('div');
  headingWrap.className = 'paco-template-page-heading';
  const heading = document.createElement('h1');
  heading.textContent = title;
  headingWrap.appendChild(heading);
  if (subtitle) {
    const subtitleElement = document.createElement('p');
    subtitleElement.className = 'paco-template-page-subtitle';
    subtitleElement.textContent = subtitle;
    headingWrap.appendChild(subtitleElement);
  }
  pageHeader.appendChild(headingWrap);
  main.appendChild(pageHeader);

  const contentElement = document.createElement('section');
  contentElement.className = 'paco-template-page-content';
  const contentNode = nodeFrom(content);
  if (contentNode) contentElement.appendChild(contentNode);
  main.appendChild(contentElement);

  body.appendChild(main);
  root.appendChild(body);

  return root;
}

export function mountPacoPageTemplate(options = {}) {
  const mount = options.mount;
  if (!(mount instanceof Element)) {
    throw new Error('mountPacoPageTemplate requires a mount Element');
  }

  const templateOptions = { ...options };
  delete templateOptions.mount;
  const root = createPacoPageTemplate(templateOptions);
  mount.replaceChildren(root);
  return root;
}