const DEFAULT_FONT_SIZE = 22;

function normalizeFontSize(size, fallback = DEFAULT_FONT_SIZE) {
  const value = Number(size);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function createEditorFormatting({ selectionStore, defaultFontSize = DEFAULT_FONT_SIZE } = {}) {
  if (!selectionStore || typeof selectionStore.restore !== 'function' || typeof selectionStore.remember !== 'function') {
    throw new TypeError('Editor formatting requires a selection store.');
  }

  const baseFontSize = normalizeFontSize(defaultFontSize);

  function applyFontSize(surface, size) {
    const range = selectionStore.restore(surface);
    if (!range || range.collapsed || !surface?.ownerDocument) return false;

    const safeSize = normalizeFontSize(size, baseFontSize);
    const span = surface.ownerDocument.createElement('span');
    span.style.fontSize = `${safeSize}px`;
    span.appendChild(range.extractContents());
    range.insertNode(span);

    const next = surface.ownerDocument.createRange();
    next.selectNodeContents(span);
    const selection = surface.ownerDocument.getSelection?.();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(next.cloneRange());
    }
    selectionStore.remember(surface);
    surface.focus?.();
    return true;
  }

  function insertTextWithFontSize(surface, size, data) {
    const selection = surface?.ownerDocument?.getSelection?.();
    if (!selection?.rangeCount || !data) return false;

    const range = selection.getRangeAt(0).cloneRange();
    const container = range.startContainer?.nodeType === 1
      ? range.startContainer
      : range.startContainer?.parentElement;
    if (!container || typeof container.closest !== 'function') return false;
    if (!surface.contains?.(range.commonAncestorContainer)) return false;

    const safeSize = normalizeFontSize(size, baseFontSize);
    const currentSpan = container.closest('span[style*="font-size"]');
    const currentSize = currentSpan ? Number.parseFloat(currentSpan.style.fontSize) : null;
    if (range.collapsed && currentSpan && currentSize === safeSize) return false;
    if (range.collapsed && !currentSpan && safeSize === baseFontSize) return false;

    const span = surface.ownerDocument.createElement('span');
    span.style.fontSize = `${safeSize}px`;
    span.appendChild(surface.ownerDocument.createTextNode(data));
    range.deleteContents();
    range.insertNode(span);

    const next = surface.ownerDocument.createRange();
    next.setStart(span, span.childNodes.length);
    next.collapse(true);
    selection.removeAllRanges();
    selection.addRange(next);
    selectionStore.remember(surface);
    return true;
  }

  return Object.freeze({
    defaultFontSize: baseFontSize,
    applyFontSize,
    insertTextWithFontSize,
  });
}
