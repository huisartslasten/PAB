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
marker='/* TEST V4.56 — editor column placement */'
if marker in s:
    print('Correction already present.')
    raise SystemExit(0)
css='''\n/* TEST V4.56 — editor column placement */\n/* Exact requested structure: left = Vak/Subvak/Naam; right = Onderdeel/Toetsdatum/Uitleg. */\n#editor .editor-main-card{grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:18px;row-gap:8px;align-items:start}\n#editor .editor-main-card>.editor-action-row,#editor .editor-main-card>.editor-student{grid-column:1/-1}\n#editor .editor-main-card>.field:has(#lessonSubject){grid-column:1;grid-row:2}\n#editor .editor-main-card>.field:has(#lessonSubvak){grid-column:1;grid-row:3}\n#editor .editor-main-card>.field:has(#lessonName){grid-column:1;grid-row:4}\n#editor .editor-main-card>.editor-type-box{grid-column:2;grid-row:2;margin:4px 0 0}\n#editor .editor-main-card>.field:has(#lessonExplanation){grid-column:2;grid-row:4}\n#editor .editor-main-card>#lessonAiBox{grid-column:2;grid-row:5}\n/* Questions and answers remain full width; make them tighter without changing their structure. */\n#editor .editor-main-card>#wordEditor,#editor .editor-main-card>#questionEditor,#editor .editor-main-card>#dictationEditor,#editor .editor-main-card>#mathEditor,#editor .editor-main-card>#spellingEditor{grid-column:1/-1}\n#editor .editor-main-card>#wordEditor .editor-row,#editor .editor-main-card>#questionEditor .editor-row{display:block;max-width:none;padding-top:10px;padding-bottom:10px}\n#editor .editor-main-card>#wordEditor .editor-row>.word-rules-box,#editor .editor-main-card>#questionEditor .editor-row>.word-rules-box{width:100%}\n@media(max-width:900px){#editor .editor-main-card{grid-template-columns:1fr}#editor .editor-main-card>.editor-action-row,#editor .editor-main-card>.editor-student,#editor .editor-main-card>.field:has(#lessonSubject),#editor .editor-main-card>.field:has(#lessonSubvak),#editor .editor-main-card>.field:has(#lessonName),#editor .editor-main-card>.field:has(#lessonExplanation),#editor .editor-main-card>.editor-type-box,#editor .editor-main-card>#lessonAiBox,#editor .editor-main-card>#wordEditor,#editor .editor-main-card>#questionEditor,#editor .editor-main-card>#dictationEditor,#editor .editor-main-card>#mathEditor,#editor .editor-main-card>#spellingEditor{grid-column:1;grid-row:auto}}\n@media(max-width:700px){#editor .editor-main-card{display:block}#editor .editor-main-card>.field,#editor .editor-main-card>.editor-type-box,#editor .editor-main-card>#lessonAiBox{margin-bottom:12px}}\n'''
s=s.replace('</style>',css+'</style>',1)
p.write_text(s)
print('Applied V4.56: exact left/right editor structure and full-width compact questions.')
PY
python3 - <<'PY'
from pathlib import Path
s=Path('index.html').read_text()
assert '<!-- PacoGO TEST V4.53 -->' in s
assert '<div class="version-badge">PacoGO TEST V4.53</div>' in s
assert '/* TEST V4.56 — editor column placement */' in s
print('CHECK OK: TEST V4.53 + V4.56 editor column placement + footer')
PY
git add index.html
git commit -m "TEST V4.56 fix editor column placement"
git push origin HEAD:test
