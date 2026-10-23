import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { MedicamentosModule } from './../src/medicamentos/medicamentos.module.js';
import { PrismaService } from './../src/database/prisma.service.js';

describe('GET /medicamentos', () => {
  let app: INestApplication<App>;
  const findMany = vi.fn();

  beforeEach(async () => {
    findMany.mockReset();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MedicamentosModule],
    })
      .overrideProvider(PrismaService)
      .useValue({ medicamento: { findMany } })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('expõe a listagem no contrato usado pelo aplicativo', () => {
    findMany.mockResolvedValue([
      { id: 'local-1', nome: 'AAS', indicacoes: null },
    ]);
    return request(app.getHttpServer())
      .get('/medicamentos')
      .expect(200)
      .expect({
        medicamentos: [{ id: 'local-1', nome: 'AAS', indicacoes: '' }],
      });
  });

  it('retorna lista vazia com sucesso quando não há medicamentos', () => {
    findMany.mockResolvedValue([]);
    return request(app.getHttpServer())
      .get('/medicamentos')
      .expect(200)
      .expect({ medicamentos: [] });
  });

  afterEach(async () => {
    await app?.close();
  });
});
