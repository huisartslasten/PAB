const DEFAULT_FONT_SIZE = 22;

function normalizeFontSize(size, fallback = DEFAULT_FONT_SIZE) {
  const value = Number(size);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function textNodes(fragment) {
  const nodes = [];
  const visit = node => {
    if (node.nodeType === 3) {
      if (String(node.textContent || '').replaceAll('\u200b', '').trim()) nodes.push(node);
      return;
    }
    node.childNodes?.forEach(visit);
  };
  visit(fragment);
  return nodes;
}

function hasAncestorTag(node, tagName) {
  const expected = String(tagName).toUpperCase();
  let current = node?.parentNode;
  while (current) {
    if (current.nodeType === 1 && current.tagName === expected) return true;
    current = current.parentNode;
  }
  return false;
}

function unwrapTag(fragment, tagName) {
  const expected = String(tagName).toUpperCase();
  const elements = [];
  const visit = node => {
    if (node.nodeType === 1) {
      if (node.tagName === expected) elements.push(node);
      [...node.childNodes].forEach(visit);
    }
  };
  visit(fragment);
  elements.forEach(element => {
    const parent = element.parentNode;
    if (!parent) return;
    while (element.firstChild) parent.insertBefore(element.firstChild, element);
    element.remove();
  });
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

  function applyInlineFormat(surface, command) {
    const name = String(command || '').trim().toLowerCase();
    const tagName = name === 'bold' ? 'strong' : name === 'italic' ? 'em' : '';
    if (!tagName || !surface?.ownerDocument) return false;

    const range = selectionStore.restore(surface);
    if (!range || range.collapsed || !surface.contains(range.commonAncestorContainer)) return false;

    const fragment = range.cloneContents();
    const nodes = textNodes(fragment);
    if (!nodes.length) return false;
    const alreadyFormatted = nodes.every(node => hasAncestorTag(node, tagName));

    const selected = range.extractContents();
    if (alreadyFormatted) {
      unwrapTag(selected, tagName);
    } else {
      const wrapper = surface.ownerDocument.createElement(tagName);
      wrapper.appendChild(selected);
      const replacement = surface.ownerDocument.createDocumentFragment();
      replacement.appendChild(wrapper);
      range.insertNode(replacement);
      const next = surface.ownerDocument.createRange();
      next.selectNodeContents(wrapper);
      const selection = surface.ownerDocument.getSelection?.();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(next.cloneRange());
      }
      selectionStore.remember(surface);
      surface.focus?.();
      return true;
    }

    range.insertNode(selected);
    const selection = surface.ownerDocument.getSelection?.();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range.cloneRange());
    }
    selectionStore.remember(surface);
    surface.focus?.();
    return true;
  }

  return Object.freeze({
    defaultFontSize: baseFontSize,
    applyFontSize,
    insertTextWithFontSize,
    applyInlineFormat,
  });
}
