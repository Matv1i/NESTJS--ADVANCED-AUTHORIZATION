import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsString({ message: 'Invalid email.' })
  @IsEmail({}, { message: 'Invalid form of email' })
  @IsNotEmpty({ message: 'Email not required' })
  email: string;

  @IsString({ message: 'Password should be a string' })
  @IsNotEmpty({ message: 'Password can not be empty' })
  @MinLength(6, { message: 'Password is not required' })
  password: string;

  @IsOptional()
  @IsString()
  code: string;
}
