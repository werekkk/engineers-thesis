import { Component, Input } from '@angular/core';
import { ShiftDto } from 'src/app/app/model/dto/ShiftDto';
import { PositionDto } from 'src/app/app/model/dto/PositionDto';
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';
import { RequiredStaffDto } from 'src/app/app/model/dto/RequiredStaffDto';

@Component({
  selector: 'schedule-employee-day-cell',
  templateUrl: './schedule-employee-day-cell.component.html',
  styleUrls: ['./schedule-employee-day-cell.component.scss']
})
export class ScheduleEmployeeDayCellComponent {

  @Input('shifts')
  shifts: ShiftDto[]

  @Input('position')
  position: PositionDto

  @Input('employee')
  employee: EmployeeDto

  @Input('requiredStaff')
  requiredStaff: RequiredStaffDto

  @Input('day')
  day: Date

  showPopup = false

  handleOnDetailsClicked() {
    this.showPopup = !this.showPopup
  }

  handleOutsideClicked() {
    this.showPopup = false
  }
}