export function createNotificationBus({ onNotify = () => {} } = {}) {
  function notify(notification = {}) {
    const value = Object.freeze({
      type: String(notification.type || 'info'),
      message: String(notification.message || ''),
      data: notification.data ?? null
    });
    onNotify(value);
    return value;
  }
  return Object.freeze({ notify });
}
