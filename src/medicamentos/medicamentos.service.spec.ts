import { MedicamentosService } from './medicamentos.service.js';
import type { PrismaService } from '../database/prisma.service.js';

describe('MedicamentosService', () => {
  it('normaliza indicações nulas sem alterar o conteúdo da fonte', async () => {
    const original = [
      { id: 'local-1', nome: 'AAS', indicacoes: null },
      { id: 'local-2', nome: 'Outro', indicacoes: 'Texto da fonte\t' },
    ];
    const prisma = {
      medicamento: { findMany: vi.fn().mockResolvedValue(original) },
    };
    const service = new MedicamentosService(prisma as unknown as PrismaService);
    expect(await service.listar()).toEqual({
      medicamentos: [
        { id: 'local-1', nome: 'AAS', indicacoes: '' },
        { id: 'local-2', nome: 'Outro', indicacoes: 'Texto da fonte\t' },
      ],
    });
    expect(original[0].indicacoes).toBeNull();
  });

  it('propaga falhas do banco sem apresentá-las como uma lista vazia', async () => {
    const error = new Error('Banco indisponível');
    const prisma = {
      medicamento: { findMany: vi.fn().mockRejectedValue(error) },
    };
    const service = new MedicamentosService(prisma as unknown as PrismaService);
    await expect(service.listar()).rejects.toBe(error);
  });
});
