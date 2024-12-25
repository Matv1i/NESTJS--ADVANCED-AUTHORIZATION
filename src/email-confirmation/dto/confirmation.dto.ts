import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmationDto {
  @IsString({ message: 'Token should be a string' })
  @IsNotEmpty({ message: 'Field cant be empty' })
  token: string;
}
