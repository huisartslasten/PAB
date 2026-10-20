/**
 * PacoGO canonical page template.
 *
 * This is the default structural shell for normal PacoGO pages.
 * Page-specific functionality belongs in the content slot; the shell owns
 * the visual frame: hero banner, left sidebar, middle field and release marker.
 */

const TEMPLATE_SCROLL_KEY = 'pacoGO:template-scroll';
const TEMPLATE_SCROLL_CLEANUP_PROPERTY = '__pacoGOTemplateScrollCleanup';
const TEMPLATE_SIDEBAR_SCROLL_CLEANUP_PROPERTY = '__pacoGOTemplateSidebarScrollCleanup';
export const PACOGO_TEST_VERSION = 'V7.0';

function installManualScrollRestoration(windowRef) {
  if (!windowRef.history || !('scrollRestoration' in windowRef.history)) return null;

  const previous = windowRef.history.scrollRestoration;
  windowRef.history.scrollRestoration = 'manual';
  return () => {
    windowRef.history.scrollRestoration = previous;
  };
}

export function installPacoTemplateSidebarScrollChaining({ navigationElement, windowRef = window, documentRef = document } = {}) {
  if (!navigationElement) throw new Error('installPacoTemplateSidebarScrollChaining requires a navigation element');

  const previousCleanup = windowRef[TEMPLATE_SIDEBAR_SCROLL_CLEANUP_PROPERTY];
  if (typeof previousCleanup === 'function') previousCleanup();

  const shouldTransfer = event => {
    if (event.defaultPrevented || event.ctrlKey || event.deltaY === 0) return false;

    const maxScrollTop = Math.max(0, navigationElement.scrollHeight - navigationElement.clientHeight);
    const atTop = navigationElement.scrollTop <= 1;
    const atBottom = navigationElement.scrollTop >= maxScrollTop - 1;
    const scrollingDown = event.deltaY > 0;
    const scrollingUp = event.deltaY < 0;

    if ((scrollingDown && !atBottom) || (scrollingUp && !atTop)) return false;

    const maxPageScroll = Math.max(0, documentRef.documentElement.scrollHeight - windowRef.innerHeight);
    const pageScrollY = windowRef.scrollY || windowRef.pageYOffset || 0;
    const pageCanScroll = scrollingDown ? pageScrollY < maxPageScroll - 1 : pageScrollY > 1;
    if (!pageCanScroll) return false;

    return true;
  };

  const onWheel = event => {
    if (!shouldTransfer(event)) return;
    event.preventDefault();
    windowRef.scrollBy(0, event.deltaY);
  };

  navigationElement.addEventListener('wheel', onWheel, { passive: false });

  const cleanup = () => {
    navigationElement.removeEventListener('wheel', onWheel);
    if (windowRef[TEMPLATE_SIDEBAR_SCROLL_CLEANUP_PROPERTY] === cleanup) {
      delete windowRef[TEMPLATE_SIDEBAR_SCROLL_CLEANUP_PROPERTY];
    }
  };

  windowRef[TEMPLATE_SIDEBAR_SCROLL_CLEANUP_PROPERTY] = cleanup;
  return cleanup;
}

export function installPacoTemplateScrollMemory({ windowRef = window, documentRef = document } = {}) {
  const previousCleanup = windowRef[TEMPLATE_SCROLL_CLEANUP_PROPERTY];
  if (typeof previousCleanup === 'function') previousCleanup();

  const restoreHistoryScroll = installManualScrollRestoration(windowRef);

  const save = () => {
    try {
      windowRef.sessionStorage.setItem(TEMPLATE_SCROLL_KEY, String(windowRef.scrollY || 0));
    } catch (error) {
      console.warn('Could not save PacoGO template scroll position:', error);
    }
  };

  const restore = () => {
    let savedPosition = null;
    try {
      const raw = windowRef.sessionStorage.getItem(TEMPLATE_SCROLL_KEY);
      if (raw !== null) savedPosition = Number(raw);
    } catch (error) {
      console.warn('Could not read PacoGO template scroll position:', error);
    }

    if (!Number.isFinite(savedPosition) || savedPosition <= 0) return;

    let attempts = 0;
    const startedAt = Date.now();
    const tryRestore = () => {
      attempts += 1;
      const maxScroll = Math.max(0, documentRef.documentElement.scrollHeight - windowRef.innerHeight);
      const target = Math.min(savedPosition, maxScroll);
      windowRef.scrollTo(0, target);

      const contentReady = maxScroll >= savedPosition;
      const timedOut = Date.now() - startedAt >= 2000;
      if (contentReady || timedOut || attempts >= 60) {
        try {
          windowRef.sessionStorage.removeItem(TEMPLATE_SCROLL_KEY);
        } catch (error) {
          console.warn('Could not clear PacoGO template scroll position:', error);
        }
        return;
      }

      windowRef.requestAnimationFrame(tryRestore);
    };

    windowRef.requestAnimationFrame(tryRestore);
  };

  windowRef.addEventListener('pagehide', save);
  windowRef.addEventListener('pageshow', restore);
  restore();

  const cleanup = () => {
    windowRef.removeEventListener('pagehide', save);
    windowRef.removeEventListener('pageshow', restore);
    if (typeof restoreHistoryScroll === 'function') restoreHistoryScroll();
    if (windowRef[TEMPLATE_SCROLL_CLEANUP_PROPERTY] === cleanup) {
      delete windowRef[TEMPLATE_SCROLL_CLEANUP_PROPERTY];
    }
  };

  windowRef[TEMPLATE_SCROLL_CLEANUP_PROPERTY] = cleanup;
  return cleanup;
}

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
  button.className = 'paco-template-nav-item' + (item.active ? ' active' : '') + (item.key === 'management' ? ' management' : '');

  let iconElement = null;
  if (item.icon) {
    iconElement = document.createElement('span');
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
    group.classList.add('always-open');
  }

  if (typeof item.onClick === 'function') button.addEventListener('click', item.onClick);
  group.appendChild(button);

  if (Array.isArray(item.submenu) && item.submenu.length) {
    const submenu = document.createElement('div');
    submenu.className = 'paco-template-nav-submenu';

    item.submenu.forEach(subitem => {
      const subbutton = document.createElement('button');
      subbutton.type = 'button';
      subbutton.className = 'paco-template-nav-subitem' + (subitem.active ? ' active' : '') + (item.key === 'management-student' ? ' management-student' : '');
      subbutton.textContent = subitem.label || '';
      if (typeof subitem.onClick === 'function') subbutton.addEventListener('click', subitem.onClick);
      submenu.appendChild(subbutton);
    });

    group.appendChild(submenu);
  }

  if (typeof item.bind === 'function') item.bind({ button, label, icon: iconElement });

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
  greeting = '',
  navigation = [],
  title = '',
  icon = '',
  subtitle = '',
  content = null,
  className = '',
  testVersion = PACOGO_TEST_VERSION,
  backLabel = '← Terug',
  backAction = null
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

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'paco-template-back';
  backButton.textContent = backLabel;
  backButton.addEventListener('click', typeof backAction === 'function' ? backAction : () => window.history.back());
  sidebar.appendChild(backButton);

  const sidebarCard = document.createElement('div');
  sidebarCard.className = 'paco-template-sidebar-card';

  const greetingElement = document.createElement('div');
  greetingElement.className = 'paco-template-greeting';
  greetingElement.textContent = greeting;
  sidebarCard.appendChild(greetingElement);

  const navigationElement = document.createElement('nav');
  navigationElement.className = 'paco-template-navigation';
  navigationElement.setAttribute('aria-label', 'PacoGO navigatie');
  navigation.forEach(item => navigationElement.appendChild(createNavigationItem(item)));
  sidebarCard.appendChild(navigationElement);
  sidebar.appendChild(sidebarCard);
  body.appendChild(sidebar);

  const main = document.createElement('main');
  main.className = 'paco-template-main';

  const pageHeader = document.createElement('header');
  pageHeader.className = 'paco-template-page-header';

  const iconElement = document.createElement('div');
  iconElement.className = 'paco-template-page-icon';
  iconElement.textContent = icon;
  iconElement.hidden = !icon;
  pageHeader.appendChild(iconElement);

  const heading = document.createElement('div');
  heading.className = 'paco-template-page-heading';
  const titleElement = document.createElement('h1');
  titleElement.textContent = title;
  heading.appendChild(titleElement);
  const subtitleElement = document.createElement('p');
  subtitleElement.textContent = subtitle;
  subtitleElement.hidden = !subtitle;
  heading.appendChild(subtitleElement);
  pageHeader.appendChild(heading);
  main.appendChild(pageHeader);

  const contentElement = document.createElement('section');
  contentElement.className = 'paco-template-page-content';
  const contentNode = nodeFrom(content);
  if (contentNode) contentElement.appendChild(contentNode);
  main.appendChild(contentElement);

  body.appendChild(main);
  root.appendChild(body);

  const versionMarker = document.createElement('small');
  versionMarker.className = 'paco-template-version-badge';
  versionMarker.textContent = testVersion;
  versionMarker.style.cssText = 'display:block;width:max-content;margin:-28px auto 10px;padding:0;background:transparent;border:0;border-radius:0;color:rgba(255,255,255,.72);font:600 10px/1 "Nunito",sans-serif;letter-spacing:.4px;box-shadow:none;text-shadow:none;';
  root.appendChild(versionMarker);

  return root;
}
