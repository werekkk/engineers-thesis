import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ShiftDto } from 'src/app/app/model/dto/ShiftDto';
import { PositionDto } from 'src/app/app/model/dto/PositionDto';
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';
import { RequiredStaffDto } from 'src/app/app/model/dto/RequiredStaffDto';
import { ShiftService } from 'src/app/app/services/shift.service';
import { interval } from 'rxjs';

@Component({
  selector: 'schedule-employee-day-cell',
  templateUrl: './schedule-employee-day-cell.component.html',
  styleUrls: ['./schedule-employee-day-cell.component.scss']
})
export class ScheduleEmployeeDayCellComponent {

  @Input()
  shifts: ShiftDto[]

  @Output()
  shiftsChange: EventEmitter<ShiftDto[]> = new EventEmitter()

  @Input()
  shiftsTable: ShiftDto[][][]

  @Input()
  position: PositionDto

  @Input()
  employee: EmployeeDto

  @Input()
  requiredStaff: RequiredStaffDto

  @Input()
  day: Date

  @Input()
  dayIndex: number

  @Input()
  instantUpdate: boolean = true

  @Input()
  disabled: boolean = false

  showPopup = false

  handleOnDetailsClicked() {
    if (!this.disabled) {
      this.showPopup = !this.showPopup
    }
  }

  handleOutsideClicked() {
    this.showPopup = false
  }

}