// src/producto/dto/create-producto.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsNumber, IsPositive, Min, ValidateNested} from "class-validator";
import { Linea } from "src/linea/entities/linea.entity";
import { Marca } from "src/marca/entities/marca.entity";

export class CreateProductoDto {
    @ApiProperty({example:'Zapatillas Azules', description:'Nombre del producto'})
    @IsString()
    @IsNotEmpty()
    nombre:string;

    @ApiProperty({example:'Zapatillas de running', description:'Descripcion del producto'})
    @IsString()
    @IsNotEmpty()
    descripcion:string;

    @ApiProperty({example:'100.99', description:'Precio del producto',minimum:0.1})
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @IsNotEmpty()
    precio:number;

    @ApiProperty({example:'10', description:'Cantidad del producto', minimum:1})
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @IsNotEmpty()
    stock:number;

    // @ApiProperty({example: 1, description: 'ID de la marca'})
    // @IsNumber()
    // @IsNotEmpty()
    // marcaId: number;

    // @ApiProperty({example: 1, description: 'ID de la línea (debe pertenecer a la marca seleccionada)'})
    // @IsNumber()
    // @IsNotEmpty()
    // lineaId: number;

    @Transform(({ value }) => new IdDTO(value), { toClassOnly: true })
    @ValidateNested()
    marcaId: Marca;

    @Transform(({ value }) => new IdDTO(value), { toClassOnly: true })
    @ValidateNested()
    lineaId: Linea;
}


class IdDTO {
    constructor(id: number) {
        this.id = id;
    }
    @IsNumber()
    id: number;
}