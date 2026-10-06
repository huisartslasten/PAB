export async function showTestHistoryRuntime({
  requireParent,
  hideAll,
  showPage,
  setGreeting,
  setLoading,
  refreshSidebars,
  listAttempts,
  renderAttempts,
  renderError,
  studentFilter = ''
} = {}) {
  const required = {
    requireParent,
    hideAll,
    showPage,
    setGreeting,
    setLoading,
    refreshSidebars,
    listAttempts,
    renderAttempts,
    renderError
  };

  for (const [name, value] of Object.entries(required)) {
    if (typeof value !== 'function') {
      throw new Error(`A test-history runtime function is required: ${name}.`);
    }
  }

  if (!requireParent()) return Object.freeze({ ok: false, reason: 'unauthorized' });

  hideAll();
  setGreeting(studentFilter);
  setLoading();
  showPage();
  refreshSidebars();

  try {
    const attempts = await listAttempts(studentFilter);
    renderAttempts(attempts || []);
    return Object.freeze({ ok: true, attempts: attempts || [] });
  } catch (error) {
    renderError(error);
    return Object.freeze({ ok: false, error });
  }
}
