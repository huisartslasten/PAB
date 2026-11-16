/** Pure student scoping helper for management views. */
export function filterByStudent(items=[],student='') {
  const target=String(student||'').trim();
  return (Array.isArray(items)?items:[]).filter(item=>String(item?.student||'').trim()===target);
}
