/** Pure agenda student scoping helper. */
export function filterAgendaByStudent(items=[],student='') {
  const target=String(student||'').trim();
  return (Array.isArray(items)?items:[]).filter(item=>String(item?.student||'').trim()===target);
}
