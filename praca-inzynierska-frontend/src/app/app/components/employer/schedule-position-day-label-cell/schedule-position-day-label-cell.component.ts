import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { RequiredStaffDto } from 'src/app/app/model/dto/RequiredStaffDto';
import { ShiftDto } from 'src/app/app/model/dto/ShiftDto';
import { ShiftService } from 'src/app/app/services/shift.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'schedule-position-day-label-cell',
  templateUrl: './schedule-position-day-label-cell.component.html',
  styleUrls: ['./schedule-position-day-label-cell.component.scss']
})
export class SchedulePositionDayLabelCellComponent implements OnInit, OnDestroy {

  @Input()
  day: Date

  @Input()
  dayIndex: number

  @Input()
  requiredStaff: RequiredStaffDto

  @Input()
  shiftsTable: ShiftDto[][][]

  @Input()
  disabled: boolean = false

  allocatedHours: number
  totalRequiredHours: number

  isDayFilled: boolean = true

  shiftUpdateSubscription: Subscription

  constructor(
    private shiftService: ShiftService
  ) { 
    
  }

  ngOnInit(): void {
    this.initHourCounter()
    this.shiftUpdateSubscription = this.shiftService.updateShifts.subscribe((day: Date) => {
      if (day.getTime() == this.day.getTime()) {
        this.calculateAllocatedHours()
      }
    })
  }

  ngOnDestroy(): void {
    this.shiftUpdateSubscription.unsubscribe()
  }
  
  initHourCounter() {
    this.totalRequiredHours = this.requiredStaff.getDayStaff(this.day).totalRequiredHours()
    this.calculateAllocatedHours()
  }

  calculateAllocatedHours() {
    let calc = this.requiredStaff.getDayStaff(this.day).countAllocatedShiftHours(this.getCurrentDayShifts())
    this.allocatedHours = calc.hours
    this.isDayFilled = calc.isDayFilled
  }

  private getCurrentDayShifts(): ShiftDto[] {
    let shifts: ShiftDto[] = []
    this.shiftsTable.forEach(emp => {
      shifts = shifts.concat(emp[this.dayIndex])
    })
    return shifts
  }

}
