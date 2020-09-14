import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'register-success',
  templateUrl: './register-success.component.html',
  styleUrls: ['./register-success.component.scss']
})
export class RegisterSuccessComponent {

  constructor(
    private router: Router
  ) { }

  onReturnClicked() {
    this.navigateToLoginPage()
  }

  private navigateToLoginPage() {
    this.router.navigate(['./'])
  }

}
