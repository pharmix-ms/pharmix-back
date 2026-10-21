import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import type { InteracoesResponseDto } from './dto/interacoes-response.dto.js';

const medicineSelect = { id: true, nome: true, indicacoes: true } as const;

@Injectable()
export class InteracoesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async consultar(query: unknown): Promise<InteracoesResponseDto> {
    if (typeof query !== 'string' || query.length > 4096) {
      throw new BadRequestException(
        'Informe nomes separados por vírgula (entre 2 e 50 medicamentos distintos).',
      );
    }
    const parts = query.split(',').map((name) => name.trim());
    const names = [
      ...new Map(parts.map((name) => [name.toLowerCase(), name])).values(),
    ];
    if (
      parts.some((name) => !name || name.length > 200) ||
      names.length < 2 ||
      names.length > 50
    ) {
      throw new BadRequestException(
        'Informe entre 2 e 50 medicamentos distintos, sem nomes vazios (máximo de 200 caracteres por nome).',
      );
    }

    const medicines = await this.prisma.medicamento.findMany({
      where: {
        OR: names.map((nome) => ({
          nome: { equals: nome, mode: 'insensitive' as const },
        })),
      },
      select: medicineSelect,
    });
    const foundNames = new Set(medicines.map((m) => m.nome.toLowerCase()));
    const missing = names.filter((name) => !foundNames.has(name.toLowerCase()));
    if (missing.length) {
      throw new NotFoundException({
        code: 'MEDICAMENTOS_NAO_ENCONTRADOS',
        message: `Medicamentos não encontrados na base: ${missing.join(', ')}.`,
        medicamentosNaoEncontrados: missing,
      });
    }

    const ids = medicines.map((m) => m.id);
    const interactions = await this.prisma.interacao.findMany({
      where: { medicamento1Id: { in: ids }, medicamento2Id: { in: ids } },
      select: {
        id: true,
        medicamento1: { select: medicineSelect },
        medicamento2: { select: medicineSelect },
        mecanismoEfeito: true,
        recomendacoes: true,
        acao: true,
      },
      orderBy: { id: 'asc' },
    });
    return {
      interacoes: interactions.map((i) => ({
        id: i.id,
        medicamento1: {
          ...i.medicamento1,
          indicacoes: i.medicamento1.indicacoes ?? '',
        },
        medicamento2: {
          ...i.medicamento2,
          indicacoes: i.medicamento2.indicacoes ?? '',
        },
        mecanismo_efeito: i.mecanismoEfeito,
        recomendacoes: i.recomendacoes,
        acao: i.acao,
      })),
    };
  }
}
