import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'employer-menu',
  templateUrl: './employer-menu.component.html',
  styleUrls: ['./employer-menu.component.scss']
})
export class EmployerMenuComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onScheduleClicked() {
    this.router.navigate(['employer', 'schedule'])
  }

  onEmployeesClicked() {
    this.router.navigate(['employer', 'employees'])
  }

  onWorkingHoursClicked() {
    this.router.navigate(['employer', 'working-hours'])
  }

  onStaffClicked() {
    this.router.navigate(['employer', 'staff'])
  }

}
