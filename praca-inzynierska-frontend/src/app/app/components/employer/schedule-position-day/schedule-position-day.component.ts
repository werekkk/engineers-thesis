import { Component, OnInit, Input } from '@angular/core';
import { RequiredStaffDto } from 'src/app/app/model/dto/RequiredStaffDto';
import { RequiredStaffDayDto } from 'src/app/app/model/dto/RequiredStaffDayDto';

@Component({
  selector: 'schedule-position-day',
  templateUrl: './schedule-position-day.component.html',
  styleUrls: ['./schedule-position-day.component.scss']
})
export class SchedulePositionDayComponent implements OnInit {

  _date: Date
  @Input('date')
  set date(value: Date) {
    this._date = value
  }
  get date(): Date {return this._date}

  @Input('requiredStaff')
  requiredWeekStaff: RequiredStaffDto
  requiredDayStaff: RequiredStaffDayDto

  requiredHours: number

  constructor() { }

  ngOnInit(): void {
    this.loadDayStaff()
  }

  loadDayStaff() {
    this.requiredDayStaff = this.requiredWeekStaff.getDayStaff(this.date)
    this.requiredHours = this.requiredDayStaff.timePeriods.map(tp => tp.hours())
    .reduceRight((prev, cur) => cur + prev)
  }

}
