import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Input a valid email' })
  @IsNotEmpty({ message: 'Email field cant be empty' })
  email: string;
}
