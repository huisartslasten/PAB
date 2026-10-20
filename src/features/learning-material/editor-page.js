const FONT_SIZE_OPTIONS = [36, 28, 22, 18, 14];

const IMAGE_LAYOUTS = Object.freeze({
  inline: Object.freeze({ className: 'learning-image-inline' }),
  left: Object.freeze({ className: 'learning-image-float-left' }),
  right: Object.freeze({ className: 'learning-image-float-right' })
});

function escapeHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function clampWidth(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(100, Math.max(20, Math.round(n))) : 100;
}

function normalizeImageLayout(value) {
  return Object.prototype.hasOwnProperty.call(IMAGE_LAYOUTS, value) ? value : 'inline';
}

function imageLayoutForDrop(surface, x) {
  if (typeof x !== 'number') return 'inline';
  const rect = surface.getBoundingClientRect();
  if (!rect.width) return 'inline';
  const relative = (x - rect.left) / rect.width;
  if (relative <= 0.35) return 'left';
  if (relative >= 0.65) return 'right';
  return 'inline';
}

function imageClass(layout) {
  return IMAGE_LAYOUTS[normalizeImageLayout(layout)].className;
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
      <div class="learning-image-help">Sleep een afbeelding naar de plek waar je hem wilt hebben. Laat hem links, in het midden of rechts vallen om de tekst eromheen te laten lopen. Je kunt hem daarna opnieuw slepen.</div>
    </div>
    <div class="learning-card-insert-row"><button type="button" class="question-insert-button" data-action="insert-card-after">➕ Kaart invoegen</button></div>
  </article>`;
}

function renderDocument(model) {
  return (Array.isArray(model?.elements) ? model.elements : []).map(element => {
    if (element?.type === 'image' && element.media_id && element.image?.url) {
      const width = clampWidth(element.width);
      const layout = normalizeImageLayout(element.layout);
      return `<img class="learning-inline-image ${imageClass(layout)}" draggable="true" contenteditable="false" data-media-id="${Number(element.media_id)}" data-width="${width}" data-layout="${layout}" src="${escapeHtml(element.image.url)}" alt="${escapeHtml(element.image.original_name || 'Afbeelding')}" style="width:${width}%">`;
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

function placeNode(surface, node, range, layout = 'inline') {
  node.dataset.layout = normalizeImageLayout(layout);
  node.classList.remove(...Object.values(IMAGE_LAYOUTS).map(item => item.className));
  node.classList.add('learning-inline-image', imageClass(layout));
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
    version: 1,
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
          layout: normalizeImageLayout(node.dataset.layout)
        }];
      }
      const html = (node.outerHTML || '').replaceAll('\u200b', '');
      return html.trim() ? [{ id: node.dataset.elementId || crypto.randomUUID(), type: 'text', html }] : [];
    })
  };
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
          const toolbar = command.closest('.learning-editor-toolbar');
          toolbar?.querySelectorAll('.learning-font-size-choice').forEach(item => item.classList.remove('is-active'));
          command.classList.add('is-active');
          if (!applied) surface.focus();
        }
      } else if (name === 'image-smaller' || name === 'image-larger') {
        const selected = surface.querySelector('.learning-inline-image.selected');
        if (selected) {
          const width = clampWidth(Number(selected.dataset.width || 100) + (name === 'image-larger' ? 10 : -10));
          selected.dataset.width = width;
          selected.style.width = `${width}%`;
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
    event.dataTransfer.effectAllowed = 'move';
  });

  root.addEventListener('dragend', () => {
    draggedImage = null;
  });

  const dropSurfaceFor = event => event.target.closest('.learning-card')?.querySelector('.learning-editor-surface') || null;

  const dropContainsImageFile = event => {
    const files = event.dataTransfer?.files;
    const types = Array.from(event.dataTransfer?.types || []);
    return Boolean(
      (files?.length && [...files].some(file => /^(image\/(jpeg|png|webp))$/i.test(file.type || '') || /\.(jpe?g|png|webp)$/i.test(file.name || ''))) ||
      types.includes('Files')
    );
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
    const file = event.dataTransfer?.files?.[0];
    if (!draggedImage && !file) return;
    event.preventDefault();
    event.stopPropagation();
    surface.classList.remove('drop-target');
    const layout = imageLayoutForDrop(surface, event.clientX);

    if (draggedImage) {
      const image = draggedImage;
      image.remove();
      placeNode(surface, image, pointRange(surface, event.clientX, event.clientY), layout);
      draggedImage = null;
      return;
    }

    if (file) await uploadImage(surface, file, event.clientX, event.clientY, layout);
  });

  root.addEventListener('change', async event => {
    const input = event.target.closest('.learning-image-input');
    if (!input) return;
    const surface = input.closest('.learning-card')?.querySelector('.learning-editor-surface');
    const file = input.files?.[0];
    input.value = '';
    if (surface && file) await uploadImage(surface, file);
  });

  async function resolveCurrentTopic() {
    const student = root.querySelector('[data-field="student"]:checked')?.value.trim() || '';
    const subject = root.querySelector('[data-field="subject"]').value.trim();
    const subvak = root.querySelector('[data-field="subvak"]').value.trim();
    if (!student || !subject) throw new Error('Kies eerst een leerling en vul het vak in.');
    activeTopic = await learningContent.resolveTopic({ student, subject, subvak });
    if (!activeTopic?.id) throw new Error('Het leerstofonderwerp kon niet worden opgeslagen.');
    return activeTopic;
  }

  async function uploadImage(surface, file, x, y, layout = null) {
    const isImage = /^image\/(jpeg|png|webp)$/i.test(file.type || '') || /\.(jpe?g|png|webp)$/i.test(file.name || '');
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
      image.dataset.width = '100';
      image.dataset.layout = normalizeImageLayout(layout || (typeof x === 'number' ? imageLayoutForDrop(surface, x) : 'inline'));
      image.src = uploaded.url || URL.createObjectURL(file);
      image.alt = uploaded.original_name || 'Afbeelding';
      image.style.width = '100%';
      const savedSelection = selectionBySurface.get(surface);
      const range = typeof x === 'number' && typeof y === 'number' ? pointRange(surface, x, y) : savedSelection;
      placeNode(surface, image, range, image.dataset.layout);
      ensureTrailing(root);
      surface.focus();
    } catch (error) {
      console.error('Learning material image upload error:', error);
      showStatus(error.message || 'De afbeelding kon niet worden toegevoegd.', true);
    }
  }

  async function save() {
    const subject = root.querySelector('[data-field="subject"]').value.trim();
    const subvak = root.querySelector('[data-field="subvak"]').value.trim();
    const student = root.querySelector('[data-field="student"]:checked')?.value.trim() || '';
    if (!student || !subject) {
      showStatus('Kies eerst een leerling en vul het vak in.', true);
      return;
    }
    showStatus('Leerstof opslaan…');
    try {
      const topicForSave = await resolveCurrentTopic();
      const payload = [...cardsMount.querySelectorAll('.learning-card')]
        .filter(card => !cardIsEmpty(card))
        .map(card => ({
          id: card.dataset.cardId || undefined,
          title: card.querySelector('.learning-card-title').value.trim(),
          document: documentModel(card.querySelector('.learning-editor-surface'))
        }));
      const saved = await learningContent.replaceForTopic(topicForSave, payload);
      showStatus('Opgeslagen.');
      await onSaved({ topic: { ...topicForSave, student, subject, subvak }, cards: saved });
    } catch (error) {
      console.error('Learning material save error:', error);
      showStatus(error.message || 'De leerstof kon niet worden opgeslagen.', true);
    }
  }
}
