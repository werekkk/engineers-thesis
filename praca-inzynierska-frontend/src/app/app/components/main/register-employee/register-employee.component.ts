import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { UserService } from 'src/app/app/services/user.service';
import { switchMap } from 'rxjs/operators';
import { AccountDto } from 'src/app/app/model/dto/AccountDto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { matchingPasswordValidator } from 'src/app/app/shared/validators/matching-password.validator';
import { RegisterEmployeeDetailsDto } from '../../../model/dto/RegisterEmployeeDetailsDto'
import { RegisterError } from 'src/app/app/model/RegisterError';
import { RegisterResponseDto } from 'src/app/app/model/dto/RegisterResponseDto';

@Component({
  selector: 'register-employee',
  templateUrl: './register-employee.component.html',
  styleUrls: ['./register-employee.component.scss']
})
export class RegisterEmployeeComponent implements OnInit {

  employee: AccountDto = null
  invitationToken: String = ''

  // Corresponds with `RegisterEmployeeDetailsDto`
  // expect the `invitationToken` attribute
  employeeForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    repeatPassword: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email])
  }, matchingPasswordValidator)

  get username(): FormControl { return this.employeeForm.get('username') as FormControl}
  get password(): FormControl { return this.employeeForm.get('password') as FormControl}
  get repeatPassword(): FormControl { return this.employeeForm.get('repeatPassword') as FormControl}
  get email(): FormControl { return this.employeeForm.get('email') as FormControl}

  invalidEmailError = false
  usernameTakenError = false
  emailTakenError = false

  isRegistering: Boolean = false
  registerResponse: RegisterResponseDto = null

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.invitationToken = params.get('invitationToken')
        return this.userService.lookupInvitationToken(this.invitationToken)
      })
    ).subscribe((invitedEmployee: AccountDto) => {
      this.employee = invitedEmployee
    }, err => {
      this.router.navigate([''])
    })
  }

  onRegisterClicked() {
    if (this.employeeForm.valid) {
      this.isRegistering = true
      let registerDetails: RegisterEmployeeDetailsDto = this.employeeForm.value
      registerDetails.invitationToken = this.invitationToken
      this.userService.registerEmployee(registerDetails)
      .subscribe((response: RegisterResponseDto) => {
        this.registerResponse = response
        switch (this.registerResponse.error) {
          case RegisterError.INVALID_EMAIL: this.invalidEmailError = true; break
          case RegisterError.EMAIL_TAKEN: this.emailTakenError = true; break
          case RegisterError.USERNAME_TAKEN: this.usernameTakenError = true; break
        }
        this.isRegistering = false
        if (!response.error && response.account) {
          this.router.navigate([''])
        }
      })
    }
  }

}
