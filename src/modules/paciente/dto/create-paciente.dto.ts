import {
  IsString,
  IsBoolean,
  IsArray,
  IsEnum,
  IsNumber,
} from 'class-validator';

export enum Gender {
  M = 'M',
  F = 'F',
  OTHER = 'Other',
}

export class CreatePatientDto {
  @IsNumber()
  age: number;

  @IsNumber()
  weight: number;

  @IsEnum(Gender)
  gender: Gender;

  @IsBoolean()
  isPregnant: boolean;

  @IsArray()
  @IsString({ each: true })
  conditions: string[];

  @IsArray()
  @IsString({ each: true })
  allergies: string[];
}
