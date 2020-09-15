import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountDto } from 'src/app/app/model/dto/AccountDto';
import { FormError } from 'src/app/app/model/FormError';
import { AuthenticationService } from 'src/app/app/services/authentication.service';
import { UserService } from 'src/app/app/services/user.service';
import { matchingPasswordValidator } from 'src/app/app/shared/validators/matching-password.validator';
import { ConfirmDeleteAccountModalComponent } from '../confirm-delete-account-modal/confirm-delete-account-modal.component'

@Component({
  selector: 'account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent {

  accountDetailsChanging: boolean = false
  passwordChanging: boolean = false
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

  // Corresponds with `ChangePasswordDto`
  newPasswordForm = new FormGroup({
    oldPassword: new FormControl('', [Validators.required, Validators.minLength(4)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(4)]),
    newPasswordRepeat: new FormControl('', [Validators.required, Validators.minLength(4)])
  }, matchingPasswordValidator('newPassword', 'newPasswordRepeat'))

  get oldPassword(): FormControl { return this.newPasswordForm.get('oldPassword') as FormControl }
  get newPassword(): FormControl { return this.newPasswordForm.get('newPassword') as FormControl }
  get newPasswordRepeat(): FormControl { return this.newPasswordForm.get('newPasswordRepeat') as FormControl }

  incorrectPasswordError: boolean

  constructor(
    public userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private modalService: NgbModal
  ) {
    userService.user.subscribe(user => {
      this.newEmail.setValue(user.email)
      this.newFirstName.setValue(user.firstName)
      this.newLastName.setValue(user.lastName)
    })
  }

  onChangeDetailsClicked() {
    this.detailsForm.markAsTouched()
    if (this.detailsForm.valid) {
      this.accountDetailsChanging = true
      this.userService.changeAccountDetails(this.detailsForm.value).subscribe(response => {
        if (response.error) {
          switch (response.error) {
            case FormError.EMAIL_TAKEN: 
              this.emailTakenError = true
              break;
            case FormError.INVALID_EMAIL:
              this.invalidEmailError = true
              break;
          }
        } else if (response.account) {
          this.userService.user.next(response.account)
        }
        this.accountDetailsChanging = false
      })
    }
  }

  onChangePasswordClicked() {
    this.newPasswordForm.markAllAsTouched()
    if (this.newPasswordForm.valid) {
      this.passwordChanging = true
      this.userService.changePassword(this.newPasswordForm.value).subscribe(response => {
        if (response.error) {
          if (response.error == FormError.INCORRECT_PASSWORD) {
            this.incorrectPasswordError = true
          }
        } else if (response.account) {
          this.newPasswordForm.reset()
        }
        this.passwordChanging = false
      })

    }
  }

  onDeleteAccountClicked() {
    let modal = this.modalService.open(ConfirmDeleteAccountModalComponent, {windowClass:'modal-appear', centered: true, size: 'md'})
    modal.result.then((shouldDelete: boolean) => {
      if (shouldDelete) {
        this.deletingAccount = true
        this.userService.deleteAccount().subscribe(() => {
          this.authenticationService.logout().subscribe(
            () => window.location.replace(window.location.origin),
            () => window.location.replace(window.location.origin)
          )
        })
      }
    }, () => null)
  }

}
