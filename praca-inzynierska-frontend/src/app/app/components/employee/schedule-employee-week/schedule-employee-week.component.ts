import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { ShiftService } from 'src/app/app/services/shift.service';
import { Utils } from 'src/app/app/shared/utils';
import { ShiftDto } from 'src/app/app/model/dto/ShiftDto';
import { Subscription } from 'rxjs';

@Component({
  selector: 'schedule-employee-week',
  templateUrl: './schedule-employee-week.component.html',
  styleUrls: ['./schedule-employee-week.component.scss']
})
export class ScheduleEmployeeWeekComponent implements OnInit {

  _firstDay: Date
  get firstDay(): Date {
    return this._firstDay
  }
  @Input('firstDay')
  set firstDay(val: Date) {
    this._firstDay = val
    this.lastDay = moment(val).add(6, 'day').toDate()
    this.handleNewFirstDay()
  }

  lastDay: Date

  shiftsLoaded = false
  loadingShiftSubscription: Subscription
  days: Date[] = []
  shiftsTable: ShiftDto[][]

  constructor(
    private shiftService: ShiftService
  ) { }

  ngOnInit(): void {
    this.initDays()
    this.initShiftsTable()
  }

  handleNewFirstDay() {
    this.initDays()
    this.loadShifts()
  }

  initDays() {
    this.days = Utils.weekFrom(this.firstDay)
  }

  loadShifts() {
    if (this.loadingShiftSubscription) {
      this.loadingShiftSubscription.unsubscribe()
    }
    this.shiftsLoaded = false
    this.loadingShiftSubscription = this.shiftService.getLoggedInEmployeeShifts(this.firstDay, 7)
    .subscribe(s => {
      this.handleNewShifts(s.shifts)
      this.shiftsLoaded = true
    })
  }

  handleNewShifts(newShifts: ShiftDto[]) {
    this.initShiftsTable()
    let dayMap = this.createFirstDayDiffToIndexMap()
    newShifts.forEach(s => {
      let diff = Utils.daysDiff(this.firstDay, s.start)
      let dayIndex = dayMap.get(diff)
      this.shiftsTable[dayIndex].push(s)
    })
  }

  private createFirstDayDiffToIndexMap(): Map<number, number> {
    let map = new Map()
    this.days.forEach((d, i) => {
      map.set(Utils.daysDiff(this.firstDay, d), i)
    })
    return map
  }

  initShiftsTable() {
    this.shiftsTable = []
    this.days.forEach(() => {
      this.shiftsTable.push([])
    });
  }

}
