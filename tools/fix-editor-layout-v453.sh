#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."
git config user.name "PacoGO Bot"
git config user.email "paco-go-bot@users.noreply.github.com"
git fetch origin test
git checkout -B test origin/test
python3 - <<'PY'
from pathlib import Path

p = Path('index.html')
s = p.read_text()

assert '<!-- PacoGO TEST V4.77 -->' in s, 'ERROR: expected current TEST V4.77'
assert "printWindow.document.write(" in s, 'ERROR: print calendar code missing'
assert "</script></body></html>');" in s, 'ERROR: print calendar syntax repair missing'

marker = '/* TEST V4.76 — approved uniform editor styling */'
if marker not in s:
    css = '''
/* TEST V4.76 — approved uniform editor styling */
.lesson-test-date-box{background:#eef8ff;border:2px solid #bfe6ff;border-radius:16px;padding:11px 14px}
#lessonAiBox.lesson-ai-box{background:#eef8ff;border:2px solid #bfe6ff;border-radius:16px;padding:16px}
#editor .question-field input,#editor .answer-field input,#editor .question-field textarea,#editor .answer-field textarea{border:2px solid #bfe6ff;border-radius:14px;background:#fff}
#editor .word-rules-box input{border:2px solid #bfe6ff;border-radius:14px;background:#fff}
#editor .hint-box textarea{border:2px solid #cfe1f0;border-radius:14px;background:#fff}
'''
    idx = s.find('</style>')
    if idx < 0:
        raise SystemExit('ERROR: main page style block not found')
    s = s[:idx] + css + s[idx:]

for token in [
    '.lesson-test-date-box{background:#eef8ff;border:2px solid #bfe6ff;border-radius:16px;padding:11px 14px}',
    '#lessonAiBox.lesson-ai-box{background:#eef8ff;border:2px solid #bfe6ff;border-radius:16px;padding:16px}',
    '#editor .question-field input,#editor .answer-field input,#editor .question-field textarea,#editor .answer-field textarea{border:2px solid #bfe6ff;border-radius:14px;background:#fff}',
    '#editor .word-rules-box input{border:2px solid #bfe6ff;border-radius:14px;background:#fff}',
    '#editor .hint-box textarea{border:2px solid #cfe1f0;border-radius:14px;background:#fff}',
]:
    assert s.count(token) == 1, f'ERROR: duplicate or missing editor style: {token}'

assert marker in s
p.write_text(s)
print('OK: TEST V4.77 now contains the approved V4.76 editor styling in the real page stylesheet; print-calendar syntax is preserved.')
PY

git add index.html
git diff --cached --check
git diff --cached --quiet || { git commit -m "TEST V4.77 restore approved editor styling"; git push origin HEAD:test; }
