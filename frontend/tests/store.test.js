import test from 'node:test';
import assert from 'node:assert/strict';
import { STORAGE_KEY, initialState, loadState, saveState, hasRequirements, createExample, CONTENT_TYPES, saveVersion, filterContents, getProfileProgress } from '../src/data/store.js';

test('el estado inicial es independiente y cumple los requisitos', () => {
  const state = loadState(null);
  assert.ok(hasRequirements(state));
  state.company.name = '';
  assert.equal(hasRequirements(state), false);
  assert.equal(initialState.company.name, 'TecnoBarrio');
});

test('el guardado local puede recuperarse sin perder datos', () => {
  const data = new Map();
  const storage = { setItem: (key, value) => data.set(key, value), getItem: key => data.get(key) };
  assert.equal(saveState(storage, initialState), true);
  assert.deepEqual(loadState(storage), initialState);
  data.set(STORAGE_KEY, '{invalido');
  assert.deepEqual(loadState(storage), initialState);
  assert.equal(saveState(null, initialState), false);
});

test('la publicación conserva una copia del contexto utilizado', () => {
  const state = structuredClone(initialState);
  const content = createExample(state.company, state.products[0], 'Conseguir consultas');
  assert.match(content.text, /TecnoBarrio/);
  state.company.name = 'Otro negocio';
  assert.equal(content.company.name, 'TecnoBarrio');
  assert.equal(content.type, 'Publicación para redes sociales');
  assert.ok(content.id);
});

test('sin productos o público no se cumplen los requisitos de generación', () => {
  const state = structuredClone(initialState);
  state.products = [];
  assert.equal(hasRequirements(state), false);
  state.products = initialState.products;
  state.company.audience = '   ';
  assert.equal(hasRequirements(state), false);
});

test('todos los formatos tienen resultados ilustrativos y contexto independiente', () => {
  for (const type of CONTENT_TYPES) {
    const campaign = { id: 'campana', name: 'Campaña ficticia', channelIds: ['correo'] };
    const content = createExample(initialState.company, initialState.products[0], 'Conseguir consultas', { type, campaign });
    assert.equal(content.type, type);
    assert.ok(content.text.trim());
    assert.equal(content.status, 'Borrador');
    assert.equal(content.versions[0].text, content.text);
    campaign.name = 'Cambio';
    assert.equal(content.campaign.name, 'Campaña ficticia');
  }
});

test('editar conserva la versión original y devuelve el contenido a borrador', () => {
  const content = createExample(initialState.company, initialState.products[0], 'Conseguir consultas');
  const original = content.text;
  content.status = 'Aprobado';
  saveVersion(content, 'Texto revisado');
  assert.equal(content.versions.length, 2);
  assert.equal(content.versions[0].text, original);
  assert.equal(content.versions[1].text, 'Texto revisado');
  assert.equal(content.status, 'Borrador');
});

test('biblioteca filtra por texto, formato, estado y campaña', () => {
  const content = createExample(initialState.company, initialState.products[0], 'Conseguir consultas', { type: 'Correo comercial', campaign: { id: 'campana' } });
  content.status = 'Aprobado';
  assert.equal(filterContents([content], { search: 'TECNO', type: 'Correo comercial', status: 'Aprobado', campaign: 'campana' }).length, 1);
  assert.equal(filterContents([content], { status: 'Descartado' }).length, 0);
});

test('el estado antiguo se amplía sin perder los contenidos existentes', () => {
  const old = { company: initialState.company, products: initialState.products, contents: [{ id: 'antiguo', text: 'Original', createdAt: '2026-10-18T12:00:00Z' }] };
  const state = loadState({ getItem: () => JSON.stringify(old) });
  assert.equal(state.contents[0].text, 'Original');
  assert.equal(state.contents[0].versions[0].text, 'Original');
  assert.equal(state.contents[0].status, 'Borrador');
  assert.deepEqual(state.campaigns, []);
});

test('el avance del panel se calcula con datos guardados, sin exigir campos opcionales', () => {
  const state = structuredClone(initialState);
  assert.equal(getProfileProgress(state).completed, 4);
  state.company.audience = '';
  state.company.tone = '';
  assert.equal(getProfileProgress(state).completed, 2);
  assert.deepEqual(getProfileProgress(state).sections, { company: true, products: true, audience: false, brand: false });
  state.company.name = '';
  state.products = [];
  assert.equal(getProfileProgress(state).completed, 0);
});
