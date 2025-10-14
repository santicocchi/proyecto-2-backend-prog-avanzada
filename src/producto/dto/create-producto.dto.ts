import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, IsPositive, Min} from "class-validator";

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

    @ApiProperty({example: 1, description: 'ID de la marca'})
    @IsNumber()
    @IsNotEmpty()
    marcaId: number;

    @ApiProperty({example: 1, description: 'ID de la línea (debe pertenecer a la marca seleccionada)'})
    @IsNumber()
    @IsNotEmpty()
    lineaId: number;
}
