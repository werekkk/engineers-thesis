import { Component, OnInit, Input } from '@angular/core';
import { RequiredStaffDto } from 'src/app/app/model/dto/RequiredStaffDto';
import { ShiftDto } from 'src/app/app/model/dto/ShiftDto';

@Component({
  selector: 'schedule-position-day-label-cell',
  templateUrl: './schedule-position-day-label-cell.component.html',
  styleUrls: ['./schedule-position-day-label-cell.component.scss']
})
export class SchedulePositionDayLabelCellComponent implements OnInit {

  @Input('day')
  day: Date

  @Input('dayIndex')
  dayIndex: number

  @Input('requiredStaff')
  requiredStaff: RequiredStaffDto

  @Input('shiftsTable')
  shiftsTable: ShiftDto[][][]

  allocatedHours: number
  totalRequiredHours: number

  constructor() { }

  ngOnInit(): void {
    this.initHourCounter()
  }
  
  initHourCounter() {
    this.totalRequiredHours = this.requiredStaff.getDayStaff(this.day).totalRequiredHours()
  }

  calculateAllocatedHours() {
  }

  private getCurrentDayShifts(): ShiftDto[] {
    let shifts: ShiftDto[] = []
    this.shiftsTable.forEach(emp => {
      shifts = shifts.concat(emp[this.dayIndex])
    })
    return shifts
  }

}
