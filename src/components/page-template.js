import { createPacoNavigationItem } from './page-navigation.js';

/**
 * PacoGO canonical page template.
 *
 * This is the default structural shell for normal PacoGO pages.
 * Page-specific functionality belongs in the content slot; the shell owns
 * the visual frame: optional management context bar, hero banner, left sidebar,
 * middle field and release marker.
 */

const TEMPLATE_SCROLL_KEY = 'pacoGO:template-scroll';
const TEMPLATE_SCROLL_CLEANUP_PROPERTY = '__pacoGOTemplateScrollCleanup';
const TEMPLATE_SIDEBAR_SCROLL_CLEANUP_PROPERTY = '__pacoGOTemplateSidebarScrollCleanup';
const MANAGEMENT_TOPBAR_STYLE_ID = 'pacogo-management-topbar-styles';
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

function ensureManagementTopbarStyles(documentRef) {
  if (documentRef.getElementById(MANAGEMENT_TOPBAR_STYLE_ID)) return;
  const style = documentRef.createElement('style');
  style.id = MANAGEMENT_TOPBAR_STYLE_ID;
  style.textContent = `
    .paco-management-topbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 58px;
      padding: 8px 18px;
      background: rgba(255,255,255,.97);
      border-bottom: 1px solid rgba(30,45,38,.12);
      box-shadow: 0 2px 10px rgba(20,35,28,.06);
      backdrop-filter: blur(8px);
    }
    .paco-management-topbar-brand { font-weight: 800; letter-spacing: .2px; white-space: nowrap; }
    .paco-management-topbar-mode { font-size: 11px; font-weight: 800; letter-spacing: 1px; color: #6c786f; margin-right: 8px; }
    .paco-management-topbar-students { display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0; overflow-x: auto; }
    .paco-management-topbar-button {
      border: 1px solid #d6dfd9;
      background: #fff;
      color: #34463b;
      border-radius: 8px;
      padding: 8px 12px;
      font: inherit;
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
      cursor: pointer;
    }
    .paco-management-topbar-button:hover { background: #f1f5f2; }
    .paco-management-topbar-button.active { background: #e7f0ea; border-color: #c5d5ca; color: #1f3929; }
    .paco-management-topbar-logout { margin-left: auto; }
    .paco-management-topbar-spacer { flex: 1; }
    .paco-page-template.management-template .paco-template-hero { margin-top: 0; }
    @media (max-width: 760px) {
      .paco-management-topbar { gap: 7px; padding: 7px 10px; }
      .paco-management-topbar-brand { font-size: 14px; }
      .paco-management-topbar-mode { display: none; }
      .paco-management-topbar-button { padding: 7px 9px; font-size: 12px; }
    }
  `;
  documentRef.head.appendChild(style);
}

function createManagementTopbar({ topbar, documentRef }) {
  if (!topbar) return null;
  ensureManagementTopbarStyles(documentRef);

  const bar = documentRef.createElement('header');
  bar.className = 'paco-management-topbar';

  const brand = documentRef.createElement('div');
  brand.className = 'paco-management-topbar-brand';
  brand.textContent = 'PacoGO';
  bar.appendChild(brand);

  const mode = documentRef.createElement('div');
  mode.className = 'paco-management-topbar-mode';
  mode.textContent = 'BEHEER';
  bar.appendChild(mode);

  const students = documentRef.createElement('div');
  students.className = 'paco-management-topbar-students';
  students.setAttribute('aria-label', 'Leerlingen');
  (topbar.students || []).forEach(student => {
    const button = documentRef.createElement('button');
    button.type = 'button';
    button.className = 'paco-management-topbar-button' + (student.active ? ' active' : '');
    button.textContent = student.label;
    if (typeof student.onClick === 'function') button.addEventListener('click', student.onClick);
    students.appendChild(button);
  });
  bar.appendChild(students);

  const spacer = documentRef.createElement('div');
  spacer.className = 'paco-management-topbar-spacer';
  bar.appendChild(spacer);

  if (typeof topbar.onLogout === 'function') {
    const logout = documentRef.createElement('button');
    logout.type = 'button';
    logout.className = 'paco-management-topbar-button paco-management-topbar-logout';
    logout.textContent = 'Uitloggen';
    logout.addEventListener('click', topbar.onLogout);
    bar.appendChild(logout);
  }

  return bar;
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

export function createPacoPageTemplate({
  greeting = '',
  navigation = [],
  title = '',
  icon = '',
  subtitle = '',
  content = null,
  className = '',
  topbar = null,
  testVersion = PACOGO_TEST_VERSION
} = {}) {
  const root = document.createElement('div');
  root.className = `paco-page-template ${className}`.trim();

  const managementTopbar = createManagementTopbar({ topbar, documentRef: document });
  if (managementTopbar) root.appendChild(managementTopbar);

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
  backButton.textContent = '← Terug';
  backButton.addEventListener('click', () => window.history.back());
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
  navigation.forEach(item => navigationElement.appendChild(createPacoNavigationItem(item)));
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
  root.appendChild(versionMarker);

  return root;
}

function updatePacoPageTemplate(template, {
  greeting = '',
  navigation = [],
  title = '',
  icon = '',
  subtitle = '',
  content = null,
  topbar = null
} = {}) {
  if (!template) throw new Error('updatePacoPageTemplate requires a template');

  const backButton = template.querySelector('.paco-template-back');
  const greetingElement = template.querySelector('.paco-template-greeting');
  const navigationElement = template.querySelector('.paco-template-navigation');
  const iconElement = template.querySelector('.paco-template-page-icon');
  const titleElement = template.querySelector('.paco-template-page-heading h1');
  const subtitleElement = template.querySelector('.paco-template-page-heading p');
  const contentElement = template.querySelector('.paco-template-page-content');

  if (!backButton || !greetingElement || !navigationElement || !iconElement || !titleElement || !subtitleElement || !contentElement) {
    throw new Error('PacoGO page template is missing its canonical shell elements.');
  }

  if (topbar) {
    const existingTopbar = template.querySelector('.paco-management-topbar');
    const nextTopbar = createManagementTopbar({ topbar, documentRef: document });
    if (existingTopbar && nextTopbar) existingTopbar.replaceWith(nextTopbar);
    else if (!existingTopbar && nextTopbar) template.prepend(nextTopbar);
  }

  backButton.textContent = '← Terug';
  backButton.onclick = () => window.history.back();
  greetingElement.textContent = greeting;
  navigationElement.replaceChildren(...navigation.map(createPacoNavigationItem));
  iconElement.textContent = icon;
  iconElement.hidden = !icon;
  titleElement.textContent = title;
  subtitleElement.textContent = subtitle;
  subtitleElement.hidden = !subtitle;

  const contentNode = nodeFrom(content);
  contentElement.replaceChildren();
  if (contentNode) contentElement.appendChild(contentNode);

  const versionMarker = template.querySelector('.paco-template-version-badge');
  if (versionMarker) versionMarker.textContent = PACOGO_TEST_VERSION;

  return template;
}

export function mountPacoPageTemplate({ mount, ...options } = {}) {
  if (!mount) throw new Error('mountPacoPageTemplate requires a mount element');

  const existingTemplate = mount.firstElementChild?.classList.contains('paco-page-template')
    ? mount.firstElementChild
    : null;

  if (existingTemplate) {
    return updatePacoPageTemplate(existingTemplate, options);
  }

  const template = createPacoPageTemplate(options);
  mount.replaceChildren(template);
  installPacoTemplateScrollMemory();
  installPacoTemplateSidebarScrollChaining({ navigationElement: template.querySelector('.paco-template-navigation') });
  return template;
}
