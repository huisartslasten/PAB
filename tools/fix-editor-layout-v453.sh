#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."
git config user.name "PacoGO Bot"
git config user.email "paco-go-bot@users.noreply.github.com"
git fetch origin test
git checkout -B test origin/test
python3 -m pip install --quiet beautifulsoup4
python3 - <<'PY'
from pathlib import Path
from bs4 import BeautifulSoup
p=Path('index.html')
soup=BeautifulSoup(p.read_text(), 'html.parser')
editor=soup.select_one('#editor')
card=editor.select_one('.editor-main-card') if editor else None
if card is None: card=editor.select_one('.card') if editor else None
if card is None: raise SystemExit('ERROR: editor main card not found')
def by_id(name):
    el=soup.find(id=name)
    if el is None: raise SystemExit(f'ERROR: missing #{name}')
    return el
def field_parent(el):
    x=el
    while x is not None and x is not card:
        if x.name=='div' and 'field' in (x.get('class') or []): return x
        x=x.parent
    return el.parent
subject=by_id('lessonSubject'); subvak=by_id('lessonSubvak'); name=by_id('lessonName'); type_select=by_id('lessonType'); explanation=by_id('lessonExplanation')
left_items=[field_parent(subject),field_parent(subvak),field_parent(name)]
right_items=[field_parent(type_select)]
test_label=None
for lab in card.find_all('label'):
    if 'Toetsdatum instellen' in lab.get_text(' ',strip=True): test_label=lab; break
if test_label is not None:
    x=test_label
    while x is not None and x is not card:
        cls=x.get('class') or []
        if x.name=='div' and ('lesson-test-date-box' in cls or 'field' in cls): right_items.append(x); break
        x=x.parent
right_items.append(field_parent(explanation))
def unique(items):
    out=[]; seen=set()
    for el in items:
        if id(el) not in seen: out.append(el); seen.add(id(el))
    return out
left_items=unique(left_items); right_items=unique(right_items)
ai=None
for candidate_id in ('lessonAiBox','aiCheckBox','aiCheck'):
    ai=soup.find(id=candidate_id)
    if ai: break
if ai is None:
    for el in card.find_all(['div','section']):
        if 'AI moet het antwoord controleren' in el.get_text(' ',strip=True): ai=el; break
if ai is not None:
    x=ai
    while x.parent is not None and x.parent is not card and len(x.get_text(' ',strip=True))<600: x=x.parent
    ai=x
editors=[]
for eid in ('wordEditor','questionEditor','dictationEditor','mathEditor','spellingEditor'):
    el=soup.find(id=eid)
    if el is not None: editors.append(el)
old=soup.find(id='editor-top-grid')
if old: old.decompose()
top=soup.new_tag('div',id='editor-top-grid',attrs={'class':['editor-top-grid']})
left=soup.new_tag('div',attrs={'class':['editor-top-left']}); right=soup.new_tag('div',attrs={'class':['editor-top-right']})
top.append(left); top.append(right)
for el in left_items: left.append(el)
for el in right_items: right.append(el)
anchor=None
for el in [*editors,ai]:
    if el is not None and el.parent is card: anchor=el; break
if anchor is None: anchor=card.find('div')
if anchor is None: card.append(top)
else: anchor.insert_before(top)
if ai is not None and ai.parent is card:
    ai['class']=(ai.get('class') or [])+['editor-ai-independent']
    top.insert_after(ai)
for box in list(card.find_all(['div','section'])):
    if box in (top,left,right,ai): continue
    if 'editor-type-box' in (box.get('class') or []) and not box.get_text(' ',strip=True) and not box.find(['input','select','textarea','button']): box.decompose()
style=soup.new_tag('style')
style.string='''
/* TEST V4.57 — structurally separated editor layout */
#editor .editor-main-card{display:block}
#editor .editor-top-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:18px;row-gap:8px;align-items:start;margin-bottom:10px}
#editor .editor-top-left,#editor .editor-top-right{min-width:0}
#editor .editor-top-left>.field,#editor .editor-top-right>.field{margin-bottom:10px}
#editor .editor-top-right>.lesson-test-date-box{margin:0 0 10px}
#editor .editor-ai-independent{width:100%;margin:0 0 10px}
#editor .editor-main-card>#wordEditor,#editor .editor-main-card>#questionEditor,#editor .editor-main-card>#dictationEditor,#editor .editor-main-card>#mathEditor,#editor .editor-main-card>#spellingEditor{width:100%;display:block}
#editor .editor-main-card>#wordEditor .editor-row,#editor .editor-main-card>#questionEditor .editor-row{display:block;width:100%;max-width:none;padding-top:10px;padding-bottom:10px}
@media(max-width:900px){#editor .editor-top-grid{grid-template-columns:1fr}}
'''
soup.find('head').append(style)
p.write_text(str(soup))
print('Applied TEST V4.57 structural editor separation.')
PY
python3 - <<'PY'
from pathlib import Path
from bs4 import BeautifulSoup
soup=BeautifulSoup(Path('index.html').read_text(),'html.parser')
assert soup.select_one('#editor-top-grid')
left=soup.select_one('.editor-top-left'); right=soup.select_one('.editor-top-right')
assert left and right
assert left.find(id='lessonSubject') and left.find(id='lessonSubvak') and left.find(id='lessonName')
assert right.find(id='lessonType') and right.find(id='lessonExplanation')
assert soup.find(id='wordEditor') and soup.find(id='questionEditor')
print('CHECK OK: V4.57 independent left/right top fields; questions full width.')
PY
git add index.html
git commit -m "TEST V4.57 structurally separate editor layout"
git push origin HEAD:test
