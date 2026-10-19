import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { templateSources, bindText } from '../src/components/templates.js';

test('las pantallas y componentes tienen plantillas HTML con identificadores únicos', async () => {
  const sources = await Promise.all(templateSources.map(url => readFile(url, 'utf8')));
  const ids = sources.flatMap(source => [...source.matchAll(/<template id="([^"]+)"/g)].map(match => match[1]));
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ['page-login', 'page-panel', 'recent-content-item', 'page-company', 'page-products', 'page-product', 'page-generator', 'page-result', 'page-history', 'page-detail', 'page-requirements', 'page-processing', 'page-generation-error', 'page-no-result', 'page-review', 'page-version', 'page-campaigns', 'page-campaign', 'page-results', 'app-shell', 'auth-shell', 'context-panel', 'content-reader']) {
    assert.ok(ids.includes(id), `Falta la plantilla ${id}`);
  }
  assert.ok(sources.every(source => !source.includes('<script')));
});

test('los datos se asignan como texto, sin interpretar HTML', () => {
  const title = { dataset: { bind: 'title' }, textContent: '' };
  const untouched = { dataset: { bind: 'other' }, textContent: 'Texto estático' };
  const root = { querySelectorAll: () => [title, untouched] };
  const value = '<img src=x onerror=alert(1)>';
  assert.equal(bindText(root, { title: value }), root);
  assert.equal(title.textContent, value);
  assert.equal(untouched.textContent, 'Texto estático');
});

test('JavaScript ya no construye las pantallas mediante cadenas HTML', async () => {
  for (const file of ['../src/app.js', '../src/pages/views.js', '../src/components/ui.js']) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /innerHTML|insertAdjacentHTML|<\/?(?:div|form|input|main|section|header|button)\b/);
  }
});
