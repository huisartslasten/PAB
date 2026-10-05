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
if 'PacoGO TEST V4.58' not in s:
    raise SystemExit('ERROR: expected TEST V4.58 checkpoint not found')
start=s.find('<div class="editor-top-grid">')
nested=s.find('<div class="editor-top-grid">',start+1)
if start<0 or nested<0:
    raise SystemExit('ERROR: malformed editor-top-grid structure not found')
spelling=s.find('<div id="spellingLabelsEditor"',nested)
left=s.find('<div class="editor-top-left">',nested)
right=s.find('<div class="editor-top-right">',left)
ai=s.find('<div id="lessonAiBox"',right)
if min(spelling,left,right,ai)<0 or not (nested<left<right<ai<spelling):
    raise SystemExit('ERROR: expected editor top markers not found in order')
left_content=s[left+len('<div class="editor-top-left">'):right]
if left_content.rstrip().endswith('</div>'):
    left_content=left_content.rstrip()[:-len('</div>')]
right_content=s[right+len('<div class="editor-top-right">'):ai]
if right_content.rstrip().endswith('</div>'):
    right_content=right_content.rstrip()[:-len('</div>')]
ai_block=s[ai:spelling]
new_top=(
    '<div class="editor-top-grid">\n'
    '  <div class="editor-top-left">'+left_content+'\n  </div>\n'
    '  <div class="editor-top-right">'+right_content+'\n  </div>\n'
    '</div>'+ai_block
)
s=s[:start]+new_top+s[spelling:]
css='''\n/* TEST V4.59 — questions/answers full width */\n#editor .editor-main-card>#wordEditor,\n#editor .editor-main-card>#questionEditor,\n#editor .editor-main-card>#dictationEditor,\n#editor .editor-main-card>#mathEditor,\n#editor .editor-main-card>#spellingEditor{\n  width:100%!important;\n  max-width:none!important;\n  display:block!important;\n  grid-column:1/-1!important;\n  margin-left:0!important;\n  margin-right:0!important;\n}\n#editor .editor-main-card>#wordEditor .editor-row,\n#editor .editor-main-card>#questionEditor .editor-row,\n#editor .editor-main-card>#dictationEditor .editor-row,\n#editor .editor-main-card>#mathEditor .editor-row,\n#editor .editor-main-card>#spellingEditor .editor-row{\n  width:100%!important;\n  max-width:none!important;\n  margin-left:0!important;\n  margin-right:0!important;\n}\n'''
if '/* TEST V4.59 — questions/answers full width */' not in s:
    s=s.replace('</style>',css+'</style>',1)
s=s.replace('PacoGO TEST V4.58','PacoGO TEST V4.59',1)
s=s.replace('PacoGO TEST V4.58','PacoGO TEST V4.59')
p.write_text(s)
print('Applied TEST V4.59: repaired editor top nesting and forced question/answer editors to full width.')
PY
python3 - <<'PY'
from pathlib import Path
s=Path('index.html').read_text()
assert 'PacoGO TEST V4.59' in s
assert s.count('<div class="editor-top-grid">')==1
assert s.count('id="lessonSubject"')==1
assert s.count('id="lessonSubvak"')==1
assert s.count('id="lessonName"')==1
assert s.count('id="lessonType"')==1
assert s.count('id="lessonExplanation"')==1
assert s.count('id="lessonAiBox"')==1
assert s.count('id="wordEditor"')==1
print('CHECK OK: TEST V4.59 structure, unique editor fields, and full-width selectors.')
PY
git add index.html
git commit -m "TEST V4.59 repair editor top nesting and full width"
git push origin HEAD:test
