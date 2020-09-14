import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval } from 'rxjs';

@Component({
  selector: 'employer-menu',
  templateUrl: './employer-menu.component.html',
  styleUrls: ['./employer-menu.component.scss']
})
export class EmployerMenuComponent {

  constructor(
    public router: Router
  ) { }

  onScheduleClicked() {
    this.router.navigate(['employer', 'schedule'])
  }

  onEmployeesClicked() {
    this.router.navigate(['employer', 'employees'])
  }

  onStaffClicked() {
    this.router.navigate(['employer', 'staff'])
  }

  onStatisticsClicked() {
    this.router.navigate(['employer', 'statistics'])
  }

}
