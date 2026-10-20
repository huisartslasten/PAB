const STUDENTS = Object.freeze(['Zyon', 'Zenith', 'Zephon', 'Testleerling']);
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 48;

function text(value) { return String(value ?? '').trim(); }

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function toolbarMarkup() {
  return `
    <div class="learning-editor-toolbar" role="toolbar" aria-label="Tekstopmaak">
      <button type="button" class="learning-tool-button" data-command="decrease-font" title="Tekst kleiner">A−</button>
      <button type="button" class="learning-tool-button" data-command="increase-font" title="Tekst groter">A+</button>
      <span class="learning-toolbar-divider" aria-hidden="true"></span>
      <button type="button" class="learning-tool-button learning-tool-bold" data-command="bold" title="Vet"><strong>B</strong></button>
      <button type="button" class="learning-tool-button learning-tool-italic" data-command="italic" title="Cursief"><em>I</em></button>
      <span class="learning-toolbar-divider" aria-hidden="true"></span>
      <button type="button" class="learning-tool-button learning-tool-image" data-command="image" title="Afbeelding toevoegen">🖼️</button>
      <button type="button" class="learning-tool-button" data-command="image-smaller" title="Geselecteerde afbeelding kleiner">▾</button>
      <button type="button" class="learning-tool-button" data-command="image-larger" title="Geselecteerde afbeelding groter">▴</button>
    </div>`;
}

function cardMarkup(index) {
  return `
    <article class="learning-card" data-card-index="${index}">
      <div class="learning-card-header">
        <div class="learning-card-number">Kaart ${index + 1}</div>
        <button type="button" class="learning-card-remove" data-action="remove-card" title="Kaart verwijderen">✕</button>
      </div>
      ${toolbarMarkup()}
      <div class="learning-card-body">
        <input class="learning-card-title" type="text" placeholder="Titel van de kaart (optioneel)" aria-label="Titel van de kaart">
        <div class="learning-editor-surface" contenteditable="true" spellcheck="true" role="textbox" aria-multiline="true" data-placeholder="Schrijf hier de leerstof…"></div>
        <input class="learning-image-input" type="file" accept="image/jpeg,image/png,image/webp" hidden>
        <div class="learning-image-help">Sleep een afbeelding naar de plek waar je hem wilt hebben. Je kunt hem daarna opnieuw slepen en groter of kleiner maken.</div>
      </div>
    </article>`;
}

function createCardElement(documentRef, index, initial = {}) {
  const wrapper = documentRef.createElement('div');
  wrapper.innerHTML = cardMarkup(index);
  const card = wrapper.firstElementChild;
  card.dataset.cardId = initial.id ? String(initial.id) : '';
  card.querySelector('.learning-card-title').value = initial.title || '';
  card.querySelector('.learning-editor-surface').innerHTML = renderDocument(initial.document || { version: 1, elements: [] });
  return card;
}

function renderDocument(documentModel) {
  const elements = Array.isArray(documentModel?.elements) ? documentModel.elements : [];
  return elements.map(element => {
    if (element?.type === 'image' && element.media_id && element.image?.url) {
      const width = clampWidth(element.width);
      return `<img class="learning-inline-image" draggable="true" contenteditable="false" data-learning-element="image" data-media-id="${Number(element.media_id)}" data-width="${width}" src="${escapeHtml(element.image.url)}" alt="${escapeHtml(element.image.original_name || 'Afbeelding')}" style="width:${width}%">`;
    }
    if (element?.type === 'text') return element.html || '';
    return '';
  }).join('');
}

function clampWidth(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 100;
  return Math.min(100, Math.max(20, Math.round(numeric)));
}

function cardIsEmpty(card) {
  const surface = card.querySelector('.learning-editor-surface');
  const title = card.querySelector('.learning-card-title');
  const hasImage = Boolean(surface?.querySelector('.learning-inline-image'));
  return !String(surface?.textContent || '').trim() && !String(title?.value || '').trim() && !hasImage;
}

function renumberCards(root) {
  [...root.querySelectorAll('.learning-card')].forEach((card, index) => {
    card.dataset.cardIndex = String(index);
    const number = card.querySelector('.learning-card-number');
    if (number) number.textContent = `Kaart ${index + 1}`;
  });
}

function ensureTrailingCard(root) {
  const mount = root.querySelector('.learning-cards');
  if (!mount) return;
  const cards = [...mount.querySelectorAll('.learning-card')];
  if (!cards.length || !cardIsEmpty(cards[cards.length - 1])) {
    mount.appendChild(createCardElement(root.ownerDocument, cards.length));
  }
  renumberCards(root);
}

function selectedRange(surface) {
  const selection = surface.ownerDocument.getSelection?.();
  if (!selection || !selection.rangeCount) return null;
  const range = selection.getRangeAt(0);
  return surface.contains(range.commonAncestorContainer) ? range : null;
}

function wrapSelection(surface, size) {
  const range = selectedRange(surface);
  if (!range || range.collapsed) return;
  const span = surface.ownerDocument.createElement('span');
  span.className = 'learning-inline-size';
  span.style.fontSize = `${size}px`;
  span.appendChild(range.extractContents());
  range.insertNode(span);
  const selection = surface.ownerDocument.getSelection();
  selection.removeAllRanges();
  const next = surface.ownerDocument.createRange();
  next.selectNodeContents(span);
  selection.addRange(next);
}

function adjustFontSize(surface, delta) {
  const range = selectedRange(surface);
  if (!range || range.collapsed) return;
  const probe = surface.ownerDocument.createElement('span');
  probe.appendChild(range.cloneContents());
  surface.appendChild(probe);
  const current = Number.parseInt(surface.ownerDocument.defaultView?.getComputedStyle(probe).fontSize || '20', 10);
  probe.remove();
  wrapSelection(surface, Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, current + delta)));
}

function execInlineCommand(surface, command) {
  surface.focus();
  const doc = surface.ownerDocument;
  if (command === 'bold' || command === 'italic') {
    doc.execCommand(command, false);
    return;
  }
  if (command === 'increase-font') adjustFontSize(surface, 2);
  if (command === 'decrease-font') adjustFontSize(surface, -2);
}

function readImageFile(file) {
  if (!file || !/^image\/(jpeg|png|webp)$/i.test(file.type || '')) {
    throw new Error('Gebruik een JPEG, PNG of WebP-afbeelding.');
  }
  return file;
}

function pointRange(surface, x, y) {
  const doc = surface.ownerDocument;
  if (typeof doc.caretRangeFromPoint === 'function') return doc.caretRangeFromPoint(x, y);
  if (typeof doc.caretPositionFromPoint === 'function') {
    const position = doc.caretPositionFromPoint(x, y);
    if (!position) return null;
    const range = doc.createRange();
    range.setStart(position.offsetNode, position.offset);
    range.collapse(true);
    return range;
  }
  return null;
}

function placeNodeAtPoint(surface, node, x, y) {
  const range = pointRange(surface, x, y);
  if (range && surface.contains(range.commonAncestorContainer)) {
    range.deleteContents();
    range.insertNode(node);
    const spacer = surface.ownerDocument.createTextNode(' ');
    node.after(spacer);
    const next = surface.ownerDocument.createRange();
    next.setStartAfter(spacer);
    next.collapse(true);
    const selection = surface.ownerDocument.getSelection();
    selection.removeAllRanges();
    selection.addRange(next);
    return true;
  }
  surface.append(node);
  surface.append(surface.ownerDocument.createTextNode(' '));
  return true;
}

function documentModelFromSurface(surface) {
  const elements = [];
  [...surface.childNodes].forEach(node => {
    if (node.nodeType === 3) {
      if (node.textContent?.trim()) elements.push({ id: crypto.randomUUID(), type: 'text', html: escapeHtml(node.textContent) });
      return;
    }
    if (node.nodeType !== 1) return;
    if (node.matches('.learning-inline-image')) {
      elements.push({
        id: node.dataset.elementId || crypto.randomUUID(),
        type: 'image',
        media_id: Number(node.dataset.mediaId),
        width: clampWidth(node.dataset.width || parseFloat(node.style.width))
      });
      return;
    }
    const html = node.outerHTML || '';
    if (html.trim()) elements.push({ id: node.dataset.elementId || crypto.randomUUID(), type: 'text', html });
  });
  return { version: 1, elements };
}

export function createLessonLearningEditorPage({ root, lesson, cards = [], learningContent, documentRef = document } = {}) {
  if (!root) throw new TypeError('Learning editor page requires a root.');
  if (!lesson) throw new TypeError('Learning editor page requires a lesson.');
  if (!learningContent) throw new TypeError('Learning editor page requires learning content service.');

  root.innerHTML = `
    <div class="learning-editor-main-card card">
      <div class="learning-editor-actions"><button class="success" type="button" data-action="save-learning">💾 Leerstof opslaan</button></div>
      <section class="learning-editor-meta">
        <div class="learning-meta-student"><strong>Voor welke leerling?</strong><div class="editor-student-buttons">${STUDENTS.map(student => `<span class="editor-student-choice${student === lesson.student ? ' selected' : ''}">${escapeHtml(student)}</span>`).join('')}</div></div>
        <div class="learning-meta-grid">
          <div class="field"><label>Vak</label><input value="${escapeHtml(lesson.subject || '')}" readonly></div>
          <div class="field"><label>Subvak <span class="small">(optioneel)</span></label><input value="${escapeHtml(lesson.subvak || '')}" readonly></div>
          <div class="field learning-meta-wide"><label>Naam van de les</label><input value="${escapeHtml(lesson.title || '')}" readonly></div>
        </div>
        <div class="learning-meta-note">Deze gegevens horen bij de les. Aanpassingen doe je in de gewone leseditor.</div>
      </section>
      <section class="learning-card-section">
        <div class="learning-card-intro"><div><h2>Leerstofkaarten</h2><p>Schrijf, plaats afbeeldingen en sleep ze later naar een andere plek.</p></div><button type="button" class="question-insert-button" data-action="add-card">➕ Kaart invoegen</button></div>
        <div class="learning-cards" data-cards></div>
        <button type="button" class="success learning-add-card-bottom" data-action="add-card">➕ Kaart invoegen</button>
      </section>
      <div class="learning-editor-status message hidden" data-status></div>
      <div class="row editor-bottom-actions"><button class="success" type="button" data-action="save-learning">💾 Leerstof opslaan</button></div>
    </div>`;

  const cardsMount = root.querySelector('[data-cards]');
  const status = root.querySelector('[data-status]');
  const uploadedImageIds = new Set();
  let activeCard = null;
  let draggedImage = null;

  const showStatus = (message, isError = false) => {
    status.textContent = message;
    status.classList.toggle('hidden', !message);
    status.classList.toggle('error', isError);
  };

  const addCard = (initial = {}) => {
    const card = createCardElement(documentRef, cardsMount.children.length, initial);
    cardsMount.appendChild(card);
    renumberCards(root);
    return card;
  };

  (Array.isArray(cards) ? cards : []).forEach(card => addCard(card));
  ensureTrailingCard(root);

  root.addEventListener('mousedown', event => {
    if (event.target.closest('[data-command]')) event.preventDefault();
  });

  root.addEventListener('click', async event => {
    const image = event.target.closest('.learning-inline-image');
    if (image) {
      root.querySelectorAll('.learning-inline-image.selected').forEach(item => item.classList.remove('selected'));
      image.classList.add('selected');
    }
    const commandButton = event.target.closest('[data-command]');
    if (commandButton) {
      const card = commandButton.closest('.learning-card');
      const surface = card?.querySelector('.learning-editor-surface');
      if (!surface) return;
      if (commandButton.dataset.command === 'image') card.querySelector('.learning-image-input')?.click();
      else if (commandButton.dataset.command === 'image-smaller' || commandButton.dataset.command === 'image-larger') {
        const selected = surface.querySelector('.learning-inline-image.selected');
        if (selected) {
          const delta = commandButton.dataset.command === 'image-larger' ? 10 : -10;
          selected.dataset.width = String(clampWidth(Number(selected.dataset.width || 100) + delta));
          selected.style.width = `${selected.dataset.width}%`;
        }
      } else execInlineCommand(surface, commandButton.dataset.command);
      return;
    }
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (!action) return;
    const card = event.target.closest('.learning-card');
    if (action === 'add-card') { addCard(); return; }
    if (action === 'remove-card' && card) {
      if (cardsMount.children.length <= 1) return;
      card.querySelectorAll('.learning-inline-image').forEach(image => uploadedImageIds.add(Number(image.dataset.mediaId)));
      card.remove(); ensureTrailingCard(root); return;
    }
    if (action === 'save-learning') await save();
  });

  root.addEventListener('input', event => {
    const card = event.target.closest('.learning-card');
    if (!card) return;
    if (event.target.matches('.learning-editor-surface, .learning-card-title')) ensureTrailingCard(root);
  });

  root.addEventListener('focusin', event => { activeCard = event.target.closest('.learning-card'); });

  root.addEventListener('dragstart', event => {
    const image = event.target.closest('.learning-inline-image');
    if (!image) return;
    draggedImage = image;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/x-pab-learning-image', image.dataset.mediaId || '');
    image.classList.add('dragging');
  });

  root.addEventListener('dragend', event => {
    const image = event.target.closest('.learning-inline-image');
    image?.classList.remove('dragging');
    draggedImage = null;
  });

  root.addEventListener('dragover', event => {
    const surface = event.target.closest('.learning-editor-surface');
    if (!surface) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = draggedImage ? 'move' : 'copy';
    surface.classList.add('drop-target');
  });

  root.addEventListener('dragleave', event => {
    const surface = event.target.closest('.learning-editor-surface');
    if (surface && !surface.contains(event.relatedTarget)) surface.classList.remove('drop-target');
  });

  root.addEventListener('drop', async event => {
    const surface = event.target.closest('.learning-editor-surface');
    if (!surface) return;
    event.preventDefault();
    surface.classList.remove('drop-target');
    if (draggedImage) {
      const image = draggedImage;
      if (image.closest('.learning-editor-surface') === surface) image.remove();
      placeNodeAtPoint(surface, image, event.clientX, event.clientY);
      draggedImage = null;
      return;
    }
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    try {
      readImageFile(file);
      const uploaded = await learningContent.uploadCardImage(lesson.id, file);
      uploadedImageIds.add(Number(uploaded.id));
      const image = documentRef.createElement('img');
      image.className = 'learning-inline-image';
      image.draggable = true;
      image.contentEditable = 'false';
      image.dataset.learningElement = 'image';
      image.dataset.mediaId = String(uploaded.id);
      image.dataset.width = '100';
      image.src = uploaded.url || URL.createObjectURL(file);
      image.alt = uploaded.original_name || 'Afbeelding';
      image.style.width = '100%';
      placeNodeAtPoint(surface, image, event.clientX, event.clientY);
      ensureTrailingCard(root);
    } catch (error) { showStatus(error.message || 'De afbeelding kon niet worden toegevoegd.', true); }
  });

  root.addEventListener('change', async event => {
    if (!event.target.matches('.learning-image-input')) return;
    const card = event.target.closest('.learning-card');
    const surface = card?.querySelector('.learning-editor-surface');
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!surface || !file) return;
    try {
      readImageFile(file);
      const uploaded = await learningContent.uploadCardImage(lesson.id, file);
      uploadedImageIds.add(Number(uploaded.id));
      const image = documentRef.createElement('img');
      image.className = 'learning-inline-image';
      image.draggable = true;
      image.contentEditable = 'false';
      image.dataset.learningElement = 'image';
      image.dataset.mediaId = String(uploaded.id);
      image.dataset.width = '100';
      image.src = uploaded.url || URL.createObjectURL(file);
      image.alt = uploaded.original_name || 'Afbeelding';
      image.style.width = '100%';
      placeNodeAtPoint(surface, image, surface.clientWidth / 2, surface.getBoundingClientRect().top + surface.clientHeight - 20);
      ensureTrailingCard(root);
    } catch (error) { showStatus(error.message || 'De afbeelding kon niet worden toegevoegd.', true); }
  });

  async function save() {
    showStatus('Leerstof opslaan…');
    try {
      const payload = [...cardsMount.querySelectorAll('.learning-card')]
        .filter(card => !cardIsEmpty(card))
        .map(card => ({
          id: card.dataset.cardId || null,
          title: text(card.querySelector('.learning-card-title')?.value),
          document: documentModelFromSurface(card.querySelector('.learning-editor-surface'))
        }));
      const originalMedia = new Set((cards || []).flatMap(card => (card.document?.elements || []).filter(element => element.type === 'image').map(element => Number(element.media_id))).filter(Boolean));
      const retainedMedia = new Set(payload.flatMap(card => card.document.elements.filter(element => element.type === 'image').map(element => Number(element.media_id))).filter(Boolean));
      const imagesToRemove = new Set([...originalMedia].filter(id => !retainedMedia.has(id)));
      for (const id of uploadedImageIds) if (!retainedMedia.has(id)) imagesToRemove.add(id);
      const saved = await learningContent.replaceForLesson(lesson.id, payload);
      for (const imageId of imagesToRemove) await learningContent.removeCardImage(imageId);
      showStatus(`${saved.length} ${saved.length === 1 ? 'kaart' : 'kaarten'} opgeslagen.`);
      return saved;
    } catch (error) { console.error('Learning editor save error:', error); showStatus(error.message || 'De leerstof kon niet worden opgeslagen.', true); return null; }
  }

  return Object.freeze({ addCard, save, getCards: () => [...cardsMount.querySelectorAll('.learning-card')].map(card => ({ title: text(card.querySelector('.learning-card-title')?.value), document: documentModelFromSurface(card.querySelector('.learning-editor-surface')) })), getActiveCard: () => activeCard });
}
