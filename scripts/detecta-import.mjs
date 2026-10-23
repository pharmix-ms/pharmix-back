import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { DEFAULT_FILE, SOURCE, validateSnapshot } from './detecta-data.mjs';

async function main() {
  const args = process.argv.slice(2);
  if (args.some(arg => arg !== '--apply')) throw new Error('Argumento desconhecido. Use apenas --apply para gravar.');
  const snapshot = JSON.parse(await readFile(DEFAULT_FILE, 'utf8'));
  const { medicines, interactions, warnings } = validateSnapshot(snapshot);
  console.log(`${medicines.length} medicamentos; ${interactions.length} interações únicas.`);
  warnings.forEach(warning => console.warn(warning));
  if (!args.includes('--apply')) {
    console.log('Validação concluída. Nenhuma gravação no banco.');
    return;
  }
  if (!process.env.DATABASE_URL) throw new Error('Configure DATABASE_URL');
  const databaseProtocol = new URL(process.env.DATABASE_URL).protocol;
  if (!['postgres:', 'postgresql:'].includes(databaseProtocol)) {
    throw new Error('O adapter PrismaPg requer DATABASE_URL PostgreSQL TCP (postgresql://). A URL prisma+postgres:// não é compatível.');
  }
  const { PrismaClient } = await import('../dist/generated/prisma/client.js');
  const { PrismaPg } = await import('@prisma/adapter-pg');
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  const collectedAt = new Date(snapshot.fetchedAt);
  const provenance = {
    endpoint: snapshot.endpoint, fetchedAt: snapshot.fetchedAt, sha256: snapshot.sha256,
    attribution: snapshot.attribution, license: snapshot.license, reference: snapshot.reference,
  };
  try {
    await prisma.$transaction(async tx => {
      // Serializes concurrent imports of this source, including medicine creation.
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(171021, 1)`;
      const localIds = new Map();
      for (const medicine of medicines) {
        const { interacoes: _interactions, ...originalMedicine } = medicine;
        const existing = await tx.medicamentoFonte.findUnique({
          where: { fonte_codigoExterno: { fonte: SOURCE, codigoExterno: String(medicine.id) } },
        });
        const data = { nome: medicine.nome, indicacoes: medicine.indicacoes };
        const local = existing
          ? await tx.medicamento.update({ where: { id: existing.medicamentoId }, data })
          : await tx.medicamento.create({ data });
        await tx.medicamentoFonte.upsert({
          where: { fonte_codigoExterno: { fonte: SOURCE, codigoExterno: String(medicine.id) } },
          create: {
            fonte: SOURCE, codigoExterno: String(medicine.id), medicamentoId: local.id,
            dadosOriginais: { ...provenance, registro: originalMedicine }, importadoEm: collectedAt,
          },
          update: { dadosOriginais: { ...provenance, registro: originalMedicine }, importadoEm: collectedAt },
        });
        localIds.set(medicine.id, local.id);
      }
      for (const interaction of interactions) {
        const data = {
          medicamento1Id: localIds.get(interaction.medicamento1.id),
          medicamento2Id: localIds.get(interaction.medicamento2.id),
          mecanismoEfeito: interaction.mecanismo_efeito,
          recomendacoes: interaction.recomendacoes,
          acao: interaction.acao,
          dadosOriginais: { ...provenance, registro: interaction },
          importadoEm: collectedAt,
        };
        await tx.interacao.upsert({
          where: { fonte_codigoExterno: { fonte: SOURCE, codigoExterno: String(interaction.id) } },
          create: { fonte: SOURCE, codigoExterno: String(interaction.id), ...data }, update: data,
        });
      }
    }, { timeout: 180_000, maxWait: 10_000 });
    const counts = await prisma.$transaction([
      prisma.medicamentoFonte.count({ where: { fonte: SOURCE } }),
      prisma.interacao.count({ where: { fonte: SOURCE } }),
    ]);
    console.log(`Importação concluída. Na fonte: ${counts[0]} medicamentos; ${counts[1]} interações.`);
  } catch (error) {
    throw new Error(`Falha ao importar ou verificar o banco${error.code ? ` (${error.code})` : ''}. Consulte o estado da carga antes de repetir.`);
  } finally {
    await prisma.$disconnect();
  }
}

// Do not print connection errors verbatim: some contain credentials or host details.
main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
