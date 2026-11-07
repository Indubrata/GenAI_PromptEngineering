import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { extractTextFromPDF } from '../src/services/pdfParser.js';

test('extracts a real PDF Buffer and preserves resume content', async () => {
  const pdf = await readFile(new URL('../../tests/fixtures/sample-resume.pdf', import.meta.url));
  const text = await extractTextFromPDF(pdf);
  assert.match(text, /Alex Morgan/);
  assert.match(text, /Reduced API latency by 35%/);
  assert.doesNotMatch(text, /-- 1 of 1 --/);
});
test('rejects corrupt PDFs instead of passing them to AI', async () => {
  await assert.rejects(extractTextFromPDF(Buffer.from('%PDF-1.4\ncorrupt')), /Failed to parse PDF/);
});
test('rejects a valid PDF with no extractable text', async () => {
  const original = await readFile(new URL('../../tests/fixtures/sample-resume.pdf', import.meta.url));
  const pdf = original.toString().replace(/stream\n[\s\S]*?\nendstream/, match => {
    const contentLength = match.length - 'stream\n\nendstream'.length;
    return 'stream\n' + ' '.repeat(contentLength) + '\nendstream';
  });
  await assert.rejects(extractTextFromPDF(Buffer.from(pdf)), /empty|images/);
});
