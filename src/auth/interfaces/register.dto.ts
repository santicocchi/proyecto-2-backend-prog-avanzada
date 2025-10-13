import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator"

export class RegisterDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/, {
    message: 'La contraseña debe tener mínimo 8 caracteres, incluir mayúsculas, minúsculas, un número y un caracter especial.'
  })
  password: string
}
