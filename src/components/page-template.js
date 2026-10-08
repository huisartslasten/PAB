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
  navigation.forEach(item => {
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
    if (typeof item.onClick === 'function') button.addEventListener('click', item.onClick);
    nav.appendChild(button);
  });
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
