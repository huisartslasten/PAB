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
if '<!-- PacoGO TEST V4.62 -->' not in s:
    raise SystemExit('ERROR: expected TEST V4.62 checkpoint not found')
css=r'''
/* TEST V4.63 — assessment layout: required words visible; minimum words label on two lines at far right */
#editor .editor-main-card>#wordEditor .word-rules-grid{
  display:grid!important;
  grid-template-columns:95px minmax(420px,1.8fr) 155px minmax(300px,1.15fr) 110px 82px!important;
  gap:10px 12px!important;
  align-items:center!important;
}
#editor .editor-main-card>#wordEditor .word-rules-grid label{
  margin:0!important;
  font-size:15px!important;
  line-height:1.12!important;
  white-space:normal!important;
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
/* DOM order is Hint, Minimum, Required; visually place Required before Minimum. */
#editor .editor-main-card>#wordEditor .word-rules-grid > :nth-child(1){grid-column:1;grid-row:1}
#editor .editor-main-card>#wordEditor .word-rules-grid > :nth-child(2){grid-column:2;grid-row:1}
#editor .editor-main-card>#wordEditor .word-rules-grid > :nth-child(5){grid-column:3;grid-row:1}
#editor .editor-main-card>#wordEditor .word-rules-grid > :nth-child(6){grid-column:4;grid-row:1}
#editor .editor-main-card>#wordEditor .word-rules-grid > :nth-child(3){grid-column:5;grid-row:1}
#editor .editor-main-card>#wordEditor .word-rules-grid > :nth-child(4){grid-column:6;grid-row:1;width:82px!important;min-width:82px!important;max-width:82px!important;text-align:left!important}
#editor .editor-main-card>#wordEditor .word-rules-grid > :nth-child(3){max-width:110px!important}

@media(max-width:1350px){
  #editor .editor-main-card>#wordEditor .word-rules-grid{
    grid-template-columns:85px minmax(320px,1.8fr) 145px minmax(240px,1.15fr) 100px 78px!important;
    gap:8px!important;
  }
}
@media(max-width:1100px){
  #editor .editor-main-card>#wordEditor .word-rules-grid{
    grid-template-columns:85px minmax(260px,1.5fr) 135px minmax(190px,1fr) 95px 78px!important;
  }
}
@media(max-width:700px){
  #editor .editor-main-card>#wordEditor .word-rules-grid{
    grid-template-columns:1fr!important;
  }
  #editor .editor-main-card>#wordEditor .word-rules-grid > *{grid-column:auto!important;grid-row:auto!important}
  #editor .editor-main-card>#wordEditor .word-rules-grid input[type="number"]{width:82px!important}
}
'''
marker='/* TEST V4.63 — assessment layout: required words visible; minimum words label on two lines at far right */'
if marker not in s:
    s=s.replace('</style>',css+'</style>',1)
s=s.replace('<!-- PacoGO TEST V4.62 -->','<!-- PacoGO TEST V4.63 -->',1)
p.write_text(s)
print('Applied TEST V4.63 assessment layout.')
PY
python3 - <<'PY'
from pathlib import Path
s=Path('index.html').read_text()
assert '<!-- PacoGO TEST V4.63 -->' in s
assert 'required words visible; minimum words label on two lines at far right' in s
assert 'function insertLessonRowAfter(button)' in s
assert 'function insertWordQuestionAfter(button)' in s
assert s.count('id="lessonSubject"')==1
assert s.count('id="lessonType"')==1
assert s.count('id="questionEditor"')==1
print('CHECK OK: TEST V4.63 version, assessment layout, insert handlers, and key editor IDs.')
PY
git add index.html
git commit -m "TEST V4.63 reorder assessment fields"
git push origin HEAD:test
