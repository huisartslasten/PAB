function selectionIsInside(surface, range) {
  return Boolean(range && surface?.contains(range.commonAncestorContainer));
}

export function createEditorSelectionStore() {
  const selections = new WeakMap();

  function remember(surface) {
    const selection = surface?.ownerDocument?.getSelection?.();
    if (!selection?.rangeCount || !surface) return null;
    const range = selection.getRangeAt(0).cloneRange();
    if (!selectionIsInside(surface, range)) return null;
    selections.set(surface, range);
    return range;
  }

  function restore(surface) {
    const saved = selections.get(surface);
    if (!saved || !selectionIsInside(surface, saved)) return null;
    const selection = surface.ownerDocument.getSelection?.();
    if (!selection) return null;
    selection.removeAllRanges();
    selection.addRange(saved.cloneRange());
    return saved.cloneRange();
  }

  function setCaret(surface, node, offset = 0) {
    const selection = surface?.ownerDocument?.getSelection?.();
    if (!selection || !node || !surface.contains(node)) return false;
    const range = surface.ownerDocument.createRange();
    const maxOffset = node.nodeType === 3 ? node.textContent.length : node.childNodes.length;
    range.setStart(node, Math.max(0, Math.min(offset, maxOffset)));
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    selections.set(surface, range.cloneRange());
    surface.focus();
    return true;
  }

  function captureDocumentSelection() {
    const selection = document?.getSelection?.();
    if (!selection?.rangeCount) return null;
    const range = selection.getRangeAt(0);
    const parent = range.commonAncestorContainer?.nodeType === 1
      ? range.commonAncestorContainer
      : range.commonAncestorContainer?.parentElement;
    const surface = parent?.closest?.('[contenteditable="true"]');
    if (!surface || !selectionIsInside(surface, range)) return null;
    selections.set(surface, range.cloneRange());
    return { surface, range: range.cloneRange() };
  }

  return Object.freeze({ remember, restore, setCaret, captureDocumentSelection });
}

export { selectionIsInside };
