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
old='''#wordEditor .word-rules-grid{display:grid;grid-template-columns:minmax(0,1fr) 250px;gap:14px;align-items:end}'''
new='''#wordEditor .word-rules-grid{display:grid;grid-template-columns:minmax(0,1fr) 220px;gap:18px;align-items:end;width:100%;max-width:none}'''
assert old in s, 'Expected V4.68 word rules grid CSS'
s=s.replace(old,new,1)
old2='''#wordEditor .word-rule-field{min-width:0;margin:0}'''
new2='''#wordEditor .word-rule-field{min-width:0;width:100%;margin:0}'''
assert old2 in s, 'Expected word rule field CSS'
s=s.replace(old2,new2,1)
s=s.replace('PacoGO TEST V4.70','PacoGO TEST V4.71')
p.write_text(s)
PY
git add index.html
git diff --cached --check
git commit -m "TEST V4.71 give required words proper space"
git push origin HEAD:test

# Triggered from TEST after the editor-layout review.
