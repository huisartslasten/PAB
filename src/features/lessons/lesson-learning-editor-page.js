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

function cardHasContent(card) {
  if (!card) return false;
  const html = String(card.content?.innerHTML ?? '').replace(/<br\s*\/?>(\s*)$/i, '').trim();
  const plain = String(card.content?.textContent ?? '').trim();
  return Boolean(plain || html || card.imageId || text(card.titleInput?.value));
}

function createCardModel() {
  return {
    id: null,
    title: '',
    content: '',
    imageId: null,
    image: null
  };
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
        <div class="learning-image-dropzone" data-action="image-dropzone">
          <input class="learning-image-input" type="file" accept="image/jpeg,image/png,image/webp" hidden>
          <div class="learning-image-empty">Sleep hier een afbeelding naartoe, of klik om een afbeelding te kiezen.</div>
          <div class="learning-image-preview hidden"></div>
        </div>
      </div>
    </article>`;
}

function createCardElement(documentRef, index, initial = {}) {
  const wrapper = documentRef.createElement('div');
  wrapper.innerHTML = cardMarkup(index);
  const card = wrapper.firstElementChild;
  card.dataset.cardId = initial.id ? String(initial.id) : '';
  card.dataset.imageId = initial.image_id ? String(initial.image_id) : '';
  card.querySelector('.learning-card-title').value = initial.title || '';
  card.querySelector('.learning-editor-surface').innerHTML = initial.content || '';
  const preview = card.querySelector('.learning-image-preview');
  const empty = card.querySelector('.learning-image-empty');
  if (initial.image?.url) {
    renderImagePreview(card, initial.image.url, initial.image.original_name || 'Afbeelding');
  } else if (initial.image_id) {
    empty.textContent = 'Afbeelding geladen.';
  }
  return card;
}

function renderImagePreview(card, url, alt = 'Afbeelding') {
  const preview = card.querySelector('.learning-image-preview');
  const empty = card.querySelector('.learning-image-empty');
  if (!preview) return;
  preview.replaceChildren();
  const image = card.ownerDocument.createElement('img');
  image.src = url;
  image.alt = alt;
  image.loading = 'lazy';
  const remove = card.ownerDocument.createElement('button');
  remove.type = 'button';
  remove.className = 'learning-image-remove';
  remove.dataset.action = 'remove-image';
  remove.textContent = 'Afbeelding verwijderen';
  preview.append(image, remove);
  preview.classList.remove('hidden');
  empty.classList.add('hidden');
}

function cardIsEmpty(card) {
  const surface = card.querySelector('.learning-editor-surface');
  const title = card.querySelector('.learning-card-title');
  return !String(surface?.textContent || '').trim() && !String(title?.value || '').trim() && !card.dataset.imageId;
}

function ensureTrailingCard(root) {
  const cards = [...root.querySelectorAll('.learning-card')];
  if (!cards.length) {
    root.querySelector('.learning-cards').appendChild(createCardElement(root.ownerDocument, 0));
    return;
  }
  const last = cards[cards.length - 1];
  if (!cardIsEmpty(last)) {
    root.querySelector('.learning-cards').appendChild(createCardElement(root.ownerDocument, cards.length));
  }
  renumberCards(root);
}

function renumberCards(root) {
  [...root.querySelectorAll('.learning-card')].forEach((card, index) => {
    card.dataset.cardIndex = String(index);
    const number = card.querySelector('.learning-card-number');
    if (number) number.textContent = `Kaart ${index + 1}`;
  });
}

function normalizeCards(root) {
  return [...root.querySelectorAll('.learning-card')]
    .filter(card => !cardIsEmpty(card))
    .map(card => ({
      id: card.dataset.cardId || null,
      title: text(card.querySelector('.learning-card-title')?.value),
      content: String(card.querySelector('.learning-editor-surface')?.innerHTML || '').trim(),
      image_id: card.dataset.imageId ? Number(card.dataset.imageId) : null
    }));
}

function selectedRange(surface) {
  const selection = surface.ownerDocument.getSelection?.();
  if (!selection || !selection.rangeCount) return null;
  const range = selection.getRangeAt(0);
  if (!surface.contains(range.commonAncestorContainer)) return null;
  return range;
}

function wrapSelection(surface, className, defaultTextSize = null) {
  const range = selectedRange(surface);
  if (!range || range.collapsed) return;
  const span = surface.ownerDocument.createElement('span');
  span.className = className;
  if (defaultTextSize) span.style.fontSize = `${defaultTextSize}px`;
  try {
    span.appendChild(range.extractContents());
    range.insertNode(span);
    const selection = surface.ownerDocument.getSelection();
    selection.removeAllRanges();
    const next = surface.ownerDocument.createRange();
    next.selectNodeContents(span);
    selection.addRange(next);
  } catch {
    // Browser selection can become invalid while the editor is rerendering.
  }
}

function adjustFontSize(surface, delta) {
  const range = selectedRange(surface);
  if (!range || range.collapsed) return;
  const fragment = range.cloneContents();
  const probe = surface.ownerDocument.createElement('span');
  probe.appendChild(fragment);
  const current = Number.parseInt(surface.ownerDocument.defaultView?.getComputedStyle(probe).fontSize || '18', 10);
  const size = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, current + delta));
  wrapSelection(surface, 'learning-inline-size', size);
}

function execInlineCommand(surface, command) {
  surface.focus();
  if (command === 'bold') document.execCommand('bold');
  else if (command === 'italic') document.execCommand('italic');
  else if (command === 'increase-font') adjustFontSize(surface, 2);
  else if (command === 'decrease-font') adjustFontSize(surface, -2);
}

async function readImageFile(file) {
  if (!file || !/^image\/(jpeg|png|webp)$/i.test(file.type || '')) throw new Error('Gebruik een JPEG, PNG of WebP-afbeelding.');
  return file;
}

export function createLessonLearningEditorPage({ root, lesson, cards = [], learningContent, documentRef = document } = {}) {
  if (!root) throw new TypeError('Learning editor page requires a root.');
  if (!lesson) throw new TypeError('Learning editor page requires a lesson.');
  if (!learningContent) throw new TypeError('Learning editor page requires learning content service.');

  root.innerHTML = `
    <div class="learning-editor-main-card card">
      <div class="learning-editor-actions">
        <button class="success" type="button" data-action="save-learning">💾 Leerstof opslaan</button>
      </div>
      <section class="learning-editor-meta">
        <div class="learning-meta-student">
          <strong>Voor welke leerling?</strong>
          <div class="editor-student-buttons">
            ${STUDENTS.map(student => `<span class="editor-student-choice${student === lesson.student ? ' selected' : ''}">${escapeHtml(student)}</span>`).join('')}
          </div>
        </div>
        <div class="learning-meta-grid">
          <div class="field"><label>Vak</label><input value="${escapeHtml(lesson.subject || '')}" readonly></div>
          <div class="field"><label>Subvak <span class="small">(optioneel)</span></label><input value="${escapeHtml(lesson.subvak || '')}" readonly></div>
          <div class="field learning-meta-wide"><label>Naam van de les</label><input value="${escapeHtml(lesson.title || '')}" readonly></div>
        </div>
        <div class="learning-meta-note">Deze gegevens horen bij de les. Aanpassingen doe je in de gewone leseditor.</div>
      </section>
      <section class="learning-card-section">
        <div class="learning-card-intro">
          <div><h2>Leerstofkaarten</h2><p>Elke kaart is een schermformaat voor uitleg, tekst en beeld.</p></div>
          <button type="button" class="question-insert-button" data-action="add-card">➕ Kaart invoegen</button>
        </div>
        <div class="learning-cards" data-cards></div>
        <button type="button" class="success learning-add-card-bottom" data-action="add-card">➕ Kaart invoegen</button>
      </section>
      <div class="learning-editor-status message hidden" data-status></div>
      <div class="row editor-bottom-actions"><button class="success" type="button" data-action="save-learning">💾 Leerstof opslaan</button></div>
    </div>`;

  const cardsMount = root.querySelector('[data-cards]');
  const status = root.querySelector('[data-status]');
  let activeCard = null;
  let imageUpload = null;

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

  root.addEventListener('click', async event => {
    const commandButton = event.target.closest('[data-command]');
    if (commandButton) {
      const card = commandButton.closest('.learning-card');
      const surface = card?.querySelector('.learning-editor-surface');
      if (!surface) return;
      if (commandButton.dataset.command === 'image') {
        card.querySelector('.learning-image-input')?.click();
      } else {
        execInlineCommand(surface, commandButton.dataset.command);
      }
      return;
    }

    const action = event.target.closest('[data-action]')?.dataset.action;
    if (!action) return;
    const card = event.target.closest('.learning-card');
    if (action === 'add-card') {
      addCard();
      return;
    }
    if (action === 'remove-card' && card) {
      if (cardsMount.children.length <= 1) return;
      card.remove();
      renumberCards(root);
      ensureTrailingCard(root);
      return;
    }
    if (action === 'remove-image' && card) {
      card.dataset.previousImageId = card.dataset.imageId || '';
      card.dataset.imageId = '';
      const preview = card.querySelector('.learning-image-preview');
      const empty = card.querySelector('.learning-image-empty');
      preview?.classList.add('hidden');
      empty?.classList.remove('hidden');
      return;
    }
    if (action === 'image-dropzone' && event.target.closest('.learning-image-dropzone') && !event.target.closest('button')) {
      card?.querySelector('.learning-image-input')?.click();
    }
    if (action === 'save-learning') {
      await save();
    }
  });

  root.addEventListener('input', event => {
    const card = event.target.closest('.learning-card');
    if (!card) return;
    if (event.target.matches('.learning-editor-surface, .learning-card-title')) ensureTrailingCard(root);
  });

  root.addEventListener('focusin', event => {
    activeCard = event.target.closest('.learning-card');
  });

  root.addEventListener('change', async event => {
    if (!event.target.matches('.learning-image-input')) return;
    const card = event.target.closest('.learning-card');
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!card || !file) return;
    try {
      await prepareImage(card, file);
    } catch (error) {
      showStatus(error.message || 'De afbeelding kon niet worden toegevoegd.', true);
    }
  });

  root.addEventListener('dragover', event => {
    const zone = event.target.closest('.learning-image-dropzone');
    if (!zone) return;
    event.preventDefault();
    zone.classList.add('drag-over');
  });

  root.addEventListener('dragleave', event => {
    const zone = event.target.closest('.learning-image-dropzone');
    if (zone && !zone.contains(event.relatedTarget)) zone.classList.remove('drag-over');
  });

  root.addEventListener('drop', async event => {
    const zone = event.target.closest('.learning-image-dropzone');
    if (!zone) return;
    event.preventDefault();
    zone.classList.remove('drag-over');
    const card = zone.closest('.learning-card');
    const file = event.dataTransfer?.files?.[0];
    if (!card || !file) return;
    try {
      await prepareImage(card, file);
    } catch (error) {
      showStatus(error.message || 'De afbeelding kon niet worden toegevoegd.', true);
    }
  });

  async function prepareImage(card, file) {
    await readImageFile(file);
    const previousImageId = card.dataset.imageId || '';
    const prepared = await learningContent.uploadCardImage(lesson.id, file);
    card.dataset.imageId = String(prepared.id);
    if (previousImageId) card.dataset.previousImageId = previousImageId;
    const images = await learningContent.listForLesson(lesson.id);
    const uploaded = images.find(image => Number(image.id) === Number(prepared.id));
    if (uploaded?.image?.url) renderImagePreview(card, uploaded.image.url, prepared.original_name || 'Afbeelding');
    else renderImagePreview(card, URL.createObjectURL(file), prepared.original_name || 'Afbeelding');
    ensureTrailingCard(root);
  }

  async function save() {
    showStatus('Leerstof opslaan…');
    try {
      const payload = normalizeCards(root);
      const oldImages = new Set((cards || []).map(card => Number(card.image_id)).filter(Boolean));
      const retainedImages = new Set(payload.map(card => Number(card.image_id)).filter(Boolean));
      const removedImages = [...oldImages].filter(id => !retainedImages.has(id));
      const saved = await learningContent.replaceForLesson(lesson.id, payload);
      for (const imageId of removedImages) await learningContent.removeCardImage(imageId);
      showStatus(`${saved.length} ${saved.length === 1 ? 'kaart' : 'kaarten'} opgeslagen.`);
      return saved;
    } catch (error) {
      console.error('Learning editor save error:', error);
      showStatus(error.message || 'De leerstof kon niet worden opgeslagen.', true);
      return null;
    }
  }

  return Object.freeze({ addCard, save, getCards: () => normalizeCards(root), getActiveCard: () => activeCard, getImageUpload: () => imageUpload });
}
