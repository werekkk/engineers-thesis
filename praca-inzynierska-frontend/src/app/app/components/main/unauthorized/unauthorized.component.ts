import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent {

  constructor(
    private router: Router
  ) { }

  onEnterPressed() {
    this.navigateToLoginPage()
  }

  onReturnClicked() {
    this.navigateToLoginPage()
  }

  private navigateToLoginPage() {
    this.router.navigate(['./'])
  }
}
