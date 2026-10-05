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
marker='/* TEST V4.54 — editor field width correction */'
if marker in s:
    print('Correction already present.')
    raise SystemExit(0)
css='''\n/* TEST V4.54 — editor field width correction */\n#editor .editor-main-card>.field{grid-column:span 4}\n#editor .editor-main-card>.field:nth-of-type(4){grid-column:span 4}\n#editor .editor-main-card>.field:nth-child(6){grid-column:span 6}\n#editor .editor-main-card>.editor-type-box{grid-column:span 6}\n@media(max-width:900px){#editor .editor-main-card>.field{grid-column:span 1}#editor .editor-main-card>.field:nth-of-type(4),#editor .editor-main-card>.field:nth-child(6),#editor .editor-main-card>.editor-type-box{grid-column:1/-1}}\n@media(max-width:700px){#editor .editor-main-card>.field,#editor .editor-main-card>.field:nth-of-type(4),#editor .editor-main-card>.field:nth-child(6),#editor .editor-main-card>.editor-type-box{margin-bottom:12px}}\n'''
s=s.replace('</style>',css+'</style>',1)
p.write_text(s)
print('Corrected editor field widths: top fields 1/3 each, explanation/type 1/2 each.')
PY
python3 - <<'PY'
from pathlib import Path
s=Path('index.html').read_text()
assert '<!-- PacoGO TEST V4.53 -->' in s
assert '<div class="version-badge">PacoGO TEST V4.53</div>' in s
assert '/* TEST V4.54 — editor field width correction */' in s
print('CHECK OK: TEST V4.53 + V4.54 layout correction + footer')
PY
git add index.html
git commit -m "TEST V4.54 correct editor field widths"
git push origin HEAD:test
