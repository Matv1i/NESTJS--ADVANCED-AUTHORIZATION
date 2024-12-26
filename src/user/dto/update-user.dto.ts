import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUSerDto {
  @IsString({ message: 'Name should be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString({ message: 'Email should be a string' })
  @IsEmail({}, { message: 'Incorrect form of mail' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsBoolean({ message: 'IsTwoFactorEnabled should be boolean' })
  isTwoFactorEnabled: boolean;
}
