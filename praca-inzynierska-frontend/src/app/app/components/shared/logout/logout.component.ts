import { Component } from '@angular/core';
import { AccountDto } from 'src/app/app/model/dto/AccountDto';
import { AuthenticationService } from 'src/app/app/services/authentication.service';
import { UserService } from 'src/app/app/services/user.service';
import { trigger, state, style, transition, animate } from '@angular/animations'

@Component({
  selector: 'logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent {

  user: AccountDto

  constructor(
    private authenticationService: AuthenticationService,
    userService: UserService
  ) {
    userService.user.subscribe(newUser => {
      this.user = newUser
    })
  }

  onLogoutClicked() {
    this.authenticationService.logout()
    .subscribe(() => {
      window.location.replace(window.location.origin)
    })
  }

}
