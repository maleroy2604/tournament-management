import { Injectable } from "@angular/core";

@Injectable()
export class ValidationService {
    public getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            required: 'This field is required',
            minlength: `Minimum length is ${validatorValue.requiredLength}`,
            maxlength: `Maximum length is ${validatorValue.requiredLength}`,
            forbiddenValue: 'This value is forbidden',
            pseudoUsed: 'This pseudo is not available',
            passwordEqualProfile: 'Your password cannot be equal to your profile string'
        };
        return config.hasOwnProperty(validatorName) ? config[validatorName] : '[' + validatorName + ']';
    }
}
