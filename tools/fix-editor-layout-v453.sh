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
if '<!-- PacoGO TEST V4.62 -->' not in s:
    raise SystemExit('ERROR: expected TEST V4.62 checkpoint not found')
css=r'''
/* TEST V4.64 — use the empty space below the rules explanation for a readable Hint */
#editor .editor-main-card>#wordEditor .word-rules-grid{
  display:grid!important;
  grid-template-columns:155px minmax(300px,1fr) 120px 82px!important;
  gap:10px 12px!important;
  align-items:center!important;
}
#editor .editor-main-card>#wordEditor .word-rules-grid label{
  margin:0!important;
  font-size:15px!important;
  line-height:1.12!important;
  white-space:normal!important;
}
#editor .editor-main-card>#wordEditor .word-rules-grid input{
  width:100%!important;
  min-height:56px!important;
  height:56px!important;
  margin:0!important;
  padding:10px 13px!important;
  font-size:16px!important;
  line-height:1.35!important;
  border-radius:11px!important;
}
/* DOM order: Hint label, Hint textarea, Minimum label, Minimum input, Required label, Required input. */
#editor .editor-main-card>#wordEditor .word-rules-grid > :nth-child(1),
#editor .editor-main-card>#wordEditor .word-rules-grid > :nth-child(2){display:none!important}
#editor .editor-main-card>#wordEditor .word-rules-grid > :nth-child(3){grid-column:3;grid-row:1;max-width:120px!important}
#editor .editor-main-card>#wordEditor .word-rules-grid > :nth-child(4){grid-column:4;grid-row:1;width:82px!important;min-width:82px!important;max-width:82px!important;text-align:left!important}
#editor .editor-main-card>#wordEditor .word-rules-grid > :nth-child(5){grid-column:1;grid-row:1}
#editor .editor-main-card>#wordEditor .word-rules-grid > :nth-child(6){grid-column:2;grid-row:1}

#editor .editor-main-card>#wordEditor .word-rules-hint-area{
  display:grid!important;
  grid-template-columns:155px minmax(0,1fr)!important;
  gap:10px 12px!important;
  align-items:start!important;
  margin:10px 0 0!important;
}
#editor .editor-main-card>#wordEditor .word-rules-hint-area label{
  margin:0!important;
  padding-top:10px!important;
  font-size:15px!important;
  line-height:1.12!important;
  font-weight:850!important;
  color:#38577d!important;
}
#editor .editor-main-card>#wordEditor .word-rules-hint-area textarea{
  width:100%!important;
  min-height:82px!important;
  height:82px!important;
  margin:0!important;
  padding:10px 13px!important;
  font-size:16px!important;
  line-height:1.35!important;
  border-radius:11px!important;
  resize:vertical!important;
}
#editor .editor-main-card>#wordEditor .word-rules-help{
  margin:8px 0 0!important;
  padding:5px 8px!important;
  font-size:11.5px!important;
  line-height:1.25!important;
}

@media(max-width:1100px){
  #editor .editor-main-card>#wordEditor .word-rules-grid{
    grid-template-columns:145px minmax(220px,1fr) 110px 78px!important;
  }
  #editor .editor-main-card>#wordEditor .word-rules-hint-area{
    grid-template-columns:145px minmax(0,1fr)!important;
  }
}
@media(max-width:700px){
  #editor .editor-main-card>#wordEditor .word-rules-grid{
    grid-template-columns:1fr 1fr!important;
  }
  #editor .editor-main-card>#wordEditor .word-rules-grid > :nth-child(3){grid-column:1;grid-row:1}
  #editor .editor-main-card>#wordEditor .word-rules-grid > :nth-child(4){grid-column:2;grid-row:1}
  #editor .editor-main-card>#wordEditor .word-rules-grid > :nth-child(5){grid-column:1;grid-row:2}
  #editor .editor-main-card>#wordEditor .word-rules-grid > :nth-child(6){grid-column:2;grid-row:2}
  #editor .editor-main-card>#wordEditor .word-rules-hint-area{
    grid-template-columns:1fr!important;
  }
  #editor .editor-main-card>#wordEditor .word-rules-hint-area label{padding-top:0!important}
}
'''
marker='/* TEST V4.64 — use the empty space below the rules explanation for a readable Hint */'
if marker not in s:
    s=s.replace('</style>',css+'</style>',1)
old='''<div class="word-rules-box"><div class="word-rules-title">🎯 Beoordeling van het antwoord</div><div class="word-rules-grid">\n      <label>💡 Hint</label><textarea class="word-item-hint" placeholder="Bijvoorbeeld: Mijn vader is een ________ op het gebied van computers."></textarea>\n      <label>🔢 Minimaal aantal woorden</label><input class="word-item-min-words" type="number" min="0" max="100" value="0" placeholder="0 = geen minimum">\n      <label>🔎 Verplichte woorden</label><input class="word-item-required-terms" type="text" placeholder="Bijvoorbeeld expert, computers (komma-gescheiden)">\n    </div><div class="word-rules-help">PacoGO controleert eerst deze vaste regels. Alleen als de regels slagen, kan de bestaande AI-beoordeling nog bepalen of het antwoord inhoudelijk goed is. Zo weet je precies waarop wordt beoordeeld.</div></div>'''
new='''<div class="word-rules-box"><div class="word-rules-title">🎯 Beoordeling van het antwoord</div><div class="word-rules-grid">\n      <label>💡 Hint</label><textarea class="word-item-hint" placeholder="Bijvoorbeeld: Mijn vader is een ________ op het gebied van computers."></textarea>\n      <label>🔢 Minimaal aantal woorden</label><input class="word-item-min-words" type="number" min="0" max="100" value="0" placeholder="0 = geen minimum">\n      <label>🔎 Verplichte woorden</label><input class="word-item-required-terms" type="text" placeholder="Bijvoorbeeld expert, computers (komma-gescheiden)">\n    </div><div class="word-rules-help">PacoGO controleert eerst deze vaste regels. Alleen als de regels slagen, kan de bestaande AI-beoordeling nog bepalen of het antwoord inhoudelijk goed is. Zo weet je precies waarop wordt beoordeeld.</div><div class="word-rules-hint-area"><label>💡 Hint</label><textarea class="word-item-hint" placeholder="Bijvoorbeeld: Mijn vader is een ________ op het gebied van computers."></textarea></div></div>'''
if old not in s:
    raise SystemExit('ERROR: expected V4.62 question template not found')
s=s.replace(old,new,1)
# Remove the old Hint field from the grid while preserving its data class through the new area.
s=s.replace('''<label>💡 Hint</label><textarea class="word-item-hint" placeholder="Bijvoorbeeld: Mijn vader is een ________ op het gebied van computers."></textarea>\n      <label>🔢 Minimaal aantal woorden</label>''','''<label>🔢 Minimaal aantal woorden</label>''',1)
s=s.replace('<!-- PacoGO TEST V4.62 -->','<!-- PacoGO TEST V4.64 -->',1)
p.write_text(s)
print('Applied TEST V4.64 assessment layout.')
PY
python3 - <<'PY'
from pathlib import Path
s=Path('index.html').read_text()
assert '<!-- PacoGO TEST V4.64 -->' in s
assert 'TEST V4.64 — use the empty space below the rules explanation for a readable Hint' in s
assert 'class="word-rules-hint-area"' in s
assert 'function insertLessonRowAfter(button)' in s
assert 'function insertWordQuestionAfter(button)' in s
assert s.count('id="lessonSubject"')==1
assert s.count('id="lessonType"')==1
assert s.count('id="questionEditor"')==1
print('CHECK OK: TEST V4.64 version, hint area, insert handlers, and key editor IDs.')
PY
git add index.html
git commit -m "TEST V4.64 move hint into available space"
git push origin HEAD:test
