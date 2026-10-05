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
marker='/* TEST V4.53 — compacte les-editor layout */'
if marker in s:
    print('Patch is already present.')
    raise SystemExit(0)
css='''\n/* TEST V4.53 — compacte les-editor layout */\n#editor .editor-main-card{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:14px;row-gap:8px}\n#editor .editor-main-card>.editor-action-row,#editor .editor-main-card>.editor-student,#editor .editor-main-card>#wordEditor,#editor .editor-main-card>#questionEditor,#editor .editor-main-card>#dictationEditor,#editor .editor-main-card>#mathEditor,#editor .editor-main-card>#spellingEditor,#editor .editor-main-card>.row,#editor .editor-main-card>#editorError{grid-column:1/-1}\n#editor .editor-main-card>.field{grid-column:span 2;margin-bottom:4px}\n#editor .editor-main-card>.field input,#editor .editor-main-card>.field select{padding:9px 11px;min-height:42px}\n#editor .editor-main-card>.field textarea{min-height:72px;padding:9px 11px}\n#editor .editor-main-card>.field>label{font-size:14px;margin-bottom:4px}\n#editor .editor-main-card>.editor-type-box{grid-column:span 6;margin:4px 0 0;padding:12px}\n#editor .editor-main-card>.editor-type-box .field{margin:0}\n#editor .editor-main-card>.editor-type-box .lesson-test-date-box{margin:8px 0 0;padding:10px 12px}\n#editor .editor-main-card>.editor-type-box .lesson-test-date-box .small{font-size:12px}\n#editor .editor-main-card>.field:nth-of-type(4){grid-column:span 6}\n#editor .editor-main-card>.editor-type-box{grid-column:span 6}\n#editor .editor-main-card>#wordEditor .editor-row,#editor .editor-main-card>#questionEditor .editor-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:12px;align-items:start}\n#editor .editor-main-card>#wordEditor .editor-row>.remove-row,#editor .editor-main-card>#questionEditor .editor-row>.remove-row,#editor .editor-main-card>#wordEditor .editor-row>.question-insert-button,#editor .editor-main-card>#questionEditor .editor-row>.question-insert-button{grid-column:1/-1}\n#editor .editor-main-card>#wordEditor .editor-row>.word-rules-box,#editor .editor-main-card>#questionEditor .editor-row>.word-rules-box{grid-column:1/-1}\n#editor .editor-main-card>#wordEditor .editor-row>.word-parts-section,#editor .editor-main-card>#questionEditor .editor-row>.word-parts-section{margin-bottom:0}\n@media(max-width:900px){#editor .editor-main-card{grid-template-columns:1fr 1fr}#editor .editor-main-card>.field{grid-column:span 1}#editor .editor-main-card>.field:nth-of-type(4),#editor .editor-main-card>.editor-type-box{grid-column:1/-1}}\n@media(max-width:700px){#editor .editor-main-card{display:block}#editor .editor-main-card>.field,#editor .editor-main-card>.editor-type-box{margin-bottom:12px}#editor .editor-main-card>#wordEditor .editor-row,#editor .editor-main-card>#questionEditor .editor-row{display:block}}\n'''
s=s.replace('</style>',css+'</style>',1)
footer_marker='<div class="version-badge">PacoGO TEST V4.53</div>'
if footer_marker not in s:
    raise SystemExit('Expected TEST V4.53 footer was not found; aborting.')
p.write_text(s)
print('Applied compact editor layout. Existing footer TEST V4.53 retained.')
PY

python3 - <<'PY'
from pathlib import Path
s=Path('index.html').read_text()
assert '<!-- PacoGO TEST V4.53 -->' in s
assert '<div class="version-badge">PacoGO TEST V4.53</div>' in s
assert '/* TEST V4.53 — compacte les-editor layout */' in s
print('CHECK OK: V4.53 marker + footer + compact editor CSS present')
PY

git add index.html
git commit -m "TEST V4.53 compact lesson editor layout"
git push origin HEAD:test

echo
echo 'Klaar. Start TEST lokaal met:'
echo 'cd ~/PacoGO/PAB'
echo 'python3 -m http.server 8000'
