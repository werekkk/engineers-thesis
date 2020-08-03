import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onRegisterEmployeeClicked() {
    this.router.navigate(['register-employee'])
  }

  onRegisterEmployerClicked() {
    this.router.navigate(['register-employer'])
  }

}
