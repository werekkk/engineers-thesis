import { ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms/forms'

export function matchingPasswordValidator(passwordControl: string, repeatPasswordControl: string): ValidatorFn {
    return (control: FormGroup): ValidationErrors | null => {
        let password = control.get(passwordControl).value
        let repeatPassword = control.get(repeatPasswordControl).value
        return password === repeatPassword ? null : {'passwordNotMatching': true}
    }
}