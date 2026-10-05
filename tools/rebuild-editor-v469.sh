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
assert '<!-- PacoGO TEST V4.68 -->' in s, 'Expected V4.68 baseline'
assert 'PacoGO TEST V4.68' in s, 'Expected visible V4.68 footer'
# Make the two assessment columns deliberate: plenty of room for required words, minimum field pushed right.
s=s.replace('grid-template-columns:minmax(0,1fr) 250px;gap:14px;align-items:end','grid-template-columns:minmax(0,1fr) 180px;gap:28px;align-items:end',1)
# Force the minimum label to the requested two-line presentation.
s=s.replace('.word-rule-field label{display:block;margin:0 0 6px;font-weight:850;color:#38577d}', '.word-rule-field label{display:block;margin:0 0 6px;font-weight:850;color:#38577d}\n#wordEditor .word-rule-min label{max-width:130px;line-height:1.05}',1)
# Make Hint use the same visual input treatment as the other editor fields.
s=s.replace('#wordEditor .word-editor-hint label{display:block;margin:0 0 6px;font-weight:850;color:#38577d}', '#wordEditor .word-editor-hint label{display:block;margin:0 0 6px;font-weight:750;color:#173b70}',1)
s=s.replace('#wordEditor .word-editor-hint textarea{display:block;width:100%;height:76px;min-height:76px;margin:0;padding:10px 13px;font-size:16px;line-height:1.35;border-radius:11px}', '#wordEditor .word-editor-hint textarea{display:block;width:100%;height:76px;min-height:76px;margin:0;padding:12px;border:1px solid #cdddec;border-radius:12px;background:#fff;color:var(--text);font:inherit;line-height:1.35;box-shadow:none}',1)
s=s.replace('<!-- PacoGO TEST V4.68 -->','<!-- PacoGO TEST V4.69 -->',1)
s=s.replace('PacoGO TEST V4.68','PacoGO TEST V4.69')
p.write_text(s)
PY
git add index.html
git diff --cached --check
git commit -m "TEST V4.69 uniform assessment fields"
git push origin HEAD:test
