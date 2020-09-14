import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountDto } from 'src/app/app/model/dto/AccountDto';
import { UserService } from 'src/app/app/services/user.service';

@Component({
  selector: 'account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {

  accountDetailsChanging: boolean = false
  passwordChanging: boolean = true
  deletingAccount: boolean = false

  // Corresponds with `ChangeAccountDetailsDto`
  detailsForm = new FormGroup({
    newEmail: new FormControl('', [Validators.required, Validators.email, Validators.minLength(3)]),
    newFirstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    newLastName: new FormControl('', [Validators.required, Validators.minLength(2)])
  })

  get newEmail(): FormControl { return this.detailsForm.get('newEmail') as FormControl }
  get newFirstName(): FormControl { return this.detailsForm.get('newFirstName') as FormControl }
  get newLastName(): FormControl { return this.detailsForm.get('newLastName') as FormControl }

  invalidEmailError: boolean
  emailTakenError: boolean

  constructor(
    public userService: UserService
  ) { }

  ngOnInit(): void {
  }

}
