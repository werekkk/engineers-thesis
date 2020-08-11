import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'employee-menu',
  templateUrl: './employee-menu.component.html',
  styleUrls: ['./employee-menu.component.scss']
})
export class EmployeeMenuComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onScheduleClicked() {
    this.router.navigate(['employee', 'schedule'])
  }

  onPreferencesClicked() {
    this.router.navigate(['employee', 'preferences'])
  }

}
