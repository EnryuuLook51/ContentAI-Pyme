import test from 'node:test';
import assert from 'node:assert/strict';
import { STORAGE_KEY, initialState, loadState, saveState, hasRequirements, createExample } from '../src/data/store.js';

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
