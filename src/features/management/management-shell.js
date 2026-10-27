import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { buildViewUrl } from '../../core/view-context.js';

/**
 * Canonical structural shell for parent/management pages.
 *
 * Management features own their content and behavior. This shell owns the
 * shared management context: session initialization, parent access, back
 * navigation and management navigation mounted into the canonical page
 * template.
 */
export function createManagementShell({
  app,
  templateMount,
  navigate,
  documentRef = document
} = {}) {
  if (!app) throw new TypeError('Management shell requires app.');
  if (!templateMount) throw new TypeError('Management shell requires template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Management shell requires navigation owner.');

  async function mount({
    title = '',
    icon = '',
    subtitle = '',
    active = 'management-dashboard',
    content = null,
    managementStudents = [],
    student = null,
    includeManagementDashboard = true,
    includeManagementTools = true,
    includeCreator = true,
    backLabel = '← Beheer'
  } = {}) {
    const session = await app.initializeSession();
    if (!session) {
      const location = documentRef.defaultView?.location;
      if (location) location.href = 'auth.html';
      return { authorized: false, reason: 'unauthenticated' };
    }

    const navigation = createPacoNavigation({
      app,
      student,
      includeManagement: false,
      includeManagementDashboard,
      includeManagementTools,
      includeCreator,
      managementStudents,
      active,
      viewMode: 'management',
      navigate
    });

    const backAction = () => navigate(buildViewUrl('management.html'));

    mountPacoPageTemplate({
      mount: templateMount,
      backLabel,
      backAction,
      greeting: 'PacoGO beheer ⚙️',
      title,
      icon,
      subtitle,
      navigation,
      content
    });

    if (!app.auth?.isParent) {
      return { authorized: false, reason: 'forbidden' };
    }

    return { authorized: true };
  }

  return Object.freeze({ mount });
}
