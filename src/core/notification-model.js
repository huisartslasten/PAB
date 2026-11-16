export function createNotification({ id = null, title = '', message = '', type = 'info', action = null } = {}) {
  return Object.freeze({
    id,
    title: String(title || '').trim(),
    message: String(message || '').trim(),
    type: String(type || 'info').trim() || 'info',
    action
  });
}

export function hasNotificationContent(notification = {}) {
  return Boolean(String(notification.title || '').trim() || String(notification.message || '').trim());
}
