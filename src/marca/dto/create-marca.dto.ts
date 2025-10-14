import { IsNotEmpty, IsOptional, IsString, IsArray, ArrayUnique, IsInt } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMarcaDto {
    
    @ApiProperty({example:'Adidas', description:'Nombre de la marca'})
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({example:'[1,2,3]', description:'IDs de las líneas asociadas a la marca', required:false})
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsInt({ each: true })
    lineas?: number[];
}
