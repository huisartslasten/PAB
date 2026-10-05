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
if 'PacoGO TEST V4.59' not in s:
    raise SystemExit('ERROR: expected TEST V4.59 checkpoint not found')
css='''
/* TEST V4.60 — compact question/answer editor rows */
#editor .editor-main-card>#wordEditor .editor-row,
#editor .editor-main-card>#questionEditor .editor-row,
#editor .editor-main-card>#dictationEditor .editor-row,
#editor .editor-main-card>#mathEditor .editor-row,
#editor .editor-main-card>#spellingEditor .editor-row{
  padding:7px 10px 7px 54px!important;
  margin:6px 0!important;
}
#editor .editor-main-card>#wordEditor .word-parts-section,
#editor .editor-main-card>#questionEditor .word-parts-section,
#editor .editor-main-card>#dictationEditor .word-parts-section,
#editor .editor-main-card>#mathEditor .word-parts-section,
#editor .editor-main-card>#spellingEditor .word-parts-section{
  display:grid!important;
  grid-template-columns:78px minmax(0,1fr) auto!important;
  align-items:center!important;
  column-gap:8px!important;
  row-gap:3px!important;
  margin:0 0 5px!important;
  padding:5px 7px!important;
  border-radius:12px!important;
}
#editor .editor-main-card>#wordEditor .word-parts-section:last-child,
#editor .editor-main-card>#questionEditor .word-parts-section:last-child,
#editor .editor-main-card>#dictationEditor .word-parts-section:last-child,
#editor .editor-main-card>#mathEditor .word-parts-section:last-child,
#editor .editor-main-card>#spellingEditor .word-parts-section:last-child{margin-bottom:0!important}
#editor .editor-main-card>#wordEditor .word-parts-head,
#editor .editor-main-card>#questionEditor .word-parts-head,
#editor .editor-main-card>#dictationEditor .word-parts-head,
#editor .editor-main-card>#mathEditor .word-parts-head,
#editor .editor-main-card>#spellingEditor .word-parts-head{
  padding:0!important;
  margin:0!important;
  border-bottom:0!important;
}
#editor .editor-main-card>#wordEditor .word-parts-head label,
#editor .editor-main-card>#questionEditor .word-parts-head label,
#editor .editor-main-card>#dictationEditor .word-parts-head label,
#editor .editor-main-card>#mathEditor .word-parts-head label,
#editor .editor-main-card>#spellingEditor .word-parts-head label{font-size:15px!important;white-space:nowrap}
#editor .editor-main-card>#wordEditor .word-question-parts,
#editor .editor-main-card>#questionEditor .word-question-parts,
#editor .editor-main-card>#dictationEditor .word-question-parts,
#editor .editor-main-card>#mathEditor .word-question-parts,
#editor .editor-main-card>#spellingEditor .word-question-parts,
#editor .editor-main-card>#wordEditor .word-answer-parts,
#editor .editor-main-card>#questionEditor .question-answer-parts,
#editor .editor-main-card>#dictationEditor .dictation-answer-parts,
#editor .editor-main-card>#mathEditor .math-answer-parts,
#editor .editor-main-card>#spellingEditor .spelling-answer-parts{min-width:0}
#editor .editor-main-card>#wordEditor .word-part-row,
#editor .editor-main-card>#questionEditor .word-part-row,
#editor .editor-main-card>#dictationEditor .word-part-row,
#editor .editor-main-card>#mathEditor .word-part-row,
#editor .editor-main-card>#spellingEditor .word-part-row{
  margin:0!important;
  gap:6px!important;
}
#editor .editor-main-card>#wordEditor .word-question-parts .word-part-row,
#editor .editor-main-card>#questionEditor .word-question-parts .word-part-row,
#editor .editor-main-card>#dictationEditor .word-question-parts .word-part-row,
#editor .editor-main-card>#mathEditor .word-question-parts .word-part-row,
#editor .editor-main-card>#spellingEditor .word-question-parts .word-part-row{
  display:grid!important;
  grid-template-columns:minmax(0,1fr) 42px!important;
  grid-template-areas:"input remove"!important;
}
#editor .editor-main-card>#wordEditor .word-answer-parts .word-part-row,
#editor .editor-main-card>#questionEditor .question-answer-parts .word-part-row,
#editor .editor-main-card>#dictationEditor .dictation-answer-parts .word-part-row,
#editor .editor-main-card>#mathEditor .math-answer-parts .word-part-row,
#editor .editor-main-card>#spellingEditor .spelling-answer-parts .word-part-row{
  display:grid!important;
  grid-template-columns:minmax(0,1fr) 170px 42px!important;
  grid-template-areas:"input role remove"!important;
  align-items:center!important;
}
#editor .editor-main-card>#wordEditor .word-part-role-select,
#editor .editor-main-card>#questionEditor .word-part-role-select,
#editor .editor-main-card>#dictationEditor .word-part-role-select,
#editor .editor-main-card>#mathEditor .word-part-role-select,
#editor .editor-main-card>#spellingEditor .word-part-role-select{grid-area:role!important}
#editor .editor-main-card>#wordEditor .word-part-role-button,
#editor .editor-main-card>#questionEditor .word-part-role-button,
#editor .editor-main-card>#dictationEditor .word-part-role-button,
#editor .editor-main-card>#mathEditor .word-part-role-button,
#editor .editor-main-card>#spellingEditor .word-part-role-button{height:40px!important;padding:7px 10px!important;font-size:12px!important}
#editor .editor-main-card>#wordEditor .word-part-remove,
#editor .editor-main-card>#questionEditor .word-part-remove,
#editor .editor-main-card>#dictationEditor .word-part-remove,
#editor .editor-main-card>#mathEditor .word-part-remove,
#editor .editor-main-card>#spellingEditor .word-part-remove{width:40px!important;height:40px!important}
#editor .editor-main-card>#wordEditor .word-parts-section .word-add-line,
#editor .editor-main-card>#questionEditor .word-parts-section .word-add-line,
#editor .editor-main-card>#dictationEditor .word-parts-section .word-add-line,
#editor .editor-main-card>#mathEditor .word-parts-section .word-add-line,
#editor .editor-main-card>#spellingEditor .word-parts-section .word-add-line{
  margin:0!important;
  padding:6px 9px!important;
  font-size:12px!important;
  white-space:nowrap;
}
#editor .editor-main-card>#wordEditor .word-extra-note,
#editor .editor-main-card>#questionEditor .word-extra-note,
#editor .editor-main-card>#dictationEditor .word-extra-note,
#editor .editor-main-card>#mathEditor .word-extra-note,
#editor .editor-main-card>#spellingEditor .word-extra-note{
  grid-column:2/-1!important;
  margin:1px 0 0!important;
  padding:4px 7px!important;
  font-size:11px!important;
  line-height:1.2!important;
}
@media(max-width:700px){
  #editor .editor-main-card>#wordEditor .word-parts-section,
  #editor .editor-main-card>#questionEditor .word-parts-section,
  #editor .editor-main-card>#dictationEditor .word-parts-section,
  #editor .editor-main-card>#mathEditor .word-parts-section,
  #editor .editor-main-card>#spellingEditor .word-parts-section{grid-template-columns:64px minmax(0,1fr) auto!important}
  #editor .editor-main-card>#wordEditor .word-answer-parts .word-part-row,
  #editor .editor-main-card>#questionEditor .question-answer-parts .word-part-row,
  #editor .editor-main-card>#dictationEditor .dictation-answer-parts .word-part-row,
  #editor .editor-main-card>#mathEditor .math-answer-parts .word-part-row,
  #editor .editor-main-card>#spellingEditor .spelling-answer-parts .word-part-row{grid-template-columns:minmax(0,1fr) 130px 40px!important}
}
'''
if '/* TEST V4.60 — compact question/answer editor rows */' not in s:
    s=s.replace('</style>',css+'</style>',1)
s=s.replace('PacoGO TEST V4.59','PacoGO TEST V4.60')
p.write_text(s)
print('Applied TEST V4.60: compact question and answer sections without changing their functionality.')
PY
python3 - <<'PY'
from pathlib import Path
s=Path('index.html').read_text()
assert 'PacoGO TEST V4.60' in s
assert 'TEST V4.60 — compact question/answer editor rows' in s
assert s.count('id="lessonSubject"')==1
assert s.count('id="lessonType"')==1
assert s.count('id="questionEditor"')==1
print('CHECK OK: TEST V4.60 version, compact editor CSS, and key editor IDs.')
PY
git add index.html
git commit -m "TEST V4.60 compact question and answer rows"
git push origin HEAD:test
