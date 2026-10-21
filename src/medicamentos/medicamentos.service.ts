import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import type { MedicamentosResponseDto } from './dto/medicamentos-response.dto.js';

@Injectable()
export class MedicamentosService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async listar(): Promise<MedicamentosResponseDto> {
    const medicamentos = await this.prisma.medicamento.findMany({
      select: { id: true, nome: true, indicacoes: true },
      orderBy: [{ nome: 'asc' }, { id: 'asc' }],
    });
    return {
      medicamentos: medicamentos.map((medicamento) => ({
        ...medicamento,
        indicacoes: medicamento.indicacoes ?? '',
      })),
    };
  }
}
