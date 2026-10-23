import { ApiProperty } from '@nestjs/swagger';

export class MedicamentoResponseDto {
  @ApiProperty({
    description: 'Identificador local do medicamento',
    example: 'cmpharmix001',
  })
  id: string;

  @ApiProperty({ example: 'AAS' })
  nome: string;

  @ApiProperty({
    description: 'Texto informado pela fonte; vazio quando não disponível',
    example: '',
  })
  indicacoes: string;
}

export class MedicamentosResponseDto {
  @ApiProperty({ type: [MedicamentoResponseDto] })
  medicamentos: MedicamentoResponseDto[];
}
