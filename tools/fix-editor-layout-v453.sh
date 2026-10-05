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

assert '<!-- PacoGO TEST V4.76 -->' in s
marker = '/* TEST V4.76 — approved uniform editor styling */'
assert marker in s, 'ERROR: V4.76 styling block not found'

# The V4.76 styling block was accidentally inserted inside the single-quoted
# printWindow.document.write() JavaScript string. Remove it from that string.
block_start = s.find(marker)
style_end = s.find('</style>', block_start)
assert style_end >= 0, 'ERROR: end of misplaced V4.76 style block not found'
s = s[:block_start] + s[style_end:]

# Put the approved styling in the real page <style> block, where CSS belongs.
css = '''
/* TEST V4.77 — approved uniform editor styling */
.lesson-test-date-box{background:#eef8ff;border:2px solid #bfe6ff;border-radius:16px;padding:11px 14px}
#lessonAiBox.lesson-ai-box{background:#eef8ff;border:2px solid #bfe6ff;border-radius:16px;padding:16px}
#editor .question-field input,#editor .answer-field input,#editor .question-field textarea,#editor .answer-field textarea{border:2px solid #bfe6ff;border-radius:14px;background:#fff}
#editor .word-rules-box input{border:2px solid #bfe6ff;border-radius:14px;background:#fff}
#editor .hint-box textarea{border:2px solid #cfe1f0;border-radius:14px;background:#fff}
'''
head_style_end = s.find('</style>')
assert head_style_end >= 0, 'ERROR: main page style block not found'
s = s[:head_style_end] + css + s[head_style_end:]

s = s.replace('<!-- PacoGO TEST V4.76 -->', '<!-- PacoGO TEST V4.77 -->', 1)
p.write_text(s)

print('TEST V4.77 source repaired: uniform editor CSS moved out of printWindow.document.write() and into the real page stylesheet.')
PY

git add index.html
git diff --cached --check
git diff --cached --quiet || { git commit -m "TEST V4.77 repair editor CSS placement"; git push origin HEAD:test; }
