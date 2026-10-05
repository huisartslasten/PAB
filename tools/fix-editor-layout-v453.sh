#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."
git config user.name "PacoGO Bot"
git config user.email "paco-go-bot@users.noreply.github.com"
git fetch origin test
git checkout -B test origin/test
python3 - <<'PY'
from pathlib import Path
p=Path('index.html')
s=p.read_text()
assert '<!-- PacoGO TEST V4.64 -->' in s
marker='TEST V4.64 — deterministic action-button cleanup/reorder'
if marker in s:
    pos=s.find(marker)
    start=s.rfind('<script>',0,pos)
    end=s.find('</script>',pos)
    if start<0 or end<0:
        raise SystemExit('ERROR: could not locate embedded V4.64 script block')
    s=s[:start]+s[end+len('</script>'):]
js='''<script>
/* TEST V4.64 — deterministic action-button cleanup/reorder */
(function(){
  function norm(t){return (t||'').replace(/[^\\p{L}\\p{N}]+/gu,' ').trim().toLowerCase();}
  function findButtons(label){return Array.from(document.querySelectorAll('#editor button')).filter(b=>norm(b.textContent)===label)}
  function applyV464(){
    const rowBtn=findButtons('rij toevoegen')[0];
    const photo=findButtons('maak les van foto')[0];
    if(rowBtn){
      rowBtn.classList.add('pg-v464-hidden-row-add');
      const parent=rowBtn.parentElement;
      const save=parent&&Array.from(parent.querySelectorAll('button')).find(b=>norm(b.textContent)==='les opslaan');
      if(save){parent.classList.add('pg-v464-bottom-actions');save.classList.add('pg-v464-save');save.style.order='0';save.style.marginLeft='0'}
    }
    if(photo){
      const parent=photo.parentElement;
      const save=parent&&Array.from(parent.querySelectorAll('button')).find(b=>norm(b.textContent)==='les opslaan');
      if(save){parent.classList.add('pg-v464-top-actions');save.classList.add('pg-v464-save');photo.classList.add('pg-v464-photo');parent.insertBefore(save,photo)}
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyV464);else applyV464();
  setTimeout(applyV464,300);setTimeout(applyV464,1000);
})();
</script>
'''
# Insert only before the final real </body>.
idx=s.rfind('</body>')
if idx<0: raise SystemExit('ERROR: final </body> not found')
# Avoid duplicate real injection.
if 'TEST V4.64 — deterministic action-button cleanup/reorder' not in s:
    s=s[:idx]+js+s[idx:]
p.write_text(s)
print('TEST V4.64 repaired: no action-button script remains inside printWindow.document.write.')
PY
git add index.html
git diff --cached --check
git diff --cached --quiet || { git commit -m "TEST V4.64 repair editor action buttons"; git push origin HEAD:test; }
