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
start='      <div class="field"><label for="lessonSubject">Vak</label>'
end='      <div id="spellingLabelsEditor"'
a=s.find(start)
b=s.find(end,a)
if a<0 or b<0: raise SystemExit('ERROR: expected editor field block not found')
new='''      <div class="editor-top-grid">
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
      <div id="lessonAiBox" class="card lesson-ai-box hidden"><label class="lesson-test-date-toggle"><input id="lessonAiCheckAnswers" type="checkbox" onchange="toggleLessonAiInstruction()"> 🤖 AI moet het antwoord controleren</label><div class="small" style="margin-top:5px">Zet dit aan als je wilt dat AI bepaalt of het antwoord inhoudelijk goed is.</div><div id="lessonAiInstructionBox" class="lesson-ai-instruction hidden"><div class="field" style="margin:0"><label for="lessonAiInstruction">Instructie voor de AI <span class="small">(optioneel)</span></label><textarea id="lessonAiInstruction" placeholder="Bijvoorbeeld: Een kleine spelfout is niet erg. Het antwoord hoeft niet 100% correct gespeld te zijn als de betekenis duidelijk goed is."></textarea></div></div></div>
'''
s=s[:a]+new+s[b:]
css='''\n/* TEST V4.58 — editor fields structurally separated */\n#editor .editor-main-card{display:block}\n#editor .editor-top-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:18px;row-gap:8px;align-items:start;margin-bottom:10px}\n#editor .editor-top-left,#editor .editor-top-right{min-width:0}\n#editor .editor-top-left>.field,#editor .editor-top-right>.field{margin-bottom:10px}\n#editor .editor-top-right>.lesson-test-date-box{margin:0 0 10px}\n#editor #lessonAiBox{width:100%;margin:0 0 10px}\n#editor .editor-main-card>#wordEditor,#editor .editor-main-card>#questionEditor,#editor .editor-main-card>#dictationEditor,#editor .editor-main-card>#mathEditor,#editor .editor-main-card>#spellingEditor{width:100%;display:block}\n#editor .editor-main-card>#wordEditor .editor-row,#editor .editor-main-card>#questionEditor .editor-row{display:block;width:100%;max-width:none;padding-top:10px;padding-bottom:10px}\n@media(max-width:900px){#editor .editor-top-grid{grid-template-columns:1fr}}\n'''
if '/* TEST V4.58 — editor fields structurally separated */' not in s: s=s.replace('</style>',css+'</style>',1)
s=s.replace('<div class="version-badge">PacoGO TEST V4.53</div>','<div class="version-badge">PacoGO TEST V4.58</div>')
p.write_text(s)
print('Applied TEST V4.58 targeted editor structure + version badge.')
PY
python3 - <<'PY'
from pathlib import Path
s=Path('index.html').read_text()
assert '<div class="version-badge">PacoGO TEST V4.58</div>' in s
assert '<div class="editor-top-grid">' in s
assert s.count('id="lessonSubject"')==1 and s.count('id="lessonSubvak"')==1 and s.count('id="lessonName"')==1
assert s.count('id="lessonType"')==1 and s.count('id="lessonExplanation"')==1
assert s.count('id="lessonAiBox"')==1 and s.count('id="wordEditor"')==1
assert 'editor-type-box' in s
print('CHECK OK: TEST V4.58 targeted structure, version, and existing editor functionality preserved.')
PY
git add index.html
git commit -m "TEST V4.58 apply editor structure"
git push origin HEAD:test
