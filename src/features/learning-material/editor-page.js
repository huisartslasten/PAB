const FONT_SIZE_OPTIONS = [36, 28, 22, 18, 14];
const MIN_IMAGE_WIDTH = 20;
const MAX_IMAGE_WIDTH = 100;
const MAX_IMAGE_OFFSET = 45;

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function clampWidth(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(MAX_IMAGE_WIDTH, Math.max(MIN_IMAGE_WIDTH, Math.round(n))) : 100;
}

function clampOffset(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(MAX_IMAGE_OFFSET, Math.max(0, Math.round(n))) : 0;
}

function normalizeImagePlacement(value) {
  const source = value && typeof value === 'object' ? value : {};
  const side = source.side === 'left' || source.side === 'right' ? source.side : 'inline';
  return {
    side,
    offset: side === 'inline' ? 0 : clampOffset(source.offset)
  };
}

function toolbarMarkup() {
  return `<div class="learning-editor-toolbar" role="toolbar">
    <div class="learning-font-size-choices" role="group" aria-label="Lettergrootte">
      ${FONT_SIZE_OPTIONS.map(size => `<button type="button" class="learning-tool-button learning-font-size-choice${size === 22 ? ' is-active' : ''}" data-command="font-size" data-size="${size}" aria-label="Lettergrootte ${size}px" style="font-size:${size}px;line-height:1">A</button>`).join('')}
    </div>
    <span class="learning-toolbar-divider"></span>
    <button type="button" class="learning-tool-button" data-command="bold"><strong>B</strong></button>
    <button type="button" class="learning-tool-button" data-command="italic"><em>I</em></button>
    <span class="learning-toolbar-divider"></span>
    <label class="learning-tool-button learning-image-picker" title="Plaatje invoegen">
      <span aria-hidden="true">🖼️</span>
      <input class="learning-image-input" type="file" accept="image/jpeg,image/png,image/webp" aria-label="Plaatje invoegen">
    </label>
    <button type="button" class="learning-tool-button" data-command="image-smaller" aria-label="Plaatje kleiner">▾</button>
    <button type="button" class="learning-tool-button" data-command="image-larger" aria-label="Plaatje groter">▴</button>
  </div>`;
}

function cardMarkup(index) {
  return `<article class="learning-card">
    <div class="learning-card-header">
      <div class="learning-card-number">Kaart ${index + 1}</div>
      <button type="button" class="learning-card-remove" data-action="remove-card">✕</button>
    </div>
    ${toolbarMarkup()}
    <div class="learning-card-body">
      <input class="learning-card-title" type="text" placeholder="Titel van de kaart (optioneel)">
      <div class="learning-editor-surface" contenteditable="true" spellcheck="true" data-placeholder="Schrijf hier de leerstof…"></div>
      <div class="learning-image-help">Sleep een afbeelding naar de plek waar je hem wilt hebben. Hij blijft aan die tekstpositie gekoppeld. Sleep aan een hoek om hem groter of kleiner te maken.</div>
    </div>
    <div class="learning-card-insert-row"><button type="button" class="question-insert-button" data-action="insert-card-after">➕ Kaart invoegen</button></div>
  </article>`;
}

function imageStyle(placement, width) {
  const normalized = normalizeImagePlacement(placement);
  const safeWidth = clampWidth(width);
  if (normalized.side === 'left') return `width:${safeWidth}%;margin-right:${normalized.offset}%;`;
  if (normalized.side === 'right') return `width:${safeWidth}%;margin-left:${normalized.offset}%;`;
  return `width:${safeWidth}%;`;
}

function imageClass(placement) {
  return `learning-image-position-${normalizeImagePlacement(placement).side}`;
}

function renderDocument(model) {
  return (Array.isArray(model?.elements) ? model.elements : []).map(element => {
    if (element?.type === 'image' && element.media_id && element.image?.url) {
      const width = clampWidth(element.width);
      const placement = normalizeImagePlacement(element.placement);
      return `<img class="learning-inline-image ${imageClass(placement)}" draggable="true" contenteditable="false" data-media-id="${Number(element.media_id)}" data-width="${width}" data-placement-side="${placement.side}" data-placement-offset="${placement.offset}" src="${escapeHtml(element.image.url)}" alt="${escapeHtml(element.image.original_name || 'Afbeelding')}" style="${imageStyle(placement, width)}">`;
    }
    return element?.type === 'text' ? element.html || '' : '';
  }).join('');
}

function createCardElement(documentRef, index, initial = {}) {
  const wrapper = documentRef.createElement('div');
  wrapper.innerHTML = cardMarkup(index);
  const card = wrapper.firstElementChild;
  card.dataset.cardId = initial.id ? String(initial.id) : '';
  card.querySelector('.learning-card-title').value = initial.title || '';
  card.querySelector('.learning-editor-surface').innerHTML = renderDocument(initial.document);
  return card;
}

function cardIsEmpty(card) {
  const surface = card.querySelector('.learning-editor-surface');
  return !String(surface?.textContent || '').trim()
    && !String(card.querySelector('.learning-card-title')?.value || '').trim()
    && !surface?.querySelector('.learning-inline-image');
}

function renumber(root) {
  [...root.querySelectorAll('.learning-card')].forEach((card, index) => {
    card.querySelector('.learning-card-number').textContent = `Kaart ${index + 1}`;
  });
}

function ensureTrailing(root) {
  const mount = root.querySelector('[data-cards]');
  const cards = [...mount.children];
  if (!cards.length || !cardIsEmpty(cards[cards.length - 1])) {
    mount.appendChild(createCardElement(root.ownerDocument, cards.length));
  }
  renumber(root);
}

function selectionIsInside(surface, range) {
  return Boolean(range && surface.contains(range.commonAncestorContainer));
}

function rememberSelection(surface) {
  const selection = surface.ownerDocument.getSelection?.();
  if (!selection?.rangeCount) return null;
  const range = selection.getRangeAt(0).cloneRange();
  if (!selectionIsInside(surface, range)) return null;
  surface.__learningSelection = range;
  return range;
}

function restoreSelection(surface, selectionBySurface) {
  const saved = selectionBySurface.get(surface) || surface.__learningSelection;
  if (!saved || !selectionIsInside(surface, saved)) return null;
  const selection = surface.ownerDocument.getSelection?.();
  if (!selection) return null;
  selection.removeAllRanges();
  selection.addRange(saved.cloneRange());
  return saved.cloneRange();
}

function applyFontSize(surface, size, selectionBySurface) {
  const range = restoreSelection(surface, selectionBySurface);
  if (!range || range.collapsed) return false;
  const span = surface.ownerDocument.createElement('span');
  span.className = 'learning-inline-size';
  span.style.fontSize = `${size}px`;
  span.appendChild(range.extractContents());
  range.insertNode(span);
  const next = surface.ownerDocument.createRange();
  next.selectNodeContents(span);
  selectionBySurface.set(surface, next.cloneRange());
  surface.__learningSelection = next.cloneRange();
  const selection = surface.ownerDocument.getSelection?.();
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(next.cloneRange());
  }
  surface.focus();
  return true;
}

function insertTextWithFontSize(surface, size, data, selectionBySurface) {
  const selection = surface.ownerDocument.getSelection?.();
  if (!selection?.rangeCount) return false;
  const range = selection.getRangeAt(0).cloneRange();
  if (!selectionIsInside(surface, range)) return false;
  const container = range.startContainer?.nodeType === 1 ? range.startContainer : range.startContainer?.parentElement;
  const currentSpan = container?.closest?.('.learning-inline-size');
  const currentSize = currentSpan ? Number.parseFloat(currentSpan.style.fontSize) : null;
  if (range.collapsed && currentSpan && currentSize === size) return false;
  if (range.collapsed && !currentSpan && size === 22) return false;
  const span = surface.ownerDocument.createElement('span');
  span.className = 'learning-inline-size';
  span.style.fontSize = `${size}px`;
  span.appendChild(surface.ownerDocument.createTextNode(data));
  range.deleteContents();
  range.insertNode(span);
  const next = surface.ownerDocument.createRange();
  next.setStart(span, span.childNodes.length);
  next.collapse(true);
  selection.removeAllRanges();
  selection.addRange(next);
  selectionBySurface.set(surface, next.cloneRange());
  surface.__learningSelection = next.cloneRange();
  return true;
}

function pointRange(surface, x, y) {
  const doc = surface.ownerDocument;
  if (typeof x === 'number' && typeof y === 'number' && typeof doc.caretRangeFromPoint === 'function') {
    return doc.caretRangeFromPoint(x, y);
  }
  if (typeof x === 'number' && typeof y === 'number' && typeof doc.caretPositionFromPoint === 'function') {
    const point = doc.caretPositionFromPoint(x, y);
    if (!point) return null;
    const range = doc.createRange();
    range.setStart(point.offsetNode, point.offset);
    range.collapse(true);
    return range;
  }
  return null;
}

function placementFromDrop(surface, x) {
  const rect = surface.getBoundingClientRect();
  if (!rect.width || typeof x !== 'number') return { side: 'inline', offset: 0 };
  const relative = ((x - rect.left) / rect.width) * 100;
  if (relative < 50) return { side: 'left', offset: clampOffset(relative) };
  if (relative > 50) return { side: 'right', offset: clampOffset(100 - relative) };
  return { side: 'inline', offset: 0 };
}

function applyImagePlacement(node, placement, width = node.dataset.width) {
  const normalized = normalizeImagePlacement(placement);
  const safeWidth = clampWidth(width);
  node.dataset.width = String(safeWidth);
  node.dataset.placementSide = normalized.side;
  node.dataset.placementOffset = String(normalized.offset);
  node.classList.remove('learning-image-position-inline', 'learning-image-position-left', 'learning-image-position-right');
  node.classList.add(imageClass(normalized));
  node.style.cssText = imageStyle(normalized, safeWidth);
}

function placeNode(surface, node, range, placement) {
  applyImagePlacement(node, placement);
  if (!range || !surface.contains(range.commonAncestorContainer)) {
    surface.append(node, surface.ownerDocument.createTextNode(' '));
    return;
  }
  range.deleteContents();
  range.insertNode(node);
  node.after(surface.ownerDocument.createTextNode(' '));
}

function documentModel(surface) {
  return {
    version: 2,
    elements: [...surface.childNodes].flatMap(node => {
      if (node.nodeType === 3) {
        const value = node.textContent?.replaceAll('\u200b', '').trim();
        return value ? [{ id: crypto.randomUUID(), type: 'text', html: escapeHtml(value) }] : [];
      }
      if (node.nodeType !== 1) return [];
      if (node.matches('.learning-inline-image')) {
        return [{
          id: node.dataset.elementId || crypto.randomUUID(),
          type: 'image',
          media_id: Number(node.dataset.mediaId),
          width: clampWidth(node.dataset.width || parseFloat(node.style.width)),
          placement: {
            side: node.dataset.placementSide || 'inline',
            offset: clampOffset(node.dataset.placementOffset)
          }
        }];
      }
      const html = (node.outerHTML || '').replaceAll('\u200b', '');
      return html.trim() ? [{ id: node.dataset.elementId || crypto.randomUUID(), type: 'text', html }] : [];
    })
  };
}

function imageForResize(target) {
  return target?.closest?.('.learning-inline-image') || null;
}

function addResizeHandle(documentRef, image) {
  if (image.parentElement?.querySelector('.learning-image-resize-handle')) return;
  const handle = documentRef.createElement('button');
  handle.type = 'button';
  handle.className = 'learning-image-resize-handle';
  handle.setAttribute('aria-label', 'Afbeelding vergroten of verkleinen');
  handle.tabIndex = -1;
  image.parentElement?.appendChild(handle);
}

export function createLearningMaterialEditorPage({ root, topic, cards = [], students = [], learningContent, documentRef = document, onSaved } = {}) {
  if (!root || !topic || !learningContent || typeof onSaved !== 'function') {
    throw new TypeError('Learning material editor requires root, topic, learning content service and onSaved.');
  }

  const studentOptions = (Array.isArray(students) ? students : []).map(student => `<label class="editor-student-choice"><input type="radio" name="learningMaterialStudent" data-field="student" value="${escapeHtml(student)}"${String(student) === String(topic.student || '') ? ' checked' : ''}><span>${escapeHtml(student)}</span></label>`).join('');
  const hasExistingMaterial = Boolean(topic.id && cards.length);

  root.innerHTML = `<div class="learning-editor-main-card card">
    <div class="learning-editor-actions"><button class="success" type="button" data-action="save-learning">💾 Leerstof opslaan</button></div>
    <div class="editor-student"><strong>Voor welke leerling?</strong><div class="editor-student-buttons">${studentOptions}</div></div>
    <section class="learning-editor-meta"><div class="learning-meta-grid"><div class="field"><label>Vak</label><input data-field="subject" value="${escapeHtml(topic.subject)}" placeholder="Bijvoorbeeld Nederlands"></div><div class="field"><label>Onderwerp</label><input data-field="subvak" value="${escapeHtml(topic.subvak)}" placeholder="Bijvoorbeeld Boekbespreking"></div></div><div class="learning-meta-note">Deze leerstof hoort rechtstreeks bij de gekozen leerling, het vak en het onderwerp. Je hoeft geen les te maken.</div></section>
    <section class="learning-card-section"><div class="learning-card-intro"><div><h2>Leerstofkaarten</h2><p>Maak kaarten en voeg later eenvoudig nieuwe kaarten tussen bestaande kaarten in.</p></div></div><div class="learning-cards" data-cards></div></section>
    <div class="learning-editor-actions learning-editor-actions-bottom"><button class="success" type="button" data-action="save-learning">💾 Leerstof opslaan</button></div>
    <div class="learning-editor-status message hidden" data-status></div>
  </div>`;

  if (hasExistingMaterial) root.querySelectorAll('[data-field]').forEach(field => { field.disabled = true; });

  const cardsMount = root.querySelector('[data-cards]');
  const status = root.querySelector('[data-status]');
  const selectionBySurface = new WeakMap();
  const activeFontSizeBySurface = new WeakMap();
  let draggedImage = null;
  let resizeState = null;
  let activeTopic = { ...topic };

  const showStatus = (message, error = false) => {
    status.textContent = message;
    status.classList.toggle('hidden', !message);
    status.classList.toggle('error', error);
  };

  const addCard = (initial = {}, before = null) => {
    const card = createCardElement(documentRef, cardsMount.children.length, initial);
    before ? cardsMount.insertBefore(card, before) : cardsMount.appendChild(card);
    activeFontSizeBySurface.set(card.querySelector('.learning-editor-surface'), 22);
    renumber(root);
    return card;
  };

  cards.forEach(card => addCard(card));
  ensureTrailing(root);

  documentRef.addEventListener('selectionchange', () => {
    const selection = documentRef.getSelection?.();
    if (!selection?.rangeCount) return;
    const range = selection.getRangeAt(0);
    const parent = range.commonAncestorContainer?.nodeType === 1 ? range.commonAncestorContainer : range.commonAncestorContainer?.parentElement;
    const surface = parent?.closest?.('.learning-editor-surface');
    if (surface) {
      const saved = range.cloneRange();
      selectionBySurface.set(surface, saved);
      surface.__learningSelection = saved;
    }
  });

  root.addEventListener('pointerup', event => {
    const surface = event.target.closest('.learning-editor-surface');
    if (surface) rememberSelection(surface);
  });

  root.addEventListener('keyup', event => {
    const surface = event.target.closest('.learning-editor-surface');
    if (surface) rememberSelection(surface);
  });

  root.addEventListener('pointerdown', event => {
    const command = event.target.closest('[data-command]');
    if (!command) return;
    const card = command.closest('.learning-card');
    const surface = card?.querySelector('.learning-editor-surface');
    if (surface) rememberSelection(surface);
    event.preventDefault();
  });

  root.addEventListener('beforeinput', event => {
    const surface = event.target.closest('.learning-editor-surface');
    if (!surface || event.inputType !== 'insertText' || !event.data) return;
    const size = activeFontSizeBySurface.get(surface) || 22;
    if (insertTextWithFontSize(surface, size, event.data, selectionBySurface)) event.preventDefault();
  });

  root.addEventListener('click', async event => {
    const image = event.target.closest('.learning-inline-image');
    if (image) {
      root.querySelectorAll('.learning-inline-image.selected').forEach(item => item.classList.remove('selected'));
      image.classList.add('selected');
      addResizeHandle(documentRef, image);
    }

    const command = event.target.closest('[data-command]');
    if (command) {
      const card = command.closest('.learning-card');
      const surface = card?.querySelector('.learning-editor-surface');
      if (!surface) return;
      const name = command.dataset.command;
      if (name === 'font-size') {
        const size = Number(command.dataset.size);
        if (Number.isFinite(size)) {
          activeFontSizeBySurface.set(surface, size);
          const applied = applyFontSize(surface, size, selectionBySurface);
          command.closest('.learning-editor-toolbar')?.querySelectorAll('.learning-font-size-choice').forEach(item => item.classList.remove('is-active'));
          command.classList.add('is-active');
          if (!applied) surface.focus();
        }
      } else if (name === 'image-smaller' || name === 'image-larger') {
        const selected = surface.querySelector('.learning-inline-image.selected');
        if (selected) {
          const width = clampWidth(Number(selected.dataset.width || 100) + (name === 'image-larger' ? 10 : -10));
          applyImagePlacement(selected, { side: selected.dataset.placementSide, offset: selected.dataset.placementOffset }, width);
        }
      } else if (name === 'bold' || name === 'italic') {
        restoreSelection(surface, selectionBySurface);
        const saved = selectionBySurface.get(surface);
        if (saved) {
          const selection = surface.ownerDocument.getSelection();
          selection.removeAllRanges();
          selection.addRange(saved.cloneRange());
        }
        surface.ownerDocument.execCommand(name, false);
      }
      return;
    }

    const action = event.target.closest('[data-action]')?.dataset.action;
    const card = event.target.closest('.learning-card');
    if (action === 'insert-card-after' && card) {
      const inserted = addCard({}, card.nextElementSibling);
      inserted.querySelector('.learning-card-title').focus();
    } else if (action === 'remove-card' && card) {
      if (cardsMount.children.length > 1) card.remove();
      ensureTrailing(root);
    } else if (action === 'save-learning') {
      await save();
    }
  });

  root.addEventListener('input', event => {
    if (event.target.closest('.learning-card')) ensureTrailing(root);
  });

  root.addEventListener('dragstart', event => {
    const image = event.target.closest('.learning-inline-image');
    if (!image) return;
    draggedImage = image;
    image.classList.add('is-dragging');
    event.dataTransfer.effectAllowed = 'move';
  });

  root.addEventListener('dragend', () => {
    draggedImage?.classList.remove('is-dragging');
    draggedImage = null;
    root.querySelectorAll('.learning-editor-surface.drop-target').forEach(surface => surface.classList.remove('drop-target'));
  });

  const dropSurfaceFor = event => event.target.closest('.learning-card')?.querySelector('.learning-editor-surface') || null;
  const dropContainsImageFile = event => {
    const files = event.dataTransfer?.files;
    return Boolean(files?.length && [...files].some(file => /^(image\/(jpeg|png|webp))$/i.test(file.type || '') || /\.(jpe?g|png|webp)$/i.test(file.name || '')));
  };

  root.addEventListener('dragover', event => {
    const surface = dropSurfaceFor(event);
    if (!surface || (!draggedImage && !dropContainsImageFile(event))) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = draggedImage ? 'move' : 'copy';
    surface.classList.add('drop-target');
  });

  root.addEventListener('dragleave', event => {
    const surface = dropSurfaceFor(event);
    if (surface && !surface.contains(event.relatedTarget)) surface.classList.remove('drop-target');
  });

  root.addEventListener('drop', async event => {
    const surface = dropSurfaceFor(event);
    if (!surface) return;
    surface.classList.remove('drop-target');
    event.preventDefault();
    const range = pointRange(surface, event.clientX, event.clientY);
    const placement = placementFromDrop(surface, event.clientX);

    if (draggedImage) {
      if (draggedImage.parentElement === surface) {
        const current = draggedImage;
        current.remove();
        placeNode(surface, current, range, placement);
      } else {
        const current = draggedImage;
        current.remove();
        placeNode(surface, current, range, placement);
      }
      draggedImage.classList.remove('is-dragging');
      draggedImage.classList.add('selected');
      addResizeHandle(documentRef, draggedImage);
      draggedImage = null;
      return;
    }

    const files = [...(event.dataTransfer?.files || [])].filter(file => /^(image\/(jpeg|png|webp))$/i.test(file.type || '') || /\.(jpe?g|png|webp)$/i.test(file.name || ''));
    if (files[0]) await uploadImage(surface, files[0], event.clientX, event.clientY);
  });

  root.addEventListener('change', async event => {
    const input = event.target.closest('.learning-image-input');
    if (!input?.files?.length) return;
    const card = input.closest('.learning-card');
    const surface = card?.querySelector('.learning-editor-surface');
    if (!surface) return;
    const saved = selectionBySurface.get(surface) || rememberSelection(surface);
    await uploadImage(surface, input.files[0]);
    if (saved) selectionBySurface.set(surface, saved);
    input.value = '';
  });

  root.addEventListener('pointerdown', event => {
    const handle = event.target.closest('.learning-image-resize-handle');
    if (!handle) return;
    const image = handle.parentElement?.querySelector('.learning-inline-image');
    if (!image) return;
    const surface = image.closest('.learning-editor-surface');
    if (!surface) return;
    event.preventDefault();
    const rect = image.getBoundingClientRect();
    resizeState = { image, surface, startX: event.clientX, startWidth: rect.width, surfaceWidth: surface.getBoundingClientRect().width };
    image.classList.add('is-resizing');
  });

  documentRef.addEventListener('pointermove', event => {
    if (!resizeState) return;
    const delta = event.clientX - resizeState.startX;
    const width = clampWidth(((resizeState.startWidth + delta) / resizeState.surfaceWidth) * 100);
    applyImagePlacement(resizeState.image, { side: resizeState.image.dataset.placementSide, offset: resizeState.image.dataset.placementOffset }, width);
  });

  documentRef.addEventListener('pointerup', () => {
    if (!resizeState) return;
    resizeState.image.classList.remove('is-resizing');
    resizeState = null;
  });

  async function resolveCurrentTopic() {
    const student = root.querySelector('[data-field="student"]:checked')?.value || activeTopic.student || '';
    const subject = root.querySelector('[data-field="subject"]')?.value.trim() || activeTopic.subject || '';
    const subvak = root.querySelector('[data-field="subvak"]')?.value.trim() || activeTopic.subvak || '';
    if (!student || !subject) throw new Error('Kies eerst een leerling en vul een vak in.');
    activeTopic = { ...activeTopic, student, subject, subvak };
    return learningContent.resolveTopic(activeTopic);
  }

  async function uploadImage(surface, file, x, y) {
    const isImage = /^(image\/(jpeg|png|webp))$/i.test(file.type || '') || /\.(jpe?g|png|webp)$/i.test(file.name || '');
    if (!isImage) {
      showStatus('Gebruik een JPEG, PNG of WebP-afbeelding.', true);
      return;
    }
    try {
      const topicForUpload = await resolveCurrentTopic();
      const uploaded = await learningContent.uploadCardImage(topicForUpload.id, file);
      const image = documentRef.createElement('img');
      image.className = 'learning-inline-image';
      image.draggable = true;
      image.contentEditable = 'false';
      image.dataset.mediaId = String(uploaded.id);
      image.src = uploaded.url || URL.createObjectURL(file);
      image.alt = uploaded.original_name || 'Afbeelding';
      const savedSelection = selectionBySurface.get(surface);
      const range = typeof x === 'number' && typeof y === 'number' ? pointRange(surface, x, y) : savedSelection;
      placeNode(surface, image, range, typeof x === 'number' ? placementFromDrop(surface, x) : { side: 'inline', offset: 0 });
      image.classList.add('selected');
      addResizeHandle(documentRef, image);
      ensureTrailing(root);
      surface.focus();
    } catch (error) {
      showStatus(error.message || 'De afbeelding kon niet worden toegevoegd.', true);
    }
  }

  async function save() {
    showStatus('Bezig met opslaan…');
    try {
      const resolvedTopic = await resolveCurrentTopic();
      const payload = [...cardsMount.querySelectorAll('.learning-card')].map(card => ({
        id: card.dataset.cardId || undefined,
        title: card.querySelector('.learning-card-title')?.value || '',
        document: documentModel(card.querySelector('.learning-editor-surface'))
      })).filter(card => card.title.trim() || card.document.elements.length);
      const savedCards = await learningContent.replaceForTopic(resolvedTopic, payload);
      activeTopic = { ...resolvedTopic };
      showStatus('Opgeslagen.');
      await onSaved({ topic: resolvedTopic, cards: savedCards });
    } catch (error) {
      console.error('Learning material save error:', error);
      showStatus(error.message || 'De leerstof kon niet worden opgeslagen.', true);
    }
  }
}
