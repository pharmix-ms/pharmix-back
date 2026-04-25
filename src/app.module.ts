import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PacienteModule } from './modules/paciente/paciente.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PacienteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
