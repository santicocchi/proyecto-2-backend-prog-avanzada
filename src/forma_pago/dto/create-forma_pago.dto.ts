import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateFormaPagoDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  nombre: string;
}