import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTipoDocumentoDto {

    @ApiProperty({ example: 'DNI', description: 'Nombre del tipo de documento' })
    @IsString()
    @IsNotEmpty()
    nombre: string;
    
}
