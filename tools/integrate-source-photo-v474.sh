#!/usr/bin/env bash
set -euo pipefail

python3 - <<'PY'
from pathlib import Path
import re

p=Path('index.html')
text=p.read_text(encoding='utf-8')

if '<!-- PacoGO TEST V4.73 -->' not in text:
    raise SystemExit('Expected V4.73 marker not found')
text=text.replace('<!-- PacoGO TEST V4.73 -->','<!-- PacoGO TEST V4.74 -->',1)

checkbox='''      <div class="photo-save-original-box"><label class="photo-save-original-label"><input id="photoSaveOriginal" type="checkbox" checked> 📷 Bronfoto bewaren bij deze les</label><div class="small">De foto wordt indien nodig verkleind en opgeslagen in PacoGO Storage.</div></div>\n'''
button='      <button class="success big" onclick="createLessonFromPhoto()">💾 Maak les</button>'
if 'id="photoSaveOriginal"' not in text:
    if text.count(button)!=1:
        raise SystemExit(f'Expected exactly one Maak les button, found {text.count(button)}')
    text=text.replace(button,checkbox+button,1)

# Directly attach source-photo saving to the real lesson-creation function.
start=text.find('async function createLessonFromPhoto(){')
end=text.find('\nfunction showAddLesson',start)
if start<0 or end<0:
    raise SystemExit('createLessonFromPhoto boundary not found')
fn=text[start:end]
needle='  await loadLessons();'
if fn.count(needle)!=1:
    raise SystemExit(f'Expected exactly one loadLessons in createLessonFromPhoto, found {fn.count(needle)}')
save='''  if(document.getElementById('photoSaveOriginal')?.checked&&photoLessonSelectedFile&&window.saveLessonSourcePhoto){\n    try{\n      await window.saveLessonSourcePhoto(created.data.id,photoLessonSelectedFile);\n    }catch(error){\n      console.error('Source photo save error:',error);\n      showMessage('Les is gemaakt, maar de bronfoto kon niet worden opgeslagen.','error');\n    }\n  }\n'''
fn=fn.replace(needle,save+needle,1)
text=text[:start]+fn+text[end:]

# Directly attach existing-lesson photo UI to the real showLesson function.
pattern=r'(function showLesson\(\)\{.*?)(\}\nfunction goBack\(\))'
m=re.search(pattern,text,re.S)
if not m:
    raise SystemExit('showLesson boundary not found')
if 'syncLessonPhotoUi(currentLesson?.id)' in m.group(1):
    raise SystemExit('showLesson photo integration already present')
show_fn=m.group(1)+'\nwindow.syncLessonPhotoUi(currentLesson?.id);\n'+m.group(2)
text=text[:m.start()]+show_fn+text[m.end():]

p.write_text(text,encoding='utf-8')
PY

grep -q '<!-- PacoGO TEST V4.74 -->' index.html
grep -q 'id="photoSaveOriginal"' index.html
grep -q 'window.saveLessonSourcePhoto(created.data.id,photoLessonSelectedFile)' index.html
grep -q 'window.syncLessonPhotoUi(currentLesson?.id)' index.html

echo 'PacoGO TEST V4.74 direct source photo integration verified.'