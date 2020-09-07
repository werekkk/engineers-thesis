import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
  selector: 'schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  monthDate: Date = new Date()

  _month: Moment = moment().locale('pl')
  get month(): Moment {
    return this._month
  }
  set month(val: Moment) {
    this._month = val
    this.monthDate = val.toDate()
  }
  constructor() { }

  ngOnInit(): void {
  }

}
