import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ShiftDto } from 'src/app/app/model/dto/ShiftDto';
import { PositionDto } from 'src/app/app/model/dto/PositionDto';
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';
import { ShiftService } from 'src/app/app/services/shift.service';
import { TimePeriodDto } from 'src/app/app/model/dto/TimePeriodDto';
import { TimeDto } from 'src/app/app/model/dto/TimeDto';
import { ShiftType } from 'src/app/app/model/ShiftType';
import { RequiredStaffDto } from 'src/app/app/model/dto/RequiredStaffDto';

@Component({
  selector: 'schedule-position-edit-popup',
  templateUrl: './schedule-position-edit-popup.component.html',
  styleUrls: ['./schedule-position-edit-popup.component.scss']
})
export class SchedulePositionEditPopupComponent {

  
  _shifts: ShiftDto[] = []
  get shifts(): ShiftDto[] {
    return this._shifts
  }
  @Input('shifts')
  set shifts(val: ShiftDto[]) {
    this._shifts = val
    this.handleNewShifts(val)
  }

  @Output('shiftsChange')
  shiftsChange: EventEmitter<ShiftDto[]> = new EventEmitter()

  newPeriod: TimePeriodDto = new TimePeriodDto(new TimeDto(0, 0), new TimeDto(0, 0))
  
  periods: TimePeriodDto[] = []

  @Output('showPopup')
  showPopup: EventEmitter<boolean> = new EventEmitter()

  @Input('position')
  position: PositionDto

  @Input('employee')
  employee: EmployeeDto

  @Input('date')
  date: Date

  @Input('dayIndex')
  dayIndex: number

  @Input('requiredStaff')
  requiredStaff: RequiredStaffDto

  @Input('shiftsTable')
  shiftsTable: ShiftDto[][][]

  @Input('instantUpdate')
  instantUpdate: boolean = true

  mouseIn: boolean = false

  constructor(
    private shiftService: ShiftService
  ) { 
  }

  handleNewShifts(newShifts: ShiftDto[]) {
    this.periods = newShifts.map(s => s.period)
  }

  handleAddShiftClicked() {
    if (this.newPeriod.start.toSeconds() < this.newPeriod.finish.toSeconds()) {
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
  }

  private saveShift(newShift: ShiftDto) {
    this.shifts.push(newShift)
    this.shifts = this.shifts.sort((a, b) => a.period.compare(b.period))
    this.emitShiftChange()
    this.showPopup.emit(false)
    if (this.instantUpdate) {
      this.shiftService.saveShift(newShift)
      .subscribe(response => {
        let shift = this.shifts[this.shifts.findIndex(s => s.equalPeriods(newShift))]
        shift.id = response.savedShift.id
        shift.start = response.savedShift.start
        shift.finish = response.savedShift.finish
        response.deletedShiftsIds.forEach(id => 
          this.shifts.splice(this.shifts.findIndex(s => s.id == id), 1)
        )
        this.shifts = this.shifts.filter(s => !response.deletedShiftsIds.some(id => s.id == id))
        this.emitShiftChange()
      }, err => {
        this.shifts.splice(this.shifts.findIndex(s => s.equalPeriods(newShift)), 1)
        this.emitShiftChange()
        this.showPopup.emit(true)
      })
    }
  }

  handleDeleteShiftClicked(shiftIndex: number) {
    let shiftToBeDeleted = this.shifts[shiftIndex]
    this.shifts.splice(shiftIndex, 1)
    this.emitShiftChange()
    this.showPopup.emit(false)
    if (this.instantUpdate) {
      this.shiftService.deleteShift(shiftToBeDeleted.id)
      .subscribe({
        next: null,
        error: err => {
          this.shifts.push(shiftToBeDeleted)
          this.shifts = this.shifts.sort((a, b) => a.period.compare(b.period))
          this.emitShiftChange()
          this.showPopup.emit(true)
        }
      })
    }
  }

  private emitShiftChange() {
    this.handleNewShifts(this.shifts)
    this.shiftsChange.emit(this.shifts)
    this.shiftService.updateShifts.emit(this.date)
  }

}
