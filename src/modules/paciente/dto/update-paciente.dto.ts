import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientDto } from './create-paciente.dto';

export class UpdatePacienteDto extends PartialType(CreatePatientDto) {}
