#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."
git config user.name "PacoGO Bot"
git config user.email "paco-go-bot@users.noreply.github.com"
git fetch origin test
git checkout -B test origin/test
python3 - <<'PY'
from pathlib import Path
import re
p=Path('index.html')
s=p.read_text()
assert '<!-- PacoGO TEST V4.64 -->' in s
marker='\n<script>\n/* TEST V4.64 — deterministic action-button cleanup/reorder */'
if marker in s:
    end='\n</script>\n</body></html>\');'
    pos=s.find(marker)
    endpos=s.find(end,pos)
    if endpos<0:
        raise SystemExit('ERROR: malformed V4.64 injection found, but end marker was not found')
    s=s[:pos]+'\n</body></html>\');'+s[endpos+len(end):]

js='''<script>
/* TEST V4.64 — deterministic action-button cleanup/reorder */
(function(){
  function norm(t){return (t||'').replace(/[^\\p{L}\\p{N}]+/gu,' ').trim().toLowerCase();}
  function findButtons(label){
    return Array.from(document.querySelectorAll('#editor button')).filter(b=>norm(b.textContent)===label);
  }
  function applyV464(){
    const rowBtns=findButtons('rij toevoegen');
    const photoBtns=findButtons('maak les van foto');
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
# Safely insert after the LAST real closing body tag, never the first occurrence inside a JS string.
if 'TEST V4.64 — deterministic action-button cleanup/reorder' not in s:
    idx=s.rfind('</body>')
    if idx<0:
        raise SystemExit('ERROR: real </body> tag not found')
    s=s[:idx]+js+s[idx:]
p.write_text(s)
print('Applied TEST V4.64 repair: action-button script is outside print-window strings.')
PY
