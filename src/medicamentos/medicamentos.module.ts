import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module.js';
import { MedicamentosController } from './medicamentos.controller.js';
import { MedicamentosService } from './medicamentos.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [MedicamentosController],
  providers: [MedicamentosService],
})
export class MedicamentosModule {}
