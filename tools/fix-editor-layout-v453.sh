#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."
git config user.name "PacoGO Bot"
git config user.email "paco-go-bot@users.noreply.github.com"
git fetch origin test
git checkout -B test origin/test
python3 - <<'PY'
from pathlib import Path
import re, subprocess, tempfile
p=Path('index.html')
s=p.read_text()
assert '<!-- PacoGO TEST V4.64 -->' in s
blocks=re.findall(r'<script(?:\s[^>]*)?>(.*?)</script>',s,re.S|re.I)
if not blocks:
    raise SystemExit('ERROR: no inline script blocks found')
for i,code in enumerate(blocks,1):
    with tempfile.NamedTemporaryFile('w',suffix='.js',delete=False) as f:
        f.write(code)
        name=f.name
    r=subprocess.run(['node','--check',name],text=True,capture_output=True)
    if r.returncode:
        print(f'INLINE SCRIPT SYNTAX ERROR IN BLOCK {i}:')
        print(r.stdout)
        print(r.stderr)
        raise SystemExit(1)
print(f'JS SYNTAX CHECK OK: {len(blocks)} inline script blocks')
PY
