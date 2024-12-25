import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class NewPasswordDto {
  @IsString({ message: 'Password should be a string' })
  @MinLength(6, { message: 'Password should contain at least 6 symbols' })
  @IsNotEmpty({ message: 'Field cant be empty' })
  password: string;
}
