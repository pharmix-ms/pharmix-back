import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Injectable()
export class PacienteService {
  create(CreatePatientDto: CreatePatientDto) {
    return 'This action adds a new paciente';
  }

  findAll() {
    return `This action returns all paciente`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paciente`;
  }

  update(id: number, updatePacienteDto: UpdatePacienteDto) {
    return `This action updates a #${id} paciente`;
  }

  remove(id: number) {
    return `This action removes a #${id} paciente`;
  }
}
