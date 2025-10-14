import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateLineaDto {
  @ApiProperty({ type: String, example: 'Nombre de la línea' })
  @IsString()
  nombre: string;
}