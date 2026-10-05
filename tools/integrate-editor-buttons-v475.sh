#!/usr/bin/env bash
set -euo pipefail

python3 - <<'PY'
from pathlib import Path

p=Path('index.html')
text=p.read_text(encoding='utf-8')

if '<!-- PacoGO TEST V4.74 -->' not in text:
    raise SystemExit('Expected V4.74 marker not found')
text=text.replace('<!-- PacoGO TEST V4.74 -->','<!-- PacoGO TEST V4.75 -->',1)

old_buttons='''<div class="editor-action-row"><button class="secondary" type="button" onclick="showPhotoLesson()">📸 MAAK LES VAN FOTO</button><button class="success" type="button" onclick="saveLesson()">💾 Les opslaan</button></div>'''
new_buttons='''<div class="editor-action-row"><button class="success" type="button" onclick="saveLesson()">💾 Les opslaan</button><button class="secondary" type="button" onclick="showPhotoLesson()">📸 MAAK LES VAN FOTO</button></div>'''
if text.count(old_buttons) != 1:
    raise SystemExit(f'Expected exactly one editor action row, found {text.count(old_buttons)}')
text=text.replace(old_buttons,new_buttons,1)

old_layout='.editor-action-row{display:flex;justify-content:flex-end;margin-bottom:4px}'
new_layout='.editor-action-row{display:flex;justify-content:space-between;margin-bottom:4px}'
if text.count(old_layout) != 1:
    raise SystemExit(f'Expected exactly one editor action layout rule, found {text.count(old_layout)}')
text=text.replace(old_layout,new_layout,1)

old_success='.editor-action-row .success{margin-left:auto}'
new_success='.editor-action-row .success{margin-left:0}'
if text.count(old_success) != 1:
    raise SystemExit(f'Expected exactly one editor success alignment rule, found {text.count(old_success)}')
text=text.replace(old_success,new_success,1)

p.write_text(text,encoding='utf-8')
PY

grep -q '<!-- PacoGO TEST V4.75 -->' index.html
grep -q '<div class="editor-action-row"><button class="success" type="button" onclick="saveLesson()">💾 Les opslaan</button><button class="secondary" type="button" onclick="showPhotoLesson()">📸 MAAK LES VAN FOTO</button></div>' index.html
grep -q '.editor-action-row{display:flex;justify-content:space-between;margin-bottom:4px}' index.html
grep -q '.editor-action-row .success{margin-left:0}' index.html

echo 'PacoGO TEST V4.75 editor button integration verified.'
