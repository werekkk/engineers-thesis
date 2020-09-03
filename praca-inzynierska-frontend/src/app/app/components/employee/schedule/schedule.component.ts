import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  firstDay: Date = moment().startOf('isoWeek').toDate()

  constructor() { }

  ngOnInit(): void {
  }

}
