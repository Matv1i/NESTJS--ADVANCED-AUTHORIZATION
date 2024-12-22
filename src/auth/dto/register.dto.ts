import {IsEmail, IsNotEmpty, IsPassportNumber, IsString, MinLength, Validate, ValidateNested} from "class-validator";
import {
    IsPasswordMatchingValidatorConstraint
} from "../../libs/common/decorators/is-password-mathcing-constraint.decorator";

export class RegisterDto {


    @IsString({message:"Name should be a string"})
    @IsNotEmpty({message:"Name should not be empty"})
    name: string;

    @IsString({message:"Email should be a string"})
    @IsEmail({},{message:"Email should be a string"})
    @IsNotEmpty({message:"Email should not be empty"})
    email: string;

    @IsString({message:"Passwords should be a string"})
    @IsNotEmpty({message:"Passwords should not be empty"})
    @MinLength(6,{message:"Password should be a minimum of 6 characters"})
    password:string

    @IsString({message:"Password of confirmation should be a string"})
    @IsNotEmpty({message:"Password should not be empty"})
    @MinLength(6,{message:"Password should not be empty"})
    @Validate(IsPasswordMatchingValidatorConstraint,{message:"Passwords should be the same "})
    passwordRepeat: string;




}