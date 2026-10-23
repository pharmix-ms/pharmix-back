import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MedicamentosResponseDto } from './dto/medicamentos-response.dto.js';
import { MedicamentosService } from './medicamentos.service.js';

@ApiTags('Medicamentos')
@Controller('medicamentos')
export class MedicamentosController {
  constructor(
    @Inject(MedicamentosService)
    private readonly medicamentosService: MedicamentosService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista os medicamentos em ordem alfabética' })
  @ApiOkResponse({ type: MedicamentosResponseDto })
  listar(): Promise<MedicamentosResponseDto> {
    return this.medicamentosService.listar();
  }
}
