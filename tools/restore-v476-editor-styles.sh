#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."

python3 - <<'PY'
from pathlib import Path
p = Path('index.html')
s = p.read_text()

assert '<!-- PacoGO TEST V4.77 -->' in s, 'ERROR: not TEST V4.77'
assert "printWindow.document.write(" in s, 'ERROR: print calendar code missing'
assert "</script></body></html>');" in s, 'ERROR: V4.77 print-calendar syntax repair missing'

marker = '/* TEST V4.76 — approved uniform editor styling */'
if marker not in s:
    css = '''\n/* TEST V4.76 — approved uniform editor styling */\n.lesson-test-date-box{background:#eef8ff;border:2px solid #bfe6ff;border-radius:16px;padding:11px 14px}\n#lessonAiBox.lesson-ai-box{background:#eef8ff;border:2px solid #bfe6ff;border-radius:16px;padding:16px}\n#editor .question-field input,#editor .answer-field input,#editor .question-field textarea,#editor .answer-field textarea{border:2px solid #bfe6ff;border-radius:14px;background:#fff}\n#editor .word-rules-box input{border:2px solid #bfe6ff;border-radius:14px;background:#fff}\n#editor .hint-box textarea{border:2px solid #cfe1f0;border-radius:14px;background:#fff}\n'''
    idx = s.find('</style>')
    if idx < 0:
        raise SystemExit('ERROR: main style block not found')
    s = s[:idx] + css + s[idx:]

# Verify the approved selectors exist exactly once and no !important patch was introduced.
for token in [
    '.lesson-test-date-box{background:#eef8ff;border:2px solid #bfe6ff;border-radius:16px;padding:11px 14px}',
    '#lessonAiBox.lesson-ai-box{background:#eef8ff;border:2px solid #bfe6ff;border-radius:16px;padding:16px}',
    '#editor .question-field input,#editor .answer-field input,#editor .question-field textarea,#editor .answer-field textarea{border:2px solid #bfe6ff;border-radius:14px;background:#fff}',
    '#editor .word-rules-box input{border:2px solid #bfe6ff;border-radius:14px;background:#fff}',
    '#editor .hint-box textarea{border:2px solid #cfe1f0;border-radius:14px;background:#fff}',
]:
    assert s.count(token) == 1, f'ERROR: expected exactly one style rule: {token}'
assert marker in s

p.write_text(s)
print('OK: restored approved V4.76 editor styling cleanly; preserved V4.77 print-calendar syntax repair.')
PY

git add index.html
git diff --cached --check
if git diff --cached --quiet; then
  echo 'No changes needed.'
else
  git commit -m 'TEST V4.77 restore approved V4.76 editor styling'
  git push origin HEAD:test
fi
