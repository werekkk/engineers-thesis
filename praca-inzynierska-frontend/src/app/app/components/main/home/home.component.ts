import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/app/services/authentication.service';
import { Credentials } from 'src/app/app/model/Credentials';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loginInput = ''
  passwordInput = ''

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onRegisterClicked() {
    this.router.navigate(['register'])
  }

  onEnterPressed() {
    this.onLoginClicked()
  }

  onLoginClicked() {
    if (this.areCredentialsPresent()) {
      this.authenticationService.login(this.getCredentials())
      .subscribe()
    }
  }

  private areCredentialsPresent(): boolean {
    return this.loginInput && this.passwordInput && true
  }

  private getCredentials(): Credentials {
    return new Credentials(this.loginInput, this.passwordInput)
  }

}
