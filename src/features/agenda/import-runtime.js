import { createCustomAgendaStorage } from './custom-storage.js';
import { agendaMediaKind, createAgendaMediaReader } from './media.js';
import { mergeAgendaAiEvents } from './merge.js';
import { prepareAgendaReviewCandidates, commitAgendaReview } from './review.js';

const esc = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
const key = date => { const d = date instanceof Date ? new Date(date) : new Date(`${date}T12:00:00`); return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-'); };

export function createAgendaImportRuntime({ storage = globalThis.localStorage, documentRef = globalThis.document, db, currentStudent = () => '', lessonMatchHtml = () => '', now = () => new Date() } = {}) {
  if (!db?.functions?.invoke) throw new Error('Agenda import requires a Supabase functions client.');
  const store = createCustomAgendaStorage(storage);
  const media = createAgendaMediaReader();
  let file = null;
  let review = [];
  const el = id => documentRef?.getElementById(id);
  const value = id => String(el(id)?.value || '').trim();

  async function understand(dataUrl) {
    const request = db.functions.invoke('agenda-understand-v1', { body: { image: dataUrl, today: now().toISOString().slice(0, 10), student: currentStudent() || '' } });
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('AI timeout')), 30000));
    const { data, error } = await Promise.race([request, timeout]);
    if (error) throw error;
    return { status: data?.status || 'none', events: Array.isArray(data?.events) ? data.events : [] };
  }

  function toggleMeta(index) { el(`agendaReviewMeta${index}`)?.classList.toggle('agenda-review-description-active', Boolean(el(`agendaReviewMetaEnabled${index}`)?.checked)); }
  function toggleAllMeta(checked) { review.forEach((_, i) => { const checkbox = el(`agendaReviewMetaEnabled${i}`); if (checkbox) checkbox.checked = checked; toggleMeta(i); }); }

  function renderReview(items) {
    review = prepareAgendaReviewCandidates(items, { student: currentStudent(), source: 'AI agenda-import', now: now().toISOString() });
    const box = el('agendaImportReview'); const list = el('agendaImportReviewList');
    if (!box || !list) return;
    if (!review.length) { box.classList.add('hidden'); return; }
    list.innerHTML = '<div class="agenda-review-select-all"><label><input id="agendaReviewMetaSelectAll" type="checkbox"><span> SELECT ALL — omschrijvingen toevoegen</span></label></div>' + review.map((item, i) => `<div class="agenda-import-found"><div class="agenda-import-found-head"><strong>Afspraak ${i + 1}</strong><span class="small">${esc(item.source || 'Import')}</span></div><div class="agenda-import-found-grid"><input id="agendaReviewDate${i}" type="date" value="${esc(item.date)}"><input id="agendaReviewTitle${i}" maxlength="120" value="${esc(item.title)}"><select id="agendaReviewType${i}"><option value="test">📝 Toets</option><option value="homework">📚 Huiswerk</option><option value="submit">📖 Inleveren</option><option value="activity">🎒 Schoolactiviteit</option><option value="free">🎉 Vrije dag</option><option value="other">📌 Overig</option></select></div><label><input id="agendaReviewMetaEnabled${i}" type="checkbox"><span> Omschrijving toevoegen</span></label><textarea id="agendaReviewMeta${i}" maxlength="300" class="agenda-review-description">${esc(item.meta)}</textarea>${lessonMatchHtml(item)}</div>`).join('');
    el('agendaReviewMetaSelectAll')?.addEventListener('change', event => toggleAllMeta(event.target.checked));
    review.forEach((item, i) => { el(`agendaReviewType${i}`).value = item.type || 'other'; el(`agendaReviewMetaEnabled${i}`)?.addEventListener('change', () => toggleMeta(i)); toggleMeta(i); });
    box.classList.remove('hidden');
  }

  async function analyzeImage() {
    if (!file) return;
    const button = el('agendaMediaAnalyzeButton'); const status = el('agendaMediaStatus');
    try { button && (button.disabled = true); const result = await understand(await media.imageToDataUrl(file)); renderReview(result.events); if (status) status.innerHTML = result.events.length ? `<strong>✅ Analyse klaar!</strong><br>AI vond ${result.events.length} afspraak${result.events.length === 1 ? '' : 'afspraken'}. Controleer ze hieronder.` : '<strong>⚠️ Analyse klaar.</strong><br>AI kon geen duidelijke afspraak herkennen.'; }
    catch (error) { console.error('Agenda AI image error:', error); if (status) status.textContent = '⚠️ De AI-analyse van de screenshot is mislukt.'; }
    finally { button && (button.disabled = false); }
  }

  async function analyzeVideo() {
    if (!file) return;
    const video = el('agendaVideoPreview'); const button = el('agendaMediaAnalyzeButton'); const status = el('agendaMediaStatus');
    try {
      button && (button.disabled = true); await video?.play?.().catch(() => {}); const duration = Number(video?.duration || 0); if (!duration) throw new Error('Geen videoduur gevonden');
      const count = 30; const step = duration / (count - 1); const events = []; const seen = new Set(); let success = 0; let failed = 0;
      const analyzeAt = async time => { const safe = Math.max(0, Math.min(duration - 0.25, time)); const signature = safe.toFixed(3); if (seen.has(signature)) return { status: 'none', events: [] }; seen.add(signature); const result = await understand(await media.videoFrameToDataUrl(video, safe)); success++; events.push(...result.events); return result; };
      for (let i = 0; i < count; i++) { const t = duration * i / (count - 1); try { const result = await analyzeAt(t); if (result.status === 'transition') for (const offset of [-step * .25, step * .25, -step * .5, step * .5, -step * .75, step * .75, -step, step, -step * 1.5, step * 1.5, -step * 2, step * 2, -step * 3, step * 3]) { const nearby = t + offset; if (nearby < 0 || nearby > duration - .25) continue; try { const refined = await analyzeAt(nearby); if (refined.status === 'stable' && refined.events.length) break; } catch { failed++; } } if (status) status.textContent = `🤖 Beeld ${i + 1} van ${count} — ${mergeAgendaAiEvents(events).length} unieke afspraken gevonden`; } catch { failed++; } }
      const merged = mergeAgendaAiEvents(events); renderReview(merged); if (!success) status.textContent = '⚠️ Analyse niet gelukt. Probeer de opname opnieuw.'; else if (!merged.length) status.textContent = '🔍 Analyse voltooid, maar geen duidelijke afspraken gevonden.'; else status.innerHTML = `<strong>✅ Analyse klaar!</strong><br>AI vond ${merged.length} unieke afspraken. Controleer ze hieronder.${failed ? `<br><span class="small">${failed} beelden konden niet worden verwerkt.</span>` : ''}`;
    } catch (error) { console.error('Agenda AI video error:', error); if (status) status.textContent = '⚠️ Analyse niet gelukt. Probeer het opnieuw.'; }
    finally { button && (button.disabled = false); }
  }

  function showImport() { if (!currentStudent()) return false; el('studentDashboard')?.classList.add('hidden'); documentRef?.querySelectorAll('.page')?.forEach(page => page.classList.add('hidden')); el('agendaImport')?.classList.remove('hidden'); return true; }
  function setMode(mode) { const cap = mode.charAt(0).toUpperCase() + mode.slice(1); el('agendaModeMedia')?.classList.toggle('active', mode === 'media'); el('agendaImportMediaStep')?.classList.toggle('hidden', mode !== 'media'); el('agendaImportManualStep')?.classList.toggle('hidden', mode !== 'manual'); void cap; }
  function handleMediaFile(event) { const selected = event?.target?.files?.[0]; if (!selected) return false; file = selected; const video = agendaMediaKind(selected) === 'video'; const url = URL.createObjectURL(selected); el('agendaImagePreview')?.classList.toggle('hidden', video); el('agendaVideoPreview')?.classList.toggle('hidden', !video); if (video) el('agendaVideoPreview').src = url; else el('agendaImagePreview').src = url; el('agendaMediaAnalyzeButton')?.classList.remove('hidden'); return true; }
  function setManualRange(mode) { el('agendaManualSingleFields')?.classList.toggle('hidden', mode !== 'single'); el('agendaManualRangeFields')?.classList.toggle('hidden', mode !== 'range'); }
  function addManualItem() { const student = currentStudent(); if (!student) return { ok: false, message: 'Kies eerst een leerling.' }; const title = value('agendaManualTitle'); if (!title) return { ok: false, message: 'Vul minimaal een titel in.' }; const type = value('agendaManualType') || 'other'; const meta = value('agendaManualMeta'); const items = store.getItems(student); const createdAt = now().toISOString(); const range = documentRef?.querySelector('input[name="agendaManualRange"]:checked')?.value || 'single'; if (range === 'single') { const date = value('agendaManualDate'); if (!date) return { ok: false, message: 'Kies een datum.' }; items.push({ id: 'agenda_' + Date.now(), student, date, type, title, meta, source: 'handmatig', createdAt }); } else { const startDate = value('agendaManualStartDate'); const endDate = value('agendaManualEndDate'); if (!startDate || !endDate || endDate < startDate) return { ok: false, message: 'Kies een geldig begin en einde.' }; const periodId = 'agenda_' + Date.now(); for (let d = new Date(`${startDate}T12:00:00`), end = new Date(`${endDate}T12:00:00`); d <= end; d.setDate(d.getDate() + 1)) { const date = key(d); items.push({ id: `${periodId}_${date}`, student, date, type, title, meta, source: 'handmatig-periode', periodId, periodStart: startDate, periodEnd: endDate, createdAt }); } } store.saveItems(items, student); return { ok: true, count: 1 }; }
  function saveReview() { const student = currentStudent(); if (!student) return { ok: false, message: 'Kies eerst een leerling.' }; const reviewed = review.map((item, i) => ({ ...item, student, date: value(`agendaReviewDate${i}`), type: value(`agendaReviewType${i}`) || 'other', title: value(`agendaReviewTitle${i}`) || 'Agenda-afspraak', meta: el(`agendaReviewMetaEnabled${i}`)?.checked ? value(`agendaReviewMeta${i}`) : '' })).filter(item => item.date && item.title); if (!reviewed.length) return { ok: false, message: 'Vul bij minimaal één afspraak een datum en titel in.' }; const result = commitAgendaReview(store.getItems(student), reviewed); store.saveItems(result.items, student); review = []; el('agendaImportReview')?.classList.add('hidden'); return { ok: true, count: result.added.length }; }
  function clearReview() { review = []; el('agendaImportReview')?.classList.add('hidden'); }

  return Object.freeze({ showImport, setMode, handleMediaFile, analyzeImage, analyzeVideo, setManualRange, addManualItem, saveReview, clearReview, toggleMeta, toggleAllMeta, renderReview, getReview: () => [...review] });
}
