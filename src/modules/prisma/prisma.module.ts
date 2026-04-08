import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 🔥 deixa global (não precisa importar em todo lugar)
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
