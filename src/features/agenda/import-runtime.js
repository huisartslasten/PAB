import { createCustomAgendaStorage } from './custom-storage.js';
import { agendaMediaKind, createAgendaMediaReader } from './media.js';
import { mergeAgendaAiEvents } from './merge.js';
import { prepareAgendaReviewCandidates, commitAgendaReview } from './review.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('`', '&#096;');
}

function dateKey(date) {
  const d = date instanceof Date ? new Date(date) : new Date(`${date}T12:00:00`);
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
}

export function createAgendaImportRuntime({
  storage = globalThis.localStorage,
  documentRef = globalThis.document,
  db,
  currentStudent = () => '',
  setCurrentStudent = () => {},
  lessonMatchHtml = () => '',
  now = () => new Date()
} = {}) {
  if (!db?.functions?.invoke) throw new Error('Agenda import requires a Supabase functions client.');
  const customStorage = createCustomAgendaStorage(storage);
  const mediaReader = createAgendaMediaReader();
  let mode = 'media';
  let file = null;
  let review = [];

  const el = id => documentRef?.getElementById(id);
  const value = id => String(el(id)?.value || '').trim();

  async function understandFrame(dataUrl) {
    const timeoutMs = 30000;
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('AI timeout')), timeoutMs));
    const request = db.functions.invoke('agenda-understand-v1', {
      body: { image: dataUrl, today: now().toISOString().slice(0, 10), student: currentStudent() || '' }
    });
    const { data, error } = await Promise.race([request, timeout]);
    if (error) throw error;
    return {
      status: ['stable', 'transition', 'none'].includes(data?.status) ? data.status : (Array.isArray(data?.events) && data.events.length ? 'stable' : 'none'),
      events: Array.isArray(data?.events) ? data.events : []
    };
  }

  function setProgress(status, step, total, uniqueCount = 0) {
    if (!status) return;
    status.innerHTML = '<div class="agenda-ai-busy"><span class="agenda-ai-spinner"></span><span><strong>🤖 PacoGO AI analyseert je schermopname</strong><br><span class="small">Beeld ' + step + ' van ' + total + ' wordt bekeken<span class="agenda-ai-dots"><span></span><span></span><span></span></span><br><span class="small">Al ' + uniqueCount + ' unieke afspraak' + (uniqueCount === 1 ? '' : 'afspraken') + ' gevonden.</span><br><span class="small">Even geduld — PacoGO is nog bezig.</span></span></div>';
  }

  function renderReview(items) {
    review = prepareAgendaReviewCandidates(items, { student: currentStudent(), source: 'AI agenda-import', now: now().toISOString() });
    const box = el('agendaImportReview');
    const list = el('agendaImportReviewList');
    if (!box || !list) return;
    if (!review.length) { box.classList.add('hidden'); return; }
    list.innerHTML = '<div class="agenda-review-select-all"><label class="agenda-review-description-toggle"><input id="agendaReviewMetaSelectAll" type="checkbox" onchange="toggleAllAgendaReviewMeta(this.checked)"> <span>SELECT ALL — omschrijvingen toevoegen</span></label></div>' + review.map((item, i) =>
      '<div class="agenda-import-found">' +
        '<div class="agenda-import-found-head"><strong>Afspraak ' + (i + 1) + '</strong><span class="small">' + escapeHtml(item.source || 'Import') + '</span></div>' +
        '<div class="agenda-import-found-grid"><input id="agendaReviewDate' + i + '" type="date" value="' + escapeAttr(item.date || '') + '">' +
        '<input id="agendaReviewTitle' + i + '" maxlength="120" value="' + escapeAttr(item.title || '') + '">' +
        '<select id="agendaReviewType' + i + '"><option value="test">📝 Toets</option><option value="homework">📚 Huiswerk</option><option value="submit">📖 Inleveren</option><option value="activity">🎒 Schoolactiviteit</option><option value="free">🎉 Vrije dag</option><option value="other">📌 Overig</option></select></div>' +
        '<label class="agenda-review-description-toggle"><input id="agendaReviewMetaEnabled' + i + '" type="checkbox" onchange="toggleAgendaReviewMeta(' + i + ')"> <span>Omschrijving toevoegen</span></label><textarea id="agendaReviewMeta' + i + '" class="agenda-review-description" maxlength="300" style="margin-top:8px" placeholder="Omschrijving">' + escapeHtml(item.meta || '') + '</textarea>' +
        lessonMatchHtml(item) +
      '</div>'
    ).join('');
    review.forEach((item, i) => { const type = el('agendaReviewType' + i); if (type) type.value = item.type || 'other'; const cb = el('agendaReviewMetaEnabled' + i); if (cb) cb.checked = false; toggleAgendaReviewMeta(i); });
    box.classList.remove('hidden');
  }

  async function analyzeImage() {
    if (!file) return;
    const status = el('agendaMediaStatus');
    const button = el('agendaMediaAnalyzeButton');
    try {
      if (button) button.disabled = true;
      if (status) status.innerHTML = '<div class="agenda-ai-busy"><span class="agenda-ai-spinner"></span><span><strong>🤖 PacoGO AI analyseert je screenshot</strong><br><span class="small">De afbeelding wordt bekeken<span class="agenda-ai-dots"><span></span><span></span><span></span></span></span></div>';
      const dataUrl = await mediaReader.imageToDataUrl(file);
      const result = await understandFrame(dataUrl);
      renderReview(result.events);
      if (status) status.innerHTML = result.events.length ? '<strong>✅ Analyse klaar!</strong><br>AI vond ' + result.events.length + ' afspraak' + (result.events.length === 1 ? '' : 'afspraken') + '. Controleer ze hieronder.' : '<strong>⚠️ Analyse klaar.</strong><br>AI kon geen duidelijke afspraak herkennen. Probeer een scherpere screenshot.';
    } catch (error) {
      console.error('Agenda AI image error:', error);
      if (status) status.textContent = '⚠️ De AI-analyse van de screenshot is mislukt.';
    } finally { if (button) button.disabled = false; }
  }

  async function analyzeVideo() {
    if (!file) return;
    const status = el('agendaMediaStatus');
    const button = el('agendaMediaAnalyzeButton');
    const video = el('agendaVideoPreview');
    try {
      if (button) button.disabled = true;
      if (status) status.textContent = '🤖 Opname voorbereiden...';
      await video?.play?.().catch(() => {});
      const duration = Number(video?.duration || 0);
      if (!duration) throw new Error('Geen videoduur gevonden');
      const count = 30;
      const events = [];
      let successfulFrames = 0;
      let failedFrames = 0;
      let refinementFrames = 0;
      const baseStep = count > 1 ? duration / (count - 1) : duration;
      const analyzedTimes = new Set();
      const analyzeAt = async time => {
        const safeTime = Math.max(0, Math.min(duration - 0.25, time));
        const key = safeTime.toFixed(3);
        if (analyzedTimes.has(key)) return { status: 'none', events: [] };
        analyzedTimes.add(key);
        const frame = await mediaReader.videoFrameToDataUrl(video, safeTime);
        const result = await understandFrame(frame);
        successfulFrames += 1;
        events.push(...result.events);
        return result;
      };
      for (let i = 0; i < count; i += 1) {
        const t = count === 1 ? 0 : Math.max(0, Math.min(duration - 0.25, duration * (i / (count - 1))));
        setProgress(status, i + 1, count, mergeAgendaAiEvents(events).length);
        try {
          const result = await analyzeAt(t);
          setProgress(status, i + 1, count, mergeAgendaAiEvents(events).length);
          if (result.status === 'transition') {
            const offsets = [-baseStep * 0.25, baseStep * 0.25, -baseStep * 0.5, baseStep * 0.5, -baseStep * 0.75, baseStep * 0.75, -baseStep, baseStep, -baseStep * 1.5, baseStep * 1.5, -baseStep * 2, baseStep * 2, -baseStep * 3, baseStep * 3];
            let stableFound = false;
            for (const offset of offsets) {
              if (stableFound) break;
              const nearby = t + offset;
              if (nearby < 0 || nearby > duration - 0.25) continue;
              try {
                refinementFrames += 1;
                const refined = await analyzeAt(nearby);
                setProgress(status, i + 1, count, mergeAgendaAiEvents(events).length);
                if (refined.status === 'stable' && refined.events.length) stableFound = true;
              } catch (error) {
                failedFrames += 1;
                console.error('Agenda AI refinement frame error', i + 1, error);
              }
            }
          }
        } catch (error) {
          failedFrames += 1;
          console.error('Agenda AI frame error', i + 1, error);
        }
      }
      const merged = mergeAgendaAiEvents(events);
      renderReview(merged);
      if (!successfulFrames) status.innerHTML = '<strong>⚠️ Analyse niet gelukt</strong><br>PacoGO kon de schermopname niet goed verwerken. Probeer de opname opnieuw.';
      else if (!merged.length) status.innerHTML = '<strong>🔍 Analyse voltooid</strong><br>PacoGO heeft de schermopname bekeken, maar kon geen duidelijke afspraken herkennen.' + (failedFrames ? '<br><span class="small">' + failedFrames + ' beelden konden niet worden verwerkt.' + (refinementFrames ? ' ' + refinementFrames + ' extra overgangsbeelden gecontroleerd.' : '') + '</span>' : '');
      else status.innerHTML = '<strong>✅ Analyse klaar!</strong><br>AI vond ' + merged.length + ' unieke afspraak' + (merged.length === 1 ? '' : 'afspraken') + '. Controleer ze hieronder.' + (failedFrames ? '<br><span class="small">' + failedFrames + ' beelden konden niet worden verwerkt.</span>' : '');
    } catch (error) {
      console.error('Agenda AI video error:', error);
      if (status) status.innerHTML = '<strong>⚠️ Analyse niet gelukt</strong><br>PacoGO kon de schermopname niet goed verwerken. Probeer het opnieuw.';
    } finally { if (button) button.disabled = false; }
  }

  function showImport() {
    if (!currentStudent()) return false;
    documentRef?.getElementById('studentDashboard')?.classList.add('hidden');
    documentRef?.querySelectorAll('.page')?.forEach(page => page.classList.add('hidden'));
    el('agendaImport')?.classList.remove('hidden');
    setMode('media');
    return true;
  }

  function setMode(nextMode) {
    mode = nextMode;
    ['media', 'manual'].forEach(name => {
      el('agendaMode' + name.charAt(0).toUpperCase() + name.slice(1))?.classList.toggle('active', name === mode);
      el('agendaImport' + name.charAt(0).toUpperCase() + name.slice(1) + 'Step')?.classList.toggle('hidden', name !== mode);
    });
    el('agendaImportReview')?.classList.add('hidden');
  }

  function handleMediaFile(event) {
    const selected = event?.target?.files?.[0];
    if (!selected) return false;
    file = selected;
    const kind = agendaMediaKind(selected);
    const isVideo = kind === 'video';
    mode = isVideo ? 'video' : 'image';
    const status = el('agendaMediaStatus');
    const image = el('agendaImagePreview');
    const video = el('agendaVideoPreview');
    image?.classList.toggle('hidden', isVideo);
    video?.classList.toggle('hidden', !isVideo);
    const url = URL.createObjectURL(selected);
    if (isVideo) { if (video) video.src = url; if (status) status.innerHTML = '✅ <strong>Schermopname herkend.</strong> PacoGO bekijkt de opname beeld voor beeld.'; }
    else { if (image) image.src = url; if (status) status.innerHTML = '✅ <strong>Screenshot herkend.</strong> PacoGO leest de agenda uit de afbeelding.'; }
    el('agendaMediaAnalyzeButton')?.classList.remove('hidden');
    return true;
  }

  function setManualRange(modeValue) {
    el('agendaManualSingleFields')?.classList.toggle('hidden', modeValue !== 'single');
    el('agendaManualRangeFields')?.classList.toggle('hidden', modeValue !== 'range');
  }

  function addManualItem() {
    const student = currentStudent();
    if (!student) return { ok: false, message: 'Kies eerst een leerling.' };
    const range = documentRef?.querySelector('input[name="agendaManualRange"]:checked')?.value || 'single';
    const title = value('agendaManualTitle');
    const type = value('agendaManualType') || 'other';
    const meta = value('agendaManualMeta');
    if (!title) return { ok: false, message: 'Vul minimaal een titel in.' };
    const items = customStorage.getItems(student);
    const createdAt = now().toISOString();
    if (range === 'single') {
      const date = value('agendaManualDate');
      if (!date) return { ok: false, message: 'Kies een datum.' };
      items.push({ id: 'agenda_' + Date.now(), student, date, type, title, meta, source: 'handmatig', createdAt });
    } else {
      const startDate = value('agendaManualStartDate');
      const endDate = value('agendaManualEndDate');
      if (!startDate || !endDate) return { ok: false, message: 'Kies een begin- en einddatum.' };
      if (endDate < startDate) return { ok: false, message: 'De einddatum moet op of na de begindatum liggen.' };
      const periodId = 'agenda_' + Date.now();
      const start = new Date(`${startDate}T12:00:00`);
      const end = new Date(`${endDate}T12:00:00`);
      for (const date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const dateValue = dateKey(date);
        items.push({ id: periodId + '_' + dateValue, student, date: dateValue, type, title, meta, source: 'handmatig-periode', periodId, periodStart: startDate, periodEnd: endDate, createdAt });
      }
    }
    customStorage.saveItems(items, student);
    el('agendaManualTitle').value = '';
    el('agendaManualMeta').value = '';
    return { ok: true, count: 1 };
  }

  function saveReview() {
    const student = currentStudent();
    if (!student) return { ok: false, message: 'Kies eerst een leerling.' };
    const reviewed = review.map((item, i) => ({
      ...item,
      student,
      date: value('agendaReviewDate' + i),
      type: value('agendaReviewType' + i) || 'other',
      title: value('agendaReviewTitle' + i) || 'Agenda-afspraak',
      meta: el('agendaReviewMetaEnabled' + i)?.checked ? value('agendaReviewMeta' + i) : ''
    })).filter(item => item.date && item.title);
    if (!reviewed.length) return { ok: false, message: 'Vul bij minimaal één afspraak een datum en titel in.' };
    const existing = customStorage.getItems(student);
    const result = commitAgendaReview(existing, reviewed);
    customStorage.saveItems(result.items, student);
    review = [];
    el('agendaImportReview')?.classList.add('hidden');
    return { ok: true, count: result.added.length };
  }

  function clearReview() { review = []; el('agendaImportReview')?.classList.add('hidden'); }
  function toggleMeta(index) { el('agendaReviewMeta' + index)?.classList.toggle('agenda-review-description-active', Boolean(el('agendaReviewMetaEnabled' + index)?.checked)); }
  function toggleAllMeta(checked) { review.forEach((_, index) => { const checkbox = el('agendaReviewMetaEnabled' + index); if (checkbox) checkbox.checked = checked; toggleMeta(index); }); }
  function getReview() { return [...review]; }

  return Object.freeze({ showImport, setMode, handleMediaFile, analyzeImage, analyzeVideo, setManualRange, addManualItem, saveReview, clearReview, toggleMeta, toggleAllMeta, getReview, renderReview });
}
