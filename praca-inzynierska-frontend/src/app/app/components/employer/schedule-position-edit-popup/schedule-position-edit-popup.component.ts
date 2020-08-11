import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ShiftDto } from 'src/app/app/model/dto/ShiftDto';
import { PositionDto } from 'src/app/app/model/dto/PositionDto';
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';
import { ShiftService } from 'src/app/app/services/shift.service';
import { TimePeriodDto } from 'src/app/app/model/dto/TimePeriodDto';
import { ShiftsDto } from 'src/app/app/model/dto/ShiftsDto';
import { TimeDto } from 'src/app/app/model/dto/TimeDto';
import { ShiftType } from 'src/app/app/model/ShiftType';
import { Utils } from 'src/app/app/shared/utils';

@Component({
  selector: 'schedule-position-edit-popup',
  templateUrl: './schedule-position-edit-popup.component.html',
  styleUrls: ['./schedule-position-edit-popup.component.scss']
})
export class SchedulePositionEditPopupComponent implements OnInit {

  
  _shifts: ShiftDto[] = []
  get shifts(): ShiftDto[] {
    return this._shifts
  }
  @Input('shifts')
  set shifts(val: ShiftDto[]) {
    this._shifts = val
    this.handleNewShifts(val)
  }

  newPeriod: TimePeriodDto = new TimePeriodDto(new TimeDto(0, 0), new TimeDto(0, 0))
  
  periods: TimePeriodDto[] = []

  @Output('shiftsChange')
  shiftsChange: EventEmitter<ShiftDto[]> = new EventEmitter()

  @Input('showPopup')
  showPopup: EventEmitter<boolean> = new EventEmitter()

  @Input('position')
  position: PositionDto

  @Input('employee')
  employee: EmployeeDto

  @Input('date')
  date: Date

  constructor(
    private shiftService: ShiftService
  ) { }

  ngOnInit(): void {
  }

  handleNewShifts(newShifts: ShiftDto[]) {
    this.periods = newShifts.map(s => s.period)
  }

  handleAddShiftClicked() {
    let newShift = new ShiftDto(0, 
      this.employee.employeeId, 
      this.position.id,
      this.newPeriod.start.createDateTime(this.date),
      this.newPeriod.finish.createDateTime(this.date), 
      null, 
      ShiftType.MANUALLY_ASSIGNED
    )
    this.saveShift(newShift)
  }

  private saveShift(newShift: ShiftDto) {
    let shiftIndex = this.shifts.length
    this.shifts.push(newShift)
    this.emitShiftChange()
    this.showPopup.emit(false)
    this.shiftService.saveShift(newShift)
    .subscribe(savedShift => {
      this.shifts[shiftIndex].id = savedShift.id
      this.emitShiftChange()
    }, err => {
      this.shifts.splice(shiftIndex, 1)
      this.emitShiftChange()
      this.showPopup.emit(true)
    })
  }

  handleDeleteShiftClicked(shiftIndex: number) {
    let shiftToBeDeleted = this.shifts[shiftIndex]
    this.shifts.splice(shiftIndex, 1)
    this.emitShiftChange()
    this.showPopup.emit(false)
    this.shiftService.deleteShift(shiftToBeDeleted.id)
    .subscribe(null, err => {
      this.shifts.splice(Math.max(this.shifts.length, shiftIndex), 0, shiftToBeDeleted)
      this.emitShiftChange()
      this.showPopup.emit(true)
    })
  }

  private emitShiftChange() {
    this.handleNewShifts(this.shifts)
    this.shiftsChange.emit(this.shifts)
  }

}
