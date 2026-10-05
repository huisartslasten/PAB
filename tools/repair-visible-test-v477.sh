#!/usr/bin/env bash
set -euo pipefail

python3 - <<'PY'
from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

assert '<!-- PacoGO TEST V4.77 -->' in s

# The readable TEST badge must match the actual source version.
s = s.replace(
    '<div class="version-badge">PacoGO TEST V4.71</div>',
    '<div class="version-badge">PacoGO TEST V4.77</div>'
)

# Remove every previous V4.77 editor-style block, wherever it ended up.
marker = '/* TEST V4.77 — approved uniform editor styling */'
while marker in s:
    start = s.find(marker)
    end_marker = '#editor .hint-box textarea{'
    end = s.find(end_marker, start)
    if end < 0:
        raise SystemExit('ERROR: existing V4.77 CSS block is incomplete')
    end = s.find('\n', end)
    if end < 0:
        end = len(s)
    else:
        end += 1
    s = s[:start] + s[end:]

# Put the approved styling in the real page stylesheet, not inside the
# print-calendar document.write string.
block = '''
/* TEST V4.77 — approved uniform editor styling */
.lesson-test-date-box{background:#eef8ff;border:2px solid #bfe6ff;border-radius:16px;padding:11px 14px}
#lessonAiBox.lesson-ai-box{background:#eef8ff;border:2px solid #bfe6ff;border-radius:16px;padding:16px}
#editor .question-field input,#editor .answer-field input,#editor .question-field textarea,#editor .answer-field textarea{border:2px solid #bfe6ff;border-radius:14px;background:#fff}
#editor .word-rules-box input{border:2px solid #bfe6ff;border-radius:14px;background:#fff}
#editor .hint-box textarea{border:2px solid #cfe1f0;border-radius:14px;background:#fff}
'''

style_end = s.find('</style>')
if style_end < 0:
    raise SystemExit('ERROR: main page stylesheet closing tag not found')
s = s[:style_end] + block + s[style_end:]

p.write_text(s, encoding='utf-8')
PY

grep -F '<!-- PacoGO TEST V4.77 -->' index.html
grep -F '<div class="version-badge">PacoGO TEST V4.77</div>' index.html
[ "$(grep -o 'TEST V4.77 — approved uniform editor styling' index.html | wc -l | tr -d ' ')" = "1" ]
grep -F '#editor .question-field input,#editor .answer-field input' index.html
grep -F '#editor .word-rules-box input' index.html

git config user.name 'PacoGO Bot'
git config user.email 'paco-go-bot@users.noreply.github.com'
git add index.html
git rm -f .github/workflows/fix-test-editor-layout.yml .github/workflows/repair-visible-test-v477.yml tools/repair-visible-test-v477.sh
git diff --cached --check
git commit -m 'TEST V4.77 clean editor styling and visible version'
git push origin HEAD:test
