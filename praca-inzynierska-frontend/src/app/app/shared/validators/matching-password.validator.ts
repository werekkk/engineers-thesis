import { ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms/forms'

export const matchingPasswordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    let password = control.get('password').value
    let repeatPassword = control.get('repeatPassword').value
    return password === repeatPassword ? null : {'passwordNotMatching': true}
}