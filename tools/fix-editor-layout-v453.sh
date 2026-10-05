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
if '<!-- PacoGO TEST V4.63 -->' not in s:
    raise SystemExit('ERROR: expected TEST V4.63 checkpoint not found')
css=r'''
/* TEST V4.64 — lesson editor action buttons: remove redundant row button; save left; photo/save swapped at top */
#editor .pg-v464-hidden-row-add{display:none!important}
#editor .pg-v464-bottom-actions{display:flex!important;align-items:center!important;gap:16px!important}
#editor .pg-v464-bottom-actions .pg-v464-save{order:0!important;margin-left:0!important}
#editor .pg-v464-bottom-actions .pg-v464-photo{order:1!important}
#editor .pg-v464-top-actions{display:flex!important;align-items:center!important;gap:16px!important}
#editor .pg-v464-top-actions .pg-v464-save{order:0!important}
#editor .pg-v464-top-actions .pg-v464-photo{order:1!important}
'''
if '/* TEST V4.64 — lesson editor action buttons:' not in s:
    s=s.replace('</style>',css+'</style>',1)
js=r'''
<script>
/* TEST V4.64 — deterministic action-button cleanup/reorder */
(function(){
  function norm(t){return (t||'').replace(/[^\p{L}\p{N}]+/gu,' ').trim().toLowerCase();}
  function findButtons(label){
    return Array.from(document.querySelectorAll('#editor button')).filter(b=>norm(b.textContent)===label);
  }
  function applyV464(){
    const rowBtns=findButtons('rij toevoegen');
    const photoBtns=findButtons('maak les van foto');
    const saveBtns=findButtons('les opslaan');

    // Remove only the redundant editor-level "+ Rij toevoegen" button.
    const rowBtn=rowBtns[0];
    if(rowBtn){
      rowBtn.classList.add('pg-v464-hidden-row-add');
      const parent=rowBtn.parentElement;
      if(parent){
        const save=Array.from(parent.querySelectorAll('button')).find(b=>norm(b.textContent)==='les opslaan');
        if(save){
          parent.classList.add('pg-v464-bottom-actions');
          save.classList.add('pg-v464-save');
          save.style.order='0';
          save.style.marginLeft='0';
        }
      }
    }

    // At the top, put LES OPSLAAN before MAAK LES VAN FOTO in their shared action row.
    const photo=photoBtns[0];
    if(photo){
      const parent=photo.parentElement;
      if(parent){
        const save=Array.from(parent.querySelectorAll('button')).find(b=>norm(b.textContent)==='les opslaan');
        if(save){
          parent.classList.add('pg-v464-top-actions');
          save.classList.add('pg-v464-save');
          photo.classList.add('pg-v464-photo');
          parent.insertBefore(save,photo);
        }
      }
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',applyV464);
  else applyV464();
  setTimeout(applyV464,300);
  setTimeout(applyV464,1000);
})();
</script>
'''
if 'TEST V4.64 — deterministic action-button cleanup/reorder' not in s:
    s=s.replace('</body>',js+'</body>',1)
s=s.replace('<!-- PacoGO TEST V4.63 -->','<!-- PacoGO TEST V4.64 -->',1)
p.write_text(s)
print('Applied TEST V4.64 action-button layout.')
PY
python3 - <<'PY'
from pathlib import Path
s=Path('index.html').read_text()
assert '<!-- PacoGO TEST V4.64 -->' in s
assert 'TEST V4.64 — deterministic action-button cleanup/reorder' in s
assert 'rij toevoegen' in s.lower()
assert 'maak les van foto' in s.lower()
assert 'les opslaan' in s.lower()
assert 'function insertLessonRowAfter(button)' in s
assert 'function insertWordQuestionAfter(button)' in s
assert s.count('id="lessonSubject"')==1
assert s.count('id="lessonType"')==1
assert s.count('id="questionEditor"')==1
print('CHECK OK: TEST V4.64 version, action-button changes, insert handlers, and key editor IDs.')
PY
git add index.html
git commit -m "TEST V4.64 reorder lesson editor action buttons"
git push origin HEAD:test
