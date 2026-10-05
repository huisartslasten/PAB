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
assert 'PacoGO TEST V4.70' in s, 'Expected visible V4.70 footer'
old='''#wordEditor .word-rules-grid{display:grid;grid-template-columns:minmax(0,1fr) 180px;gap:28px;align-items:end}'''
new='''#editor .editor-main-card>#wordEditor .word-rules-grid{display:grid!important;grid-template-columns:minmax(0,1fr) 220px!important;gap:18px!important;align-items:end!important;width:100%!important;max-width:none!important}'''
assert old in s, 'Expected V4.70 word rules grid CSS'
s=s.replace(old,new,1)
old2='''#wordEditor .word-rule-field{min-width:0;margin:0}'''
new2='''#editor .editor-main-card>#wordEditor .word-rule-field{min-width:0;width:100%;margin:0}'''
assert old2 in s, 'Expected word rule field CSS'
s=s.replace(old2,new2,1)
old3='''#wordEditor .word-rule-min label{max-width:130px;line-height:1.05}'''
new3='''#editor .editor-main-card>#wordEditor .word-rule-min label{display:block;max-width:150px;line-height:1.05}'''
assert old3 in s, 'Expected minimum words label CSS'
s=s.replace(old3,new3,1)
old4='''<label>🔢 Minimum aantal woorden</label>'''
new4='''<label>🔢 Minimum aantal<br>woorden</label>'''
assert old4 in s, 'Expected minimum words label markup'
s=s.replace(old4,new4,1)
s=s.replace('PacoGO TEST V4.70','PacoGO TEST V4.71')
p.write_text(s)
PY
git add index.html
git diff --cached --check
git commit -m "TEST V4.71 give required words proper space"
git push origin HEAD:test
