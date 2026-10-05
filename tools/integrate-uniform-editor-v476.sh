#!/usr/bin/env bash
set -euo pipefail
python3 - <<'PY'
from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

if '<!-- PacoGO TEST V4.75 -->' not in s:
    raise SystemExit('Expected TEST V4.75 marker not found')

s = s.replace('<!-- PacoGO TEST V4.75 -->', '<!-- PacoGO TEST V4.76 -->', 1)

marker = '/* TEST V4.76 — approved uniform editor styling */'
if marker not in s:
    css = r'''\n/* TEST V4.76 — approved uniform editor styling */
.lesson-test-date-box{background:#eef8ff!important;border:2px solid #bfe6ff!important;border-radius:16px!important;padding:11px 14px!important}
#lessonAiBox.lesson-ai-box{background:#eef8ff!important;border:2px solid #bfe6ff!important;border-radius:16px!important;padding:16px!important}
#editor .question-field input,#editor .answer-field input,#editor .question-field textarea,#editor .answer-field textarea{border:2px solid #bfe6ff!important;border-radius:14px!important;background:#fff!important}
#editor .word-rules-box input{border:2px solid #bfe6ff!important;border-radius:14px!important;background:#fff!important}
#editor .hint-box textarea{border:2px solid #cfe1f0!important;border-radius:14px!important;background:#fff!important}
'''
    pos = s.rfind('</style>')
    if pos < 0:
        raise SystemExit('Could not find closing style tag')
    s = s[:pos] + css + s[pos:]

p.write_text(s, encoding='utf-8')
PY

grep -q '<!-- PacoGO TEST V4.76 -->' index.html
grep -q 'TEST V4.76 — approved uniform editor styling' index.html
grep -q '#editor .word-rules-box input' index.html
grep -q '#lessonAiBox.lesson-ai-box' index.html
