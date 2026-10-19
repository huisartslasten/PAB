import { createDashboardRuntime } from '../features/dashboard/runtime.js';
import { createLessonsRuntime } from '../features/lessons/runtime.js';
import { readViewContext } from '../core/view-context.js';

export function createPacoRouteRegistry({ app, mounts, documentRef = document } = {}) {
  if (!app) throw new TypeError('Paco route registry requires an app.');
  if (!mounts?.templateMount) throw new TypeError('Paco route registry requires a template mount.');

  const routes = {};

  routes['dashboard.html'] = ({ url, navigate }) => {
    const context = readViewContext(url.searchParams);
    const chooserMount = mounts.chooserMount;
    if (!chooserMount) throw new TypeError('Dashboard route requires a chooser mount.');
    return createDashboardRuntime({
      app,
      templateMount: mounts.templateMount,
      chooserMount,
      context,
      documentRef,
      navigate
    });
  };

  routes['lessons.html'] = ({ url, navigate }) => {
    const context = readViewContext(url.searchParams);
    const selectedSubject = url.searchParams.get('subject') || '';
    return createLessonsRuntime({
      app,
      templateMount: mounts.templateMount,
      context,
      selectedSubject,
      documentRef,
      navigate
    });
  };

  return Object.freeze(routes);
}
