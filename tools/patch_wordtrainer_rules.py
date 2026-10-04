from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

if '/* TEST V4.53 — WOORDENTRAINER beoordeling + hints */' in s:
    print('Already patched')
    raise SystemExit(0)

# 1. CSS
css = r'''\n/* TEST V4.53 — WOORDENTRAINER beoordeling + hints */
.word-rules-box{margin-top:14px;padding:14px 16px;background:#fff9ea;border:2px solid #f1d48b;border-radius:16px}
.word-rules-title{font-family:"Baloo 2",Nunito,sans-serif;font-size:18px;font-weight:900;color:#7a5b00;margin-bottom:10px}
.word-rules-grid{display:grid;grid-template-columns:180px minmax(0,1fr);gap:10px 14px;align-items:start}
.word-rules-grid label{font-weight:850;color:#38577d;padding-top:10px}
.word-rules-grid input,.word-rules-grid textarea{width:100%;padding:10px 12px;border:1px solid #e3c978;border-radius:11px;background:#fff;color:#102b57}
.word-rules-grid textarea{min-height:74px}
.word-rules-help{font-size:12px;color:#7a6a45;line-height:1.4;margin-top:9px}
.practice-answer-review{margin:16px 0 12px;padding:14px 16px;border-radius:15px;background:#f7fbff;border:2px solid #dce9f6;text-align:left}
.practice-answer-review-title{font-weight:900;color:#126fc9;margin-bottom:5px}
.practice-answer-review-text{white-space:pre-wrap;line-height:1.45;color:#102b57}
.practice-rule-results{margin-top:10px;padding-top:10px;border-top:1px solid #dce9f6;font-size:14px;line-height:1.5}
.practice-rule-ok{color:#18743b}.practice-rule-bad{color:#b42318}
.practice-hint-box{margin:12px 0;padding:13px 15px;border-radius:14px;background:#fff9ea;border:2px solid #f1d48b;text-align:left;color:#7a5b00}
.practice-hint-box strong{display:block;margin-bottom:4px}
.practice-hint-button{margin:0 0 8px;background:#fff6df;color:#7a5b00;border:2px solid #f1d48b;box-shadow:0 3px 0 #ead28a}
.practice-hint-button:hover{background:#fff0c7}
@media(max-width:700px){.word-rules-grid{grid-template-columns:1fr}.word-rules-grid label{padding-top:0}}
'''
s = s.replace('</style>', css + '</style>', 1)

# 2. Replace addWordRow with the current function plus rule fields.
old_start = 'function addWordRow(q=\'\',a=\'\',questionParts=null,answerParts=null){'
start = s.index(old_start)
end = s.index('\nfunction addQuestionRow', start)
new_func = r'''function addWordRow(q='',a='',questionParts=null,answerParts=null,rules=null){
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
      <label>💡 Hint</label><textarea class="word-item-hint" placeholder="Bijvoorbeeld: Mijn vader is een ________ op het gebied van computers."></textarea>
      <label>🔢 Minimaal aantal woorden</label><input class="word-item-min-words" type="number" min="0" max="100" value="0" placeholder="0 = geen minimum">
      <label>🔎 Verplichte woorden</label><input class="word-item-required-terms" type="text" placeholder="Bijvoorbeeld expert, computers (komma-gescheiden)">
    </div><div class="word-rules-help">PacoGO controleert eerst deze vaste regels. Alleen als de regels slagen, kan de bestaande AI-beoordeling nog bepalen of het antwoord inhoudelijk goed is. Zo weet je precies waarop wordt beoordeeld.</div></div>
    <button type="button" class="question-insert-button" onclick="insertWordQuestionAfter(this)">➕ Vraag hier invoegen</button>`;
  editor.appendChild(row);
  questionParts.forEach((part,i)=>addWordQuestionPart(row,part||''));
  answerParts.forEach(part=>addWordAnswerPart(row,part?.text||'',part?.role||'answer'));
  if(rules){
    row.querySelector('.word-item-hint').value=rules.hint||'';
    row.querySelector('.word-item-min-words').value=Number.isFinite(Number(rules.min_words))?Number(rules.min_words):0;
    row.querySelector('.word-item-required-terms').value=Array.isArray(rules.required_terms)?rules.required_terms.join(', '):(rules.required_terms||'');
  }
}
function getWordItemRules(row){
  const min=Math.max(0,Number(row.querySelector('.word-item-min-words')?.value||0));
  const required=String(row.querySelector('.word-item-required-terms')?.value||'').split(',').map(x=>x.trim()).filter(Boolean);
  return {hint:String(row.querySelector('.word-item-hint')?.value||'').trim(),min_words:Number.isFinite(min)?min:0,required_terms:required};
}
'''
s = s[:start] + new_func + s[end:]

# 3. Replace the words/custom collectItems branch.
old = "if(t==='words'||t==='custom')document.querySelectorAll('#wordEditor .editor-row').forEach((r,i)=>{\n  const questionParts=[...r.querySelectorAll('.word-q-part')].map(x=>x.value.trim()).filter(Boolean);\n  const answerParts=[...r.querySelectorAll('.word-a-part')].map(x=>({text:x.value.trim(),role:x.closest('.word-part-row')?.querySelector('.word-part-role')?.value||'answer'})).filter(x=>x.text);\n  const required=answerParts.filter(x=>x.role==='answer').map(x=>x.text);\n  if(questionParts.length&&required.length)items.push({question:questionParts.join('\\n'),answer:required.join('\\n'),question_parts:questionParts,answer_parts:answerParts,sort_order:i});\n});"
new = "if(t==='words'||t==='custom')document.querySelectorAll('#wordEditor .editor-row').forEach((r,i)=>{\n  const questionParts=[...r.querySelectorAll('.word-q-part')].map(x=>x.value.trim()).filter(Boolean);\n  const answerParts=[...r.querySelectorAll('.word-a-part')].map(x=>({text:x.value.trim(),role:x.closest('.word-part-row')?.querySelector('.word-part-role')?.value||'answer'})).filter(x=>x.text);\n  const required=answerParts.filter(x=>x.role==='answer').map(x=>x.text);\n  const rules=getWordItemRules(r);\n  if(questionParts.length&&required.length)items.push({question:questionParts.join('\\n'),answer:required.join('\\n'),question_parts:questionParts,answer_parts:answerParts,hint:rules.hint,min_words:rules.min_words,required_terms:rules.required_terms,sort_order:i});\n});"
if old not in s: raise SystemExit('collectItems marker not found')
s = s.replace(old,new,1)

# 4. Save lesson_items: the two insertion paths need the new fields.
s = s.replace("items.map(x=>({...x,lesson_id:lessonId}))", "items.map(x=>({...x,lesson_id:lessonId,hint:x.hint||'',min_words:Number(x.min_words||0),required_terms:Array.isArray(x.required_terms)?x.required_terms:[]}))")

# 5. Existing lesson editor load: pass rules into addWordRow.
old = "addWordRow('', '', qp, ap);"
new = "addWordRow('', '', qp, ap, {hint:it.hint||'',min_words:it.min_words||0,required_terms:Array.isArray(it.required_terms)?it.required_terms:[]});"
if old not in s: raise SystemExit('edit addWordRow marker not found')
s = s.replace(old,new,1)

# 6. Add helper functions before gradeWithAI.
marker = "async function gradeWithAI(question, correctAnswer, userAnswer){"
helpers = r'''function countAnswerWords(value){return String(value||'').trim().split(/\s+/).filter(Boolean).length}
function checkFixedAnswerRules(item,userAnswer){
  const min=Math.max(0,Number(item?.min_words||0));
  const required=Array.isArray(item?.required_terms)?item.required_terms.map(x=>String(x||'').trim()).filter(Boolean):[];
  const normalized=normalize(userAnswer);
  const words=countAnswerWords(userAnswer);
  const results=[];
  if(min>0)results.push({ok:words>=min,text:'minimaal '+min+' woorden (je hebt er '+words+')'});
  required.forEach(term=>results.push({ok:normalized.includes(normalize(term)),text:'bevat “'+term+'”'}));
  return {ok:results.every(x=>x.ok),results,hasRules:results.length>0};
}
function fixedRuleResultsHtml(check){
  if(!check?.results?.length)return '';
  return '<div class="practice-rule-results"><strong>Vaste beoordelingsregels</strong><br>'+check.results.map(r=>(r.ok?'✓ ':'✗ ')+escapeHtml(r.text)).join('<br>')+'</div>';
}
function answerReviewHtml(userAnswer,check){
  return '<div class="practice-answer-review"><div class="practice-answer-review-title">Jouw antwoord:</div><div class="practice-answer-review-text">'+escapeHtml(userAnswer||'—')+'</div>'+fixedRuleResultsHtml(check)+'</div>';
}
function hintHtml(item){
  const hint=String(item?.hint||'').trim();
  if(!hint)return '';
  return '<div><button type="button" class="practice-hint-button" onclick="showPracticeHint()">💡 Hint</button><div id="practiceHintBox" class="practice-hint-box hidden"><strong>Hint</strong>'+escapeHtml(hint)+'</div></div>';
}
function showPracticeHint(){document.getElementById('practiceHintBox')?.classList.toggle('hidden')}

'''
if marker not in s: raise SystemExit('grade marker not found')
s = s.replace(marker, helpers+marker,1)

# 7. Add hint to typing practice for word/custom/dictation only where useful.
s = s.replace("<div class=\"small\">Typ hier het woord.</div><div class=\"prompt\">${escapeHtml(item.question)}</div>", "<div class=\"small\">Typ hier het woord.</div>${hintHtml(item)}<div class=\"prompt\">${escapeHtml(item.question)}</div>")
s = s.replace("<div class=\"small\">Typ nu zelf het antwoord.</div><div class=\"prompt\">${escapeHtml(item.question)}</div>", "<div class=\"small\">Typ nu zelf het antwoord.</div>${hintHtml(item)}<div class=\"prompt\">${escapeHtml(item.question)}</div>")
s = s.replace("<div class=\"dictation-word\">Luister goed en schrijf het woord.</div>", "<div class=\"dictation-word\">Luister goed en schrijf het woord.</div>${hintHtml(item)}")

# 8. Replace the normal word/custom grading segment inside checkPractice.
old = "const grading=currentLesson?.type==='custom'?(currentLesson.ai_check_answers?await gradeWithAI(item.question,item.answer,userAnswer):{correct:normalize(userAnswer)===normalize(item.answer),feedback:''}):await gradeWithAI(item.question,item.answer,userAnswer);"
new = "const fixed=checkFixedAnswerRules(item,userAnswer);\n    if(fixed.hasRules&&!fixed.ok){recordPracticeResult(item,false);f.innerHTML=answerReviewHtml(userAnswer,fixed)+'<div class=\"feedback incorrect\">❌ Nog niet. Eerst moet aan de vaste beoordelingsregels worden voldaan.</div>';f.className='feedback incorrect';const next=document.createElement('button');next.className='big';next.textContent='OK → Volgende vraag';next.onclick=()=>renderPractice();f.insertAdjacentElement('afterend',next);return;}\n    const grading=currentLesson?.type==='custom'?(currentLesson.ai_check_answers?await gradeWithAI(item.question,item.answer,userAnswer):{correct:normalize(userAnswer)===normalize(item.answer),feedback:''}):await gradeWithAI(item.question,item.answer,userAnswer);"
if old not in s: raise SystemExit('practice grading marker not found')
s = s.replace(old,new,1)

# 9. Ensure the final word/custom feedback contains the full answer and fixed-rule status.
s = s.replace("f.innerHTML='✅ Goed! '+escapeHtml(grading.feedback||'')+extraInfoHtml(item);", "f.innerHTML=answerReviewHtml(userAnswer,fixed)+'<div class=\"feedback correct\">✅ Goed! '+escapeHtml(grading.feedback||'')+'</div>'+extraInfoHtml(item);")
s = s.replace("f.innerHTML='❌ Nog niet helemaal. '+escapeHtml(grading.feedback||'Dit antwoord klopt niet helemaal.')+'<br>Dit woord komt later opnieuw terug.'+extraInfoHtml(item);", "f.innerHTML=answerReviewHtml(userAnswer,fixed)+'<div class=\"feedback incorrect\">❌ Nog niet helemaal. '+escapeHtml(grading.feedback||'Dit antwoord klopt niet helemaal.')+'<br>Dit woord komt later opnieuw terug.</div>'+extraInfoHtml(item);")

# 10. Update version labels.
s = s.replace('PacoGO TEST V4.52', 'PacoGO TEST V4.53')

p.write_text(s,encoding='utf-8')
print('Patched index.html to TEST V4.53')
