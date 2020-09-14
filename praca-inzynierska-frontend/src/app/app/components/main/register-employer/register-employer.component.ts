import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { RegisterWorkplaceDetailsDto } from '../../../model/dto/RegisterWorkplaceDetailsDto'
import { matchingPasswordValidator } from '../../../shared/validators/matching-password.validator'
import { UserService } from 'src/app/app/services/user.service';
import { Router } from '@angular/router';
import { RegisterResponseDto } from 'src/app/app/model/dto/RegisterResponseDto';
import { RegisterError } from 'src/app/app/model/RegisterError';
import { ɵBrowserPlatformLocation } from '@angular/common';

@Component({
  selector: 'register-employer',
  templateUrl: './register-employer.component.html',
  styleUrls: ['./register-employer.component.scss']
})
export class RegisterEmployerComponent implements OnInit {

  // Corresponds with `RegisterWorkplaceDetailsDto`
  employerForm = new FormGroup({
    employer: new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
      repeatPassword: new FormControl('', [Validators.required, Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(3)]),
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      middleName: new FormControl(''),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)])
    }, matchingPasswordValidator),
    workplaceName: new FormControl('', [Validators.required, Validators.minLength(3)])
  })

  get username(): FormControl { return this.employerForm.get('employer').get('username') as FormControl }
  get password(): FormControl { return this.employerForm.get('employer').get('password') as FormControl }
  get repeatPassword(): FormControl { return this.employerForm.get('employer').get('repeatPassword') as FormControl }
  get email(): FormControl { return this.employerForm.get('employer').get('email') as FormControl }
  get firstName(): FormControl { return this.employerForm.get('employer').get('firstName') as FormControl }
  get middleName(): FormControl { return this.employerForm.get('employer').get('middleName') as FormControl }
  get lastName(): FormControl { return this.employerForm.get('employer').get('lastName') as FormControl }
  get workplaceName(): FormControl { return this.employerForm.get('workplaceName') as FormControl }
  get employer(): FormGroup { return this.employerForm.get('employer') as FormGroup }

  isRegistering: boolean = false
  registerResponse: RegisterResponseDto = null

  invalidEmailError = false
  usernameTakenError = false
  emailTakenError = false

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onRegisterClicked() {
    this.employerForm.markAllAsTouched()
    if (this.employerForm.valid) {
      this.isRegistering = true
      let registerDetails = this.employerForm.value as RegisterWorkplaceDetailsDto
      this.userService.registerWorkplace(registerDetails)
      .subscribe((response) => {
        this.registerResponse = response
        switch (this.registerResponse.error) {
          case RegisterError.INVALID_EMAIL: this.invalidEmailError = true; break
          case RegisterError.EMAIL_TAKEN: this.emailTakenError = true; break
          case RegisterError.USERNAME_TAKEN: this.usernameTakenError = true; break
        }
        this.isRegistering = false
        if (!response.error && response.account) {
          this.router.navigate(['register-success'])
        }
      }, err => {
        console.log(err)
      })
    }
  }

}
