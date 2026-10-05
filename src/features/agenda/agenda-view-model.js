export function buildAgendaViewModel(items = [], { student = '', today = new Date() } = {}) {
  const todayKey = new Date(today).toISOString().slice(0, 10);
  const scoped = (Array.isArray(items) ? items : []).filter(item => !student || item?.student === student);
  const upcoming = scoped
    .filter(item => String(item?.date || '') >= todayKey)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  return Object.freeze({
    student,
    all: [...scoped],
    upcoming: [...upcoming]
  });
}
