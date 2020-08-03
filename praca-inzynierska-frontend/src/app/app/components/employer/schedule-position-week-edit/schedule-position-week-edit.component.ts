import { Component, OnInit } from '@angular/core';
import { PositionDto } from 'src/app/app/model/dto/PositionDto';
import { Router } from '@angular/router';
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';
import { EmployeeService } from 'src/app/app/services/employee.service';
import { ShiftService } from '../../../services/shift.service'
import { Utils } from 'src/app/app/shared/Utils';

@Component({
  selector: 'schedule-position-week-edit',
  templateUrl: './schedule-position-week-edit.component.html',
  styleUrls: ['./schedule-position-week-edit.component.scss']
})
export class SchedulePositionWeekEditComponent implements OnInit {

  firstDay: Date

  days: Date[] = []

  position: PositionDto

  employeesLoaded = false
  employees: EmployeeDto[]

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private shiftService: ShiftService
  ) { 
    this.employeeService.employees.subscribe(newEmployees => {
      this.employees = newEmployees
    })
  }

  ngOnInit(): void {
    let data: SchedulePostitionWeekData = history.state.data
    if (!data) {
      this.router.navigate(['employer'])
    } else {
      this.position = data.position
      this.firstDay = data.firstDay
    }
    this.employeesLoaded = this.employeeService.employeesLoaded
    if (!this.employeeService.employeesLoaded) {
      this.employeeService.getAllEmployees().subscribe(() => {
        this.employeesLoaded = true
      })
    }
    this.initDays()
  }

  private initDays() {
    this.days = []
    for (let index = 0; index < 7; index++) {
      this.days.push(Utils.daysAfter(this.firstDay, index))
    }
  }
}

export type SchedulePostitionWeekData = {
  position: PositionDto,
  firstDay: Date
}