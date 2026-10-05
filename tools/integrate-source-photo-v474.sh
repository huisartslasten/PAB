#!/usr/bin/env bash
set -euo pipefail

python3 - <<'PY'
from pathlib import Path

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
if start<0:
    raise SystemExit('createLessonFromPhoto start not found')
end=text.find('\nfunction ',start+len('async function createLessonFromPhoto(){'))
if end<0:
    raise SystemExit('createLessonFromPhoto end boundary not found')
fn=text[start:end]
needle="  currentLesson=lessons.find(l=>Number(l.id)===Number(created.data.id))||null;"
if fn.count(needle)!=1:
    raise SystemExit(f'Expected exactly one created-lesson assignment, found {fn.count(needle)}')
save='''  if(document.getElementById('photoSaveOriginal')?.checked&&photoLessonSelectedFile&&window.saveLessonSourcePhoto){\n    try{\n      await window.saveLessonSourcePhoto(created.data.id,photoLessonSelectedFile);\n    }catch(error){\n      console.error('Source photo save error:',error);\n      showMessage('Les is gemaakt, maar de bronfoto kon niet worden opgeslagen.','error');\n    }\n  }\n'''
if 'window.saveLessonSourcePhoto(created.data.id,photoLessonSelectedFile)' not in fn:
    fn=fn.replace(needle,needle+'\n'+save,1)
text=text[:start]+fn+text[end:]

# Directly attach existing-lesson photo UI to the real showLesson function.
show_start=text.find('function showLesson(){')
if show_start<0:
    raise SystemExit('showLesson start not found')
go_back=text.find('\nfunction ',show_start+len('function showLesson(){'))
if go_back<0:
    raise SystemExit('showLesson end boundary not found')
show_fn=text[show_start:go_back]
if 'window.syncLessonPhotoUi(currentLesson?.id)' not in show_fn:
    close=show_fn.rfind('}')
    if close<0:
        raise SystemExit('showLesson closing brace not found')
    show_fn=show_fn[:close]+'\nwindow.syncLessonPhotoUi(currentLesson?.id);\n'+show_fn[close:]
    text=text[:show_start]+show_fn+text[go_back:]

p.write_text(text,encoding='utf-8')
PY

grep -q '<!-- PacoGO TEST V4.74 -->' index.html
grep -q 'id="photoSaveOriginal"' index.html
grep -q 'window.saveLessonSourcePhoto(created.data.id,photoLessonSelectedFile)' index.html
grep -q 'window.syncLessonPhotoUi(currentLesson?.id)' index.html

echo 'PacoGO TEST V4.74 direct source photo integration verified.'
