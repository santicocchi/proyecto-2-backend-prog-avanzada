import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidarCuitPipe implements PipeTransform {
  transform(value: any) {
    if (!value) throw new BadRequestException('El CUIT no puede estar vacío.');

    const cuit = value.replace(/[^0-9]/g, ''); // quitamos guiones y espacios

    if (!/^\d{11}$/.test(cuit)) {
      throw new BadRequestException(
        `El CUIT '${value}' debe tener 11 dígitos numéricos.`,
      );
    }

    if (!this.esCuitValido(cuit)) {
      throw new BadRequestException(`El CUIT '${value}' no es válido.`);
    }

    return value; // devolvemos el valor original (puede incluir guiones si lo deseas)
  }

  private esCuitValido(cuit: string): boolean {
    const coeficientes = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    const digitos = cuit.split('').map(Number);
    const verificador = digitos.pop()!;
    const total = digitos.reduce(
      (acc, d, i) => acc + d * coeficientes[i],
      0,
    );
    const resto = total % 11;
    const resultado = resto === 0 ? 0 : resto === 1 ? 9 : 11 - resto;
    return resultado === verificador;
  }
}
