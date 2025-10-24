import { IsNotEmpty, IsString, MaxLength, IsNumber } from 'class-validator';

export class CreateClienteDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(50)
	nombre: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(50)
	apellido: string;

	@IsNotEmpty()
	@IsString()
	num_documento: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(50)
	telefono: string;

	@IsNotEmpty()
    @IsNumber()
	tipo_documento: number;
}
