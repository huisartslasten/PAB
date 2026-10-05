export function createActivityState() {
  let activity = null;

  function start(next) {
    activity = next || null;
    return activity;
  }
  function get() { return activity; }
  function clear() { activity = null; return activity; }
  function update(patch = {}) {
    if (!activity) return null;
    activity = { ...activity, ...patch };
    return activity;
  }

  return Object.freeze({ start, get, clear, update });
}
