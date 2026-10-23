import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeSnapshot, validatePayload, validateSnapshot } from './detecta-data.mjs';

function fixture() {
  const a = { id: 1, nome: 'A', indicacoes: '' };
  const b = { id: 2, nome: 'B', indicacoes: '' };
  const interaction = { id: 7, medicamento1: a, medicamento2: b,
    mecanismo_efeito: 'Texto original\t', recomendacoes: 'Recomendação original', acao: '' };
  return { medicamentos: [
    { ...a, interacoes: [structuredClone(interaction)] },
    { ...b, interacoes: [structuredClone(interaction)] },
  ] };
}

test('deduplicates repeated source IDs without changing clinical text or filling empty actions', () => {
  const result = validatePayload(fixture());
  assert.equal(result.interactions.length, 1);
  assert.equal(result.interactions[0].mecanismo_efeito, 'Texto original\t');
  assert.equal(result.interactions[0].acao, '');
  assert.equal(result.warnings.length, 1);
});

test('rejects conflicting copies instead of silently choosing one', () => {
  const payload = fixture();
  payload.medicamentos[1].interacoes[0].recomendacoes = 'Outro texto';
  assert.throws(() => validatePayload(payload), /cópias divergentes/);
});

test('preserves an empty recommendation supplied by the source and flags it', () => {
  const payload = fixture();
  for (const medicine of payload.medicamentos) medicine.interacoes[0].recomendacoes = '';
  const result = validatePayload(payload);
  assert.equal(result.interactions[0].recomendacoes, '');
  assert.ok(result.warnings.some(warning => warning.includes('recomendacoes vazio')));
});

test('rejects missing medicine references', () => {
  const payload = fixture();
  payload.medicamentos.pop();
  assert.throws(() => validatePayload(payload), /referência divergente ou ausente/);
});

test('rejects truncated clinical records and duplicate medicine IDs', () => {
  const payload = fixture();
  delete payload.medicamentos[0].interacoes[0].recomendacoes;
  assert.throws(() => validatePayload(payload), /recomendacoes inválido/);
  const duplicate = fixture();
  duplicate.medicamentos.push(duplicate.medicamentos[0]);
  assert.throws(() => validatePayload(duplicate), /ID de medicamento repetido/);
});

test('rejects a modified snapshot and unexpected source', () => {
  const snapshot = makeSnapshot(fixture());
  assert.equal(validateSnapshot(snapshot).interactions.length, 1);
  snapshot.payload.medicamentos[0].nome = 'Alterado';
  assert.throws(() => validateSnapshot(snapshot), /Hash/);
  snapshot.endpoint = 'https://example.com';
  assert.throws(() => validateSnapshot(snapshot), /Origem/);
});
