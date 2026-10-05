export function createNotificationBoundary(notify = () => {}) {
  const send = (message, type = 'info') => notify(String(message || ''), type);
  return Object.freeze({ send, info: message => send(message, 'info'), success: message => send(message, 'success'), error: message => send(message, 'error') });
}
