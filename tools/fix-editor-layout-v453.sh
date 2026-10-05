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
if 'PacoGO TEST V4.61' not in s:
    raise SystemExit('ERROR: expected TEST V4.61 checkpoint not found')

css=r'''
/* TEST V4.62 — smarter assessment layout: readable hint, required words, minimum words at far right */
#editor .editor-main-card>#wordEditor .editor-row,
#editor .editor-main-card>#questionEditor .editor-row,
#editor .editor-main-card>#dictationEditor .editor-row,
#editor .editor-main-card>#mathEditor .editor-row,
#editor .editor-main-card>#spellingEditor .editor-row{
  display:block!important;
  padding:8px 12px 10px 54px!important;
  margin:7px 0!important;
}

#editor .editor-main-card>#wordEditor .word-rules-box{
  margin:8px 0 0!important;
  padding:10px 12px!important;
  border-radius:14px!important;
}
#editor .editor-main-card>#wordEditor .word-rules-title{
  font-size:16px!important;
  margin:0 0 8px!important;
  line-height:1.15!important;
}

/* One deliberate horizontal row: Hint gets real writing space; minimum words is compact and always far right. */
#editor .editor-main-card>#wordEditor .word-rules-grid{
  display:grid!important;
  grid-template-columns:150px minmax(420px,2.1fr) 185px minmax(280px,1.35fr) 205px 82px!important;
  gap:10px 12px!important;
  align-items:center!important;
}
#editor .editor-main-card>#wordEditor .word-rules-grid label{
  margin:0!important;
  font-size:15px!important;
  line-height:1.15!important;
  white-space:nowrap!important;
}

#editor .editor-main-card>#wordEditor .word-rules-grid input,
#editor .editor-main-card>#wordEditor .word-rules-grid textarea{
  width:100%!important;
  min-height:56px!important;
  height:56px!important;
  margin:0!important;
  padding:10px 13px!important;
  font-size:16px!important;
  line-height:1.35!important;
  border-radius:11px!important;
}
#editor .editor-main-card>#wordEditor .word-rules-grid textarea{
  min-height:76px!important;
  height:76px!important;
  resize:vertical!important;
}

/* The minimum-word number field is intentionally small. */
#editor .editor-main-card>#wordEditor .word-rules-grid input[type="number"]{
  width:82px!important;
  min-width:82px!important;
  max-width:82px!important;
  text-align:left!important;
}

#editor .editor-main-card>#wordEditor .word-rules-help{
  margin:8px 0 0!important;
  padding:5px 8px!important;
  font-size:11.5px!important;
  line-height:1.25!important;
}

#editor .editor-main-card>#wordEditor .question-insert-button,
#editor .editor-main-card>#questionEditor .question-insert-button,
#editor .editor-main-card>#dictationEditor .question-insert-button,
#editor .editor-main-card>#mathEditor .question-insert-button,
#editor .editor-main-card>#spellingEditor .question-insert-button{
  margin:7px 0 0 auto!important;
  padding:8px 13px!important;
  font-size:13px!important;
  border-radius:11px!important;
}

#editor .editor-main-card>#wordEditor .word-parts-section,
#editor .editor-main-card>#questionEditor .word-parts-section,
#editor .editor-main-card>#dictationEditor .word-parts-section,
#editor .editor-main-card>#mathEditor .word-parts-section,
#editor .editor-main-card>#spellingEditor .word-parts-section{
  margin:0 0 5px!important;
  padding:5px 8px!important;
  border-radius:12px!important;
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

@media(max-width:1350px){
  #editor .editor-main-card>#wordEditor .word-rules-grid{
    grid-template-columns:125px minmax(320px,2fr) 165px minmax(220px,1.35fr) 180px 78px!important;
    gap:8px!important;
  }
  #editor .editor-main-card>#wordEditor .word-rules-grid label{font-size:14px!important}
}
@media(max-width:1100px){
  #editor .editor-main-card>#wordEditor .word-rules-grid{
    grid-template-columns:120px minmax(260px,1.8fr) 165px minmax(180px,1.2fr)!important;
  }
  #editor .editor-main-card>#wordEditor .word-rules-grid input[type="number"]{width:82px!important}
}
@media(max-width:700px){
  #editor .editor-main-card>#wordEditor .word-rules-grid{
    grid-template-columns:1fr!important;
  }
  #editor .editor-main-card>#wordEditor .word-rules-grid label{white-space:normal!important}
  #editor .editor-main-card>#wordEditor .word-rules-grid input[type="number"]{width:82px!important}
}
'''

if '/* TEST V4.62 — smarter assessment layout: readable hint, required words, minimum words at far right */' not in s:
    s=s.replace('</style>',css+'</style>',1)

s=s.replace('<!-- PacoGO TEST V4.61 -->','<!-- PacoGO TEST V4.62 -->',1)
p.write_text(s)
print('Applied TEST V4.62 assessment layout.')
PY
python3 - <<'PY'
from pathlib import Path
s=Path('index.html').read_text()
assert '<!-- PacoGO TEST V4.62 -->' in s
assert 'TEST V4.62 — smarter assessment layout: readable hint, required words, minimum words at far right' in s
assert 'function insertLessonRowAfter(button)' in s
assert 'function insertWordQuestionAfter(button)' in s
assert s.count('id="lessonSubject"')==1
assert s.count('id="lessonType"')==1
assert s.count('id="questionEditor"')==1
print('CHECK OK: TEST V4.62 version, assessment layout, insert handlers, and key editor IDs.')
PY
git add index.html
git commit -m "TEST V4.62 improve assessment layout"
git push origin HEAD:test
