import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ShiftDto } from 'src/app/app/model/dto/ShiftDto';
import { ShiftService } from 'src/app/app/services/shift.service';
import { PositionDto } from 'src/app/app/model/dto/PositionDto';
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';
import { TimePeriodDto } from 'src/app/app/model/dto/TimePeriodDto';

@Component({
  selector: 'schedule-employee-day-cell',
  templateUrl: './schedule-employee-day-cell.component.html',
  styleUrls: ['./schedule-employee-day-cell.component.scss']
})
export class ScheduleEmployeeDayCellComponent implements OnInit {

  @Input('shifts')
  shifts: ShiftDto[]

  @Input('position')
  position: PositionDto

  @Input('employee')
  employee: EmployeeDto

  @Input('day')
  day: Date

  showPopup = false
  showPopupEvent: EventEmitter<boolean> = new EventEmitter()

  constructor(
    private shiftService : ShiftService
  ) { 
    shiftService.hideAllPopups.subscribe(() => this.showPopup = false)
    this.showPopupEvent.subscribe(val => {
      if (val) {
        shiftService.hideAllPopups.emit(null)
      }
      this.showPopup = val
    })
  }

  ngOnInit(): void {
  }

  handleOnDetailsClicked() {
    if (this.showPopup) {
      this.showPopup = false
    } else {
      this.shiftService.hideAllPopups.emit(null)
      this.showPopup = true
    }
  }

  handleShowPopupChange(newValue: boolean) {
    this.showPopup = newValue
  }
}