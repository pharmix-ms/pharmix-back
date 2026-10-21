import { Controller, Get, Inject, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { InteracoesResponseDto } from './dto/interacoes-response.dto.js';
import { InteracoesService } from './interacoes.service.js';

@ApiTags('Interações')
@Controller('interacoes')
export class InteracoesController {
  constructor(
    @Inject(InteracoesService) private readonly service: InteracoesService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Consulta interações entre os medicamentos informados',
    description:
      'Busca por nome exato, ignorando maiúsculas e minúsculas. Uma lista vazia indica apenas ausência de registros na base consultada.',
  })
  @ApiQuery({
    name: 'nomes',
    required: true,
    type: String,
    example: 'AAS,Varfarina',
  })
  @ApiOkResponse({ type: InteracoesResponseDto })
  @ApiBadRequestResponse({
    description: 'Lista inválida; informe de 2 a 50 nomes distintos',
  })
  @ApiNotFoundResponse({
    description:
      'Um ou mais medicamentos não estão cadastrados; código MEDICAMENTOS_NAO_ENCONTRADOS',
  })
  consultar(@Query('nomes') nomes: unknown): Promise<InteracoesResponseDto> {
    return this.service.consultar(nomes);
  }
}
