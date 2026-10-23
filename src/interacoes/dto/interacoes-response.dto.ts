import { ApiProperty } from '@nestjs/swagger';
import { MedicamentoResponseDto } from '../../medicamentos/dto/medicamentos-response.dto.js';

export class InteracaoResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: MedicamentoResponseDto })
  medicamento1: MedicamentoResponseDto;

  @ApiProperty({ type: MedicamentoResponseDto })
  medicamento2: MedicamentoResponseDto;

  @ApiProperty()
  mecanismo_efeito: string;

  @ApiProperty()
  recomendacoes: string;

  @ApiProperty({ description: 'Texto da fonte; pode estar vazio' })
  acao: string;
}

export class InteracoesResponseDto {
  @ApiProperty({ type: [InteracaoResponseDto] })
  interacoes: InteracaoResponseDto[];
}
