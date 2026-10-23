import { createHash } from 'node:crypto';

export const SOURCE = 'detecta-interacoes';
export const ENDPOINT = 'https://imses.crfmg.org.br/api/medicamentos';
export const DEFAULT_FILE = 'data/detecta/base.json';

export function digest(payload) {
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

function requireValue(condition, message) {
  if (!condition) throw new Error(message);
}

function validateMedicine(medicine) {
  requireValue(medicine && Number.isSafeInteger(medicine.id) && medicine.id > 0,
    'Medicamento com ID inválido');
  requireValue(typeof medicine.nome === 'string' && medicine.nome.trim().length > 0,
    `Medicamento ${medicine.id}: nome ausente`);
  requireValue(typeof medicine.indicacoes === 'string',
    `Medicamento ${medicine.id}: indicações inválidas`);
}

export function validatePayload(payload) {
  requireValue(Array.isArray(payload?.medicamentos) && payload.medicamentos.length > 0,
    'Resposta sem lista de medicamentos');
  const medicines = new Map();
  const interactions = new Map();
  for (const medicine of payload.medicamentos) {
    validateMedicine(medicine);
    requireValue(!medicines.has(medicine.id), `ID de medicamento repetido: ${medicine.id}`);
    requireValue(Array.isArray(medicine.interacoes), `Medicamento ${medicine.id}: interações ausentes`);
    medicines.set(medicine.id, medicine);
  }
  for (const medicine of medicines.values()) {
    for (const interaction of medicine.interacoes) {
      requireValue(interaction && Number.isSafeInteger(interaction.id) && interaction.id > 0,
        'Interação com ID inválido');
      for (const field of ['mecanismo_efeito', 'recomendacoes', 'acao']) {
        requireValue(typeof interaction[field] === 'string', `Interação ${interaction.id}: ${field} inválido`);
      }
      for (const field of ['medicamento1', 'medicamento2']) {
        const linked = interaction[field];
        validateMedicine(linked);
        const canonical = medicines.get(linked.id);
        requireValue(canonical && canonical.nome === linked.nome && canonical.indicacoes === linked.indicacoes,
          `Interação ${interaction.id}: referência divergente ou ausente (${linked.id})`);
      }
      requireValue(interaction.medicamento1.id !== interaction.medicamento2.id,
        `Interação ${interaction.id}: medicamentos iguais`);
      requireValue([interaction.medicamento1.id, interaction.medicamento2.id].includes(medicine.id),
        `Interação ${interaction.id}: não pertence ao medicamento ${medicine.id}`);
      const existing = interactions.get(interaction.id);
      requireValue(!existing || digest(existing) === digest(interaction),
        `Interação ${interaction.id}: cópias divergentes na origem`);
      interactions.set(interaction.id, interaction);
    }
  }
  requireValue(interactions.size > 0, 'Resposta sem interações: carga incompleta');
  return {
    medicines: [...medicines.values()],
    interactions: [...interactions.values()],
    warnings: [...interactions.values()].flatMap(i =>
      ['mecanismo_efeito', 'recomendacoes', 'acao'].filter(field => !i[field].trim()).map(field =>
        `Interação ${i.id}: ${field} vazio na origem; preservado sem inferência`)),
  };
}

export function makeSnapshot(payload) {
  validatePayload(payload);
  return {
    source: SOURCE,
    endpoint: ENDPOINT,
    fetchedAt: new Date().toISOString(),
    sha256: digest(payload),
    attribution: 'Detecta Interações — André Oliveira Baldoni; Anderson Fernandes de Oliveira Filho; Rafael Sachetto Oliveira (UFSJ)',
    license: 'CC BY-NC-SA 4.0',
    reference: 'https://doi.org/10.30968/rbfhss.2021.122.0568',
    payload,
  };
}

export function validateSnapshot(snapshot) {
  requireValue(snapshot?.source === SOURCE && snapshot.endpoint === ENDPOINT, 'Origem do snapshot inválida');
  requireValue(typeof snapshot.fetchedAt === 'string' && Number.isFinite(Date.parse(snapshot.fetchedAt)),
    'Data de coleta inválida');
  requireValue(snapshot.sha256 === digest(snapshot.payload), 'Hash do snapshot divergente');
  return validatePayload(snapshot.payload);
}
