import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { UserService } from 'src/app/app/services/user.service';
import { switchMap } from 'rxjs/operators';
import { AccountDto } from 'src/app/app/model/dto/AccountDto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { matchingPasswordValidator } from 'src/app/app/shared/validators/matching-password.validator';
import { RegisterEmployeeDetailsDto } from '../../../model/dto/RegisterEmployeeDetailsDto'
import { FormError } from 'src/app/app/model/FormError';
import { AccountResponseDto } from 'src/app/app/model/dto/AccountResponseDto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'register-employee',
  templateUrl: './register-employee.component.html',
  styleUrls: ['./register-employee.component.scss']
})
export class RegisterEmployeeComponent implements OnInit {

  employee: AccountDto = null
  invitationToken: String = ''

  // Corresponds with `RegisterEmployeeDetailsDto`
  // except the `invitationToken` attribute
  employeeForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    repeatPassword: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(3)])
  }, matchingPasswordValidator('password', 'repeatPassword'))

  get username(): FormControl { return this.employeeForm.get('username') as FormControl}
  get password(): FormControl { return this.employeeForm.get('password') as FormControl}
  get repeatPassword(): FormControl { return this.employeeForm.get('repeatPassword') as FormControl}
  get email(): FormControl { return this.employeeForm.get('email') as FormControl}

  invalidEmailError = false
  usernameTakenError = false
  emailTakenError = false

  isRegistering: Boolean = false
  registerResponse: AccountResponseDto = null

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.modalService.dismissAll()
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
    this.employeeForm.markAllAsTouched()
    if (this.employeeForm.valid) {
      this.isRegistering = true
      let registerDetails: RegisterEmployeeDetailsDto = this.employeeForm.value
      registerDetails.invitationToken = this.invitationToken
      this.userService.registerEmployee(registerDetails)
      .subscribe((response: AccountResponseDto) => {
        this.registerResponse = response
        switch (this.registerResponse.error) {
          case FormError.INVALID_EMAIL: this.invalidEmailError = true; break
          case FormError.EMAIL_TAKEN: this.emailTakenError = true; break
          case FormError.USERNAME_TAKEN: this.usernameTakenError = true; break
        }
        this.isRegistering = false
        if (!response.error && response.account) {
          this.router.navigate(['register-success'])
        }
      })
    }
  }

}
