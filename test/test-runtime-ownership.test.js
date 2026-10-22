import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const runtimePath = path.resolve(__dirname, '../src/features/lessons/test-runtime.js');
const source = fs.readFileSync(runtimePath, 'utf8');

test('toets uses the shared practice presentation', () => {
  assert.match(source, /import \{ createPracticePresentation \} from '\.\/practice-presentation\.js';/);
  assert.match(source, /createPracticePresentation\(/);
  assert.match(source, /practiceMode: 'assessment'/);
  assert.doesNotMatch(source, /createProfessionalPlayerBridge/);
  assert.doesNotMatch(source, /backLabel/);
  assert.doesNotMatch(source, /backAction/);
});
