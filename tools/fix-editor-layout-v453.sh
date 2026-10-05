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
marker='/* TEST V4.55 — editor structure layout */'
if marker in s:
    print('Correction already present.')
    raise SystemExit(0)
css='''\n/* TEST V4.55 — editor structure layout */\n/* Top editor: left = Vak/Subvak/Naam, right = Onderdeel/Toetsdatum/Uitleg. */\n#editor .editor-main-card{grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:18px;row-gap:8px;align-items:start}\n#editor .editor-main-card>.editor-student{grid-column:1/-1}\n#editor .editor-main-card>.field{grid-column:auto;margin-bottom:4px}\n#editor .editor-main-card>.field:nth-child(3){grid-column:1;grid-row:2}\n#editor .editor-main-card>.field:nth-child(4){grid-column:1;grid-row:3}\n#editor .editor-main-card>.field:nth-child(5){grid-column:1;grid-row:4}\n#editor .editor-main-card>.editor-type-box{grid-column:2;grid-row:2 / span 2;margin:4px 0 0}\n#editor .editor-main-card>.field:nth-child(6){grid-column:2;grid-row:4}\n/* Keep question/answer rows full width; only tighten their internal spacing. */\n#editor .editor-main-card>#wordEditor .editor-row,#editor .editor-main-card>#questionEditor .editor-row{display:block;max-width:none;padding-top:11px;padding-bottom:11px}\n#editor .editor-main-card>#wordEditor .editor-row>.remove-row,#editor .editor-main-card>#questionEditor .editor-row>.remove-row{display:inline-block}\n#editor .editor-main-card>#wordEditor .editor-row>.word-rules-box,#editor .editor-main-card>#questionEditor .editor-row>.word-rules-box{width:100%}\n@media(max-width:900px){#editor .editor-main-card{grid-template-columns:1fr}#editor .editor-main-card>.editor-student,#editor .editor-main-card>.field,#editor .editor-main-card>.field:nth-child(3),#editor .editor-main-card>.field:nth-child(4),#editor .editor-main-card>.field:nth-child(5),#editor .editor-main-card>.field:nth-child(6),#editor .editor-main-card>.editor-type-box{grid-column:1;grid-row:auto}#editor .editor-main-card>.editor-type-box{margin-bottom:8px}}\n@media(max-width:700px){#editor .editor-main-card{display:block}#editor .editor-main-card>.field,#editor .editor-main-card>.editor-type-box{margin-bottom:12px}}\n'''
s=s.replace('</style>',css+'</style>',1)
p.write_text(s)
print('Applied V4.55: left stacked fields, right type/date/explanation, full-width compact question rows.')
PY
python3 - <<'PY'
from pathlib import Path
s=Path('index.html').read_text()
assert '<!-- PacoGO TEST V4.53 -->' in s
assert '<div class="version-badge">PacoGO TEST V4.53</div>' in s
assert '/* TEST V4.55 — editor structure layout */' in s
print('CHECK OK: TEST V4.53 + V4.55 editor structure layout + footer')
PY
git add index.html
git commit -m "TEST V4.55 correct editor structure layout"
git push origin HEAD:test
