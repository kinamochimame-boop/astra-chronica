import assert from 'node:assert/strict';

/** Preserve old CI receipts while correcting one proven capture-label typo. */
export function screenshotOutputName(capture) {
  const match = capture.file.match(/-(320|390|430|768)\.png$/);
  if (!match || Number(match[1]) === capture.width) return capture.file;
  assert.equal(capture.file, 'chapter-eighteen-new-duals-action-390.png', 'Unexpected screenshot width mismatch');
  assert.equal(capture.width, 768);
  assert.equal(capture.height, 1024);
  return 'chapter-eighteen-new-duals-action-768.png';
}
