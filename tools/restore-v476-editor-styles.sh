#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."

python3 - <<'PY'
from pathlib import Path
p = Path('index.html')
s = p.read_text()

assert '<!-- PacoGO TEST V4.77 -->' in s, 'ERROR: not TEST V4.77'
assert "printWindow.document.write(" in s, 'ERROR: print calendar code missing'

old_blocks = [
'''/* TEST V4.76 — approved uniform editor styling */
.lesson-test-date-box{background:#eef8ff;border:2px solid #bfe6ff;border-radius:16px;padding:11px 14px}
#lessonAiBox.lesson-ai-box{background:#eef8ff;border:2px solid #bfe6ff;border-radius:16px;padding:16px}
#editor .question-field input,#editor .answer-field input,#editor .question-field textarea,#editor .answer-field textarea{border:2px solid #bfe6ff;border-radius:14px;background:#fff}
#editor .word-rules-box input{border:2px solid #bfe6ff;border-radius:14px;background:#fff}
#editor .hint-box textarea{border:2px solid #cfe1f0;border-radius:14px;background:#fff}
''',
'''/* TEST V4.77 — approved uniform editor styling */
.lesson-test-date-box{background:#eef8ff;border:2px solid #bfe6ff;border-radius:16px;padding:11px 14px}
#lessonAiBox.lesson-ai-box{background:#eef8ff;border:2px solid #bfe6ff;border-radius:16px;padding:16px}
#editor .question-field input,#editor .answer-field input,#editor .question-field textarea,#editor .answer-field textarea{border:2px solid #bfe6ff;border-radius:14px;background:#fff}
#editor .word-rules-box input{border:2px solid #bfe6ff;border-radius:14px;background:#fff}
#editor .hint-box textarea{border:2px solid #cfe1f0;border-radius:14px;background:#fff}
'''
]
for block in old_blocks:
    s = s.replace(block, '')

css = '''/* TEST V4.78 — clean uniform lesson editor fields */
.lesson-test-date-box{background:#eef8ff;border:2px solid #bfe6ff;border-radius:16px;padding:11px 14px}
#lessonAiBox.lesson-ai-box{background:#eef8ff;border:2px solid #bfe6ff;border-radius:16px;padding:16px}
#editor .editor-main-card .word-part-row input{border:2px solid #bfe6ff;border-radius:14px;background:#fff;color:var(--text)}
#editor .word-rules-box input{border:2px solid #bfe6ff;border-radius:14px;background:#fff;color:var(--text)}
#editor .word-editor-hint textarea{border:2px solid #cfe1f0;border-radius:14px;background:#fff;color:var(--text)}
'''
idx = s.find('</style>')
if idx < 0:
    raise SystemExit('ERROR: main style block not found')
s = s[:idx] + css + s[idx:]
s = s.replace('<!-- PacoGO TEST V4.77 -->', '<!-- PacoGO TEST V4.78 -->', 1)
s = s.replace('<div class="version-badge">PacoGO TEST V4.77</div>', '<div class="version-badge">PacoGO TEST V4.78</div>', 1)

assert '<!-- PacoGO TEST V4.78 -->' in s
assert '<div class="version-badge">PacoGO TEST V4.78</div>' in s
assert s.count('TEST V4.78 — clean uniform lesson editor fields') == 1
assert '#editor .editor-main-card .word-part-row input{border:2px solid #bfe6ff;border-radius:14px;background:#fff;color:var(--text)}' in s
assert 'question-field input' not in s
assert 'answer-field input' not in s
assert '!important' not in css

p.write_text(s)
print('OK: TEST V4.78 uses the actual lesson-editor input structure; VRAAG and ANTWOORD fields are now rounded by their real .word-part-row inputs. No !important patch.')
PY

git add index.html
git diff --cached --check
if git diff --cached --quiet; then
  echo 'No changes needed.'
else
  git commit -m 'TEST V4.78 clean uniform lesson editor fields'
  git push origin HEAD:test
fi
