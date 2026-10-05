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
spelling=s.find('<div id="spellingLabelsEditor"',start)
ai=s.find('<div id="lessonAiBox"',start)
if start<0 or spelling<0 or ai<0 or not (start<ai<spelling):
    raise SystemExit('ERROR: expected editor top block markers not found')
ai_block=s[ai:spelling]
canonical='''<div class="editor-top-grid">
  <div class="editor-top-left">
    <div class="field"><label for="lessonSubject">Vak</label><input id="lessonSubject" placeholder="Voer vak in bijvoorbeeld Nederlands"></div>
    <div class="field"><label for="lessonSubvak">Subvak <span class="small">(optioneel)</span></label><input id="lessonSubvak" placeholder="Bijvoorbeeld Themawoorden of Spelling"></div>
    <div class="field"><label for="lessonName">Naam van de les</label><input id="lessonName" placeholder="Bijvoorbeeld Week 4"></div>
  </div>
  <div class="editor-top-right">
    <div class="field"><label for="lessonType">Onderdeel</label><div class="lesson-type-select"><button type="button" id="lessonTypeButton" class="lesson-type-button" onclick="toggleLessonTypeMenu()"><span id="lessonTypeButtonText">🎯 Woordtrainer</span><span class="lesson-type-chevron">⌄</span></button><div id="lessonTypeMenu" class="lesson-type-menu hidden"><button type="button" onclick="setLessonType('words')">🎯 Woordtrainer</button><button type="button" onclick="setLessonType('questions')">❓ Vragen</button><button type="button" onclick="setLessonType('dictation')">✏️ Dictee</button><button type="button" onclick="setLessonType('math')">🔢 Rekenen</button><button type="button" onclick="setLessonType('spelling')">✍️ Spelling</button><button type="button" onclick="setLessonType('custom')">🛠️ Eigen les</button></div><select id="lessonType" class="lesson-type-native" tabindex="-1" aria-hidden="true"><option value="words">words</option><option value="questions">questions</option><option value="dictation">dictation</option><option value="math">math</option><option value="spelling">spelling</option><option value="custom">custom</option></select></div></div>
    <div class="lesson-test-date-box"><label class="lesson-test-date-toggle"><input id="lessonTestDateEnabled" type="checkbox" onchange="toggleLessonTestDate()"> 📅 Toetsdatum instellen</label><div class="small" style="margin-top:5px">Optioneel. Alleen instellen als er al een toetsdatum bekend is.</div><input id="lessonTestDate" type="hidden"><div id="lessonTestDatePicker" class="date-picker lesson-test-date-picker hidden"></div></div>
    <div class="field"><label for="lessonExplanation">Uitleg <span class="small">(optioneel)</span></label><textarea id="lessonExplanation" placeholder="Leg hier de leerstof of regel uit. Dit wordt apart boven de oefeningen getoond."></textarea></div>
  </div>
</div>
'''
s=s[:start]+canonical+ai_block+s[spelling:]
css='''\n/* TEST V4.59 — questions/answers full width */\n#editor .editor-main-card>#wordEditor,\n#editor .editor-main-card>#questionEditor,\n#editor .editor-main-card>#dictationEditor,\n#editor .editor-main-card>#mathEditor,\n#editor .editor-main-card>#spellingEditor{\n  width:100%!important;\n  max-width:none!important;\n  display:block!important;\n  grid-column:1/-1!important;\n  margin-left:0!important;\n  margin-right:0!important;\n}\n#editor .editor-main-card>#wordEditor .editor-row,\n#editor .editor-main-card>#questionEditor .editor-row,\n#editor .editor-main-card>#dictationEditor .editor-row,\n#editor .editor-main-card>#mathEditor .editor-row,\n#editor .editor-main-card>#spellingEditor .editor-row{\n  width:100%!important;\n  max-width:none!important;\n  margin-left:0!important;\n  margin-right:0!important;\n}\n'''
if '/* TEST V4.59 — questions/answers full width */' not in s:
    s=s.replace('</style>',css+'</style>',1)
s=s.replace('PacoGO TEST V4.58','PacoGO TEST V4.59')
p.write_text(s)
print('Applied TEST V4.59: canonical editor top structure + full-width question/answer editors.')
PY
python3 - <<'PY'
from pathlib import Path
s=Path('index.html').read_text()
assert 'PacoGO TEST V4.59' in s
assert s.count('<div class="editor-top-grid">')==1
for x in ['lessonSubject','lessonSubvak','lessonName','lessonType','lessonExplanation','lessonAiBox','wordEditor']:
    assert s.count('id="'+x+'"')==1, x
assert 'TEST V4.59 — questions/answers full width' in s
print('CHECK OK: TEST V4.59 canonical editor structure and full-width question/answer selectors.')
PY
git add index.html
git commit -m "TEST V4.59 canonical editor structure and full width"
git push origin HEAD:test
