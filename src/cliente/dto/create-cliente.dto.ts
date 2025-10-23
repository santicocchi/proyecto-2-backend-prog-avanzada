import { IsNotEmpty, IsString, MaxLength, IsOptional, IsNumber, MinLength } from 'class-validator';

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
	@MinLength(7)
	@MaxLength(10)
	num_documento: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(50)
	telefono: string;

	@IsNotEmpty()
    @IsNumber()
	tipo_documento: number;
}
