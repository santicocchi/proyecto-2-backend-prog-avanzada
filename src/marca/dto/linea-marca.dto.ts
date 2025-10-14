import { IsNumber } from "class-validator";

export class LineaMarcaDto {
    @IsNumber()
    lineaId: number;
}