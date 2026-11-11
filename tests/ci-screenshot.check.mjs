import {test} from 'node:test';
import assert from 'node:assert/strict';
import {screenshotOutputName} from './ci-screenshot.mjs';

test('correctly labeled captures retain their filename', () => {
  for (const width of [320,390,430,768]) {
    const file = `chapter-eighteen-guardian-${width}.png`;
    assert.equal(screenshotOutputName({file,width,height:844}), file);
  }
});
test('the historical dual-blade capture is labeled with its actual 768px width', () => {
  assert.equal(screenshotOutputName({file:'chapter-eighteen-new-duals-action-390.png',width:768,height:1024}), 'chapter-eighteen-new-duals-action-768.png');
});
test('unrelated or unexpected dimensions still fail validation', () => {
  assert.throws(() => screenshotOutputName({file:'chapter-eighteen-guardian-390.png',width:768,height:1024}));
  assert.throws(() => screenshotOutputName({file:'chapter-eighteen-new-duals-action-390.png',width:430,height:844}));
});
