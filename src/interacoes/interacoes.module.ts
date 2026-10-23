import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module.js';
import { InteracoesController } from './interacoes.controller.js';
import { InteracoesService } from './interacoes.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [InteracoesController],
  providers: [InteracoesService],
})
export class InteracoesModule {}
