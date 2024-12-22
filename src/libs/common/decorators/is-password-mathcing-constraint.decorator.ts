import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import {RegisterDto} from "../../../auth/dto/register.dto";

@ValidatorConstraint({
    name:"IsPasswordMatching", async:false
})

export class IsPasswordMatchingValidatorConstraint  implements  ValidatorConstraintInterface{
    public  validate(passwordRepeat: string, args: ValidationArguments){

        const obj = args.object as RegisterDto
        return obj.password === passwordRepeat;
    }
    public defaultMessage(validationArguments?: ValidationArguments){
        return "Passwords should be the same ";
    }
}