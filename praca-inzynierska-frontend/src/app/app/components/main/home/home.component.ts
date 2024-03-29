import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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

  errors: boolean = false

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.errors = false
    this.route.queryParams
      .subscribe(params => {
        this.loginInput = params.login || ''
        this.passwordInput = params.password || ''
      })
  }

  onRegisterClicked() {
    this.router.navigate(['register-employer'])
  }

  onLoginClicked() {
    if (this.areCredentialsPresent()) {
      this.authenticationService.login(this.getCredentials())
      .subscribe(() => {}, err => {this.errors = true})
    }
  }

  private areCredentialsPresent(): boolean {
    return this.loginInput && this.passwordInput && true
  }

  private getCredentials(): Credentials {
    return new Credentials(this.loginInput, this.passwordInput)
  }

}
