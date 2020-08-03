import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { RegisterWorkplaceDetailsDto } from '../../../model/dto/RegisterWorkplaceDetailsDto'
import { matchingPasswordValidator } from '../../../shared/validators/matching-password.validator'
import { UserService } from 'src/app/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'register-employer',
  templateUrl: './register-employer.component.html',
  styleUrls: ['./register-employer.component.scss']
})
export class RegisterEmployerComponent implements OnInit {

  // Corresponds with `RegisterWorkplaceDetailsDto`
  employerForm = new FormGroup({
    employer: new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      repeatPassword: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl('', Validators.required),
      middleName: new FormControl(''),
      lastName: new FormControl('', Validators.required)
    }, matchingPasswordValidator),
    workplaceName: new FormControl('', Validators.required)
  })

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onRegisterClicked() {
    if (this.employerForm.valid) {
      let registerDetails = this.employerForm.value as RegisterWorkplaceDetailsDto
      this.userService.registerWorkplace(registerDetails)
      .subscribe(() => {
        this.router.navigate([''])
      }, err => {
        console.log(err)
      })
    }
  }

}
