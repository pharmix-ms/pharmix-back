import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { InteracoesModule } from '../src/interacoes/interacoes.module.js';
import { PrismaService } from '../src/database/prisma.service.js';

describe('GET /interacoes', () => {
  let app: INestApplication;
  const medicines = vi.fn();
  const interactions = vi.fn();
  const aas = { id: 'local-aas', nome: 'AAS', indicacoes: null };
  const varfarina = {
    id: 'local-varfarina',
    nome: 'Varfarina',
    indicacoes: '',
  };

  beforeEach(async () => {
    medicines.mockReset().mockResolvedValue([aas, varfarina]);
    interactions.mockReset().mockResolvedValue([]);
    const module = await Test.createTestingModule({
      imports: [InteracoesModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        medicamento: { findMany: medicines },
        interacao: { findMany: interactions },
      })
      .compile();
    app = module.createNestApplication();
    app.useLogger(false);
    await app.init();
  });

  afterEach(async () => {
    await app?.close();
  });

  it.each([
    '/interacoes',
    '/interacoes?nomes=AAS',
    '/interacoes?nomes=AAS,aas',
    '/interacoes?nomes=AAS,,Varfarina',
    '/interacoes?nomes=AAS&nomes=Varfarina',
    `/interacoes?nomes=${Array.from({ length: 51 }, (_, i) => `Nome${i}`).join(',')}`,
  ])('rejeita consulta inválida: %s', async (path) => {
    await request(app.getHttpServer()).get(path).expect(400);
    expect(medicines).not.toHaveBeenCalled();
    expect(interactions).not.toHaveBeenCalled();
  });

  it('retorna nomes ausentes como erro sem fazer uma análise parcial', async () => {
    medicines.mockResolvedValue([aas]);
    const response = await request(app.getHttpServer())
      .get('/interacoes?nomes=AAS,Desconhecido')
      .expect(404);
    expect(response.body.code).toBe('MEDICAMENTOS_NAO_ENCONTRADOS');
    expect(response.body.medicamentosNaoEncontrados).toEqual(['Desconhecido']);
    expect(interactions).not.toHaveBeenCalled();
  });

  it('aceita espaços, variação de caixa e nomes repetidos sem duplicar a seleção', async () => {
    interactions.mockResolvedValue([
      {
        id: 'interacao-1',
        medicamento1: varfarina,
        medicamento2: aas,
        mecanismoEfeito: 'Texto original\t',
        recomendacoes: '',
        acao: '',
      },
    ]);
    const response = await request(app.getHttpServer())
      .get('/interacoes')
      .query({ nomes: ' aas , Varfarina, AAS ' })
      .expect(200);
    expect(response.body).toEqual({
      interacoes: [
        {
          id: 'interacao-1',
          medicamento1: varfarina,
          medicamento2: { ...aas, indicacoes: '' },
          mecanismo_efeito: 'Texto original\t',
          recomendacoes: '',
          acao: '',
        },
      ],
    });
    expect(interactions.mock.calls[0][0].where).toEqual({
      medicamento1Id: { in: ['local-aas', 'local-varfarina'] },
      medicamento2Id: { in: ['local-aas', 'local-varfarina'] },
    });
  });

  it('retorna HTTP 200 e lista vazia apenas para medicamentos cadastrados sem registros', async () => {
    await request(app.getHttpServer())
      .get('/interacoes?nomes=AAS,Varfarina')
      .expect(200)
      .expect({ interacoes: [] });
  });

  it('retorna falha de servidor quando o banco falha, nunca uma lista vazia', async () => {
    interactions.mockRejectedValue(new Error('Banco indisponível'));
    await request(app.getHttpServer())
      .get('/interacoes?nomes=AAS,Varfarina')
      .expect(500);
  });
});
