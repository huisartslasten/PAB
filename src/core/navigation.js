export function createNavigation({ routes = {}, onUnknownRoute = null } = {}) {
  function go(name, payload = undefined) {
    const handler = routes[name];
    if (typeof handler === 'function') return handler(payload);
    if (typeof onUnknownRoute === 'function') return onUnknownRoute(name, payload);
    return undefined;
  }

  return { go };
}
