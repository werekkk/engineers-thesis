import { Component } from '@angular/core';
import { AccountDto } from 'src/app/app/model/dto/AccountDto';
import { AuthenticationService } from 'src/app/app/services/authentication.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/app/services/user.service';

@Component({
  selector: 'logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  user: AccountDto

  displayOptions = false

  constructor(
    private authenticationService: AuthenticationService,
    userService: UserService
  ) {
    userService.user.subscribe(newUser => {
      this.user = newUser
    })
  }

  onChevronClicked() {
    this.displayOptions = !this.displayOptions
  }

  onLogoutClicked() {
    this.authenticationService.logout()
    .subscribe(() => {
      window.location.replace(window.location.origin)
    })
  }

}
