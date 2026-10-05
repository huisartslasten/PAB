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
if 'PacoGO TEST V4.60' not in s:
    raise SystemExit('ERROR: expected TEST V4.60 checkpoint not found')

css=r'''
/* TEST V4.61 — compact answer-assessment block + working insert buttons */
#editor .editor-main-card>#wordEditor .editor-row,
#editor .editor-main-card>#questionEditor .editor-row,
#editor .editor-main-card>#dictationEditor .editor-row,
#editor .editor-main-card>#mathEditor .editor-row,
#editor .editor-main-card>#spellingEditor .editor-row{
  display:block!important;
  padding:6px 10px 7px 54px!important;
  margin:5px 0!important;
}
#editor .editor-main-card>#wordEditor .word-rules-box{
  margin:6px 0 0!important;
  padding:8px 10px!important;
  border-radius:12px!important;
}
#editor .editor-main-card>#wordEditor .word-rules-title{
  font-size:15px!important;
  margin:0 0 5px!important;
  line-height:1.1!important;
}
#editor .editor-main-card>#wordEditor .word-rules-grid{
  display:grid!important;
  grid-template-columns:minmax(110px,.9fr) minmax(150px,1.25fr) minmax(140px,1fr) minmax(150px,1.25fr) minmax(120px,1fr) minmax(170px,1.5fr)!important;
  gap:5px 7px!important;
  align-items:center!important;
}
#editor .editor-main-card>#wordEditor .word-rules-grid label{
  margin:0!important;
  font-size:12px!important;
  line-height:1.05!important;
  white-space:nowrap!important;
}
#editor .editor-main-card>#wordEditor .word-rules-grid input,
#editor .editor-main-card>#wordEditor .word-rules-grid textarea{
  min-height:38px!important;
  height:38px!important;
  margin:0!important;
  padding:6px 9px!important;
  font-size:13px!important;
  border-radius:9px!important;
}
#editor .editor-main-card>#wordEditor .word-rules-grid textarea{
  resize:none!important;
}
#editor .editor-main-card>#wordEditor .word-rules-help{
  margin:5px 0 0!important;
  padding:4px 7px!important;
  font-size:10.5px!important;
  line-height:1.15!important;
}
#editor .editor-main-card>#wordEditor .question-insert-button,
#editor .editor-main-card>#questionEditor .question-insert-button,
#editor .editor-main-card>#dictationEditor .question-insert-button,
#editor .editor-main-card>#mathEditor .question-insert-button,
#editor .editor-main-card>#spellingEditor .question-insert-button{
  margin:5px 0 0 auto!important;
  padding:6px 10px!important;
  font-size:12px!important;
  border-radius:10px!important;
}
#editor .editor-main-card>#wordEditor .word-parts-section,
#editor .editor-main-card>#questionEditor .word-parts-section,
#editor .editor-main-card>#dictationEditor .word-parts-section,
#editor .editor-main-card>#mathEditor .word-parts-section,
#editor .editor-main-card>#spellingEditor .word-parts-section{
  margin:0 0 4px!important;
  padding:4px 7px!important;
  border-radius:11px!important;
}
#editor .editor-main-card>#wordEditor .word-parts-head,
#editor .editor-main-card>#questionEditor .word-parts-head,
#editor .editor-main-card>#dictationEditor .word-parts-head,
#editor .editor-main-card>#mathEditor .word-parts-head,
#editor .editor-main-card>#spellingEditor .word-parts-head{
  padding:0!important;
  margin:0!important;
}
#editor .editor-main-card>#wordEditor .word-parts-head label,
#editor .editor-main-card>#questionEditor .word-parts-head label,
#editor .editor-main-card>#dictationEditor .word-parts-head label,
#editor .editor-main-card>#mathEditor .word-parts-head label,
#editor .editor-main-card>#spellingEditor .word-parts-head label{
  font-size:14px!important;
}
#editor .editor-main-card>#wordEditor .word-part-row,
#editor .editor-main-card>#questionEditor .word-part-row,
#editor .editor-main-card>#dictationEditor .word-part-row,
#editor .editor-main-card>#mathEditor .word-part-row,
#editor .editor-main-card>#spellingEditor .word-part-row{
  margin:0!important;
  gap:5px!important;
}
#editor .editor-main-card>#wordEditor .word-part-row input,
#editor .editor-main-card>#questionEditor .word-part-row input,
#editor .editor-main-card>#dictationEditor .word-part-row input,
#editor .editor-main-card>#mathEditor .word-part-row input,
#editor .editor-main-card>#spellingEditor .word-part-row input{
  min-height:38px!important;
  height:38px!important;
  padding:6px 9px!important;
  font-size:13px!important;
}
#editor .editor-main-card>#wordEditor .word-part-remove,
#editor .editor-main-card>#questionEditor .word-part-remove,
#editor .editor-main-card>#dictationEditor .word-part-remove,
#editor .editor-main-card>#mathEditor .word-part-remove,
#editor .editor-main-card>#spellingEditor .word-part-remove{
  width:38px!important;
  height:38px!important;
}
@media(max-width:1100px){
  #editor .editor-main-card>#wordEditor .word-rules-grid{
    grid-template-columns:minmax(110px,1fr) minmax(150px,1.5fr) minmax(120px,1fr) minmax(150px,1.5fr)!important;
  }
}
@media(max-width:700px){
  #editor .editor-main-card>#wordEditor .word-rules-grid{
    grid-template-columns:1fr 1fr!important;
  }
  #editor .editor-main-card>#wordEditor .word-rules-grid label{white-space:normal!important}
}
'''

js=r'''
/* TEST V4.61 — restore the insert-row handlers used by the editor buttons */
function insertLessonRowAfter(button){
  const current=button?.closest('.editor-row');
  if(!current)return;
  const editor=current.parentElement;
  const type=document.getElementById('lessonType')?.value;
  const makers={
    words:()=>addWordRow(),
    custom:()=>addWordRow(),
    questions:()=>addQuestionRow(),
    dictation:()=>addDictationRow(),
    math:()=>addMathRow(),
    spelling:()=>addSpellingRow()
  };
  const maker=makers[type];
  if(!maker)return;
  const beforeLast=editor.lastElementChild;
  maker();
  const created=editor.lastElementChild;
  if(!created||created===beforeLast)return;
  current.insertAdjacentElement('afterend',created);
  created.querySelector('input,textarea')?.focus();
}
function insertWordQuestionAfter(button){
  const current=button?.closest('.editor-row');
  const editor=document.getElementById('wordEditor');
  if(!current||!editor)return;
  const questionParts=[...current.querySelectorAll('.word-q-part')].map(()=> '');
  const answerParts=[...current.querySelectorAll('.word-a-part')].map(r=>({text:'',role:r.closest('.word-part-row')?.querySelector('.word-part-role')?.value||'answer'}));
  const rules={hint:'',min_words:0,required_terms:[]};
  addWordRow('', '', questionParts.length?questionParts:[''], answerParts.length?answerParts:[{text:'',role:'answer'}], rules);
  const created=editor.lastElementChild;
  if(!created||created===current)return;
  current.insertAdjacentElement('afterend',created);
  created.querySelector('.word-q-part')?.focus();
}
'''

if '/* TEST V4.61 — compact answer-assessment block + working insert buttons */' not in s:
    s=s.replace('</style>',css+'</style>',1)
if '/* TEST V4.61 — restore the insert-row handlers used by the editor buttons */' not in s:
    pos=s.rfind('</script>')
    if pos<0:
        raise SystemExit('ERROR: inline script closing tag not found')
    s=s[:pos]+js+'\n'+s[pos:]
s=s.replace('<!-- PacoGO TEST V4.60 -->','<!-- PacoGO TEST V4.61 -->',1)
p.write_text(s)
print('Applied TEST V4.61: compact assessment block and working insert-row handlers.')
PY
python3 - <<'PY'
from pathlib import Path
s=Path('index.html').read_text()
assert '<!-- PacoGO TEST V4.61 -->' in s
assert 'TEST V4.61 — compact answer-assessment block + working insert buttons' in s
assert 'function insertLessonRowAfter(button)' in s
assert 'function insertWordQuestionAfter(button)' in s
assert s.count('id="lessonSubject"')==1
assert s.count('id="lessonType"')==1
assert s.count('id="questionEditor"')==1
print('CHECK OK: TEST V4.61 version, compact assessment CSS, insert handlers, and key editor IDs.')
PY
git add index.html
git commit -m "TEST V4.61 compact assessment and fix insert button"
git push origin HEAD:test
