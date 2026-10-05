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
assert '<!-- PacoGO TEST V4.64 -->' in s, 'Expected clean V4.64 editor baseline'
assert 'PacoGO TEST V4.60' in s, 'Expected existing visible version badge'
start=s.index('function addWordRow(')
end=s.index('function getWordItemRules(', start)
new_function=r'''function addWordRow(q='',a='',questionParts=null,answerParts=null,rules=null){
  const editor=document.getElementById('wordEditor');
  const previous=editor.lastElementChild;
  if(!questionParts){
    if(previous&&previous.querySelector('.word-q-part'))questionParts=[...previous.querySelectorAll('.word-q-part')].map(()=> '');
    else questionParts=[''];
  }
  if(!answerParts){
    if(previous&&previous.querySelector('.word-a-part'))answerParts=[...previous.querySelectorAll('.word-a-part')].map(r=>({text:'',role:r.querySelector('.word-part-role')?.value||'answer'}));
    else answerParts=[{text:'',role:'answer'}];
  }
  const row=document.createElement('div');
  row.className='editor-row';
  row.innerHTML=`<button class="remove-row" type="button" onclick="this.parentElement.remove()">✕</button>
    <div class="word-parts-section"><div class="word-parts-head"><label>Vraag</label></div><div class="word-question-parts"></div><button type="button" class="word-add-line word-add-line-bottom" onclick="addWordQuestionPart(this.closest('.editor-row'))">➕ regel</button></div>
    <div class="word-parts-section"><div class="word-parts-head"><label>Antwoord</label></div><div class="word-answer-parts"></div><button type="button" class="word-add-line word-add-line-bottom" onclick="addWordAnswerPart(this.closest('.editor-row'))">➕ regel</button><div class="word-extra-note">Kies per regel of deze wordt beoordeeld als antwoord of alleen als extra informatie.</div></div>
    <div class="word-rules-box"><div class="word-rules-title">🎯 Beoordeling van het antwoord</div><div class="word-rules-grid">
      <div class="word-rule-field word-rule-required"><label>🔎 Verplichte woorden</label><input class="word-item-required-terms" type="text" placeholder="Bijvoorbeeld expert, computers (komma-gescheiden)"></div>
      <div class="word-rule-field word-rule-min"><label>🔢 Minimum aantal woorden</label><input class="word-item-min-words" type="number" min="0" max="100" value="0" placeholder="0 = geen minimum"></div>
    </div></div>
    <div class="word-editor-bottom"><div class="word-editor-hint"><label>💡 Hint</label><textarea class="word-item-hint" placeholder="Bijvoorbeeld: Mijn vader is een ________ op het gebied van computers."></textarea></div><button type="button" class="question-insert-button" onclick="insertWordQuestionAfter(this)">➕ Vraag hier invoegen</button></div>`;
  editor.appendChild(row);
  questionParts.forEach((part,i)=>addWordQuestionPart(row,part||''));
  answerParts.forEach(part=>addWordAnswerPart(row,part?.text||'',part?.role||'answer'));
  if(rules){
    row.querySelector('.word-item-hint').value=rules.hint||'';
    row.querySelector('.word-item-min-words').value=Number.isFinite(Number(rules.min_words))?Number(rules.min_words):0;
    row.querySelector('.word-item-required-terms').value=Array.isArray(rules.required_terms)?rules.required_terms.join(', '):(rules.required_terms||'');
  }
}
'''
s=s[:start]+new_function+s[end:]
s=s.replace('<!-- PacoGO TEST V4.64 -->','<!-- PacoGO TEST V4.68 -->',1)
s=s.replace('PacoGO TEST V4.60','PacoGO TEST V4.68',1)
css=r'''

/* TEST V4.68 — clean lesson-editor assessment structure */
#wordEditor .word-rules-box{margin-top:14px;padding:14px 16px;background:#fbfdff;border:2px solid #d7e7f5;border-radius:16px}
#wordEditor .word-rules-title{margin-bottom:12px;font-size:17px;font-weight:900;color:#173b70}
#wordEditor .word-rules-grid{display:grid;grid-template-columns:minmax(0,1fr) 250px;gap:14px;align-items:end}
#wordEditor .word-rule-field{min-width:0;margin:0}
#wordEditor .word-rule-field label{display:block;margin:0 0 6px;font-weight:850;color:#38577d}
#wordEditor .word-rule-field input{width:100%;min-width:0}
#wordEditor .word-editor-bottom{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:18px;align-items:end;margin-top:14px}
#wordEditor .word-editor-hint{min-width:0;margin:0}
#wordEditor .word-editor-hint label{display:block;margin:0 0 6px;font-weight:850;color:#38577d}
#wordEditor .word-editor-hint textarea{display:block;width:100%;height:76px;min-height:76px;margin:0;padding:10px 13px;font-size:16px;line-height:1.35;border-radius:11px}
#wordEditor .word-editor-bottom .question-insert-button{margin:0;white-space:nowrap;align-self:end}
@media(max-width:760px){#wordEditor .word-rules-grid{grid-template-columns:1fr}#wordEditor .word-editor-bottom{grid-template-columns:1fr}#wordEditor .word-editor-bottom .question-insert-button{justify-self:start}}
'''
marker='</style>'
pos=s.find(marker)
if pos<0:raise SystemExit('ERROR: main style closing tag not found')
s=s[:pos]+css+s[pos:]
p.write_text(s)
PY
git add index.html
git diff --cached --check
git commit -m "TEST V4.68 rebuild word assessment layout cleanly"
git push origin HEAD:test
