import { Component, OnInit, Input } from '@angular/core';
import { Moment } from 'moment';
import { Utils } from 'src/app/app/shared/utils/utils';
import * as moment from 'moment';
import { ShiftService } from 'src/app/app/services/shift.service';
import { ShiftDto } from 'src/app/app/model/dto/ShiftDto';
import { PositionService } from 'src/app/app/services/position.service';

@Component({
  selector: 'schedule-calendar',
  templateUrl: './schedule-calendar.component.html',
  styleUrls: ['./schedule-calendar.component.scss']
})
export class ScheduleCalendarComponent implements OnInit {

  month: Moment
  shiftsLoaded: boolean = false
  positionsLoaded: boolean = false

  @Input('month')
  set monthDate(val: Date) {
    this.month = moment(val)
    this.calendarDays = Utils.getDateArrayForCalendar(this.month)
    this.loadShiftsForMonth()
  }

  calendarDays: Date[][] = []
  shifts: ShiftDto[][][] = []

  today: Date = new Date()

  constructor(
    private shiftService: ShiftService,
    private positionService: PositionService
  ) { }

  ngOnInit() {
    if (!this.positionService.positionsLoaded) {
      this.positionService.getLoggedInEmployeePositions().subscribe(() => {
        this.positionsLoaded = true
      })
    } else {
      this.positionsLoaded = true
    }
  }

  loadShiftsForMonth() {
    this.shiftsLoaded = false
    this.shiftService.getLoggedInEmployeeShifts(this.calendarDays[0][0], this.calendarDays.length * 7)
    .subscribe(shifts => this.handleNewShifts(shifts.shifts))
  }

  private handleNewShifts(shifts: ShiftDto[]) {
    let firstDay = this.calendarDays[0][0]
    this.initShiftsArray()
    shifts.sort((a, b) => a.start.getTime() - b.start.getTime())
    shifts.forEach(s => {
      let diff = Utils.daysDiff(firstDay, s.start)
      this.shifts[Math.floor(diff/7)][diff%7].push(s)
    })
    this.shiftsLoaded = true
  }

  private initShiftsArray() {
    this.shifts = []
    this.calendarDays.forEach(() => {
      let shiftWeek = [[],[],[],[],[],[],[]]
      this.shifts.push(shiftWeek)
    })
  }

}
