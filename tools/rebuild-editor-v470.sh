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
assert 'PacoGO TEST V4.69' in s, 'Expected visible V4.69 footer'
old='''#wordEditor .word-editor-hint{min-width:0;margin:0}\n#wordEditor .word-editor-hint label{display:block;margin:0 0 6px;font-weight:750;color:#173b70}\n#wordEditor .word-editor-hint textarea{display:block;width:100%;height:76px;min-height:76px;margin:0;padding:12px;border:1px solid #cdddec;border-radius:12px;background:#fff;color:var(--text);font:inherit;line-height:1.35;box-shadow:none}'''
new='''#wordEditor .word-editor-hint{display:grid;grid-template-columns:120px minmax(0,1fr);align-items:center;gap:12px;min-width:0;margin:0;padding:10px 12px;background:#f8fbff;border:2px solid #d7e7f5;border-radius:16px}\n#wordEditor .word-editor-hint label{display:flex;align-items:center;margin:0;font-weight:850;color:#173b70}\n#wordEditor .word-editor-hint textarea{display:block;width:100%;height:56px;min-height:56px;margin:0;padding:10px 13px;border:1px solid #cdddec;border-radius:11px;background:#fff;color:var(--text);font:inherit;font-size:16px;line-height:1.35;box-shadow:none;resize:vertical}'''
assert old in s, 'Expected V4.69 Hint CSS'
s=s.replace(old,new,1)
s=s.replace('@media(max-width:760px){#wordEditor .word-rules-grid{grid-template-columns:1fr}#wordEditor .word-editor-bottom{grid-template-columns:1fr}#wordEditor .word-editor-bottom .question-insert-button{justify-self:start}}','@media(max-width:760px){#wordEditor .word-rules-grid{grid-template-columns:1fr}#wordEditor .word-editor-bottom{grid-template-columns:1fr}#wordEditor .word-editor-hint{grid-template-columns:1fr}#wordEditor .word-editor-bottom .question-insert-button{justify-self:start}}',1)
s=s.replace('PacoGO TEST V4.69','PacoGO TEST V4.70')
p.write_text(s)
PY
git add index.html
git diff --cached --check
git commit -m "TEST V4.70 make hint field uniform"
git push origin HEAD:test
